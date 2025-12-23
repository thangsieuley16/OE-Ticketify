import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Mutex } from '@/lib/mutex';

const bookingMutex = new Mutex();

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

        let targetRocketUsername = '';

        for (const line of dataRows) {
            const parts = line.split(',');
            if (parts.length >= 3) {
                const csvName = parts[0].trim().toLowerCase();
                const csvRocketOriginal = parts[1].trim();
                const csvRocket = csvRocketOriginal.toLowerCase();
                const csvPhoneRaw = parts[2].trim();
                const csvPhone = csvPhoneRaw.replace(/^'/, '').replace(/'$/, '');

                if (csvName === inputName && csvRocket === inputRocket && csvPhone === inputPhone) {
                    isVerified = true;
                    targetRocketUsername = csvRocketOriginal;
                    break;
                }
            }
        }

        if (!isVerified) {
            return NextResponse.json({ error: 'Thông tin không chính xác hoặc bạn không có trong danh sách thành viên.' }, { status: 403 });
        }

        // --- TIME CHECK (LOCK until 14:30 29/12/2025 and CLOSE at 18:00 30/12/2025) ---
        // --- TIME CHECK (LOCK until 14:30 29/12/2025 and CLOSE at 18:00 30/12/2025) ---
        // --- TIME CHECK (LOCK until 14:30 29/12/2025 and CLOSE at 18:01 30/12/2025) ---
        const openingTime = new Date('2025-12-29T14:30:00+07:00').getTime();
        const closingTime = new Date('2025-12-30T18:01:00+07:00').getTime();
        const now = new Date().getTime();

        if (now < openingTime) {
            return NextResponse.json({ error: 'Cổng bán vé sẽ mở vào lúc 14:30 ngày 29/12/2025. Vui lòng quay lại sau!' }, { status: 403 });
        }
        if (now >= closingTime) {
            return NextResponse.json({ error: 'Đã hết thời gian mua vé!' }, { status: 403 });
        }
        // ----------------------------------------------------

        // Variables to hold data extracting from the lock
        let response: NextResponse | undefined;
        let chatNotificationTask: { username: string; ticketId: string; isEarlyBird: boolean } | null = null;
        let bookingReference: any = null;

        await bookingMutex.runExclusive(async () => {
            const currentBookings = getBookings();

            const alreadyBooked = currentBookings.some((b: any) => {
                const bookedRocket = b.user.employeeId.trim().toLowerCase();
                const bookedPhone = b.user.phoneNumber.replace(/^'/, '').trim();
                return bookedRocket === inputRocket || bookedPhone === inputPhone;
            });

            if (alreadyBooked) {
                const existingBooking = currentBookings.find((b: any) => {
                    const bookedRocket = b.user.employeeId.trim().toLowerCase();
                    const bookedPhone = b.user.phoneNumber.replace(/^'/, '').trim();
                    return bookedRocket === inputRocket || bookedPhone === inputPhone;
                });

                response = NextResponse.json({
                    ticketId: existingBooking?.seats.map((s: any) => s.id).join(', '),
                    errorCode: 'GREEDY_USER'
                }, { status: 409 });
                return;
            }

            const allOccupiedSeatIds = new Set(currentBookings.flatMap((b: any) => b.seats.map((s: any) => s.id)));
            const hasConflict = seats.some((seat: any) => allOccupiedSeatIds.has(seat.id));

            if (hasConflict) {
                response = NextResponse.json({ error: 'Ghế này có người khác đặt ồi =))) bạn vui lòng đặt ghế khác nhaaa' }, { status: 409 });
                return;
            }

            const seatsWithZeroPrice = seats.map((seat: any) => ({
                ...seat,
                price: 0
            }));

            const newBooking = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                user,
                seats: seatsWithZeroPrice,
                chatStatus: 'pending' // Initially pending
            };

            const standardBookingsCount = currentBookings.filter((b: any) =>
                b.seats.some((s: any) => s.type === 'STANDARD' || s.price === 20)
            ).length;

            const hasStandardTicket = seats.some((s: any) => s.type === 'STANDARD' || s.price === 20);

            const isEarlyBird = hasStandardTicket && standardBookingsCount < 10;

            // Save booking immediately
            currentBookings.push(newBooking);
            saveBookings(currentBookings);

            // Prepare task for outside lock
            chatNotificationTask = {
                username: targetRocketUsername,
                ticketId: seats.map((s: any) => s.id).join(', '),
                isEarlyBird
            };

            bookingReference = newBooking;

            // We do NOT create the response here for success anymore.
            // We wait until after chat to report "sent" or "failed".
        });

        // --- CRITICAL: MOVED OUTSIDE MUTEX ---
        // This runs while the lock is FREE for other users.
        if (chatNotificationTask && bookingReference) {
            const { username, ticketId, isEarlyBird } = chatNotificationTask;
            const isChatSent = await sendChatNotification(username, ticketId, isEarlyBird);

            // Update the in-memory reference
            bookingReference.chatStatus = isChatSent ? 'sent' : 'failed';

            // Now create the response with the CORRECT status
            response = NextResponse.json({ success: true, booking: bookingReference, isEarlyBird });
        }

        return response!;
    } catch (error) {
        console.error("Booking error:", error);
        return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
    }
}

async function sendChatNotification(username: string, ticketId: string, isEarlyBird: boolean): Promise<boolean> {
    const payload = {
        username,
        ticketId,
        isEarlyBird
    };

    try {
        const response = await fetch('https://chat.ownego.com/api/apps/public/1891b806-120e-4e23-92d0-2bc3793ac3a1/messenger', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to send chat notification:', response.status, response.statusText, errorText);
            return false;
        } else {
            console.log('Chat notification sent successfully');
            return true;
        }
    } catch (error) {
        console.error('Error sending chat notification:', error);
        return false;
    }
}

export async function DELETE(request: Request) {
    try {
        const body = await request.json();
        const { password } = body;

        const passwordPath = path.join(process.cwd(), 'src', 'thangnc.json');
        if (!fs.existsSync(passwordPath)) {
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
        }

        const passwordData = JSON.parse(fs.readFileSync(passwordPath, 'utf-8'));

        if (password !== passwordData.password) {
            return NextResponse.json({ error: 'Sai mật khẩu' }, { status: 403 });
        }

        // Use mutex to ensure safe deletion
        await bookingMutex.runExclusive(async () => {
            saveBookings([]);
        });

        return NextResponse.json({ success: true, message: 'Deleted all bookings' });

    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: 'Failed to delete bookings' }, { status: 500 });
    }
}
