import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle =
    'font-secondary flex items-center justify-center rounded-brand px-6 py-3 text-sm font-medium tracking-wide transition-all duration-250 ease-out focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 focus:ring-offset-brand-charcoal disabled:cursor-not-allowed disabled:opacity-50 active:scale-95';

  const variants = {
    primary:
      'bg-brand-amber text-brand-ivory hover:bg-brand-gold hover:text-brand-charcoal hover:shadow-[0_0_15px_rgba(221,169,100,0.4)]',
    secondary:
      'bg-brand-teal text-brand-ivory hover:bg-opacity-85 hover:shadow-[0_0_15px_rgba(102,124,129,0.3)]',
    outline:
      'border border-brand-gold bg-transparent text-brand-gold hover:bg-brand-gold hover:text-brand-charcoal',
    ghost:
      'bg-transparent text-brand-ivory hover:bg-brand-charcoal-tint'
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg
          className="mr-2 h-4 w-4 animate-spin text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : null}
      {children}
    </button>
  );
};
export default Button;
