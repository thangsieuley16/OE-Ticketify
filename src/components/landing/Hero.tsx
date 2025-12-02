import { Button } from '@/components/ui/Button';

interface HeroProps {
    onBookTicket: () => void;
}

export function Hero({ onBookTicket }: HeroProps) {
    return (
        <section className="relative min-h-[70vh] flex items-center overflow-hidden py-12 md:py-0">
            {/* Nebula Background Effect */}
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-cosmic-purple/20 rounded-full blur-[120px] animate-pulse-slow"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-cosmic-cyan/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
                {/* Mobile-only center glow */}
                <div className="lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[40%] bg-cosmic-cyan/10 rounded-full blur-[80px]"></div>
            </div>

            <div className="container mx-auto px-4 relative z-10 flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">
                {/* Left Column: Information */}
                <div className="space-y-8 text-center lg:text-left order-1">
                    <div className="flex items-center justify-center lg:justify-start gap-3 flex-wrap">
                        <span className="glass-panel px-4 py-1 rounded-full text-xs font-bold tracking-widest text-cosmic-cyan uppercase border border-cosmic-cyan/30">
                            Sự kiện nội bộ
                        </span>
                        <span className="glass-panel px-4 py-1 rounded-full text-xs font-bold tracking-widest text-stardust uppercase border border-white/10">
                            OWNEGO
                        </span>
                        <span className="glass-panel px-4 py-1 rounded-full text-xs font-bold tracking-widest text-stardust uppercase border border-white/10">
                            QIKIFY .IT .JSC
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl md:text-2xl font-light tracking-[0.5em] text-stardust uppercase">
                            YEAR END GALA
                        </h2>
                        <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-display font-bold leading-none tracking-tighter text-gradient drop-shadow-2xl">
                            OWNEVERSE 2025
                        </h1>
                    </div>

                    <p className="text-stardust text-lg md:text-xl max-w-xl mx-auto lg:mx-0 leading-relaxed">
                        Đêm sự kiện đánh dấu hơn 10 năm Ownego phát triển
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto lg:mx-0">
                        <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4">
                            <span className="text-2xl w-8 text-center">📅</span>
                            <div className="text-left">
                                <div className="text-xs text-stardust uppercase tracking-wider">Date</div>
                                <div className="font-bold">09 Tháng 01, 2026</div>
                            </div>
                        </div>
                        <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4">
                            <span className="text-2xl w-8 text-center">🕒</span>
                            <div className="text-left">
                                <div className="text-xs text-stardust uppercase tracking-wider">Time</div>
                                <div className="font-bold">14:00 - 20:00</div>
                            </div>
                        </div>
                        <div className="glass-panel px-5 py-3 rounded-2xl flex items-center gap-4 md:col-span-2">
                            <span className="text-2xl w-8 text-center">📍</span>
                            <div className="text-left">
                                <div className="text-xs text-stardust uppercase tracking-wider">Location</div>
                                <div className="font-bold">Tổ hợp Villa/Resort Melorita Làng Châu Âu, Hòa Lạc, Hà Nội</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Interactive Visuals & CTA */}
                <div className="relative h-[300px] lg:h-[500px] w-full perspective-1000 order-2 lg:order-2 hidden md:block">
                    {/* Central Energy Core */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 lg:w-64 h-48 lg:h-64 bg-gradient-to-br from-cosmic-cyan to-cosmic-purple rounded-full blur-[60px] opacity-40 animate-pulse-glow"></div>

                    {/* Floating Cards - Shifted Up */}
                    <div className="absolute top-[10%] right-[10%] glass-card p-4 lg:p-6 rounded-2xl w-40 lg:w-56 animate-[float_6s_ease-in-out_infinite]">
                        <div className="text-3xl lg:text-4xl mb-2">🎮</div>
                        <h3 className="font-bold text-sm lg:text-lg text-white">Team-tertainment</h3>
                        <p className="text-[10px] lg:text-xs text-stardust">Giải trí cùng nhau</p>
                    </div>

                    <div className="absolute top-[35%] left-[5%] glass-card p-4 lg:p-6 rounded-2xl w-36 lg:w-48 animate-[float_7s_ease-in-out_infinite_1s]">
                        <div className="text-3xl lg:text-4xl mb-2">🎵</div>
                        <h3 className="font-bold text-sm lg:text-lg text-white">Music Fest</h3>
                        <p className="text-[10px] lg:text-xs text-stardust">Đêm nhạc bùng nổ</p>
                    </div>

                    <div className="absolute top-[55%] right-[25%] glass-card p-4 lg:p-6 rounded-2xl w-36 lg:w-48 animate-[float_8s_ease-in-out_infinite_2s]">
                        <div className="text-3xl lg:text-4xl mb-2">🏆</div>
                        <h3 className="font-bold text-sm lg:text-lg text-white">OE-Awards</h3>
                        <p className="text-[10px] lg:text-xs text-stardust">Vinh danh ngôi sao</p>
                    </div>

                    {/* CTA Button - Bottom Right (Desktop Only) */}
                    <div className="absolute bottom-0 right-0 z-20 translate-y-5 hidden lg:flex gap-4">
                        <Button
                            onClick={() => document.getElementById('schedule')?.scrollIntoView({ behavior: 'smooth' })}
                            className="btn-shiny bg-white/10 backdrop-blur-md text-white font-bold py-4 px-8 rounded-full text-xl tracking-widest hover:scale-105 transition-transform duration-300 border border-white/20 hover:bg-white/20"
                        >
                            LỊCH TRÌNH
                        </Button>
                        <Button
                            onClick={onBookTicket}
                            className="btn-shiny bg-gradient-to-r from-cosmic-cyan to-cosmic-purple text-white font-bold py-4 px-12 rounded-full text-xl tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] border-none"
                        >
                            ĐẶT VÉ NGAY
                        </Button>
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
                            className="flex-1 btn-shiny bg-gradient-to-r from-cosmic-cyan to-cosmic-purple text-white font-bold py-4 rounded-full text-lg tracking-widest hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(6,182,212,0.5)] border-none"
                        >
                            ĐẶT VÉ NGAY
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
