import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import type { Category } from '@/lib/firestore-schema';

interface CategoryBuilderProps {
    categories: Category[];
    onChange: (categories: Category[]) => void;
}

export default function CategoryBuilder({ categories, onChange }: CategoryBuilderProps) {
    const [newCatName, setNewCatName] = useState('');
    const [newCatDesc, setNewCatDesc] = useState('');

    const handleAdd = () => {
        if (!newCatName.trim()) return;

        const newCategory: Category = {
            id: crypto.randomUUID(),
            name: newCatName.trim(),
            description: newCatDesc.trim() || undefined,
        };

        onChange([...categories, newCategory]);
        setNewCatName('');
        setNewCatDesc('');
    };

    const handeRemove = (idToRemove: string) => {
        onChange(categories.filter((c) => c.id !== idToRemove));
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 space-y-2">
                    <Input
                        placeholder="Category Name (e.g., Pot of Gold)"
                        value={newCatName}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCatName(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAdd();
                            }
                        }}
                    />
                    <Input
                        placeholder="Description (Optional)"
                        className="text-sm"
                        value={newCatDesc}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCatDesc(e.target.value)}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAdd();
                            }
                        }}
                    />
                </div>
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAdd}
                    disabled={!newCatName.trim()}
                    className="shrink-0 h-10 mt-auto"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Category
                </Button>
            </div>

            {categories.length > 0 ? (
                <ul className="space-y-2">
                    {categories.map((cat) => (
                        <li
                            key={cat.id}
                            className="flex items-center justify-between p-3 bg-white/[0.06] rounded-lg border border-white/[0.06] group"
                        >
                            <div>
                                <p className="text-text-primary font-medium">{cat.name}</p>
                                {cat.description && (
                                    <p className="text-text-muted text-sm">{cat.description}</p>
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => handeRemove(cat.id)}
                                className="p-2 text-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                                aria-label="Remove category"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-text-muted text-sm italic py-2">
                    No categories added yet. Contests need at least one category.
                </p>
            )}
        </div>
    );
}
