'use client';

import { useState, useEffect } from 'react';
import { Hero } from '@/components/landing/Hero';
import { AboutEvent } from '@/components/landing/AboutEvent';
import { AboutSchedule } from '@/components/landing/AboutSchedule';
import { TicketClasses } from '@/components/landing/TicketClasses';
import { BookingModal } from '@/components/booking/BookingModal';
import { StardustBackground } from '@/components/ui/StardustBackground';

export default function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isSoldOut, setIsSoldOut] = useState(false);

  useEffect(() => {
    const checkSoldOut = async () => {
      try {
        const response = await fetch('/api/bookings', {
          cache: 'no-store',
          headers: {
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
          }
        });
        if (response.ok) {
          const bookings = await response.json();
          const totalBookedSeats = bookings.reduce((acc: number, booking: any) => {
            return acc + (Array.isArray(booking.seats) ? booking.seats.length : 0);
          }, 0);

          if (totalBookedSeats >= 68) {
            setIsSoldOut(true);
          } else {
            setIsSoldOut(false);
          }
        }
      } catch (error) {
        console.error("Failed to check booking status", error);
      }
    };

    checkSoldOut();
  }, []);

  const openBooking = () => setIsBookingModalOpen(true);
  const closeBooking = () => setIsBookingModalOpen(false);

  return (
    <div className="min-h-screen bg-black relative">
      <StardustBackground />
      <Hero onBookTicket={openBooking} isSoldOut={isSoldOut} />
      <AboutEvent />
      <AboutSchedule />
      <TicketClasses onBookTicket={openBooking} isSoldOut={isSoldOut} />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBooking}
        isSoldOut={isSoldOut}
      />
    </div>
  );
}
