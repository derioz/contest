import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
    return (
        <div className={cn('flex items-center justify-center', className)}>
            <div
                className={cn(
                    'relative rounded-full',
                    size === 'sm' && 'w-5 h-5',
                    size === 'md' && 'w-8 h-8',
                    size === 'lg' && 'w-12 h-12'
                )}
            >
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 border-white/[0.06]" />
                {/* Spinning accent arc */}
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent-orange animate-spin" />
                {/* Center dot */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className={cn(
                        'rounded-full bg-accent-orange/60',
                        size === 'sm' && 'w-1 h-1',
                        size === 'md' && 'w-1.5 h-1.5',
                        size === 'lg' && 'w-2 h-2',
                    )} />
                </div>
            </div>
        </div>
    );
}
