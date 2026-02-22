import { cn } from '@/lib/utils';
import { type ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center font-heading font-semibold uppercase tracking-wider',
                    'rounded-lg transition-all duration-300 ease-out',
                    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg-primary',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    // Variant styles
                    variant === 'primary' && [
                        'bg-accent-orange text-white',
                        'hover:bg-accent-orange-hover hover:shadow-[0_0_30px_rgba(232,117,10,0.3)]',
                        'focus:ring-accent-orange',
                        'active:scale-[0.98]',
                    ],
                    variant === 'secondary' && [
                        'border-2 border-accent-orange text-accent-orange bg-transparent',
                        'hover:bg-accent-orange hover:text-white hover:shadow-[0_0_30px_rgba(232,117,10,0.2)]',
                        'focus:ring-accent-orange',
                    ],
                    variant === 'ghost' && [
                        'text-text-secondary bg-transparent',
                        'hover:text-text-primary hover:bg-bg-surface-hover',
                        'focus:ring-border-subtle',
                    ],
                    variant === 'danger' && [
                        'bg-red-600 text-white',
                        'hover:bg-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]',
                        'focus:ring-red-500',
                    ],
                    // Size styles
                    size === 'sm' && 'px-3 py-1.5 text-xs gap-1.5',
                    size === 'md' && 'px-5 py-2.5 text-sm gap-2',
                    size === 'lg' && 'px-7 py-3.5 text-base gap-2.5',
                    className
                )}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                )}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export default Button;
