import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export function Input({ className = '', ...props }: InputProps) {
    return (
        <input
            className={`bg-black border border-gray-700 text-white px-4 py-2 focus:outline-none focus:border-neon-green focus:shadow-[0_0_10px_rgba(57,255,20,0.3)] transition-all duration-300 w-full ${className}`}
            {...props}
        />
    );
}
