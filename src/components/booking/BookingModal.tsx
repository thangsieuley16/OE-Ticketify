import React, { useState, useEffect } from 'react';
import { SeatMap, SeatType } from './SeatMap';
import { Button } from '@/components/ui/Button';
import { QueueScreen } from './QueueScreen';
import confetti from 'canvas-confetti';

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    isSoldOut: boolean;
}

interface SelectedSeat {
    id: string;
    type: SeatType;
    price: number;
    row: string;
    col: number;
}

export function BookingModal({ isOpen, onClose, isSoldOut }: BookingModalProps) {
    const [selectedSeats, setSelectedSeats] = useState<SelectedSeat[]>([]);
    const [paymentInfo, setPaymentInfo] = useState({
        name: '',
        employeeId: '',
        phoneNumber: ''
    });
    const [isVerified, setIsVerified] = useState(false);
    const [showQueue, setShowQueue] = useState(!isSoldOut);
    const [isVisible, setIsVisible] = useState(false);
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [showGreedyModal, setShowGreedyModal] = useState(false);
    const [existingTicketId, setExistingTicketId] = useState('');

    const [refreshKey, setRefreshKey] = useState(0);
    const [successData, setSuccessData] = useState<{
        booking: any;
        isEarlyBird: boolean;
        message: string;
    } | null>(null);

    const [errorData, setErrorData] = useState<{ title: string; message: string } | null>(null);

    useEffect(() => {
        if (isOpen) {
            setShowQueue(!isSoldOut);
            requestAnimationFrame(() => setIsVisible(true));
        } else {
            setIsVisible(false);
        }
    }, [isOpen, isSoldOut]);

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

    useEffect(() => {
        if (showLimitModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [showLimitModal]);

    if (!isOpen) return null;

    if (showQueue) {
        return <QueueScreen onComplete={() => setShowQueue(false)} />;
    }
    const originalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
    const totalPrice = isVerified ? 0 : originalPrice;

    const fireConfetti = () => {
        const duration = 5000;
        const animationEnd = Date.now() + duration;

        const interval: any = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 40;

            confetti({
                particleCount,
                startVelocity: 25, // Slow speed
                spread: 360,
                origin: {
                    x: Math.random(),
                    // since they fall down, start a bit higher than random
                    y: Math.random() - 0.2
                },
                gravity: 0.8,
                scalar: 0.9,
                ticks: 200, // Stay longer
                colors: ['#06b6d4', '#8b5cf6', '#ec4899', '#ffffff', '#FFD700'] // Cosmic theme colors
            });

            // Also shoot from bottom
            confetti({
                particleCount: 10,
                angle: 90,
                spread: 100,
                origin: { x: 0.5, y: 1.1 }, // Bottom center
                startVelocity: 45,
                gravity: 0.6,
                scalar: 1.2,
                drift: 0,
                ticks: 300,
                colors: ['#06b6d4', '#8b5cf6', '#ec4899']
            });

        }, 250);
    };

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
                const { isEarlyBird, booking } = data;
                let message = "";

                if (isEarlyBird) {
                    message = "Chúc mừng bạn đã trở thành những người đầu tiên mua vé thành công cho sự kiện Owniverse 2025\n\nĐặc quyền cho vé Early bird sẽ được gửi đến cho bạn trong những ngày sớm nhất\n\nHãy kiểm tra oeapp.bot trên rocketchat nhé\n\nHẹn gặp bạn tại sự kiện vào ngày 09/01/2026";
                } else {
                    message = "Chúc mừng bạn đã mua vé thành công cho sự kiện Owniverse 2025\n\nHãy kiểm tra oeapp.bot trên rocketchat nhé\n\nHẹn gặp bạn tại sự kiện vào ngày 09/01/2026";
                }

                // Trigger effects
                fireConfetti();

                // Show Success Popup
                setSuccessData({
                    booking,
                    isEarlyBird,
                    message
                });

            } else if (response.status === 409) {
                if (data.errorCode === 'GREEDY_USER' || data.ticketId) {
                    setExistingTicketId(data.ticketId || 'UNKNOWN');
                    setShowGreedyModal(true);
                } else {
                    setErrorData({
                        title: "CHẬM TAY MẤT RỒI!",
                        message: 'Ghế này có người khác đặt ồi =))) bạn vui lòng đặt ghế khác nhaaa'
                    });
                }
            } else {
                setErrorData({
                    title: "CÓ LỖI XẢY RA",
                    message: data.error || 'Có lỗi xảy ra, vui lòng thử lại.'
                });
            }
        } catch (error) {
            setErrorData({
                title: "CÓ LỖI XẢY RA",
                message: 'Hệ thống đang bận. Vui lòng thử lại sau.'
            });
        }
    };

    const handleCloseSuccess = () => {
        setSuccessData(null);
        setSelectedSeats([]);
        setPaymentInfo({ name: '', employeeId: '', phoneNumber: '' });
        setRefreshKey(prev => prev + 1); // Reload SeatMap
        setShowQueue(false); // Ensure queue screen is not shown
    };

    const handleCloseError = () => {
        setErrorData(null);
        setRefreshKey(prev => prev + 1); // Reload SeatMap to update occupied seats
        setSelectedSeats([]); // Clear selected seats as they might be taken
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
                            <p className="text-stardust text-lg font-sans">Owniverse 2025 • Melorita Hòa Lạc</p>
                        </div>
                    </div>

                    {/* Right: Legend + Close Button Grouped */}
                    <div className="flex items-center gap-8">
                        {/* Legend */}
                        <div className="flex gap-6 text-base text-stardust">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full border border-cosmic-cyan/50 bg-black/40"></div>
                                <span className="font-sans">Ghế trống</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-white border border-white rounded-full shadow-[0_0_8px_white]"></div>
                                <span className="font-sans">Đang chọn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-white/5 border border-white/10 rounded-full"></div>
                                <span className="font-sans">Đã bán</span>
                            </div>
                        </div>

                        <button onClick={onClose} className="text-stardust hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18" />
                                <path d="M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col overflow-y-auto relative bg-[url('/images/stardust.png')] custom-scrollbar">
                    {/* Grid Background */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                    {/* Seat Map Area - Full Width */}
                    <div className="shrink-0 min-h-[400px] p-4 md:p-8 flex items-center justify-center relative z-10">
                        <SeatMap
                            key={refreshKey}
                            onSelectionChange={(seats) => setSelectedSeats(seats)}
                            onLimitReached={() => setShowLimitModal(true)}
                        />
                    </div>

                    {/* Bottom Bar - Info & Payment */}
                    <div className="w-full bg-deep-space/95 border-t border-white/10 backdrop-blur-xl p-4 md:p-6 shrink-0 relative z-20">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                            {/* Selected Tickets - Compact on Mobile */}
                            <div className="flex flex-col h-full order-2 lg:order-1">
                                <h3 className="text-stardust uppercase text-xs font-display font-bold tracking-widest mb-2 lg:mb-4">Vé đã chọn</h3>
                                <div className="flex-1 overflow-auto pr-2 custom-scrollbar max-h-[100px] lg:max-h-[150px]">
                                    {selectedSeats.length === 0 ? (
                                        <div className="border border-white/10 border-dashed rounded-xl h-full flex flex-col items-center justify-center text-stardust min-h-[60px] lg:min-h-[100px] bg-white/5">
                                            <span className="text-lg lg:text-xl font-sans">Chưa chọn ghế nào</span>
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
                                <h3 className="text-stardust uppercase text-xs font-display font-bold tracking-widest mb-2 lg:mb-4">Thông tin người đặt</h3>
                                <div className="space-y-2 lg:space-y-3">
                                    <input
                                        type="text"
                                        placeholder="Họ và tên"
                                        className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 lg:px-4 lg:py-3 text-lg lg:text-xl text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-cyan focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all font-sans"
                                        value={paymentInfo.name}
                                        onChange={(e) => setPaymentInfo({ ...paymentInfo, name: e.target.value })}
                                    />
                                    <div className="flex gap-2 lg:gap-3">
                                        <input
                                            type="text"
                                            placeholder="Tên Rocket"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 lg:px-4 lg:py-3 text-lg lg:text-xl text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-cyan focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all font-sans"
                                            value={paymentInfo.employeeId}
                                            onChange={(e) => setPaymentInfo({ ...paymentInfo, employeeId: e.target.value })}
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Số điện thoại"
                                            className="w-full bg-black/50 border border-white/10 rounded-xl px-3 py-2 lg:px-4 lg:py-3 text-lg lg:text-xl text-white placeholder-gray-500 focus:outline-none focus:border-cosmic-cyan focus:shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all font-sans"
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
                                    <h3 className="text-stardust uppercase text-xs font-bold font-display tracking-widest mb-2 lg:mb-4">Thanh toán</h3>
                                    <div className="flex justify-between items-center mb-4 bg-white/5 p-3 lg:p-4 rounded-xl border border-white/10">
                                        <span className="text-stardust text-sm font-display">Tổng cộng</span>
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
                                    className="btn-shiny w-full bg-gradient-to-r from-cosmic-purple to-cosmic-cyan text-white border-none py-3 lg:py-4 text-base lg:text-lg font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.02] transition-transform duration-300 rounded-xl font-display"
                                    disabled={selectedSeats.length === 0}
                                >
                                    Xác nhận đặt vé
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Success Popup */}
            {successData && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-deep-space border border-cosmic-cyan/50 rounded-3xl w-full max-w-md p-8 relative shadow-[0_0_50px_rgba(6,182,212,0.3)] flex flex-col items-center">
                        {/* Close Button */}
                        <button onClick={handleCloseSuccess} className="absolute top-4 right-4 text-stardust hover:text-white transition-colors">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18" />
                                <path d="M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Success Icon */}
                        <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-6 animate-bounce">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider mb-2 text-center">Đặt vé thành công!</h2>
                        <p className="text-stardust text-center text-sm mb-8 whitespace-pre-line">{successData.message}</p>

                        {/* Virtual Ticket Card */}
                        <div className="w-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-6 relative overflow-hidden group hover:border-cosmic-cyan/50 transition-colors">
                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-cosmic-cyan/20 blur-[50px] rounded-full"></div>
                            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-cosmic-purple/20 blur-[50px] rounded-full"></div>

                            {/* Ticket Header */}
                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div>
                                    <h3 className="text-cosmic-cyan font-display font-bold text-lg tracking-widest">OWNIVERSE 2025</h3>
                                    <p className="text-white/60 text-xs uppercase">Melorita Hòa Lạc • 09/01/2026</p>
                                </div>
                                <img src="/images/ownego_logo.png" alt="Ownego" className="h-8 w-auto opacity-80" />
                            </div>

                            {/* Ticket Details */}
                            <div className="space-y-4 relative z-10">
                                <div>
                                    <p className="text-stardust text-[10px] uppercase tracking-wider font-display">Người tham dự</p>
                                    <p className="text-white font-bold text-lg">{successData.booking.user.name}</p>
                                </div>

                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-stardust text-[10px] uppercase tracking-wider font-display">Vị trí ghế</p>
                                        <p className="text-cosmic-cyan font-bold text-xl text-shadow-glow">
                                            {successData.booking.seats.map((s: any) => s.id).join(', ')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-stardust text-[10px] uppercase tracking-wider font-display">Ticket ID</p>
                                        <p className="text-white font-mono text-sm">{successData.booking.seats.map((s: any) => s.id).join(', ')}</p>
                                    </div>
                                </div>
                            </div>


                        </div>

                        <Button onClick={handleCloseSuccess} className="mt-8 w-full bg-white/10 hover:bg-white/20 text-white border border-white/20">
                            Đóng & Tiếp tục
                        </Button>
                    </div>
                </div>
            )}

            {/* Limit Reached Popup (Covers Everything) */}
            {showLimitModal && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-black border border-white/10 rounded-3xl w-[400px] h-[400px] shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center text-center p-8 relative">
                        <div className="w-40 h-40 mb-2">
                            <img
                                src="/images/cute_astronaut.png" // Reverted to cute_astronaut.png to match existing code logic for LimitModal if it was used there. Wait, code view shows line 426 used cute_astronaut.png.
                                alt="Only one ticket"
                                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-wide">
                            ÚI CHÀ CHÀ!
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 font-sans">
                            Mỗi thành viên chỉ được pick 1 ghế thôi nha
                        </p>
                        <button
                            onClick={() => setShowLimitModal(false)}
                            className="bg-cosmic-cyan hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-lg"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}

            {/* Greedy User Popup */}
            {showGreedyModal && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-black border border-white/10 rounded-3xl w-[400px] aspect-square shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center text-center p-8 relative">
                        <div className="w-32 h-32 mb-6">
                            <img
                                src="/images/mini_fig-removebg-preview.png"
                                alt="Greedy"
                                className="w-full h-full object-contain hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                        <h3 className="text-xl font-bold text-cyan-400 mb-2 uppercase tracking-wide">
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

            {/* Error Popup */}
            {errorData && (
                <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
                    <div className="bg-black border border-white/10 rounded-3xl w-[400px] shadow-[0_0_50px_rgba(6,182,212,0.2)] flex flex-col items-center justify-center text-center p-8 relative">
                        <div className="w-40 h-40 mb-2">
                            <img
                                src="/images/cute_astronaut.png"
                                alt="Error"
                                className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                            />
                        </div>
                        <h3 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-wide">
                            {errorData.title}
                        </h3>
                        <p className="text-gray-400 text-lg mb-8 font-sans px-4 whitespace-pre-line">
                            {errorData.message}
                        </p>
                        <button
                            onClick={handleCloseError}
                            className="bg-cosmic-cyan hover:bg-cyan-400 text-black font-bold py-3 px-8 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(6,182,212,0.4)] text-lg"
                        >
                            Đã hiểu
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
