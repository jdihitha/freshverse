import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'bordered' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  ...props
}) => {
  const variantStyles = {
    default: 'bg-white border border-[#E8E3DA] rounded-xl shadow-[0_2px_8px_rgba(31,61,43,0.04)]',
    elevated: 'bg-white border border-[#E8E3DA] rounded-xl shadow-[0_8px_24px_rgba(31,61,43,0.08)]',
    bordered: 'bg-[#FAF8F5] border border-[#DDD7CC] rounded-xl',
    glass: 'bg-white/80 backdrop-blur-md border border-[#E8E3DA] rounded-xl shadow-sm'
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8'
  };

  return (
    <div
      className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
