import React from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}
export function Alert({
  type = 'info',
  title,
  message,
  onClose,
  className = ''
}: AlertProps) {
  const config = {
    success: {
      icon: CheckCircle,
      bg: 'bg-accent/10',
      border: 'border-accent/20',
      text: 'text-accent',
      iconColor: 'text-accent'
    },
    error: {
      icon: XCircle,
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
      text: 'text-destructive',
      iconColor: 'text-destructive'
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-600'
    },
    info: {
      icon: Info,
      bg: 'bg-primary/10',
      border: 'border-primary/20',
      text: 'text-primary',
      iconColor: 'text-primary'
    }
  };
  const { icon: Icon, bg, border, text, iconColor } = config[type];
  return (
    <div className={`${bg} ${border} border rounded-lg p-4 ${className}`}>
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
        <div className="flex-1">
          {title && <p className={`font-semibold ${text} mb-1`}>{title}</p>}
          <p className={`text-sm ${text}`}>{message}</p>
        </div>
        {onClose &&
        <button
          onClick={onClose}
          className={`${text} hover:opacity-70 transition-opacity flex-shrink-0`}>
          
            <X className="w-4 h-4" />
          </button>
        }
      </div>
    </div>);

}