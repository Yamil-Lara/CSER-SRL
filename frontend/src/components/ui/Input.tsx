import React, { forwardRef } from 'react';
import { InputHTMLAttributes } from 'react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label &&
        <label className="block text-sm font-medium  mb-1.5">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        }
        <input
          ref={ref}
          className={`w-full px-4 py-2.5 bg-transparent dark:bg-slate-900/50 border rounded-lg  placeholder:opacity-40 
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed transition-all
            ${error ? 'border-destructive focus:ring-destructive' : 'border-muted dark:border-slate-700'}
            ${className}`}
          {...props} />
        
        {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
        {helperText && !error &&
        <p className="mt-1.5 text-sm opacity-60">{helperText}</p>
        }
      </div>);

  }
);
Input.displayName = 'Input';

