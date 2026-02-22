import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glow' | 'interactive';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export default function Card({
    className,
    variant = 'default',
    padding = 'md',
    children,
    ...props
}: CardProps) {
    return (
        <div
            className={cn(
                'rounded-xl border border-border-subtle bg-bg-surface',
                'transition-all duration-300 ease-out',
                variant === 'glow' && 'animate-pulse-glow',
                variant === 'interactive' && [
                    'hover:border-border-accent hover:bg-bg-surface-hover',
                    'hover:shadow-[0_0_40px_rgba(232,117,10,0.08)]',
                    'cursor-pointer',
                ],
                padding === 'sm' && 'p-3',
                padding === 'md' && 'p-5',
                padding === 'lg' && 'p-7',
                padding === 'none' && 'p-0',
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
