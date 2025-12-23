'use client';

import { useEffect, useState } from 'react';

interface Booking {
    id: string;
    date: string;
    user: {
        name: string;
        employeeId: string;
        phoneNumber: string;
    };
    seats: {
        id: string;
        label: string;
        type: string;
        price: number;
    }[];
    isEarlyBird?: boolean;
    chatStatus?: 'sent' | 'failed' | 'pending';
}

export default function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/bookings')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Sort by date ascending to determine Early Birds
                    const sortedByDate = [...data].sort((a: Booking, b: Booking) => new Date(a.date).getTime() - new Date(b.date).getTime());

                    let standardCount = 0;
                    const earlyBirdIds = new Set<string>();

                    sortedByDate.forEach((booking: Booking) => {
                        // Check if it's a standard booking based on type or price
                        const isStandard = booking.seats.some((s: any) => s.type === 'STANDARD' || s.price === 20 || s.price === 0);
                        if (isStandard) {
                            if (standardCount < 10) {
                                earlyBirdIds.add(booking.id);
                                standardCount++;
                            }
                        }
                    });

                    // Sort by newest for display and add isEarlyBird flag
                    const sortedForDisplay = [...data].sort((a: Booking, b: Booking) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((b: Booking) => ({
                        ...b,
                        isEarlyBird: earlyBirdIds.has(b.id)
                    }));

                    setBookings(sortedForDisplay);
                } else {
                    setBookings([]);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch bookings:', err);
                setIsLoading(false);
            });
    }, []);

    const totalBookings = bookings.length;
    const totalSeats = bookings.reduce((acc, curr) => acc + curr.seats.length, 0);

    return (
        <div className="min-h-screen bg-deep-space text-white font-sans flex flex-col">

            <main className="flex-1 container mx-auto px-4 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 mb-2">
                            BOOKING DASHBOARD
                        </h1>

                    </div>

                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 min-w-[140px]">
                            <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Total Bookings</p>
                            <p className="text-2xl font-display font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">{totalBookings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0a0f18] border border-white/10 rounded-2xl overflow-hidden shadow-2xl relative">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none"></div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-white/5 border-b border-white/10 text-white/50 text-xs uppercase tracking-wider">
                                    <th className="p-6 font-medium">No.</th>
                                    <th className="p-6 font-medium">Time</th>
                                    <th className="p-6 font-medium">Employee Info</th>
                                    <th className="p-6 font-medium">Seat(s)</th>
                                    <th className="p-6 font-medium">Type</th>
                                    <th className="p-6 font-medium text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-sm">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-white/40">
                                            Loading data...
                                        </td>
                                    </tr>
                                ) : bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-white/40">
                                            No bookings found yet.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking, index) => (
                                        <tr key={booking.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="p-6 text-white/40 group-hover:text-white/60 font-mono">
                                                {(bookings.length - index).toString().padStart(3, '0')}
                                            </td>
                                            <td className="p-6 text-white/70">
                                                {new Date(booking.date).toLocaleString('vi-VN')}
                                            </td>
                                            <td className="p-6">
                                                <div className="font-bold text-white mb-1">{booking.user.name}</div>
                                                <div className="text-white/50 text-xs space-y-0.5">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-4 text-cyan-500/70">ID:</span>
                                                        {booking.user.employeeId}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-4 text-cyan-500/70">P:</span>
                                                        {booking.user.phoneNumber}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                <div className="flex flex-wrap gap-2">
                                                    {booking.seats.map(seat => (
                                                        <span key={seat.id} className="px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded text-xs font-bold font-mono">
                                                            {seat.label} {seat.id}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="p-6">
                                                {booking.seats.some((s: any) => s.type === 'STANDARD' || s.price === 20 || s.price === 0) ? (
                                                    booking.isEarlyBird ? (
                                                        <span className="text-pink-400 font-display font-bold uppercase drop-shadow-[0_0_5px_rgba(236,72,153,0.5)]">
                                                            EARLY BIRD
                                                        </span>
                                                    ) : (
                                                        <span className="text-purple-400 font-display font-medium uppercase">
                                                            STANDARD
                                                        </span>
                                                    )
                                                ) : (
                                                    <span className="text-white/50 font-display font-medium uppercase">
                                                        VIP
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-6 text-right">
                                                <div className="flex flex-col items-end gap-2">
                                                    {booking.chatStatus === 'sent' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium border border-green-500/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                                                            Sent
                                                        </span>
                                                    ) : booking.chatStatus === 'failed' ? (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                                            Failed
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 text-white/30 text-xs font-medium border border-white/10">
                                                            Pending
                                                        </span>
                                                    )}

                                                    <button
                                                        onClick={() => {
                                                            const password = prompt("Nhập mật khẩu admin để gửi lại tin nhắn:");
                                                            if (password) {
                                                                const btn = document.getElementById(`resend-${booking.id}`) as HTMLButtonElement;
                                                                if (btn) {
                                                                    btn.disabled = true;
                                                                    btn.innerText = "Sending...";
                                                                }

                                                                fetch('/api/bookings/resend', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({ bookingId: booking.id, password })
                                                                })
                                                                    .then(res => res.json())
                                                                    .then(data => {
                                                                        if (data.success) {
                                                                            alert("Gửi thành công!");
                                                                            // Simple reload to refresh status
                                                                            window.location.reload();
                                                                        } else {
                                                                            alert("Lỗi: " + (data.error || "Unknown error"));
                                                                        }
                                                                    })
                                                                    .catch(err => alert("Lỗi kết nối"))
                                                                    .finally(() => {
                                                                        if (btn) {
                                                                            btn.disabled = false;
                                                                            btn.innerText = "Resend MSG";
                                                                        }
                                                                    });
                                                            }
                                                        }}
                                                        id={`resend-${booking.id}`}
                                                        className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 px-2 py-1 rounded transition-colors"
                                                    >
                                                        Resend MSG
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>

        </div>
    );
}
