import { cn } from '@/lib/utils';
import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    children?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        return (
            <motion.button
                ref={ref}
                disabled={disabled || isLoading}
                whileHover={disabled || isLoading ? undefined : { scale: 1.02 }}
                whileTap={disabled || isLoading ? undefined : { scale: 0.98 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                className={cn(
                    'relative inline-flex items-center justify-center font-heading font-semibold tracking-wide',
                    'rounded-xl transition-all duration-300 ease-out',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
                    'disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none',

                    variant === 'primary' && [
                        'bg-gradient-to-r from-accent-orange to-[#FF6B00] text-white',
                        'shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_16px_rgba(232,117,10,0.25)]',
                        'hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_32px_rgba(232,117,10,0.35)]',
                        'focus-visible:ring-accent-orange',
                    ],
                    variant === 'secondary' && [
                        'bg-white/[0.04] border border-white/[0.1] text-text-primary backdrop-blur-lg',
                        'hover:bg-white/[0.08] hover:border-white/[0.15]',
                        'shadow-[0_1px_2px_rgba(0,0,0,0.2)]',
                        'focus-visible:ring-white/30',
                    ],
                    variant === 'ghost' && [
                        'text-text-secondary bg-transparent',
                        'hover:text-text-primary hover:bg-white/[0.04]',
                        'focus-visible:ring-white/20',
                    ],
                    variant === 'danger' && [
                        'bg-red-600/90 text-white border border-red-500/30',
                        'shadow-[0_1px_2px_rgba(0,0,0,0.3),0_4px_16px_rgba(220,38,38,0.2)]',
                        'hover:bg-red-600 hover:shadow-[0_1px_2px_rgba(0,0,0,0.3),0_8px_32px_rgba(220,38,38,0.3)]',
                        'focus-visible:ring-red-500',
                    ],

                    size === 'sm' && 'px-4 py-2 text-xs gap-1.5',
                    size === 'md' && 'px-6 py-2.5 text-sm gap-2',
                    size === 'lg' && 'px-8 py-3.5 text-sm gap-2.5',
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
            </motion.button>
        );
    }
);

Button.displayName = 'Button';
export default Button;
