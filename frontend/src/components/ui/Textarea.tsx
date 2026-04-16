import React, { forwardRef } from 'react';
import { TextareaHTMLAttributes } from 'react';
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label &&
        <label className="block text-sm font-medium text-sidebar mb-1.5">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        }
        <textarea
          ref={ref}
          className={`w-full px-4 py-2.5 bg-card border rounded-lg text-sidebar placeholder:text-sidebar/40 
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed transition-all resize-none
            ${error ? 'border-destructive focus:ring-destructive' : 'border-muted'}
            ${className}`}
          rows={4}
          {...props} />
        
        {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
        {helperText && !error &&
        <p className="mt-1.5 text-sm text-sidebar/60">{helperText}</p>
        }
      </div>);

  }
);
Textarea.displayName = 'Textarea';