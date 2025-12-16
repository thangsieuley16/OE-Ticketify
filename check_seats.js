const fs = require('fs');

try {
    const data = fs.readFileSync('bookings.json', 'utf8');
    const bookings = JSON.parse(data);
    const totalBookedSeats = bookings.reduce((acc, booking) => acc + booking.seats.length, 0);
    console.log('Total bookings entries:', bookings.length);
    console.log('Total booked seats:', totalBookedSeats);

    // Check for unique seat IDs to ensure no duplicates
    const seatIds = bookings.flatMap(b => b.seats.map(s => s.id));
    const uniqueSeatIds = new Set(seatIds);
    console.log('Unique booked seat IDs:', uniqueSeatIds.size);

} catch (err) {
    console.error(err);
}
