import React, { forwardRef } from 'react';
import { SelectHTMLAttributes } from 'react';
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: {
    value: string | number;
    label: string;
  }[];
}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label &&
        <label className="block text-sm font-medium text-sidebar mb-1.5">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        }
        <select
          ref={ref}
          className={`w-full px-4 py-2.5 bg-card border rounded-lg text-sidebar
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
            disabled:opacity-50 disabled:cursor-not-allowed transition-all
            ${error ? 'border-destructive focus:ring-destructive' : 'border-muted'}
            ${className}`}
          {...props}>
          
          {options.map((option) =>
          <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )}
        </select>
        {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
        {helperText && !error &&
        <p className="mt-1.5 text-sm text-sidebar/60">{helperText}</p>
        }
      </div>);

  }
);
Select.displayName = 'Select';