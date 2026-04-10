import React from 'react';
import { ButtonHTMLAttributes } from 'react';
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary:
    'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm hover:shadow',
    secondary: 'bg-muted text-sidebar hover:bg-gray-200 focus:ring-gray-200',
    accent:
    'bg-accent text-white hover:bg-accent-hover focus:ring-accent shadow-sm hover:shadow',
    outline:
    'border-2 border-primary text-primary hover:bg-primary/5 focus:ring-primary',
    ghost: 'text-sidebar hover:bg-muted focus:ring-muted'
  };
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-5 py-2.5',
    lg: 'text-base px-6 py-3'
  };
  const widthClass = fullWidth ? 'w-full' : '';
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}>
      
      {children}
    </button>);

}