'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SeatMap, Seat } from '@/components/booking/SeatMap';
import { BookingSummary } from '@/components/booking/BookingSummary';
import { BookerForm } from '@/components/booking/BookerForm';

// Mock data
const EVENTS = {
    '1': { title: "Year End Party 2025", date: "Dec 31, 2025", price: 0, location: "Main Hall" },
    '2': { title: "Tech Summit Q1", date: "Jan 15, 2026", price: 0, location: "Conference Room A" },
    '3': { title: "Music Festival", date: "Feb 20, 2026", price: 50, location: "Outdoor Arena" },
};

export default function EventPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;
    const event = EVENTS[id as keyof typeof EVENTS];

    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [step, setStep] = useState<'select' | 'form'>('select');
    const [showLimitModal, setShowLimitModal] = useState(false);



    if (!event) return <div className="text-white text-center py-20">Event not found</div>;

    const handleConfirmSelection = () => {
        setStep('form');
    };

    const handleBookingSubmit = async (data: any) => {
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    seats: selectedSeats,
                    user: data
                }),
            });

            const result = await response.json();

            if (response.ok) {
                // Success
                router.push('/confirmation');
            } else if (response.status === 409) {
                if (result.errorCode === 'GREEDY_USER') {
                    setExistingTicketId(result.ticketId);
                    setShowGreedyModal(true);
                } else {
                    setShowSlowModal(true);
                }
            } else {
                alert(result.error || 'Booking failed');
            }
        } catch (error) {
            console.error('Booking error:', error);
            alert('Failed to submit booking');
        }
    };

    const handleLimitReached = () => {
        setShowLimitModal(true);
    };

    // Race Condition (Slow) Popup State
    const [showSlowModal, setShowSlowModal] = useState(false);
    // Greedy Popup State
    const [showGreedyModal, setShowGreedyModal] = useState(false);
    const [existingTicketId, setExistingTicketId] = useState('');

    return (
        <div className="space-y-8 relative">
            <div className="border-b border-gray-800 pb-8">
                <h1 className="text-4xl font-bold text-white mb-2">{event.title}</h1>
                <div className="flex gap-4 text-gray-400">
                    <span>📅 {event.date}</span>
                    <span>📍 {event.location}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-bold text-white">Select Seats</h2>
                    <SeatMap
                        onSelectionChange={setSelectedSeats}
                        onLimitReached={handleLimitReached}
                    />
                </div>

                <div>
                    {step === 'select' ? (
                        <BookingSummary
                            selectedSeats={selectedSeats}
                            pricePerSeat={event.price}
                            onConfirm={handleConfirmSelection}
                        />
                    ) : (
                        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 sticky top-24">
                            <h3 className="text-xl font-bold text-white mb-4">Booker Details</h3>
                            <BookerForm
                                onSubmit={handleBookingSubmit}
                                onCancel={() => setStep('select')}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Custom Limit Reached Popup */}
            {showLimitModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-black border border-white/10 rounded-2xl w-[400px] aspect-square shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center text-center relative">
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32">
                            <img
                                src="/images/cute_astronaut_limit.png"
                                alt="Only one ticket"
                                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide mt-8">
                            Úi chà chà!
                        </h3>
                        <p className="text-stardust text-sm mb-6">
                            Mỗi thành viên chỉ được pick 1 ghế thôi nha
                        </p>
                        <button
                            onClick={() => setShowLimitModal(false)}
                            className="bg-cosmic-cyan hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                        >
                            Đã hiểu :))
                        </button>
                    </div>
                </div>
            )}

            {/* Slow/Race Condition Popup */}
            {showSlowModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-black border border-white/10 rounded-2xl w-[400px] aspect-square shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center text-center relative">
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32">
                            <img
                                src="/images/cute_astronaut_limit.png"
                                alt="Slow"
                                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-wide mt-8">
                            CHẬM TAY MẤT RỒI!
                        </h3>
                        <p className="text-stardust text-sm mb-6 px-6">
                            Ghế này có người khác đặt ồi =))) bạn vui lòng đặt ghế khác nhaaa
                        </p>
                        <button
                            onClick={() => {
                                setShowSlowModal(false);
                                setStep('select');
                                setSelectedSeats([]);
                            }}
                            className="bg-cosmic-cyan hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}

            {/* Greedy User Popup */}
            {showGreedyModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
                    <div className="bg-black border border-white/10 rounded-2xl w-[400px] aspect-square shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center text-center relative">
                        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-32 h-32">
                            <img
                                src="/images/mini_fig-removebg-preview.png"
                                alt="Greedy"
                                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-cyan-400 mb-2 uppercase tracking-wide mt-8">
                            ĐỒ THAM LAM =)))
                        </h3>
                        <p className="text-stardust text-sm mb-6 px-6">
                            Bạn chỉ được mua 1 vé thôi, bạn đã mua vé <span className="font-mono font-bold text-white">{existingTicketId}</span> rồi
                        </p>
                        <button
                            onClick={() => setShowGreedyModal(false)}
                            className="bg-cosmic-cyan hover:bg-cyan-400 text-black font-bold py-2 px-6 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                        >
                            Đã hiểu :))
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
}
