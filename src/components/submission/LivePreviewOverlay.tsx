import { Loader2 } from 'lucide-react';

interface LivePreviewOverlayProps {
    imageUrl: string;
}

export default function LivePreviewOverlay({ imageUrl }: LivePreviewOverlayProps) {
    return (
        <div className="relative w-full h-full animate-fade-in overflow-hidden rounded-xl border border-white/10">
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${imageUrl})` }}
            />

            {/* Dark Gradient Overlay for text readability (matches Vital loading screen style) */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />

            {/* Loading Elements */}
            <div className="absolute bottom-6 left-6 flex items-center space-x-4">
                <Loader2 className="w-8 h-8 text-accent-orange animate-spin" />

                <div>
                    <h1 className="text-white font-heading text-2xl uppercase tracking-widest font-bold mb-1 drop-shadow-md">
                        VITAL RP
                    </h1>
                    <p className="text-text-secondary text-xs">
                        Downloading server assets... (42/104)
                    </p>
                </div>
            </div>

            <div className="absolute top-6 left-6 max-w-[200px]">
                <div className="bg-black/40 backdrop-blur-md border border-white/[0.06] p-3 rounded-lg">
                    <h3 className="text-accent-orange font-heading font-bold uppercase tracking-wider text-[10px] mb-1">
                        Server Tip
                    </h3>
                    <p className="text-white text-[10px] leading-tight">
                        This is exactly how your screenshot will look when players load into the city.
                    </p>
                </div>
            </div>
        </div>
    );
}
