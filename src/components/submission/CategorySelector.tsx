import { cn } from '@/lib/utils';
import type { Category } from '@/lib/firestore-schema';
import { CheckCircle2 } from 'lucide-react';

interface CategorySelectorProps {
    categories: Category[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    disabled?: boolean;
}

export default function CategorySelector({ categories, selectedId, onSelect, disabled }: CategorySelectorProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat) => {
                const isSelected = selectedId === cat.id;

                return (
                    <button
                        key={cat.id}
                        type="button"
                        disabled={disabled}
                        onClick={() => onSelect(cat.id)}
                        className={cn(
                            "relative text-left p-5 rounded-xl border transition-all duration-300",
                            "focus:outline-none focus:ring-2 focus:ring-accent-orange focus:ring-offset-2 focus:ring-offset-bg-primary",
                            isSelected
                                ? "bg-accent-orange/10 border-accent-orange shadow-[0_0_20px_rgba(232,117,10,0.15)]"
                                : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-accent-orange/50",
                            disabled && !isSelected && "opacity-50 cursor-not-allowed hover:bg-white/[0.03] hover:border-white/[0.06]",
                            disabled && isSelected && "opacity-80 cursor-not-allowed"
                        )}
                    >
                        {isSelected && (
                            <div className="absolute top-4 right-4">
                                <CheckCircle2 className="w-5 h-5 text-accent-orange" />
                            </div>
                        )}

                        <h4 className={cn(
                            "font-heading text-lg font-semibold tracking-wide mb-1 transition-colors",
                            isSelected ? "text-accent-orange" : "text-text-primary"
                        )}>
                            {cat.name}
                        </h4>

                        {cat.description && (
                            <p className="text-sm text-text-secondary leading-relaxed">
                                {cat.description}
                            </p>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
