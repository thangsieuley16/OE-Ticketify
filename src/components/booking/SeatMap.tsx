'use client';

import React, { useState, useEffect, useRef } from 'react';

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
}

interface ClusterConfig {
    id: string;
    label: string;
    count: number;
    type: SeatType;
    price: number;
}

export function SeatMap({ onSelectionChange }: SeatMapProps) {
    const [seats, setSeats] = useState<Seat[]>([]);

    // Zoom & Pan State
    const [scale, setScale] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const lastDistance = useRef<number | null>(null);
    const isDragGesture = useRef(false); // To distinguish click vs drag

    // Configuration for the clusters
    const topRowClusters: ClusterConfig[] = [
        { id: 'CAT1', label: 'CAT 1', count: 6, type: 'STANDARD', price: 20 },
        { id: 'PREM', label: 'Premium', count: 6, type: 'STANDARD', price: 20 },
        { id: 'VVIP', label: 'VVIP', count: 6, type: 'STANDARD', price: 20 },
        { id: 'VIP', label: 'VIP', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT2', label: 'CAT 2', count: 6, type: 'STANDARD', price: 20 },
    ];

    const bottomRowClusters: ClusterConfig[] = [
        { id: 'CAT5A', label: 'CAT 5A', count: 7, type: 'STANDARD', price: 20 },
        { id: 'CAT4A', label: 'CAT 4A', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT3A', label: 'CAT 3A', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT3B', label: 'CAT 3B', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT4B', label: 'CAT 4B', count: 6, type: 'STANDARD', price: 20 },
        { id: 'CAT5B', label: 'CAT 5B', count: 7, type: 'STANDARD', price: 20 },
    ];

    useEffect(() => {
        const newSeats: Seat[] = [];

        const generateSeats = (clusters: ClusterConfig[]) => {
            clusters.forEach(cluster => {
                for (let i = 1; i <= cluster.count; i++) {
                    newSeats.push({
                        id: `${cluster.label}-${i}`,
                        row: cluster.label,
                        col: i,
                        type: cluster.type,
                        price: cluster.price,
                        status: 'available'
                    });
                }
            });
        };

        generateSeats(topRowClusters);
        generateSeats(bottomRowClusters);

        setSeats(newSeats);
    }, []);

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

    // Initial Auto-Scale
    useEffect(() => {
        if (containerRef.current && contentRef.current) {
            const containerWidth = containerRef.current.clientWidth;
            const contentWidth = contentRef.current.scrollWidth;
            // Add some padding/margin to calculation
            const initialScale = Math.min(1, (containerWidth - 40) / contentWidth);

            // Center initially
            const scaledContentWidth = contentWidth * initialScale;
            const initialX = (containerWidth - scaledContentWidth) / 2;

            setScale(initialScale);
            setPosition({ x: initialX, y: 20 }); // Top padding 20
        }
    }, [seats]); // Re-run when seats are generated/loaded

    const toggleSeat = (seatId: string) => {
        if (isDragGesture.current) return; // Ignore click if it was a drag

        const currentSelected = seats.find(s => s.status === 'selected');
        const targetSeat = seats.find(s => s.id === seatId);

        if (!targetSeat) return;
        if (targetSeat.status === 'occupied') return;

        if (currentSelected && currentSelected.id !== seatId && targetSeat.status !== 'selected') {
            alert("Mỗi người chỉ được mua 1 vé!");
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

    // --- ZOOM & PAN HANDLERS ---

    const handlePointerDown = (e: React.PointerEvent) => {
        e.preventDefault();
        setIsDragging(true);
        setStartPan({ x: e.clientX - position.x, y: e.clientY - position.y });
        isDragGesture.current = false;
        if (containerRef.current) {
            containerRef.current.setPointerCapture(e.pointerId);
        }
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;
        e.preventDefault();

        const newX = e.clientX - startPan.x;
        const newY = e.clientY - startPan.y;

        // Threshold to detect drag vs click
        if (Math.abs(newX - position.x) > 5 || Math.abs(newY - position.y) > 5) {
            isDragGesture.current = true;
        }

        setPosition({ x: newX, y: newY });
    };

    const handlePointerUp = (e: React.PointerEvent) => {
        setIsDragging(false);
        lastDistance.current = null;
        if (containerRef.current) {
            containerRef.current.releasePointerCapture(e.pointerId);
        }
    };

    // Touch events for Pinch Zoom (since Pointer Events don't natively handle pinch distance easily in all browsers)
    const handleTouchMove = (e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const touch1 = e.touches[0];
            const touch2 = e.touches[1];
            const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);

            if (lastDistance.current !== null) {
                const delta = dist - lastDistance.current;
                const zoomSpeed = 0.005;
                const newScale = Math.min(Math.max(0.3, scale + delta * zoomSpeed), 3);
                setScale(newScale);
            }
            lastDistance.current = dist;
        }
    };

    const handleTouchEnd = () => {
        lastDistance.current = null;
    };

    const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 3));
    const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.3));

    const renderSeat = (seat: Seat) => {
        let baseClass = "w-8 h-8 rounded-full text-[10px] flex items-center justify-center cursor-pointer transition-all duration-300 font-bold border ";

        if (seat.status === 'occupied') {
            baseClass += "bg-white/5 border-white/10 text-white/20 cursor-not-allowed";
        } else if (seat.status === 'selected') {
            baseClass += "bg-white text-black border-white shadow-[0_0_20px_white] transform scale-125 z-20 animate-pulse";
        } else {
            baseClass += "bg-black/40 border-cosmic-cyan/30 text-cosmic-cyan hover:bg-cosmic-cyan hover:text-black hover:border-cosmic-cyan hover:shadow-[0_0_15px_var(--color-cosmic-cyan)] hover:scale-110";
        }

        return (
            <div
                key={seat.id}
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering container click
                    toggleSeat(seat.id);
                }}
                className={baseClass}
                title={`${seat.id} - ${seat.price} banhmi`}
            >
                {seat.col}
            </div>
        );
    };

    const renderCluster = (config: ClusterConfig) => {
        const clusterSeats = seats.filter(s => s.row === config.label);

        if (config.count === 7) {
            // 3-1-3 Layout for 7 seats
            const leftCol = clusterSeats.filter(s => [1, 2, 3].includes(s.col));
            const rightCol = clusterSeats.filter(s => [4, 5, 6].includes(s.col));
            const centerSeat = clusterSeats.find(s => s.col === 7);

            return (
                <div key={config.id} className="flex items-start gap-2">
                    {/* Left Column (1, 2, 3) */}
                    <div className="flex flex-col gap-2">
                        {leftCol.map(renderSeat)}
                    </div>

                    {/* Center Column (Label + Seat 7) */}
                    <div className="flex flex-col justify-between h-full gap-2">
                        <div className="h-28 w-8 border border-white/10 bg-white/5 rounded flex items-center justify-center backdrop-blur-sm">
                            <span className="text-stardust text-[10px] font-bold uppercase tracking-widest -rotate-90 whitespace-nowrap">
                                {config.label}
                            </span>
                        </div>
                        {centerSeat && renderSeat(centerSeat)}
                    </div>

                    {/* Right Column (4, 5, 6) */}
                    <div className="flex flex-col gap-2">
                        {rightCol.map(renderSeat)}
                    </div>
                </div>
            );
        }

        // Standard Layout for 6 seats
        const col1 = clusterSeats.filter(s => s.col <= 3);
        const col2 = clusterSeats.filter(s => s.col > 3);

        return (
            <div key={config.id} className="flex items-center gap-2">
                {/* Left Column of Seats */}
                <div className="flex flex-col gap-2">
                    {col1.map(renderSeat)}
                </div>

                {/* Vertical Label */}
                <div className="h-28 w-8 border border-white/10 bg-white/5 rounded flex items-center justify-center backdrop-blur-sm">
                    <span className="text-stardust text-[10px] font-bold uppercase tracking-widest -rotate-90 whitespace-nowrap">
                        {config.label}
                    </span>
                </div>

                {/* Right Column of Seats */}
                <div className="flex flex-col gap-2">
                    {col2.map(renderSeat)}
                </div>
            </div>
        );
    };

    return (
        <div className="w-full h-full relative overflow-hidden bg-black/20 rounded-xl border border-white/5">
            {/* Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            {/* Zoom Controls */}
            <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-50">
                <button onClick={handleZoomIn} className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </button>
                <button onClick={handleZoomOut} className="w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                    </svg>
                </button>
            </div>

            {/* Interactive Container */}
            <div
                ref={containerRef}
                className="w-full h-full touch-none cursor-move"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    ref={contentRef}
                    className="origin-top-left absolute top-0 left-0 transition-transform duration-100 ease-out"
                    style={{
                        transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                        width: 'fit-content'
                    }}
                >
                    <div className="flex flex-col items-center p-10 min-w-[800px]"> {/* Min width to ensure layout holds */}

                        {/* Stage Illustration */}
                        <div className="w-full max-w-4xl mb-16 relative flex flex-col items-center shrink-0 perspective-1000">
                            {/* Stage Glow */}
                            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-full h-40 bg-cosmic-cyan/20 blur-[80px] rounded-full animate-pulse-slow"></div>

                            {/* 3D Stage Effect */}
                            <div className="w-full h-24 border-t border-cosmic-cyan/50 rounded-t-[50%] bg-gradient-to-b from-cosmic-cyan/20 via-cosmic-cyan/5 to-transparent flex items-start justify-center pt-6 shadow-[0_-10px_50px_rgba(6,182,212,0.2)] transform rotateX(20deg)">
                                <span className="text-cosmic-cyan uppercase tracking-[0.5em] text-sm font-bold text-shadow-glow">Sân khấu</span>
                            </div>
                        </div>

                        {/* Seat Clusters */}
                        <div className="flex flex-col gap-16">
                            {/* Top Row Clusters */}
                            <div className="flex gap-6 justify-center">
                                {topRowClusters.map(renderCluster)}
                            </div>

                            {/* Bottom Row Clusters + CAT 6 (Standing Zone) */}
                            <div className="flex items-start justify-center">
                                {/* CAT 6 - Standing Zone - Fixed 50px left of CAT 5A */}
                                <div className="w-20 border border-dashed border-white/20 rounded-xl p-2 flex flex-col items-center justify-center bg-white/5 shrink-0 h-[240px] backdrop-blur-sm rotate-180 mr-[50px]" style={{ writingMode: 'vertical-rl' }}>
                                    <h5 className="text-stardust font-bold text-xs uppercase tracking-widest text-center whitespace-nowrap">CAT 6 - Standing Zone</h5>
                                    <span className="text-gray-500 text-[8px] font-normal mt-2 whitespace-nowrap">Staff only</span>
                                </div>

                                {/* Bottom Row Clusters */}
                                <div className="flex gap-6">
                                    {bottomRowClusters.map(renderCluster)}
                                </div>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex gap-8 mt-12 text-xs text-stardust glass-panel px-8 py-4 rounded-full shadow-lg shrink-0 relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-black/40 border border-cosmic-cyan/50 rounded-full"></div>
                                <span>Ghế trống</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-white border border-white rounded-full shadow-[0_0_10px_white]"></div>
                                <span>Đang chọn</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-4 h-4 bg-white/5 border border-white/10 rounded-full"></div>
                                <span>Đã bán</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
