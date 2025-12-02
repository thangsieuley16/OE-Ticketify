import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'bookings.json');

// Helper to read bookings
function getBookings() {
    if (!fs.existsSync(DATA_FILE_PATH)) {
        return [];
    }
    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    try {
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
}

// Helper to save bookings
function saveBookings(bookings: any[]) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(bookings, null, 2));
}

export async function GET() {
    const bookings = getBookings();
    return NextResponse.json(bookings);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { seats, user } = body;

        if (!seats || !Array.isArray(seats) || seats.length === 0) {
            return NextResponse.json({ error: 'Invalid seats data' }, { status: 400 });
        }

        // Verify member
        const csvPath = path.join(process.cwd(), 'members_ownego_contacts_phone_text_utf8.csv');
        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: 'Member list not found' }, { status: 500 });
        }

        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');

        // Skip header row
        const dataRows = lines.slice(1);

        let isVerified = false;

        // Normalize user input for comparison
        const inputName = user.name.trim().toLowerCase();
        const inputRocket = user.employeeId.trim().toLowerCase();
        const inputPhone = user.phoneNumber.replace(/^'/, '').trim(); // Remove leading quote if user typed it, though usually they won't

        for (const line of dataRows) {
            // CSV format: ten,rocketname,so_dien_thoai
            const parts = line.split(',');
            if (parts.length >= 3) {
                const csvName = parts[0].trim().toLowerCase();
                const csvRocket = parts[1].trim().toLowerCase();
                // Phone in CSV has leading single quote like '0911...
                const csvPhoneRaw = parts[2].trim();
                const csvPhone = csvPhoneRaw.replace(/^'/, '').replace(/'$/, ''); // Remove quotes

                if (csvName === inputName && csvRocket === inputRocket && csvPhone === inputPhone) {
                    isVerified = true;
                    break;
                }
            }
        }

        if (!isVerified) {
            return NextResponse.json({ error: 'Thông tin không chính xác hoặc bạn không có trong danh sách thành viên.' }, { status: 403 });
        }

        const currentBookings = getBookings();

        // Check if user has already booked
        // We compare against the normalized inputRocket and inputPhone we prepared earlier
        const alreadyBooked = currentBookings.some((b: any) => {
            const bookedRocket = b.user.employeeId.trim().toLowerCase();
            const bookedPhone = b.user.phoneNumber.replace(/^'/, '').trim();
            return bookedRocket === inputRocket || bookedPhone === inputPhone;
        });

        if (alreadyBooked) {
            return NextResponse.json({ error: 'Bạn đã đặt vé rồi! Mỗi người chỉ được đặt 1 vé.' }, { status: 409 });
        }

        // Check for double booking
        const allOccupiedSeatIds = new Set(currentBookings.flatMap((b: any) => b.seats.map((s: any) => s.id)));
        const hasConflict = seats.some((seat: any) => allOccupiedSeatIds.has(seat.id));

        if (hasConflict) {
            return NextResponse.json({ error: 'One or more seats are already booked' }, { status: 409 });
        }

        // Apply 0 price if verified (which is required now)
        const seatsWithZeroPrice = seats.map((seat: any) => ({
            ...seat,
            price: 0
        }));

        const newBooking = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            user,
            seats: seatsWithZeroPrice
        };

        // Calculate Early Bird status
        // Count how many bookings have at least one Standard ticket (price 20 or type STANDARD)
        // We check the saved bookings. Saved bookings might have price 0 if verified, so we check the 'type' or original price if available.
        // In our data, 'type' is saved.
        const standardBookingsCount = currentBookings.filter((b: any) =>
            b.seats.some((s: any) => s.type === 'STANDARD' || s.price === 20)
        ).length;

        // Check if current booking has any Standard ticket
        // The 'seats' from request body comes from frontend selection, so it has the original price/type.
        const hasStandardTicket = seats.some((s: any) => s.type === 'STANDARD' || s.price === 20);

        // Early Bird applies if:
        // 1. Current booking includes a Standard ticket
        // 2. The number of previous bookings with Standard tickets is less than 10
        const isEarlyBird = hasStandardTicket && standardBookingsCount < 10;

        currentBookings.push(newBooking);
        saveBookings(currentBookings);

        return NextResponse.json({ success: true, booking: newBooking, isEarlyBird });
    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
    }
}
