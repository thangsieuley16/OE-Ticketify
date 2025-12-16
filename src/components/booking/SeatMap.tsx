'use client';

import React, { useState, useEffect } from 'react';

// --- GIỮ NGUYÊN PHẦN KHAI BÁO TYPES CỦA BẠN ---
export type SeatType = 'STANDARD' | 'VIP';

interface Seat {
    id: string;
    row: string; // Using this for Category/Cluster name
    col: number;
    type: SeatType;
    price: number;
    status: 'available' | 'occupied' | 'selected';
}

interface SeatMapProps {
    onSelectionChange: (selectedSeats: Seat[]) => void;
    onLimitReached?: () => void;
}

interface ClusterConfig {
    id: string;
    label: string;
    count: number;
    type: SeatType;
    price: number;
}

export function SeatMap({ onSelectionChange, onLimitReached }: SeatMapProps) {
    const [seats, setSeats] = useState<Seat[]>([]);

    // --- CẤU HÌNH CLUSTER CHO LAYOUT MỚI ---

    // Hàng trên (Top Row): CAT 4A, CAT 2A, CAT 3A, CAT 5A
    const topClusters: ClusterConfig[] = [
        { id: 'CAT4A', label: 'CAT 4A', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT2A', label: 'CAT 2A', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT3A', label: 'CAT 3A', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT5A', label: 'CAT 5A', count: 6, type: 'STANDARD', price: 20 },
    ];

    // Hàng dưới (Bottom Row): CAT 6A, 4B, 2B, 1, 3B, 5B, 6B
    const bottomClusters: ClusterConfig[] = [
        { id: 'CAT6A', label: 'CAT 6A', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT4B', label: 'CAT 4B', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT2B', label: 'CAT 2B', count: 7, type: 'STANDARD', price: 20 },
        { id: 'CAT1', label: 'CAT 1', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT3B', label: 'CAT 3B', count: 7, type: 'STANDARD', price: 20 },
        { id: 'CAT5B', label: 'CAT 5B', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT6B', label: 'CAT 6B', count: 6, type: 'STANDARD', price: 20 },
    ];

    // --- LOGIC KHỞI TẠO GHẾ ---
    useEffect(() => {
        const newSeats: Seat[] = [];
        const allClusters = [...topClusters, ...bottomClusters];

        allClusters.forEach(cluster => {
            for (let i = 1; i <= cluster.count; i++) {
                newSeats.push({
                    id: `${cluster.id}.${i.toString().padStart(2, '0')}`,
                    row: cluster.label,
                    col: i,
                    type: cluster.type,
                    price: cluster.price,
                    status: 'available'
                });
            }
        });
        setSeats(newSeats);
    }, []);

    // --- LOGIC FETCH BOOKINGS ---
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('/api/bookings');
                if (response.ok) {
                    const bookings = await response.json();
                    const occupiedSeatIds = new Set(bookings.flatMap((b: any) => b.seats.map((s: any) => s.id)));

                    setSeats(prevSeats => prevSeats.map(seat => {
                        if (occupiedSeatIds.has(seat.id)) {
                            return { ...seat, status: 'occupied' };
                        }
                        return seat;
                    }));
                }
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            }
        };

        fetchBookings();
    }, []);

    // --- LOGIC TOGGLE SEAT ---
    const toggleSeat = (seatId: string) => {
        const currentSelected = seats.find(s => s.status === 'selected');
        const targetSeat = seats.find(s => s.id === seatId);

        if (!targetSeat) return;
        if (targetSeat.status === 'occupied') return;

        if (currentSelected && currentSelected.id !== seatId && targetSeat.status !== 'selected') {
            if (onLimitReached) onLimitReached();
            return;
        }

        const updatedSeats = seats.map(seat => {
            if (seat.id !== seatId) return seat;
            const newStatus: 'available' | 'selected' = seat.status === 'selected' ? 'available' : 'selected';
            return { ...seat, status: newStatus };
        });

        setSeats(updatedSeats);
        const selected = updatedSeats.filter(s => s.status === 'selected');
        onSelectionChange(selected);
    };

    // --- RENDER SEAT (STYLE MỚI) ---
    const renderSeat = (seat: Seat) => {
        let baseClass = "w-6 h-6 sm:w-7 sm:h-7 rounded-full text-[10px] flex items-center justify-center cursor-pointer transition-all duration-300 font-bold border font-mono ";

        if (seat.status === 'occupied') {
            baseClass += "bg-white/5 border-white/10 text-white/20 cursor-not-allowed";
        } else if (seat.status === 'selected') {
            baseClass += "bg-white text-black border-white shadow-[0_0_15px_white] scale-110 z-20";
        } else {
            // Style Dark/Cyan theme mới
            baseClass += "bg-[#050B14] border-cyan-500/50 text-cyan-500 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_#06b6d4]";
        }

        return (
            <div
                key={seat.id}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleSeat(seat.id);
                }}
                className={baseClass}
            >
                {seat.col}
            </div>
        );
    };

    // --- RENDER CLUSTER (LAYOUT MỚI) ---
    const renderCluster = (config: ClusterConfig) => {
        const clusterSeats = seats.filter(s => s.row === config.label);
        const containerClass = "bg-[#0a0f18] border border-white/10 p-2 rounded-lg flex relative group hover:border-white/20 transition-colors";

        // Layout đặc biệt cho CAT 5A/5B (7 ghế)
        if (config.count === 7) {
            const leftCol = clusterSeats.filter(s => [1, 2, 3].includes(s.col));
            const rightCol = clusterSeats.filter(s => [4, 5, 6].includes(s.col));
            const centerSeat = clusterSeats.find(s => s.col === 7);

            return (
                <div key={config.id} className={`${containerClass} flex-col items-center gap-2`}>
                    <div className="flex gap-2 items-stretch">
                        <div className="flex flex-col gap-2">{leftCol.map(renderSeat)}</div>
                        <div className="w-8 flex items-center justify-center border border-white/5 bg-white/5 rounded mx-1">
                            <span className="text-white/40 text-[9px] font-bold uppercase -rotate-90 whitespace-nowrap tracking-wider font-display">
                                {config.label}
                            </span>
                        </div>
                        <div className="flex flex-col gap-2">{rightCol.map(renderSeat)}</div>
                    </div>
                    {centerSeat && renderSeat(centerSeat)}
                </div>
            );
        }

        // Layout chuẩn 6 ghế
        const col1 = clusterSeats.filter(s => s.col <= 3);
        const col2 = clusterSeats.filter(s => s.col > 3);

        return (
            <div key={config.id} className={containerClass}>
                <div className="flex flex-col gap-2">{col1.map(renderSeat)}</div>
                <div className="w-8 flex items-center justify-center border border-white/5 bg-white/5 rounded mx-1">
                    <span className="text-white/40 text-[9px] font-bold uppercase -rotate-90 whitespace-nowrap tracking-wider font-display">
                        {config.label}
                    </span>
                </div>
                <div className="flex flex-col gap-2">{col2.map(renderSeat)}</div>
            </div>
        );
    };

    // --- LAYOUT JSX (GRID, STAGE, RUNWAY) ---
    return (
        <div className="w-full h-full min-h-[600px] relative overflow-hidden bg-[#020408] rounded-xl border border-white/10 select-none">
            {/* Background Grid Effect */}
            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'linear-gradient(#1e293b 1px, transparent 1px), linear-gradient(90deg, #1e293b 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                }}>
            </div>

            {/* Scroll Container */}
            <div className="w-full h-full overflow-auto custom-scrollbar flex items-center justify-center p-10">

                <div className="flex flex-col gap-0 relative">

                    {/* === SÂN KHẤU (STAGE) === */}
                    <div className="flex flex-col items-center mb-10">
                        {/* Khối chính sân khấu */}
                        <div className="w-[630px] h-28 border border-cyan-500/50 rounded-2xl bg-[#0a1520] relative flex items-center justify-center shadow-[0_0_40px_rgba(6,182,212,0.15)] z-10 backdrop-blur-sm">
                            <h1 className="text-xl font-display font-normal text-white/50 tracking-[0.2em] drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                                SÂN KHẤU
                            </h1>
                        </div>

                        {/* Đường băng (Runway) - Height 180px */}
                        <div className="absolute top-[90px] w-[130px] h-[180px] border-x border-b border-cyan-500/30 bg-[#0a1520]/90 rounded-b-xl z-0"></div>
                    </div>


                    {/* === HÀNG GHẾ TRÊN (TOP ROW) === */}
                    <div className="flex items-stretch gap-6 mb-6">

                        {/* CAT 6 - STANDING ZONE (STAFF ONLY) */}
                        <div className="w-[110px] flex flex-col">
                            <div className="flex-1 border border-dashed border-white/20 rounded-lg bg-white/5 flex flex-col items-center justify-center p-2 text-center group hover:border-cyan-500/30 transition-colors cursor-default">
                                <span className="text-white/70 font-bold text-[10px] uppercase tracking-wider mb-2 font-display">
                                    PREMIUM
                                    <br />
                                    STANDING ZONE
                                </span>
                                <span className="text-[8px] text-white/30 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded">
                                    Staff Only
                                </span>
                            </div>
                        </div>

                        {renderCluster(topClusters[0])} {/* CAT 4A */}
                        {renderCluster(topClusters[1])} {/* CAT 2A */}

                        {/* Khoảng trống giữa (Runway Gap) */}
                        <div className="w-[130px]"></div>

                        {renderCluster(topClusters[2])} {/* CAT 3A */}
                        {renderCluster(topClusters[3])} {/* CAT 5A */}

                        {/* Spacer Right cho CAT 5B */}
                        <div className="w-[110px]"></div>
                    </div>


                    {/* === HÀNG GHẾ DƯỚI (BOTTOM ROW) === */}
                    <div className="flex items-start gap-6">
                        {renderCluster(bottomClusters[0])} {/* CAT 6A */}
                        {renderCluster(bottomClusters[1])} {/* CAT 4B */}
                        {renderCluster(bottomClusters[2])} {/* CAT 2B */}

                        {/* PREMIUM - Thẳng hàng */}
                        <div>
                            {renderCluster(bottomClusters[3])} {/* CAT 1 */}
                        </div>

                        {renderCluster(bottomClusters[4])} {/* CAT 3B */}
                        {renderCluster(bottomClusters[5])} {/* CAT 5B */}
                        {renderCluster(bottomClusters[6])} {/* CAT 6B */}
                    </div>

                </div>

            </div>


            {/* Removed Custom Limit Reached Popup JSX */}
        </div >
    );
}

// --- APP COMPONENT MỚI (DÙNG LÀM DEFAULT EXPORT ĐỂ SỬA LỖI) ---
export default function App() {
    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
    const [showLimitModal, setShowLimitModal] = useState(false); // Added state for the modal in App component

    const handleSelectionChange = (seats: Seat[]) => {
        console.log("Selected seats:", seats);
        setSelectedSeats(seats);
    };

    const handleLimitReached = () => {
        setShowLimitModal(true); // Set modal visibility in App component
    };

    return (
        <div className="w-full h-screen bg-black flex flex-col">
            <div className="p-4 border-b border-white/10 bg-[#0F172A] flex justify-between items-center z-10">
                <h1 className="text-white font-bold text-lg">CHỌN VỊ TRÍ <span className="text-gray-400 font-normal text-sm ml-2">Melorita Hòa Lạc</span></h1>
                <div className="text-cyan-400 text-sm">
                    {selectedSeats.length > 0
                        ? `Đang chọn: ${selectedSeats[0].row}-${selectedSeats[0].col}`
                        : 'Chưa chọn ghế nào'}
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                <SeatMap onSelectionChange={handleSelectionChange} onLimitReached={handleLimitReached} />
            </div>

            {/* Custom Limit Reached Popup - Moved to App component */}
            {
                showLimitModal && (
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
                )
            }
        </div>
    );
}
