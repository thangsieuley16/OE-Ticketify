import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE_PATH = path.join(process.cwd(), 'bookings.json');

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

        const csvPath = path.join(process.cwd(), 'members_ownego_contacts_phone_text_utf8.csv');
        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: 'Member list not found' }, { status: 500 });
        }

        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');

        const dataRows = lines.slice(1);

        let isVerified = false;

        const inputName = user.name.trim().toLowerCase();
        const inputRocket = user.employeeId.trim().toLowerCase();
        const inputPhone = user.phoneNumber.replace(/^'/, '').trim();

        for (const line of dataRows) {
            const parts = line.split(',');
            if (parts.length >= 3) {
                const csvName = parts[0].trim().toLowerCase();
                const csvRocket = parts[1].trim().toLowerCase();
                const csvPhoneRaw = parts[2].trim();
                const csvPhone = csvPhoneRaw.replace(/^'/, '').replace(/'$/, '');

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

        const alreadyBooked = currentBookings.some((b: any) => {
            const bookedRocket = b.user.employeeId.trim().toLowerCase();
            const bookedPhone = b.user.phoneNumber.replace(/^'/, '').trim();
            return bookedRocket === inputRocket || bookedPhone === inputPhone;
        });

        if (alreadyBooked) {
            return NextResponse.json({ error: 'Bạn đã đặt vé rồi! Mỗi người chỉ được đặt 1 vé.' }, { status: 409 });
        }

        const allOccupiedSeatIds = new Set(currentBookings.flatMap((b: any) => b.seats.map((s: any) => s.id)));
        const hasConflict = seats.some((seat: any) => allOccupiedSeatIds.has(seat.id));

        if (hasConflict) {
            return NextResponse.json({ error: 'One or more seats are already booked' }, { status: 409 });
        }

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

        const standardBookingsCount = currentBookings.filter((b: any) =>
            b.seats.some((s: any) => s.type === 'STANDARD' || s.price === 20)
        ).length;

        const hasStandardTicket = seats.some((s: any) => s.type === 'STANDARD' || s.price === 20);

        const isEarlyBird = hasStandardTicket && standardBookingsCount < 10;

        currentBookings.push(newBooking);
        saveBookings(currentBookings);

        return NextResponse.json({ success: true, booking: newBooking, isEarlyBird });
    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
    }
}
