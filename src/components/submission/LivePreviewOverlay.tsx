import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Loader2 } from 'lucide-react';

interface LivePreviewOverlayProps {
    imageUrl: string;
}

export default function LivePreviewOverlay({ imageUrl }: LivePreviewOverlayProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-50 pointer-events-none animate-fade-in">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Dark Gradient Overlay for text readability (matches Vital loading screen style) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Loading Elements */}
            <div className="absolute bottom-12 left-12 flex items-center space-x-6">
                <Loader2 className="w-16 h-16 text-accent-orange animate-spin" />

                <div>
                    <h1 className="text-white font-heading text-5xl uppercase tracking-widest font-bold mb-2 drop-shadow-md">
                        VITAL RP
                    </h1>
                    <p className="text-text-secondary text-lg">
                        Downloading server assets... (42/104)
                    </p>
                </div>
            </div>

            <div className="absolute top-12 left-12 max-w-md">
                <div className="bg-black/40 backdrop-blur-md border md:border-white/[0.06] p-6 rounded-xl">
                    <h3 className="text-accent-orange font-heading font-bold uppercase tracking-wider mb-2">
                        Server Tip
                    </h3>
                    <p className="text-white">
                        This is exactly how your screenshot will look when players load into the city.
                        The interface overlay is automatically applied in-game.
                    </p>
                </div>
            </div>
        </div>,
        document.body
    );
}
