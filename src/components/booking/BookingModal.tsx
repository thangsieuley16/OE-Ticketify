import React, { useState, useEffect } from 'react';
import { SeatMap, SeatType } from './SeatMap';
import { Button } from '@/components/ui/Button';
import { QueueScreen } from './QueueScreen';
import confetti from 'canvas-confetti';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SelectedSeat {
    id: string;
    type: SeatType;
    price: number;
    row: string;
    col: number;
}

export function BookingModal({ isOpen, onClose }: BookingModalProps) {
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
    const [paymentInfo, setPaymentInfo] = useState({
        name: '',
        employeeId: '',
        phoneNumber: ''
    });
    const [isVerified, setIsVerified] = useState(false);
    const [showQueue, setShowQueue] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    // Reset queue when modal opens
    useEffect(() => {
        if (isOpen) {
            setShowQueue(true);
            // Small delay to trigger animation
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsVisible(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const verifyUser = async () => {
            if (paymentInfo.name && paymentInfo.employeeId && paymentInfo.phoneNumber) {
                try {
                    const response = await fetch('/api/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(paymentInfo)
                    });
                    const data = await response.json();
                    setIsVerified(data.verified);
                } catch (error) {
                    console.error("Verification error", error);
                    setIsVerified(false);
                }
            } else {
                setIsVerified(false);
            }
        };

        const timeoutId = setTimeout(verifyUser, 500); // Debounce
        return () => clearTimeout(timeoutId);
    }, [paymentInfo]);

    if (!isOpen) return null;

    if (showQueue) {
        return <QueueScreen onComplete={() => setShowQueue(false)} />;
    }

    const originalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const totalPrice = isVerified ? 0 : originalPrice;

    const handleConfirm = async () => {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất 1 vé!');
            return;
        }
        if (!paymentInfo.name || !paymentInfo.employeeId || !paymentInfo.phoneNumber) {
            alert('Vui lòng điền đầy đủ thông tin thanh toán!');
            return;
        }

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    seats: selectedSeats,
                    user: paymentInfo
                }),
            });

            const data = await response.json();

            if (response.ok) {
                const { isEarlyBird } = data;
                let message = "";

                if (isEarlyBird) {
                    // Fire confetti
                    const duration = 3000;
                    const end = Date.now() + duration;

                    const frame = () => {
                        confetti({
                            particleCount: 2,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 },
                            colors: ['#06b6d4', '#8b5cf6', '#ec4899'] // Cosmic colors
                        });
                        confetti({
                            particleCount: 2,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 },
                            colors: ['#06b6d4', '#8b5cf6', '#ec4899']
                        });

                        if (Date.now() < end) {
                            requestAnimationFrame(frame);
                        }
                    };
                    frame();

                    message = "Chúc mừng bạn đã trở thành những người đầu tiên mua vé thành công cho sự kiện Owneverse 2025\n\nĐặc quyền cho vé Early bird sẽ được gửi đến cho bạn trong những ngày sớm nhất\n\nHãy kiểm tra oeapp.bot trên rocketchat nhé\n\nHẹn gặp bạn tại sự kiện vào ngày 09/01/2026";
                } else {
                    message = "Chúc mừng bạn đã mua vé thành công cho sự kiện Owneverse 2025\n\nHãy kiểm tra oeapp.bot trên rocketchat nhé\n\nHẹn gặp bạn tại sự kiện vào ngày 09/01/2026";
                }

                // Small delay to let confetti start before alert blocks UI (though alert blocks immediately usually)
                setTimeout(() => {
                    alert(message);
                    window.location.reload(); // Reload to update seat map
                }, 500);
            } else {
                alert(data.error || 'Đặt vé thất bại. Vui lòng thử lại.');
            }
        } catch (error) {
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-deep-space/90 backdrop-blur-md p-4 transition-opacity duration-300">
            <div
                className={`bg-deep-space border border-white/10 rounded-3xl w-full max-w-[95vw] h-[90vh] flex flex-col overflow-hidden shadow-[0_0_100px_rgba(6,182,212,0.2)] transition-all duration-500 ease-out transform ${isVisible ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-white/10 bg-white/5 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <img src="/images/ownego_logo.png" alt="Ownego" className="h-10 w-auto" />
                        <div>
                            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Chọn vị trí</h2>
                            <p className="text-stardust text-sm">Owniverse 2025 • Melorita Hòa Lạc</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-stardust hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 6L6 18" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col lg:overflow-hidden overflow-y-auto relative bg-[url('/images/stardust.png')]">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                    {/* Seat Map Area - Full Width */}
                    <div className="shrink-0 min-h-[400px] lg:flex-1 lg:overflow-auto p-4 md:p-8 flex items-center justify-center relative z-10">
                        <SeatMap onSelectionChange={(seats) => setSelectedSeats(seats)} />
                    </div>

                    {/* Bottom Bar - Info & Payment */}
                    <div className="w-full bg-deep-space/95 border-t border-white/10 backdrop-blur-xl p-4 md:p-6 shrink-0 relative z-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            {/* Selected Tickets - Compact on Mobile */}
                            <div className="flex flex-col h-full order-2 lg:order-1">
                                <h3 className="text-stardust uppercase text-xs font-bold tracking-widest mb-2 lg:mb-4">Vé đã chọn</h3>
                                <div className="flex-1 overflow-auto pr-2 custom-scrollbar max-h-[100px] lg:max-h-[150px]">
                                    {selectedSeats.length === 0 ? (
                                        <div className="border border-white/10 border-dashed rounded-xl h-full flex flex-col items-center justify-center text-stardust min-h-[60px] lg:min-h-[100px] bg-white/5">
                                            <span className="text-xs lg:text-sm">Chưa chọn ghế nào</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedSeats.map((seat) => (
                                                <div key={seat.id} className="bg-white/5 border border-cosmic-cyan/30 rounded-xl p-2 lg:p-3 flex justify-between items-center relative overflow-hidden group hover:bg-white/10 transition-colors">
                                                    <div className="flex items-center gap-3 relative z-10">
                                                        {/* Planet Icon Style */}
                                                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg border border-cosmic-cyan/30 bg-black/50 flex items-center justify-center text-cosmic-cyan relative overflow-hidden shrink-0">
                                                            <div className="absolute inset-0 bg-cosmic-cyan/10"></div>
                                                            <span className="text-sm lg:text-lg">🪐</span>
                                                        </div>

                                                        <div>
                                                            <div className="font-bold text-xs lg:text-sm text-cosmic-cyan">
                                                                {seat.id}
                                                            </div>
                                                            <div className="text-stardust text-[10px]">Hàng {seat.row} • Ghế {seat.col}</div>
                                                        </div>
                                                    </div>
                                                    <div className="text-white font-bold text-xs lg:text-sm flex items-center gap-1 relative z-10">
                                                        {seat.price} <span><img src="/images/banhmi.png" alt="Banhmi" className="w-3 h-auto lg:w-4 inline-block" /></span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Booker Info */}
                            <div className="flex flex-col order-1 lg:order-2">
                                <h3 className="text-stardust uppercase text-xs font-bold tracking-widest mb-2 lg:mb-4">Thông tin người đặt</h3>
                                <div className="space-y-2 lg:space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Họ và tên"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-cyan focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                                        value={paymentInfo.name}
                                        onChange={(e) => setPaymentInfo({ ...paymentInfo, name: e.target.value })}
                                    />
                                    <div className="flex gap-2 lg:gap-3">
                                        <input
                                            type="text"
                                            placeholder="Tên Rocket"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-cyan focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                                            value={paymentInfo.employeeId}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, employeeId: e.target.value })}
                                        />
                                        <input
                                            type="tel"
                                            placeholder="SĐT"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 lg:px-4 lg:py-3 text-sm lg:text-base text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-cyan focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
                                            value={paymentInfo.phoneNumber}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                    <div className="p-2 lg:p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                        <p className="text-yellow-500 text-[10px] flex gap-2 items-center">
                                            <span>⚠️</span>
                                            Nhập đúng thông tin ở Ownego của bạn để nhận discount từ Ban tổ chức
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Payment & Action */}
                            <div className="flex flex-col justify-between order-3">
                                <div>
                                    <h3 className="text-stardust uppercase text-xs font-bold tracking-widest mb-2 lg:mb-4">Thanh toán</h3>
                                    <div className="flex justify-between items-center mb-4 bg-white/5 p-3 lg:p-4 rounded-xl border border-white/10">
                                        <span className="text-stardust text-sm">Tổng cộng</span>
                                        <div className="text-right">
                                            {isVerified && <span className="text-gray-500 line-through text-xs lg:text-sm mr-2">{originalPrice}</span>}
                                            <span className="text-cosmic-cyan font-bold text-2xl lg:text-3xl text-shadow-glow flex items-center gap-2 justify-end">
                                                {totalPrice} <span><img src="/images/banhmi.png" alt="Banhmi" className="w-5 h-auto lg:w-6 inline-block drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" /></span>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    onClick={handleConfirm}
                                    className="btn-shiny w-full bg-gradient-to-r from-cosmic-purple to-cosmic-cyan text-white border-none py-3 lg:py-4 text-base lg:text-lg font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.02] transition-transform duration-300 rounded-xl"
                                    disabled={selectedSeats.length === 0}
                                >
                                    Xác nhận đặt vé
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
