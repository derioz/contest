import { useState, useRef } from 'react';
import { X, Loader2, ImagePlus } from 'lucide-react';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface UploadZoneProps {
    onImageValid: (file: File, tempUrl: string, width: number, height: number) => void;
    onClear: () => void;
    isUploading?: boolean;
}

export default function UploadZone({ onImageValid, onClear, isUploading }: UploadZoneProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateAndProcessFile = (file: File) => {
        // Basic checks
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload a valid image file (PNG, JPG, etc).');
            return;
        }
        if (file.size > 20 * 1024 * 1024) {
            toast.error('File size must be under 20MB.');
            return;
        }

        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.src = objectUrl;

        img.onload = () => {
            // Vital RP requirement: minimum 1920x1080
            if (img.width < 1920 || img.height < 1080) {
                toast.error(`Resolution too low! Must be at least 1920x1080. Your image is ${img.width}x${img.height}.`, {
                    duration: 5000,
                });
                URL.revokeObjectURL(objectUrl);
            } else {
                setPreviewUrl(objectUrl);
                onImageValid(file, objectUrl, img.width, img.height);
            }
        };

        img.onerror = () => {
            toast.error('Failed to read image.');
            URL.revokeObjectURL(objectUrl);
        };
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(false);

        if (isUploading) return;

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            validateAndProcessFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (isUploading) return;

        if (e.target.files && e.target.files.length > 0) {
            validateAndProcessFile(e.target.files[0]);
        }
    };

    const handleClear = () => {
        if (isUploading) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        onClear();
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    if (previewUrl) {
        return (
            <div className="relative rounded-xl overflow-hidden border border-border-subtle bg-bg-surface group">
                <img
                    src={previewUrl}
                    alt="Preview"
                    className={cn(
                        "w-full h-[400px] object-cover transition-opacity",
                        isUploading && "opacity-50 blur-sm"
                    )}
                />

                {isUploading && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
                        <Loader2 className="w-12 h-12 text-accent-orange animate-spin mb-4" />
                        <p className="text-white font-heading text-xl uppercase tracking-wider">Uploading to server...</p>
                    </div>
                )}

                {!isUploading && (
                    <button
                        onClick={handleClear}
                        className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500 text-white rounded-full backdrop-blur-sm transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div
            onDragOver={(e) => { e.preventDefault(); setIsHovering(true); }}
            onDragLeave={() => setIsHovering(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
                "relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-12 text-center cursor-pointer transition-all duration-300",
                "h-[300px]",
                isHovering
                    ? "border-accent-orange bg-accent-orange/5"
                    : "border-border-subtle bg-bg-surface hover:bg-bg-surface-hover hover:border-accent-orange/50"
            )}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
            />

            <div className="p-4 bg-bg-primary rounded-full mb-4">
                <ImagePlus className={cn("w-10 h-10", isHovering ? "text-accent-orange" : "text-text-muted")} />
            </div>

            <h3 className="text-text-primary font-heading text-xl uppercase tracking-widest mb-2">
                Click or Drag Screenshot Here
            </h3>
            <p className="text-text-secondary mb-4 max-w-sm">
                Only PC screenshots. Do not crop or edit the image. Minimum resolution is 1920x1080.
            </p>

            <div className="flex gap-2 text-xs text-text-muted">
                <span className="bg-bg-primary px-2 py-1 rounded">PNG, JPG, WEBP</span>
                <span className="bg-bg-primary px-2 py-1 rounded">Max 20MB</span>
            </div>
        </div>
    );
}
