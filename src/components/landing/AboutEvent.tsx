import { motion } from 'framer-motion';

export function AboutEvent() {
    return (
        <section className="py-12 md:py-20 relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">

                {/* Introduction Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-12 md:mb-20">
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 flex items-center gap-6">
                            {/* Title with Left Border */}
                            <h2 className="text-3xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white border-l-4 border-cosmic-cyan pl-6">
                                Sự kiện
                            </h2>
                        </div>
                    </div>

                    <div className="lg:col-span-8 space-y-12">
                        {/* Text Content with Drop Cap */}
                        <div className="prose prose-invert prose-lg max-w-none">
                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-sans">
                                <span className="float-left text-5xl md:text-6xl font-display font-bold text-cosmic-cyan mr-4 mt-[-8px] leading-none">C</span>
                                hào mừng đến với <strong className="text-white">Owneverse</strong> — vũ trụ nơi giới hạn không tồn tại. Khép lại năm 2025 đầy bứt phá, Ownego trân trọng mời toàn thể chiến binh của đại gia đình cùng hội tụ tại đêm tiệc vinh danh hoành tráng nhất thập kỷ.
                            </p>
                            <p className="text-base md:text-lg text-gray-300 leading-relaxed mt-6 font-sans">
                                Hành trình 2025 đã khép lại với những dấu ấn rực rỡ. Tại <strong className="text-cosmic-cyan">Owneverse</strong>, chúng ta không chỉ nhìn lại chặng đường đã qua mà còn cùng nhau khai mở những chân trời mới. Đây là thời khắc để tôn vinh sự cống hiến, nhiệt huyết và tinh thần đoàn kết của mỗi thành viên đại gia đình Ownego. Hãy sẵn sàng cho một đêm tiệc bùng nổ cảm xúc và đậm chất công nghệ!
                            </p>
                        </div>

                        {/* Feature Grid 2x2 */}
                        {/* Feature Grid 2x2 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            {/* Card 1: Team-tertainment (Purple) */}
                            <div className="glass-card p-6 rounded-2xl group hover:border-purple-400 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-400 shadow-[0_0_15px_rgba(139,92,246,0.1)] group-hover:bg-purple-500/20">
                                    <i className="fas fa-gamepad text-purple-400 text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-purple-400 mb-2 font-display">Team-tertainment</h3>
                                <p className="text-sm text-gray-300 font-sans">Tham gia các thử thách đồng đội cực &quot;cháy&quot; và rinh về những phần quà hấp dẫn.</p>
                            </div>

                            {/* Card 2: Fine Dining (Pink) */}
                            <div className="glass-card p-6 rounded-2xl group hover:border-pink-400 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:shadow-[0_0_20px_rgba(236,72,153,0.3)]">
                                <div className="w-14 h-14 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-400 shadow-[0_0_15px_rgba(236,72,153,0.1)] group-hover:bg-pink-500/20">
                                    <i className="fas fa-wine-glass text-pink-400 text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-pink-400 mb-2 font-display">Fine Dining</h3>
                                <p className="text-sm text-gray-300 font-sans">Thưởng thức tiệc tối sang trọng với thực đơn Á-Âu được tuyển chọn kỹ lưỡng.</p>
                            </div>

                            {/* Card 3: Ownego Award (Yellow) */}
                            <div className="glass-card p-6 rounded-2xl group hover:border-yellow-400 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                                <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-2 transition-transform duration-400 shadow-[0_0_15px_rgba(234,179,8,0.1)] group-hover:bg-yellow-500/20">
                                    <i className="fas fa-trophy text-yellow-400 text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-yellow-400 mb-2 font-display">Ownego Award</h3>
                                <p className="text-sm text-gray-300 font-sans">Khoảnh khắc vinh danh những cá nhân và tập thể xuất sắc nhất năm 2025.</p>
                            </div>

                            {/* Card 4: Music Fest (Cyan) */}
                            <div className="glass-card p-6 rounded-2xl group hover:border-cyan-400 transition-all duration-400 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-2 transition-transform duration-400 shadow-[0_0_15px_rgba(6,182,212,0.1)] group-hover:bg-cyan-500/20">
                                    <i className="fas fa-music text-cyan-400 text-2xl"></i>
                                </div>
                                <h3 className="text-xl font-bold text-cyan-400 mb-2 font-display">Music Fest</h3>
                                <p className="text-sm text-gray-300 font-sans">Quẩy hết mình cùng các &quot;nghệ sĩ khách mời&quot; trong không gian âm nhạc bùng nổ.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-20"></div>

                {/* Location Section - Premium Card Design */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    <div className="lg:col-span-4">
                        <div className="sticky top-24 flex items-center gap-6">
                            {/* Title with Left Border */}
                            <h2 className="text-4xl md:text-5xl font-display font-bold uppercase tracking-tighter text-white border-l-4 border-cosmic-cyan pl-6">
                                Địa điểm
                            </h2>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="relative rounded-3xl overflow-hidden bg-deep-space border border-white/10 shadow-2xl">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                {/* Left: Info */}
                                <div className="p-8 md:p-12 flex flex-col justify-center space-y-6 bg-gradient-to-br from-gray-900 to-black relative z-10">
                                    <div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 font-display">Melorita Villa Hòa Lạc</h3>
                                        <p className="text-cosmic-cyan font-medium font-sans">Làng Châu Âu, Hòa Lạc, Hà Nội</p>
                                    </div>

                                    <div className="w-20 h-1 bg-white/20 rounded-full"></div>

                                    <p className="text-gray-300 leading-relaxed font-sans">
                                        Đẳng cấp 4 sao tại Hòa Lạc, Hà Nội, có kiến trúc thiết kế lấy cảnh quan làm trọng tâm với 100% căn villa đều hòa mình vào thiên nhiên. Không gian thoáng đãng, sang trọng, hứa hẹn mang đến trải nghiệm nghỉ dưỡng và sự kiện tuyệt vời nhất.
                                    </p>

                                    <div className="pt-4">
                                        <a
                                            href="https://maps.app.goo.gl/9APk2pF2ntphznt89"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors font-sans"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                <circle cx="12" cy="10" r="3"></circle>
                                            </svg>
                                            XEM VỊ TRÍ
                                        </a>
                                    </div>
                                </div>

                                {/* Right: Map/Image */}
                                <div className="relative h-[400px] lg:h-auto min-h-[400px]">
                                    {/* Overlay for depth */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent z-10 lg:w-1/2 pointer-events-none"></div>

                                    <iframe
                                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.588491850668!2d105.46411559602707!3d20.975490739162932!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345b4b6a405555%3A0x1004667555555555!2sMelorita%20H%C3%B2a%20L%E1%BA%A1c!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
                                        width="100%"
                                        height="100%"
                                        style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2) grayscale(0.2)' }}
                                        allowFullScreen
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover"
                                    ></iframe>

                                    {/* Badge */}
                                    <div className="absolute bottom-6 right-6 z-20 bg-white text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg flex items-center gap-2 font-sans">
                                        <span className="text-blue-600">🚙</span> 45 min from Center
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mt-20"></div>

            </div>
        </section >
    );
}
