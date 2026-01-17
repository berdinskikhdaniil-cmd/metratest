import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'secondary';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "py-4 px-6 rounded-2xl font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base";
  
  const variants = {
    primary: "bg-[#8D5FFF] text-white shadow-lg shadow-[#8D5FFF]/30 hover:bg-[#7b4fe0]",
    accent: "bg-[#C8FA03] text-[#111010] shadow-lg shadow-[#C8FA03]/30 hover:bg-[#b5e302]",
    secondary: "bg-[#111010] text-white hover:bg-gray-800"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};