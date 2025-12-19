import React from 'react';
import { Button } from '@/components/ui/Button';

import { Seat } from './SeatMap';

interface BookingSummaryProps {
    selectedSeats: Seat[];
    pricePerSeat?: number; // Kept for compatibility but calculation will prioritize seat.price
    onConfirm: () => void;
}

export function BookingSummary({ selectedSeats, onConfirm }: BookingSummaryProps) {
    const total = selectedSeats.reduce((sum, seat) => sum + seat.price, 0);

    return (
        <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 space-y-4 sticky top-24">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">Booking Summary</h3>

            <div className="space-y-2 text-gray-400">
                <div className="flex justify-between">
                    <span>Selected Seats:</span>
                    <span className="text-white font-mono text-right">
                        {selectedSeats.map(s => s.id).join(', ') || 'None'}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span>Price per seat:</span>
                    <span className="text-white font-mono">
                        {selectedSeats.length > 0
                            ? selectedSeats.length === 1
                                ? `$${selectedSeats[0].price}`
                                : 'Varies'
                            : '$0'}
                    </span>
                </div>
                <div className="border-t border-gray-800 pt-2 flex justify-between text-lg font-bold text-neon-green">
                    <span>Total:</span>
                    <span>${total}</span>
                </div>
            </div>

            <Button
                className="w-full mt-4"
                disabled={selectedSeats.length === 0}
                onClick={onConfirm}
            >
                Confirm Selection
            </Button>
        </div>
    );
}
