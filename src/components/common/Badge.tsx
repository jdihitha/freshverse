import React from 'react';

export type BadgeVariant = 
  | 'success' 
  | 'warning' 
  | 'info' 
  | 'danger' 
  | 'neutral' 
  | 'gold' 
  | 'sage';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-[#1F3D2B]/10 text-[#1F3D2B] border border-[#1F3D2B]/20',
    sage: 'bg-[#A7C4A0]/25 text-[#1F3D2B] border border-[#A7C4A0]/50',
    warning: 'bg-[#C6A969]/20 text-[#7C6328] border border-[#C6A969]/40',
    info: 'bg-emerald-50 text-emerald-800 border border-emerald-200',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200',
    neutral: 'bg-[#EAE5DC] text-[#4A4A4A] border border-[#D8D1C5]',
    gold: 'bg-[#F9F4E8] text-[#8C6D23] border border-[#C6A969]/60'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold tracking-wide'
  };

  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-[#1F3D2B]',
    sage: 'bg-[#4B6B48]',
    warning: 'bg-[#C6A969]',
    info: 'bg-emerald-600',
    danger: 'bg-rose-600',
    neutral: 'bg-gray-500',
    gold: 'bg-[#C6A969]'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full whitespace-nowrap ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
