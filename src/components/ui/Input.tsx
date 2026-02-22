import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-text-secondary font-heading uppercase tracking-wider"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full bg-bg-surface border border-border-subtle rounded-lg',
                        'px-4 py-2.5 text-text-primary placeholder:text-text-muted',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-accent-orange/50 focus:border-accent-orange',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        error && 'border-red-500 focus:ring-red-500/50 focus:border-red-500',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-red-400 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
