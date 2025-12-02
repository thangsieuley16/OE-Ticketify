import React from 'react';

export default function OwnARversePage() {
    return (
        <div className="w-full h-screen bg-black relative">
            <iframe
                src="/ownarverse/index.html"
                className="w-full h-full border-none"
                title="ownARverse Experience"
                allow="camera; microphone; accelerometer; gyroscope; autoplay"
            />

            {/* Back Button Overlay */}
            <a
                href="/"
                className="absolute top-4 left-4 z-50 text-white/50 hover:text-white bg-black/50 hover:bg-black/80 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 flex items-center gap-2 border border-white/10"
            >
                <i className="fas fa-arrow-left"></i>
                <span className="font-display tracking-widest text-sm">BACK TO EVENT</span>
            </a>
        </div>
    );
}
