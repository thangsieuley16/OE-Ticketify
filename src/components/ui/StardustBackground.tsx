export function StardustBackground() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Stardust Image */}
            <div className="absolute inset-0 bg-[url('/images/stardust.png')] bg-cover bg-center opacity-50 mix-blend-screen"></div>

            {/* Grid Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

            {/* Vignette for depth */}
            <div className="absolute inset-0 bg-radial-gradient from-transparent via-deep-space/50 to-deep-space"></div>
        </div>
    );
}
