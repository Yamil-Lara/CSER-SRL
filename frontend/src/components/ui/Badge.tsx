import React from 'react';
interface BadgeProps {
  children: React.ReactNode;
  variant?:
  'default' |
  'primary' |
  'accent' |
  'destructive' |
  'warning' |
  'success';
  size?: 'sm' | 'md';
  className?: string;
}
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = ''
}: BadgeProps) {
  const variants = {
    default: 'bg-muted text-sidebar',
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    destructive: 'bg-destructive/10 text-destructive',
    warning: 'bg-yellow-100 text-yellow-800',
    success: 'bg-accent/10 text-accent'
  };
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1'
  };
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      
      {children}
    </span>);

}