import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center gap-3', className)}>
            <div
                className={cn(
                    'relative rounded-full',
                    size === 'sm' && 'h-6 w-6',
                    size === 'md' && 'h-10 w-10',
                    size === 'lg' && 'h-16 w-16',
                )}
            >
                {/* Outer ring */}
                <div className={cn(
                    'absolute inset-0 rounded-full border-2 border-border-subtle',
                )} />
                {/* Spinning arc */}
                <div className={cn(
                    'absolute inset-0 rounded-full border-2 border-transparent border-t-accent-orange animate-spin',
                )} />
                {/* Inner glow */}
                <div className={cn(
                    'absolute inset-2 rounded-full bg-accent-orange/10 animate-pulse',
                )} />
            </div>
            {size === 'lg' && (
                <p className="text-text-muted text-sm font-heading uppercase tracking-wider animate-pulse">
                    Loading...
                </p>
            )}
        </div>
    );
}
