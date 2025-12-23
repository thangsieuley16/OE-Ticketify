import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Mutex } from '@/lib/mutex';

// Reuse mutex to be safe with file reads/writes
const bookingMutex = new Mutex();

const DATA_FILE_PATH = path.join(process.cwd(), 'bookings.json');
const PASSWORD_FILE_PATH = path.join(process.cwd(), 'src', 'thangnc.json');
const CSV_PATH = path.join(process.cwd(), 'members_ownego_contacts_phone_text_utf8.csv');

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

// Helper to look up rocket username from CSV (to be safe if original booking data is messy)
function getRocketUsername(user: any): string | null {
    if (!fs.existsSync(CSV_PATH)) return null;

    const fileContent = fs.readFileSync(CSV_PATH, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim() !== '');
    const dataRows = lines.slice(1);

    const inputName = user.name?.trim().toLowerCase();
    const inputRocket = user.employeeId?.trim().toLowerCase();
    const inputPhone = user.phoneNumber?.replace(/^'/, '').trim();

    for (const line of dataRows) {
        const parts = line.split(',');
        if (parts.length >= 3) {
            const csvName = parts[0].trim().toLowerCase();
            const csvRocketOriginal = parts[1].trim();
            const csvRocket = csvRocketOriginal.toLowerCase();
            const csvPhoneRaw = parts[2].trim();
            const csvPhone = csvPhoneRaw.replace(/^'/, '').replace(/'$/, '');

            if (csvName === inputName && csvRocket === inputRocket && csvPhone === inputPhone) {
                return csvRocketOriginal;
            }
        }
    }
    return null;
}

// Helper: Determine if Early Bird (re-implementing logic to be consistent)
// Note: This must match the frontend display logic or the `POST /bookings` logic
function checkIsEarlyBird(bookings: any[], targetBookingId: string): boolean {
    // Sort by date ascending
    const sorted = [...bookings].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let standardCount = 0;
    const earlyBirdIds = new Set<string>();

    for (const b of sorted) {
        const isStandard = b.seats.some((s: any) => s.type === 'STANDARD' || s.price === 20 || s.price === 0);
        if (isStandard) {
            if (standardCount < 10) {
                earlyBirdIds.add(b.id);
                standardCount++;
            }
        }
    }

    return earlyBirdIds.has(targetBookingId);
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to send chat notification:', response.status, errorText);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error sending chat notification:', error);
        return false;
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { bookingId, password } = body;

        // 1. Check Password
        if (!fs.existsSync(PASSWORD_FILE_PATH)) {
            return NextResponse.json({ error: 'Server config error' }, { status: 500 });
        }
        const passwordData = JSON.parse(fs.readFileSync(PASSWORD_FILE_PATH, 'utf-8'));
        if (password !== passwordData.password) {
            return NextResponse.json({ error: 'Sai mật khẩu' }, { status: 403 });
        }

        let chatTask: { username: string; ticketId: string; isEarlyBird: boolean } | null = null;
        let bookingFound = false;

        // 2. Find Booking & Prepare Data (Inside Mutex just to read/write safely)
        await bookingMutex.runExclusive(async () => {
            const bookings = getBookings();
            const bookingIndex = bookings.findIndex((b: any) => b.id === bookingId);

            if (bookingIndex === -1) {
                return; // Not found
            }

            bookingFound = true;
            const booking = bookings[bookingIndex];

            // Re-verify rocket username to ensure it's correct
            const rocketUsername = getRocketUsername(booking.user);
            if (!rocketUsername) {
                throw new Error("Could not verify user info in CSV");
            }

            // Check Early Bird status
            const isEarlyBird = checkIsEarlyBird(bookings, bookingId);

            chatTask = {
                username: rocketUsername,
                ticketId: booking.seats.map((s: any) => s.id).join(', '),
                isEarlyBird
            };
        });

        if (!bookingFound) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (!chatTask) {
            return NextResponse.json({ error: 'User data verification failed' }, { status: 400 });
        }

        // 3. Send Chat (OUTSIDE MUTEX)
        const { username, ticketId, isEarlyBird } = chatTask!;
        const success = await sendChatNotification(username, ticketId, isEarlyBird);

        // 4. Update Status (Inside Mutex)
        await bookingMutex.runExclusive(async () => {
            const bookings = getBookings();
            const bookingIndex = bookings.findIndex((b: any) => b.id === bookingId);
            if (bookingIndex !== -1) {
                bookings[bookingIndex].chatStatus = success ? 'sent' : 'failed';
                bookings[bookingIndex].isEarlyBird = isEarlyBird; // Store this for persistence if we want
                saveBookings(bookings);
            }
        });

        if (success) {
            return NextResponse.json({ success: true, message: 'Message sent successfully' });
        } else {
            return NextResponse.json({ error: 'Failed to send message to Rocket.Chat' }, { status: 502 });
        }

    } catch (error) {
        console.error("Resend error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
