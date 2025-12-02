const fs = require('fs');
const path = require('path');

const csvPath = path.join(process.cwd(), 'members_ownego_contacts_phone_text_utf8.csv');

console.log(`Reading CSV from: ${csvPath}`);

if (!fs.existsSync(csvPath)) {
    console.error('CSV file not found!');
    process.exit(1);
}

const fileContent = fs.readFileSync(csvPath, 'utf-8');
const lines = fileContent.split('\n').filter(line => line.trim() !== '');
const dataRows = lines.slice(1);

console.log(`Found ${dataRows.length} records.`);

function verify(name, rocket, phone) {
    const inputName = name.trim().toLowerCase();
    const inputRocket = rocket.trim().toLowerCase();
    const inputPhone = phone.replace(/^'/, '').trim();

    console.log(`Verifying: ${inputName}, ${inputRocket}, ${inputPhone}`);

    for (const line of dataRows) {
        const parts = line.split(',');
        if (parts.length >= 3) {
            const csvName = parts[0].trim().toLowerCase();
            const csvRocket = parts[1].trim().toLowerCase();
            const csvPhoneRaw = parts[2].trim();
            const csvPhone = csvPhoneRaw.replace(/^'/, '').replace(/'$/, '');

            if (csvName === inputName && csvRocket === inputRocket && csvPhone === inputPhone) {
                return true;
            }
        }
    }
    return false;
}

// Test Case 1: Valid User
const result1 = verify('Nguyễn Tiến Minh', 'mihnsen', '0911556248');
console.log(`Test Case 1 (Valid): ${result1 ? 'PASSED' : 'FAILED'}`);

// Test Case 2: Valid User with leading quote in input (simulating weird input, though frontend strips it usually)
const result2 = verify('Nguyễn Tiến Minh', 'mihnsen', "'0911556248");
console.log(`Test Case 2 (Valid with quote): ${result2 ? 'PASSED' : 'FAILED'}`);

// Test Case 3: Invalid Name
const result3 = verify('Nguyen Tien Minh', 'mihnsen', '0911556248');
console.log(`Test Case 3 (Invalid Name): ${!result3 ? 'PASSED' : 'FAILED'}`);

// Test Case 4: Invalid Phone
const result4 = verify('Nguyễn Tiến Minh', 'mihnsen', '0999999999');
console.log(`Test Case 4 (Invalid Phone): ${!result4 ? 'PASSED' : 'FAILED'}`);
