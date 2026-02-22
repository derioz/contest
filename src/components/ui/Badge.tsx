import { cn } from '@/lib/utils';
import type { ContestPhase } from '@/lib/firestore-schema';

interface BadgeProps {
    variant?: 'default' | 'submission' | 'voting' | 'closed' | 'success' | 'warning' | 'danger';
    children: React.ReactNode;
    className?: string;
    pulse?: boolean;
}

const variantStyles: Record<string, string> = {
    default: 'bg-bg-elevated text-text-secondary border-border-subtle',
    submission: 'bg-accent-orange-muted text-accent-orange border-accent-orange/30',
    voting: 'bg-accent-green/15 text-accent-green border-accent-green/30',
    closed: 'bg-red-500/15 text-red-400 border-red-500/30',
    success: 'bg-accent-green/15 text-accent-green border-accent-green/30',
    warning: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    danger: 'bg-red-500/15 text-red-400 border-red-500/30',
};

export default function Badge({ variant = 'default', children, className, pulse }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border',
                'font-heading',
                variantStyles[variant],
                className
            )}
        >
            {pulse && (
                <span className="relative flex h-2 w-2">
                    <span className={cn(
                        'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                        variant === 'submission' && 'bg-accent-orange',
                        variant === 'voting' && 'bg-accent-green',
                        variant === 'closed' && 'bg-red-400',
                    )} />
                    <span className={cn(
                        'relative inline-flex rounded-full h-2 w-2',
                        variant === 'submission' && 'bg-accent-orange',
                        variant === 'voting' && 'bg-accent-green',
                        variant === 'closed' && 'bg-red-400',
                    )} />
                </span>
            )}
            {children}
        </span>
    );
}

/**
 * Helper to get badge variant from contest phase
 */
export function getPhaseBadgeVariant(phase: ContestPhase): BadgeProps['variant'] {
    switch (phase) {
        case 'submission':
            return 'submission';
        case 'voting':
            return 'voting';
        case 'closed':
            return 'closed';
        default:
            return 'default';
    }
}

export function getPhaseLabel(phase: ContestPhase): string {
    switch (phase) {
        case 'submission':
            return 'Submissions Open';
        case 'voting':
            return 'Voting Phase';
        case 'closed':
            return 'Closed';
        default:
            return phase;
    }
}
