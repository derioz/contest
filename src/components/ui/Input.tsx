import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, id, ...props }, ref) => {
        return (
            <div className="space-y-1.5">
                {label && (
                    <label htmlFor={id} className="block text-xs font-heading font-semibold tracking-wider uppercase text-text-secondary">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={id}
                    className={cn(
                        'w-full px-4 py-2.5 rounded-xl text-sm text-text-primary placeholder:text-text-muted',
                        'bg-white/[0.03] border border-white/[0.08]',
                        'backdrop-blur-sm',
                        'transition-all duration-200',
                        'focus:outline-none focus:border-accent-orange/40 focus:bg-white/[0.05]',
                        'focus:ring-1 focus:ring-accent-orange/20',
                        error && 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-400 mt-1">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
export default Input;
