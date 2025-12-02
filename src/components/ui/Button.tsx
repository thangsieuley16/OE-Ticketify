import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export function Button({ children, className = '', variant = 'primary', ...props }: ButtonProps) {
  const baseStyles = "px-6 py-2 font-bold transition-all duration-300 uppercase tracking-wider cursor-pointer";
  const variants = {
    primary: "bg-neon-green text-black hover:bg-white hover:shadow-[0_0_15px_var(--color-neon-green)]",
    secondary: "bg-gray-dark text-white hover:bg-gray-700",
    outline: "border-2 border-neon-green text-neon-green hover:bg-neon-green hover:text-black hover:shadow-[0_0_15px_var(--color-neon-green)]"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
