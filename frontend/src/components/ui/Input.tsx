'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-charcoal/70 mb-2 tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/30">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`w-full bg-white border ${error ? 'border-red-400' : 'border-warm-gray'} rounded-xl px-4 ${icon ? 'pl-12' : ''} py-3.5 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all duration-300 ${className}`}
            {...props}
          />
        </div>
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
