'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ConfirmationPage() {
    const [booking, setBooking] = useState<any>(null);

    useEffect(() => {
        const data = localStorage.getItem('lastBooking');
        if (data) {
            setBooking(JSON.parse(data));
        }
    }, []);

    if (!booking) return <div className="text-white text-center py-20">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto py-12 text-center space-y-8">
            <div className="w-20 h-20 bg-neon-green rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_var(--color-neon-green)]">
                <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
            </div>

            <h1 className="text-4xl font-bold text-white">Booking Confirmed!</h1>
            <p className="text-gray-400">Your tickets have been successfully booked.</p>

            <Card className="text-left space-y-4">
                <div className="border-b border-gray-800 pb-4">
                    <h3 className="text-xl font-bold text-white">{booking.event.title}</h3>
                    <p className="text-gray-400">{booking.event.date} | {booking.event.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Booker</label>
                        <p className="text-white font-medium">{booking.booker.name}</p>
                        <p className="text-sm text-gray-400">{booking.booker.email}</p>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500 uppercase">Seats</label>
                        <p className="text-neon-green font-bold text-lg">{booking.seats.join(', ')}</p>
                    </div>
                </div>

                <div className="bg-gray-800 p-4 rounded text-center">
                    <p className="text-xs text-gray-500 mb-1">BOOKING ID</p>
                    <p className="font-mono text-white tracking-widest">#TB-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
            </Card>

            <Link href="/">
                <Button variant="outline">Back to Home</Button>
            </Link>
        </div>
    );
}
