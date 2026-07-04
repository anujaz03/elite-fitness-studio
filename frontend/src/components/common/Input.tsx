import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label ? (
          <label
            htmlFor={inputId}
            className="font-secondary text-xs font-medium uppercase tracking-wider text-brand-ivory-muted"
          >
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={inputId}
          className={`h-12 w-full rounded-brand border bg-brand-charcoal px-4 py-2 text-sm text-brand-ivory transition-all duration-250 ease-out placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal disabled:cursor-not-allowed disabled:opacity-50
            ${
              error
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-950/5'
                : 'border-brand-beige/20 hover:border-brand-beige/40 focus:border-brand-gold'
            } ${className}`}
          {...props}
        />
        {error ? (
          <span className="text-xs text-red-500 font-secondary mt-0.5">
            {error}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
