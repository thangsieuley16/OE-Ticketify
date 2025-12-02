import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <div className={`bg-gray-dark border border-gray-800 p-6 hover:border-neon-green transition-colors duration-300 ${className}`}>
            {children}
        </div>
    );
}
