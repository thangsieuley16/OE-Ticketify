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
        // Initialize random count between 25 and 35
        const initialCount = Math.floor(Math.random() * 11) + 49
        setQueueCount(initialCount);

        // Random target duration between 5000ms and 7000ms
        const targetDuration = Math.floor(Math.random() * 2001) + 5000;

        // Estimate steps needed (avg decrease is 1.5)
        const estimatedSteps = initialCount / 1.5;

        // Calculate base delay needed to achieve target duration
        const baseDelay = targetDuration / estimatedSteps;

        let timeoutId: NodeJS.Timeout;

        const processQueue = () => {
            // Add randomness to delay ( +/- 20% of baseDelay)
            const variation = baseDelay * 0.4; // 40% range spread
            const randomOffset = (Math.random() * variation) - (variation / 2);
            const delay = Math.floor(baseDelay + randomOffset);

            timeoutId = setTimeout(() => {
                setQueueCount((prev) => {
                    // If prev is null (shouldn't happen after init) or <= 0, stop
                    if (prev === null || prev <= 0) return 0;

                    // Decrease by random amount 1-2
                    const decrease = Math.floor(Math.random() * 2) + 1;
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
    }, []);

    return (
        <div className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl text-white overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('/images/stardust.png')] opacity-30 animate-pulse-slow pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cosmic-cyan/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative w-80 h-80 flex items-center justify-center mb-10">
                {/* Rotating Logo */}
                <div className="w-64 h-64 rounded-full flex items-center justify-center relative z-10 animate-spin-slow">
                    <img src="/images/ownego_logo_new.png" alt="Ownego" className="w-full h-full object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.6)] brightness-125" />
                </div>
                {/* Orbit rings */}
                <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-4 border border-cosmic-cyan/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
            </div>

            <h2 className="text-4xl md:text-6xl font-display font-bold tracking-widest mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] text-center px-4">
                Chờ xíu...
            </h2>

            <div className="flex flex-col items-center gap-2 mb-8">
                <p className="text-gray-300 text-xl md:text-2xl font-light tracking-wide font-display">Số người trước bạn</p>
                <span className="text-7xl md:text-9xl font-bold text-cosmic-cyan drop-shadow-[0_0_40px_rgba(6,182,212,0.8)] font-chatime animate-pulse">
                    {queueCount}
                </span>
            </div>

            <p className="text-gray-400 text-base md:text-lg mt-4 animate-bounce bg-white/5 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm font-sans">
                ⚠️ Vui lòng không tắt trình duyệt
            </p>
        </div>
    );
}
