import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 
  | 'primary' 
  | 'secondary' 
  | 'outline' 
  | 'ghost' 
  | 'gold' 
  | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8',
    md: 'text-sm px-4 py-2 rounded-lg gap-2 h-10',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5 h-12 font-semibold'
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-[#1F3D2B] text-white hover:bg-[#284f38] active:bg-[#183122] shadow-sm focus:ring-[#1F3D2B]',
    secondary: 'bg-[#A7C4A0] text-[#1F3D2B] hover:bg-[#95b58e] active:bg-[#85a67e] font-semibold focus:ring-[#A7C4A0]',
    outline: 'border border-[#2E2E2E]/20 text-[#2E2E2E] bg-transparent hover:bg-black/5 active:bg-black/10 focus:ring-[#1F3D2B]',
    ghost: 'text-[#2E2E2E] hover:bg-[#1F3D2B]/5 active:bg-[#1F3D2B]/10 focus:ring-[#1F3D2B]',
    gold: 'bg-[#C6A969] text-[#1F3D2B] hover:bg-[#b89a56] font-semibold shadow-sm focus:ring-[#C6A969]',
    danger: 'bg-rose-700 text-white hover:bg-rose-800 active:bg-rose-900 focus:ring-rose-500'
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
