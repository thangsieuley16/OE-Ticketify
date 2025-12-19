import { Button } from '@/components/ui/Button';

interface HeroProps {
    onBookTicket: () => void;
    isSoldOut: boolean;
}

export function Hero({ onBookTicket, isSoldOut }: HeroProps) {
    return (
        <section className="relative min-h-[100dvh] flex items-center overflow-hidden py-24 md:py-0">
            {/* Nebula Background Effect */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cosmic-purple/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cosmic-cyan/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                {/* Mobile-only center glow */}
                <div className="lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-cosmic-cyan/10 rounded-full blur-[80px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:h-full lg:min-h-screen items-center justify-center">
                {/* Left Column: Information */}
                <div className="space-y-8 text-center lg:text-left order-1 pt-10 lg:pt-0 lg:-translate-y-40">
                    <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                        <span className="glass-panel px-4 py-1 rounded-full text-xs font-bold tracking-widest text-cosmic-cyan uppercase border border-cosmic-cyan/30 font-display">
                            Sự kiện nội bộ
                        </span>
                        <span className="glass-panel px-4 py-1 rounded-full text-xs font-bold tracking-widest text-stardust uppercase border border-white/10 font-display">
                            OWNEGO
                        </span>
                        <span className="glass-panel px-4 py-1 rounded-full text-xs font-bold tracking-widest text-stardust uppercase border border-white/10 font-display">
                            QIKIFY .IT .JSC
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-display font-light tracking-[0.5em] text-stardust uppercase">
                            YEAR END GALA
                        </h2>
                        <div className="relative w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[700px] xl:max-w-[800px] mx-auto lg:mx-0">
                            <img
                                src="/images/owniverse_logo.png"
                                alt="OWNIVERSE 2025"
                                className="w-full h-auto drop-shadow-[0_0_25px_rgba(255,255,255,0.3)] hover:scale-105 transition-transform duration-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
                        <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4">
                            <span className="text-2xl w-8 text-center">📅</span>
                            <div className="text-left">
                                <div className="text-xs text-stardust uppercase tracking-wider font-display">Ngày này</div>
                                <div className="text-sm font-display text-white">09 - 10 Tháng 01, 2026</div>
                            </div>
                        </div>
                        <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4">
                            <span className="text-2xl w-8 text-center">🕒</span>
                            <div className="text-left">
                                <div className="text-xs text-stardust uppercase tracking-wider font-display">Tầm này</div>
                                <div className="text-sm font-display text-white">14:00 - chiều hôm sau</div>
                            </div>
                        </div>
                        <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4 md:col-span-2">
                            <span className="text-2xl w-8 text-center">📍</span>
                            <div className="text-left">
                                <div className="text-xs text-stardust uppercase tracking-wider font-display">Chỗ này</div>
                                <div className="text-sm font-display text-white">Tổ hợp Villa/Resort Melorita Làng Châu Âu, Hòa Lạc, Hà Nội</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Interactive Visuals & CTA */}
                <div className="relative h-[300px] lg:h-[500px] w-full perspective-1000 order-2 lg:order-2 hidden md:block">
                    <div className="w-full h-full relative flex items-center justify-center">
                        {/* Wrapper for Core and Orbit Ring to adjust position together */}
                        <div className="relative transform -translate-y-32 translate-x-8">
                            {/* Central Energy Core */}
                            <div className="relative z-0 w-48 lg:w-64 h-48 lg:h-64 bg-gradient-to-br from-cosmic-cyan to-cosmic-purple rounded-full blur-[60px] opacity-40 animate-pulse-glow"></div>

                            {/* Floating Mini Fig - ĐÃ SỬA KÍCH THƯỚC TẠI ĐÂY */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-float">
                                <img
                                    src="/images/mini_fig-removebg-preview.png"
                                    alt="Owniverse Figure"
                                    // Thay đổi: w-[600px] (mobile) - md:w-[1000px] (tablet) - lg:w-[1600px] (desktop)
                                    className="w-[600px] md:w-[1000px] lg:w-[1600px] h-auto drop-shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-110 transition-transform duration-500 cursor-pointer"
                                />
                            </div>

                            {/* Orbit Ring Container */}
                            <div className="absolute inset-0 z-10 animate-orbit">
                                {/* Card 1: People (0 degrees / 12 o'clock) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotate(0deg) translate(0px, -220px)' }}>
                                    <div className="animate-counter-orbit">
                                        <div style={{ transform: 'rotate(0deg)' }}>
                                            <div className="glass-card p-2 lg:p-4 rounded-xl w-28 lg:w-36 flex flex-col items-center justify-center text-center">
                                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                                    <i className="fas fa-users text-sm lg:text-xl text-purple-400"></i>
                                                </div>
                                                <h3 className="font-bold text-[10px] lg:text-sm text-white font-display uppercase tracking-wider">People</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2: Xcelerate (60 degrees) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotate(60deg) translate(0px, -220px)' }}>
                                    <div className="animate-counter-orbit">
                                        <div style={{ transform: 'rotate(-60deg)' }}>
                                            <div className="glass-card p-2 lg:p-4 rounded-xl w-28 lg:w-36 flex flex-col items-center justify-center text-center">
                                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(234,179,8,0.3)]">
                                                    <i className="fas fa-bolt text-sm lg:text-xl text-yellow-400"></i>
                                                </div>
                                                <h3 className="font-bold text-[10px] lg:text-sm text-white font-display uppercase tracking-wider">Xcelerate</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3: New Platform (120 degrees) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotate(120deg) translate(0px, -220px)' }}>
                                    <div className="animate-counter-orbit">
                                        <div style={{ transform: 'rotate(-120deg)' }}>
                                            <div className="glass-card p-2 lg:p-4 rounded-xl w-28 lg:w-36 flex flex-col items-center justify-center text-center">
                                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                                                    <i className="fas fa-cubes text-sm lg:text-xl text-orange-400"></i>
                                                </div>
                                                <h3 className="font-bold text-[10px] lg:text-sm text-white font-display uppercase tracking-wider">New Platform</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 4: Explore (180 degrees) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotate(180deg) translate(0px, -220px)' }}>
                                    <div className="animate-counter-orbit">
                                        <div style={{ transform: 'rotate(-180deg)' }}>
                                            <div className="glass-card p-2 lg:p-4 rounded-xl w-28 lg:w-36 flex flex-col items-center justify-center text-center">
                                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                                    <i className="fas fa-compass text-sm lg:text-xl text-cyan-400"></i>
                                                </div>
                                                <h3 className="font-bold text-[10px] lg:text-sm text-white font-display uppercase tracking-wider">Explore</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 5: Ambition (240 degrees) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotate(240deg) translate(0px, -220px)' }}>
                                    <div className="animate-counter-orbit">
                                        <div style={{ transform: 'rotate(-240deg)' }}>
                                            <div className="glass-card p-2 lg:p-4 rounded-xl w-28 lg:w-36 flex flex-col items-center justify-center text-center">
                                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                                    <i className="fas fa-gem text-sm lg:text-xl text-green-400"></i>
                                                </div>
                                                <h3 className="font-bold text-[10px] lg:text-sm text-white font-display uppercase tracking-wider">Ambition</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 6: Development (300 degrees) */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transform: 'rotate(300deg) translate(0px, -220px)' }}>
                                    <div className="animate-counter-orbit">
                                        <div style={{ transform: 'rotate(-300deg)' }}>
                                            <div className="glass-card p-2 lg:p-4 rounded-xl w-28 lg:w-36 flex flex-col items-center justify-center text-center">
                                                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                                                    <i className="fas fa-anchor text-sm lg:text-xl text-red-400"></i>
                                                </div>
                                                <h3 className="font-bold text-[10px] lg:text-sm text-white font-display uppercase tracking-wider">Development</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA Buttons - Centered absolutely relative to the right column container, below the core? 
                            Actually, the design shows buttons at bottom right. The core is centered.
                            Let's keep buttons independent of the rotation.
                        */}
                        <div className="absolute bottom-0 right-0 z-20 translate-y-[56px] hidden lg:flex gap-4">
                            <Button
                                onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}
                                className="btn-shiny bg-white/10 backdrop-blur-md text-white font-bold py-4 px-8 rounded-full text-xl tracking-widest hover:scale-105 transition-transform duration-300 border border-white/20 hover:bg-white/20 font-display"
                            >
                                LỊCH TRÌNH
                            </Button>
                            <Button
                                onClick={onBookTicket}
                                className={`btn-shiny text-white font-bold py-4 px-12 rounded-full text-xl tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] border-none font-display ${isSoldOut ? 'bg-gray-600 cursor-pointer' : 'bg-gradient-to-r from-cosmic-cyan to-cosmic-purple'}`}
                            >
                                {isSoldOut ? 'SOLD OUT' : 'ĐẶT VÉ NGAY'}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Mobile CTA (Visible on Mobile/Tablet) */}
                <div className="lg:hidden flex justify-center w-full order-3">
                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
                        <Button
                            onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}
                            className="flex-1 btn-shiny bg-white/10 backdrop-blur-md text-white font-bold py-4 rounded-full text-lg tracking-widest hover:scale-105 transition-transform duration-300 border border-white/20 hover:bg-white/20"
                        >
                            LỊCH TRÌNH
                        </Button>
                        <Button
                            onClick={onBookTicket}
                            className={`flex-1 btn-shiny text-white font-bold py-4 rounded-full text-lg tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] border-none ${isSoldOut ? 'bg-gray-600 cursor-pointer' : 'bg-gradient-to-r from-cosmic-cyan to-cosmic-purple'}`}
                        >
                            {isSoldOut ? 'SOLD OUT' : 'ĐẶT VÉ NGAY'}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
