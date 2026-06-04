import React from 'react';
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}
export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`card rounded-xl border border-muted shadow-soft p-6 ${hover ? 'hover:shadow-md transition-shadow duration-200' : ''} ${className}`}>
      
      {children}
    </div>);

}