import { motion } from 'framer-motion';

const scheduleData = [
    { time: '12:30', title: "Xe đón tại C'land", iconClass: 'fas fa-bus', color: 'cyan' },
    { time: '14:00', title: 'Checkin khách sạn, nghỉ ngơi', iconClass: 'fas fa-hotel', color: 'purple' },
    { time: '15:00', title: 'Chuỗi Pre-Event', description: 'Photo Booth & Game & Team Building', iconClass: 'fas fa-puzzle-piece', color: 'pink' },
    { time: '17:00', title: 'Kết thúc chuỗi Pre-event', description: 'Hoạt động cá nhân', iconClass: 'fas fa-user-clock', color: 'gray' },
    { time: '18:00', title: 'Main Event - Thảm đỏ - Check in', iconClass: 'fas fa-camera', color: 'red', highlight: true },
    { time: '18:30', title: 'Gala Owniverse 2025 - Dining', iconClass: 'fas fa-utensils', color: 'purple' },
    { time: '18:45', title: 'Lễ công bố OE Awards 2025 (Phần 1)', iconClass: 'fas fa-trophy', color: 'yellow' },
    { time: '19:00', title: 'Quay số trúng thưởng', iconClass: 'fas fa-gift', color: 'pink' },
    { time: '19:20', title: 'OE Awards 2025 (Phần 2)', iconClass: 'fas fa-trophy', color: 'yellow' },
    { time: '19:45', title: 'Phần trình diễn của các nghệ sĩ khách mời', iconClass: 'fas fa-microphone', color: 'cyan' },
    { time: '20:15', title: 'Kết thúc chương trình. Quẩy tự do!!!', iconClass: 'fas fa-music', color: 'pink' },
];

export function AboutSchedule() {
    return (
        <section id="schedule" className="py-12 md:py-20 relative overflow-hidden scroll-mt-24">
            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left Column: Sticky Title */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 flex items-center gap-6">
                            {/* Title with Left Border */}
                            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-wide text-white border-l-4 border-cosmic-cyan pl-6">
                                Lịch trình
                            </h2>
                        </div>
                    </div>

                    {/* Right Column: Timeline */}
                    <div className="lg:col-span-8">
                        <div className="relative">
                            {/* Center Line (Gradient) */}
                            {/* Adjusted left position to 42px to center through the 24px dot at left-8 (32px) */}
                            {/* Dot Left: 32px. Dot Center: 32 + 12 = 44px. Line Width: 4px. Line Left: 44 - 2 = 42px. */}
                            <div className="absolute left-[42px] md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cosmic-cyan via-cosmic-purple to-transparent md:-translate-x-1/2 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>

                            <div className="space-y-12">
                                {scheduleData.map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 50 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, margin: "-50px" }}
                                        transition={{ duration: 0.6, delay: index * 0.1 }}
                                        className={`relative flex flex-col md:flex-row items-center gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                                    >
                                        {/* Timeline Dot */}
                                        <div className="absolute left-8 md:left-1/2 w-6 h-6 bg-[#050510] border-4 rounded-full z-20 md:-translate-x-1/2 translate-y-1/2 md:translate-y-0 group-hover:scale-150 transition-transform duration-300 shadow-[0_0_10px_currentColor]"
                                            style={{ borderColor: item.color === 'cyan' ? '#06b6d4' : item.color === 'purple' ? '#8b5cf6' : item.color === 'pink' ? '#ec4899' : item.color === 'yellow' ? '#eab308' : item.color === 'red' ? '#ef4444' : '#9ca3af' }}
                                        >
                                            <div className="absolute inset-0 rounded-full animate-pulse bg-white/50"></div>
                                        </div>

                                        {/* Spacer for Desktop Staggering */}
                                        <div className="hidden md:block w-1/2"></div>

                                        {/* Content Card */}
                                        <div className={`w-full md:w-[calc(50%-3rem)] pl-24 md:pl-0 group`}>
                                            <div className={`glass-card p-6 rounded-2xl border border-white/10 transition-all duration-300 hover:scale-105 relative overflow-hidden 
                                                ${item.highlight
                                                    ? 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.3)] bg-red-500/10 hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)]'
                                                    : item.color === 'cyan' ? 'hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                                                        : item.color === 'purple' ? 'hover:border-purple-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]'
                                                            : item.color === 'pink' ? 'hover:border-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]'
                                                                : item.color === 'yellow' ? 'hover:border-yellow-400 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]'
                                                                    : item.color === 'red' ? 'hover:border-red-500 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                                                                        : 'hover:border-gray-400 hover:shadow-[0_0_20px_rgba(156,163,175,0.3)]'
                                                }`}>

                                                {/* Connector Line (Desktop) */}
                                                <div className={`hidden md:block absolute top-1/2 w-12 h-[2px] bg-white/20 ${index % 2 === 0 ? '-right-12' : '-left-12'}`}></div>

                                                <div className="flex items-center gap-4 mb-4">
                                                    {/* Squircle Icon Container */}
                                                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-400 shadow-[0_0_10px_rgba(255,255,255,0.1)]
                                                        ${item.color === 'cyan' ? 'bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                                                            : item.color === 'purple' ? 'bg-purple-500/10 border-purple-500/20 shadow-[0_0_10px_rgba(139,92,246,0.2)]'
                                                                : item.color === 'pink' ? 'bg-pink-500/10 border-pink-500/20 shadow-[0_0_10px_rgba(236,72,153,0.2)]'
                                                                    : item.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                                                                        : item.color === 'red' ? 'bg-red-500/10 border-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]'
                                                                            : 'bg-gray-500/10 border-gray-500/20 shadow-[0_0_10px_rgba(156,163,175,0.2)]'
                                                        }`}>
                                                        <i className={`${item.iconClass} text-xl ${item.color === 'cyan' ? 'text-cyan-400' : item.color === 'purple' ? 'text-purple-400' : item.color === 'pink' ? 'text-pink-400' : item.color === 'yellow' ? 'text-yellow-400' : item.color === 'red' ? 'text-red-500' : 'text-gray-400'}`}></i>
                                                    </div>

                                                    <span className={`text-2xl font-display font-bold ${item.color === 'cyan' ? 'text-cyan-400' : item.color === 'purple' ? 'text-purple-400' : item.color === 'pink' ? 'text-pink-400' : item.color === 'yellow' ? 'text-yellow-400' : item.color === 'red' ? 'text-red-500' : 'text-gray-400'}`}>
                                                        {item.time}
                                                    </span>
                                                </div>
                                                <h3 className={`text-xl font-bold mb-1 font-display ${item.highlight ? 'text-white text-2xl' : 'text-white'}`}>{item.title}</h3>
                                                {item.description && (
                                                    <p className="text-gray-300 text-base font-sans">{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-20"></div>
            </div >
        </section >
    );
}
