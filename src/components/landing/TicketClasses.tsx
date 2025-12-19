import { Button } from '@/components/ui/Button';

interface TicketClassesProps {
    onBookTicket: () => void;
    isSoldOut: boolean;
}

export function TicketClasses({ onBookTicket, isSoldOut }: TicketClassesProps) {
    return (
        <section className="container mx-auto px-4 pt-32 pb-24 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-display font-bold text-white uppercase tracking-widest mb-4">
                            Tickets
                        </h2>
                        <div className="h-1 w-32 bg-gradient-to-r from-cosmic-purple to-transparent mb-12"></div>
                    </div>

                    <div className="space-y-6">
                        <div
                            className="group relative glass-card rounded-2xl p-8 overflow-hidden transition-all duration-500 opacity-60 grayscale hover:grayscale-0 hover:opacity-80 cursor-not-allowed"
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cosmic-purple"></div>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex items-center gap-8">
                                    <div className="w-24 h-24 rounded-full border-2 border-cosmic-purple/30 bg-black/50 flex flex-col items-center justify-center text-cosmic-purple relative overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                        <div className="absolute inset-0 bg-cosmic-purple/10"></div>
                                        <span className="text-4xl">👑</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2 font-display tracking-wide">Thẻ Phi Hành Đoàn</h3>
                                        <p className="text-stardust text-xl max-w-md font-sans">
                                            (Sound check & all access) Dành riêng cho đội ngũ vận hành - ekip kiến tạo nên trải nghiệm Owniverse hoàn hảo.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right min-w-[140px]">
                                    <div className="text-3xl font-bold text-cosmic-purple mb-2 flex items-center justify-end gap-2">
                                        50 <span><img src="/images/banhmi.png" alt="Banhmi" className="w-8 h-auto inline-block filter drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" /></span>
                                    </div>
                                    <div className="text-white font-bold text-xs uppercase tracking-widest border border-white/20 bg-white/5 px-3 py-1 rounded-full inline-block font-display">Sold Out</div>
                                </div>
                            </div>
                        </div>

                        <div
                            onClick={isSoldOut ? undefined : onBookTicket}
                            className={`group relative glass-card rounded-2xl p-8 overflow-hidden transition-all duration-500 ${isSoldOut ? 'opacity-60 grayscale cursor-not-allowed hover:grayscale-0 hover:opacity-80' : 'cursor-pointer hover:border-cosmic-cyan hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:-translate-y-1'}`}
                        >
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-cosmic-cyan group-hover:w-2 transition-all duration-300"></div>
                            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                                <div className="flex items-center gap-8">
                                    <div className="w-24 h-24 rounded-full border-2 border-cosmic-cyan/30 bg-black/50 flex flex-col items-center justify-center text-cosmic-cyan relative overflow-hidden shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:scale-110 transition-transform duration-500">
                                        <div className="absolute inset-0 bg-cosmic-cyan/10 animate-pulse-slow"></div>
                                        <span className="text-4xl">🪐</span>
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-2 font-display tracking-wide group-hover:text-cosmic-cyan transition-colors">Vé Nhà Du Hành</h3>
                                        <p className="text-stardust text-xl max-w-md font-sans">
                                            (Full experience) Tấm vé thông hành chính thức gia nhập Owniverse với đặc quyền tận hưởng trọn vẹn đêm gala.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right min-w-[140px]">
                                    <div className="text-3xl font-bold text-cosmic-cyan mb-2 flex items-center justify-end gap-2 text-shadow-glow">
                                        20 <span><img src="/images/banhmi.png" alt="Banhmi" className="w-8 h-auto inline-block filter drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]" /></span>
                                    </div>
                                    <div className={`flex items-center justify-end gap-2 ${isSoldOut ? '' : 'text-xs font-bold uppercase tracking-widest animate-pulse text-cosmic-cyan'}`}>
                                        {isSoldOut ? (
                                            <div className="text-white font-bold text-xs uppercase tracking-widest border border-white/20 bg-white/5 px-3 py-1 rounded-full inline-block font-display">Sold Out</div>
                                        ) : (
                                            <>
                                                <span className="w-2 h-2 rounded-full bg-cosmic-cyan inline-block"></span>
                                                <span className="font-display">Đang mở bán</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="glass-panel rounded-2xl p-6 text-left sticky top-24 h-full flex flex-col">
                        {/* Logo */}
                        <div className="w-24 h-24 bg-white rounded-full mb-6 flex items-center justify-center overflow-hidden p-1 shadow-[0_0_20px_rgba(255,255,255,0.2)] mx-auto">
                            <img src="/images/ownego_logo.png" alt="Ownego Logo" className="w-full h-full object-contain rounded-full" />
                        </div>

                        {/* Title & Socials Row */}
                        <div className="grid grid-cols-3 items-center mb-6">
                            <div></div> {/* Spacer for alignment */}
                            <h3 className="text-xl font-display font-bold text-white uppercase tracking-widest text-center">OWNEGO</h3>
                            <div className="flex gap-4 justify-end">
                                <a
                                    href="https://www.facebook.com/ownego"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-500 transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                                >
                                    <span className="font-bold text-lg">f</span>
                                </a>
                                <a
                                    href="https://chat.ownego.com/channel/chat-anything"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-all border border-gray-700 hover:border-cosmic-cyan hover:scale-110 hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] overflow-hidden"
                                >
                                    <img src="/images/rocketchat.png" alt="Chat" className="w-6 h-6 object-contain" />
                                </a>
                            </div>
                        </div>

                        {/* Contact Info */}
                        <div className="bg-white/5 rounded-xl p-5 text-left space-y-4 border border-white/10 flex-grow">
                            <div className="flex items-start gap-4 text-stardust text-xl">
                                <span className="text-2xl mt-1">🏢</span>
                                <span className="font-sans leading-snug">Tầng 17-18, Tòa nhà CLand, 156 Xã Đàn 2, Đống Đa, Hà Nội</span>
                            </div>
                            <div className="flex items-center gap-4 text-stardust text-xl">
                                <span className="text-2xl">✉️</span>
                                <span className="font-sans">contact@ownego.com</span>
                            </div>
                            <div className="flex items-center gap-4 text-stardust text-xl">
                                <span className="text-2xl">🌐</span>
                                <span className="font-sans">ownego.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
