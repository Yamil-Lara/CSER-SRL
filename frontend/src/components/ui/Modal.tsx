import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: React.ReactNode;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  footer
}: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  if (!isOpen) return null;
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose} />
      

      {/* Modal */}
      <div
        className={`relative bg-card rounded-2xl shadow-2xl w-full ${sizes[size]} max-h-[90vh] flex flex-col`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-muted">
          <h2 className="text-2xl font-bold ">{title}</h2>
          <button
            onClick={onClose}
            className="opacity-50 hover: transition-colors p-1 hover:bg-muted rounded-lg">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>

        {/* Footer */}
        {footer &&
        <div className="flex items-center justify-end gap-3 p-6 border-t border-muted">
            {footer}
          </div>
        }
      </div>
    </div>);

}
