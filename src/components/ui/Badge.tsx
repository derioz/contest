import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'orange' | 'green' | 'red' | 'amber';
    pulse?: boolean;
}

export default function Badge({
    className,
    variant = 'default',
    pulse = false,
    children,
    ...props
}: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-heading font-semibold tracking-wider uppercase',
                'border backdrop-blur-sm',
                variant === 'default' && 'bg-white/[0.04] border-white/[0.08] text-text-secondary',
                variant === 'orange' && 'bg-accent-orange/10 border-accent-orange/20 text-accent-orange',
                variant === 'green' && 'bg-green-500/10 border-green-500/20 text-green-400',
                variant === 'red' && 'bg-red-500/10 border-red-500/20 text-red-400',
                variant === 'amber' && 'bg-amber-500/10 border-amber-500/20 text-amber-400',
                className
            )}
            {...props}
        >
            {pulse && (
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                        style={{ backgroundColor: 'currentColor' }} />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5"
                        style={{ backgroundColor: 'currentColor' }} />
                </span>
            )}
            {children}
        </span>
    );
}

export function getPhaseBadgeVariant(phase: string): BadgeProps['variant'] {
    switch (phase) {
        case 'submission': return 'green';
        case 'voting': return 'orange';
        case 'closed': return 'red';
        default: return 'default';
    }
}

export function getPhaseLabel(phase: string): string {
    switch (phase) {
        case 'submission': return 'Submissions Open';
        case 'voting': return 'Voting Active';
        case 'closed': return 'Contest Closed';
        default: return phase;
    }
}
