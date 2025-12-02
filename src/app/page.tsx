'use client';

import { useState } from 'react';
import { Hero } from '@/components/landing/Hero';
import { AboutEvent } from '@/components/landing/AboutEvent';
import { AboutSchedule } from '@/components/landing/AboutSchedule';
import { TicketClasses } from '@/components/landing/TicketClasses';
import { BookingModal } from '@/components/booking/BookingModal';
import { StardustBackground } from '@/components/ui/StardustBackground';

export default function Home() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  const openBooking = () => setIsBookingModalOpen(true);
  const closeBooking = () => setIsBookingModalOpen(false);

  return (
    <div className="min-h-screen bg-black relative">
      <StardustBackground />
      <Hero onBookTicket={openBooking} />
      <AboutEvent />
      <AboutSchedule />
      <TicketClasses onBookTicket={openBooking} />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={closeBooking}
      />
    </div>
  );
}
