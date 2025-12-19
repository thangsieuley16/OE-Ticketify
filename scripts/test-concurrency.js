// using native fetch

async function testConcurrency() {
    console.log("Starting concurrency test...");

    const seatId = "TEST_SEAT_" + Date.now();
    const concurrentRequests = 5;

    // Create conflicting booking requests
    const requests = Array.from({ length: concurrentRequests }, (_, i) => {
        return fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                seats: [{ id: seatId, type: 'STANDARD', price: 0, row: 'X', col: 1 }],
                user: {
                    name: `Test User ${i}`,
                    employeeId: `testuser${i}`,
                    phoneNumber: `090000000${i}`
                }
            })
        }).then(res => res.json().then(data => ({ status: res.status, data, user: `Test User ${i}` })));
    });

    console.log(`Sending ${concurrentRequests} concurrent requests for seat ${seatId}...`);

    const results = await Promise.all(requests);

    console.log("Results:");

    let successCount = 0;
    let conflictCount = 0;
    let otherCount = 0;

    results.forEach(r => {
        console.log(`User: ${r.user} | Status: ${r.status} | Data: ${JSON.stringify(r.data)}`);
        if (r.status === 200 || (r.data.success)) successCount++;
        else if (r.status === 409) conflictCount++;
        else otherCount++;
    });

    console.log("---------------------------------------------------");
    console.log(`Successes: ${successCount}`);
    console.log(`Conflicts: ${conflictCount}`);
    console.log(`Others: ${otherCount}`);

    if (successCount === 1 && conflictCount === concurrentRequests - 1) {
        console.log("✅ TEST PASSED: Concurrency handled correctly.");
    } else {
        console.log("❌ TEST FAILED: Race condition detected or unexpected error.");
    }
}

testConcurrency();
