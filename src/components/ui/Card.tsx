import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    variant?: 'default' | 'glow' | 'interactive';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    children?: ReactNode;
}

export default function Card({
    className,
    variant = 'default',
    padding = 'md',
    children,
    ...props
}: CardProps) {
    const isInteractive = variant === 'interactive';

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            whileHover={isInteractive ? { y: -4, transition: { type: 'spring', stiffness: 300, damping: 20 } } : undefined}
            className={cn(
                'relative rounded-2xl overflow-hidden',
                'bg-white/[0.02] border border-white/[0.06]',
                'backdrop-blur-xl',
                'shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_20px_50px_-12px_rgba(0,0,0,0.5)]',
                'transition-all duration-500 ease-out',
                variant === 'glow' && [
                    'border-accent-orange/20',
                    'shadow-[0_0_0_1px_rgba(232,117,10,0.1)_inset,0_0_30px_rgba(232,117,10,0.08),0_20px_50px_-12px_rgba(0,0,0,0.5)]',
                ],
                isInteractive && [
                    'cursor-pointer',
                    'hover:border-white/[0.12] hover:bg-white/[0.04]',
                    'hover:shadow-[0_0_0_1px_rgba(255,255,255,0.06)_inset,0_25px_60px_-12px_rgba(0,0,0,0.6)]',
                ],
                padding === 'sm' && 'p-4',
                padding === 'md' && 'p-6',
                padding === 'lg' && 'p-8',
                padding === 'none' && 'p-0',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
}
