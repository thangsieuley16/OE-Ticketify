'use client';

import { useState } from 'react';
import { SeatMap } from '@/components/booking/SeatMap';
import { StardustBackground } from '@/components/ui/StardustBackground';

export default function SeatMapPage() {
    const handleSelectionChange = () => {
        // Just viewing, no action needed
    };

    return (
        <div className="min-h-screen bg-black relative">
            <StardustBackground />
            <div className="container mx-auto px-4 py-8 relative z-10 h-screen flex flex-col">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-display font-bold text-white uppercase tracking-wider">
                        Sơ đồ chỗ ngồi
                    </h1>
                </div>

                <div className="flex-1 bg-deep-space/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden p-4">
                    <SeatMap
                        onSelectionChange={handleSelectionChange}
                        onLimitReached={() => { }}
                    />
                </div>
            </div>
        </div>
    );
}
