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

    if (!event) return <div className="text-white text-center py-20">Event not found</div>;

    const handleConfirmSelection = () => {
        setStep('form');
    };

    const handleBookingSubmit = (data: any) => {
        console.log('Booking submitted:', { eventId: id, seats: selectedSeats, booker: data });
        // Save to local storage for demo
        localStorage.setItem('lastBooking', JSON.stringify({
            event,
            seats: selectedSeats,
            booker: data,
            date: new Date().toISOString()
        }));
        router.push('/confirmation');
    };

    return (
        <div className="space-y-8">
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
        </div>
    );
}
