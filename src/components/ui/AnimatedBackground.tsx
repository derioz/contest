import type { ReactNode } from 'react';

export default function AnimatedBackground({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-screen bg-bg-primary overflow-hidden">
            {/* Noise texture */}
            <div className="noise fixed inset-0 pointer-events-none z-0" />

            {/* Ambient gradient orbs */}
            <div className="fixed inset-0 pointer-events-none z-0">
                {/* Top-left warm orb */}
                <div
                    className="absolute -top-[30%] -left-[15%] w-[60vw] h-[60vw] rounded-full opacity-30"
                    style={{
                        background: 'radial-gradient(circle, rgba(232,117,10,0.15) 0%, transparent 70%)',
                        animation: 'pulse-glow 4s ease-in-out infinite',
                    }}
                />
                {/* Bottom-right cool orb */}
                <div
                    className="absolute -bottom-[30%] -right-[15%] w-[70vw] h-[70vw] rounded-full opacity-20"
                    style={{
                        background: 'radial-gradient(circle, rgba(232,117,10,0.1) 0%, transparent 70%)',
                        animation: 'pulse-glow 5s ease-in-out infinite 2s',
                    }}
                />
                {/* Center subtle accent */}
                <div
                    className="absolute top-[40%] left-[50%] -translate-x-1/2 w-[40vw] h-[40vw] rounded-full opacity-10"
                    style={{
                        background: 'radial-gradient(circle, rgba(255,140,26,0.12) 0%, transparent 70%)',
                        animation: 'pulse-glow 6s ease-in-out infinite 1s',
                    }}
                />
            </div>

            {/* Grid pattern overlay */}
            <div className="fixed inset-0 grid-pattern pointer-events-none z-0 opacity-60" />

            {/* Content */}
            <div className="relative z-10 w-full min-h-screen">
                {children}
            </div>
        </div>
    );
}
