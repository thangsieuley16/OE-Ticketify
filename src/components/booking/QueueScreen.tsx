import React, { useEffect, useState } from 'react';

interface QueueScreenProps {
    onComplete: () => void;
}

export function QueueScreen({ onComplete }: QueueScreenProps) {
    const [queueCount, setQueueCount] = useState<number | null>(null);

    // Handle completion when queue reaches 0
    useEffect(() => {
        if (queueCount === 0) {
            onComplete();
        }
    }, [queueCount, onComplete]);

    useEffect(() => {
        // Initialize random count between 10 and 70
        const initialCount = Math.floor(Math.random() * 61) + 10;
        setQueueCount(initialCount);

        let timeoutId: NodeJS.Timeout;

        const processQueue = () => {
            // Random delay between 200ms and 1000ms
            const delay = Math.floor(Math.random() * 800) + 200;

            timeoutId = setTimeout(() => {
                setQueueCount((prev) => {
                    // If prev is null (shouldn't happen after init) or <= 0, stop
                    if (prev === null || prev <= 0) return 0;

                    // Decrease by random amount 1-5
                    const decrease = Math.floor(Math.random() * 5) + 1;
                    const nextValue = prev - decrease;

                    if (nextValue <= 0) {
                        return 0;
                    }

                    // Continue queueing
                    processQueue();
                    return nextValue;
                });
            }, delay);
        };

        processQueue();

        return () => clearTimeout(timeoutId);
    }, []); // Empty dependency array for init logic (we don't want to restart if onComplete changes, though it shouldn't matter)

    return (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black text-white">
            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
                {/* Rotating Logo */}
                <div className="w-48 h-48 rounded-full flex items-center justify-center relative z-10 animate-spin-slow">
                    <img src="/images/ownego_logo_new.png" alt="Ownego" className="w-full h-full object-contain drop-shadow-[0_0_25px_rgba(255,255,255,0.5)] brightness-110" />
                </div>
            </div>

            <h2 className="text-2xl font-bold uppercase tracking-widest mb-4">Đang xếp hàng...</h2>
            <p className="text-gray-400 text-lg">
                Số người trước bạn: <span className="text-neon-cyan font-bold text-2xl">{queueCount}</span>
            </p>
            <p className="text-gray-600 text-sm mt-2">Vui lòng không tắt trình duyệt</p>
        </div>
    );
}
