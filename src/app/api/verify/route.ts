import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, employeeId, phoneNumber } = body;

        if (!name || !employeeId || !phoneNumber) {
            return NextResponse.json({ verified: false });
        }

        const csvPath = path.join(process.cwd(), 'members_ownego_contacts_phone_text_utf8.csv');
        if (!fs.existsSync(csvPath)) {
            return NextResponse.json({ error: 'Member list not found' }, { status: 500 });
        }

        const fileContent = fs.readFileSync(csvPath, 'utf-8');
        const lines = fileContent.split('\n').filter(line => line.trim() !== '');

        const dataRows = lines.slice(1);

        let isVerified = false;

        const inputName = name.trim().toLowerCase();
        const inputRocket = employeeId.trim().toLowerCase();
        const inputPhone = phoneNumber.replace(/^'/, '').trim();

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

        return NextResponse.json({ verified: isVerified });
    } catch (error) {
        return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
    }
}
