'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="border-b border-white/5 bg-white/5 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
            <div className="container mx-auto px-4 md:px-8 py-6 flex justify-between items-center relative">
                <Link href="/" className="flex items-center gap-2 group relative">
                    {/* Logo Glow */}
                    <div className="absolute -inset-4 bg-cosmic-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    <span className="text-3xl md:text-4xl font-display font-bold text-white tracking-tighter group-hover:text-cosmic-cyan transition-colors duration-300 relative z-10">
                        TICKET<span className="text-cosmic-cyan">IFY</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex space-x-8 absolute left-1/2 -translate-x-1/2 -ml-[50px]">
                    <Link href="/" className="text-white hover:text-cosmic-cyan transition-colors duration-300 uppercase text-sm tracking-widest font-bold border-b-2 border-transparent hover:border-cosmic-cyan">Sự kiện</Link>
                    <a href="https://blog.ownego.com/" target="_blank" rel="noopener noreferrer" className="text-stardust hover:text-cosmic-cyan transition-colors duration-300 uppercase text-sm tracking-widest">Về Ownego</a>
                    <a href="https://www.facebook.com/ownego" target="_blank" rel="noopener noreferrer" className="text-stardust hover:text-cosmic-cyan transition-colors duration-300 uppercase text-sm tracking-widest">Và hơn thế nữa</a>
                </nav>

                <div className="flex items-center space-x-4 md:space-x-6">
                    {/* ownARverse Text */}
                    <Link href="/ownarverse" className="hidden md:block group">
                        <span className="text-xl md:text-2xl font-display font-bold text-white tracking-tighter group-hover:text-cosmic-cyan transition-colors duration-300 cursor-pointer">
                            own<span className="text-cosmic-cyan">AR</span>verse
                        </span>
                    </Link>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Nav Dropdown */}
            <div className={`md:hidden absolute top-full left-0 w-full bg-[#030014]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? 'max-h-[400px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="flex flex-col p-6 space-y-6">
                    {/* Item 1: ownARverse */}
                    <Link
                        href="/ownarverse"
                        className="group flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span className="text-lg font-display font-bold text-white tracking-wider group-hover:text-cosmic-cyan transition-colors">
                            own<span className="text-cosmic-cyan">AR</span>verse
                        </span>
                        <i className="fas fa-cube text-cosmic-cyan text-xl group-hover:scale-110 transition-transform"></i>
                    </Link>

                    {/* Item 2: Về Ownego */}
                    <a
                        href="https://blog.ownego.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-stardust hover:text-white transition-colors pl-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span className="text-lg font-display font-bold uppercase tracking-widest">Về Ownego</span>
                    </a>

                    {/* Item 3: Và hơn thế nữa */}
                    <a
                        href="https://www.facebook.com/ownego"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-stardust hover:text-white transition-colors pl-2"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <span className="text-lg font-display font-bold uppercase tracking-widest">Và hơn thế nữa</span>
                    </a>
                </div>
            </div>
        </header>
    );
}
