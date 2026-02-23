import { useState, useEffect } from 'react';
import { collection, query, orderBy, limit, getDocs, addDoc, updateDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Contest, Category } from '@/lib/firestore-schema';
import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import CategoryBuilder from '@/components/admin/CategoryBuilder';
import Badge from '@/components/ui/Badge';
import toast from 'react-hot-toast';
import { Calendar, Clock, Trophy, Users } from 'lucide-react';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

export default function ContestManager() {
    const { user } = useAuth();

    const [activeContest, setActiveContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);

    // Form State
    const [name, setName] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [categories, setCategories] = useState<Category[]>([]);
    const [votingCloseDate, setVotingCloseDate] = useState('');
    const [votingCloseTime, setVotingCloseTime] = useState('23:59');

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchActiveContest();
    }, []);

    const fetchActiveContest = async () => {
        try {
            const q = query(collection(db, 'contests'), orderBy('createdAt', 'desc'), limit(1));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const docData = snapshot.docs[0];
                setActiveContest({ id: docData.id, ...docData.data() } as Contest);
            }
        } catch (error) {
            console.error('Error fetching contest:', error);
            toast.error('Failed to load active contest');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateContest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        if (categories.length === 0) {
            toast.error('Please add at least one category.');
            return;
        }

        if (!votingCloseDate || !votingCloseTime) {
            toast.error('Please set a voting close date and time.');
            return;
        }

        setIsSubmitting(true);

        try {
            // Combine date and time
            const dateTimeString = `${votingCloseDate}T${votingCloseTime}`;
            const closeDate = new Date(dateTimeString);

            const newContest: Omit<Contest, 'id'> = {
                name: name.trim() || `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`,
                month,
                year,
                categories,
                phase: 'submission', // Default to submission phase
                votingCloseDate: Timestamp.fromDate(closeDate),
                createdAt: Timestamp.now(),
                createdBy: user.uid,
            };

            const docRef = await addDoc(collection(db, 'contests'), newContest);

            setActiveContest({ id: docRef.id, ...newContest });
            toast.success('Contest created successfully!');

            // Reset form
            setName('');
            setCategories([]);
            setVotingCloseDate('');
            setVotingCloseTime('23:59');

        } catch (error) {
            console.error('Error creating contest:', error);
            toast.error('Failed to create contest.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const updateContestPhase = async (newPhase: 'submission' | 'voting' | 'closed') => {
        if (!activeContest) return;

        try {
            await updateDoc(doc(db, 'contests', activeContest.id), {
                phase: newPhase
            });
            setActiveContest({ ...activeContest, phase: newPhase });
            toast.success(`Phase changed to ${newPhase}`);
        } catch (error) {
            console.error('Error updating phase:', error);
            toast.error('Failed to update phase');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="heading text-3xl text-text-primary">Contest Manager</h1>
                <p className="text-text-secondary mt-2">Create new contests and manage the active monthly phase.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column: Current Active Contest State */}
                <div className="space-y-6">
                    <h2 className="heading text-xl text-text-primary">Active Contest</h2>

                    {activeContest ? (
                        <Card className="p-6 border-accent-orange/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                                <Trophy className="w-32 h-32 text-accent-orange" />
                            </div>

                            <div className="relative z-10 space-y-6">
                                <div>
                                    <h3 className="heading text-2xl text-text-primary mb-2">
                                        {activeContest.name}
                                    </h3>
                                    <div className="flex gap-2">
                                        <Badge variant={
                                            activeContest.phase === 'submission' ? 'default' :
                                                activeContest.phase === 'voting' ? 'success' : 'default'
                                        }>
                                            {activeContest.phase.toUpperCase()} PHASE
                                        </Badge>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center text-text-secondary">
                                        <Calendar className="w-5 h-5 mr-3 text-text-muted" />
                                        <span>Voting Closes: <strong className="text-text-primary">
                                            {activeContest.votingCloseDate.toDate().toLocaleString()}
                                        </strong></span>
                                    </div>
                                    <div className="flex items-center text-text-secondary">
                                        <Users className="w-5 h-5 mr-3 text-text-muted" />
                                        <span>Total Submissions: <strong className="text-text-primary">0</strong></span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border-subtle">
                                    <h4 className="font-heading font-semibold text-text-primary mb-3">Categories ({activeContest.categories.length})</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {activeContest.categories.map(cat => (
                                            <span key={cat.id} className="text-xs bg-bg-primary border border-border-subtle px-2 py-1 rounded text-text-secondary">
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <h4 className="font-heading font-semibold text-text-primary mb-3">Phase Controls</h4>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            variant={activeContest.phase === 'submission' ? 'primary' : 'secondary'}
                                            onClick={() => updateContestPhase('submission')}
                                            disabled={activeContest.phase === 'submission'}
                                        >
                                            Submission
                                        </Button>
                                        <Button
                                            variant={activeContest.phase === 'voting' ? 'primary' : 'secondary'}
                                            onClick={() => updateContestPhase('voting')}
                                            disabled={activeContest.phase === 'voting'}
                                        >
                                            Voting
                                        </Button>
                                        <Button
                                            variant={activeContest.phase === 'closed' ? 'primary' : 'secondary'}
                                            onClick={() => updateContestPhase('closed')}
                                            disabled={activeContest.phase === 'closed'}
                                        >
                                            Closed
                                        </Button>
                                    </div>
                                    <p className="text-xs text-text-muted mt-2">
                                        Changing the phase automatically updates the website view for players.
                                    </p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <Card className="p-8 text-center border-dashed">
                            <p className="text-text-secondary">No contest exists in the database.</p>
                            <p className="text-sm text-text-muted mt-2">Create the first one using the form on the right.</p>
                        </Card>
                    )}
                </div>

                {/* Right Column: Create New Contest */}
                <div className="space-y-6">
                    <h2 className="heading text-xl text-text-primary">Create New Contest</h2>

                    <Card className="p-6">
                        <form onSubmit={handleCreateContest} className="space-y-6">

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text-secondary mb-1">
                                        Contest Display Name
                                    </label>
                                    <Input
                                        value={name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                        placeholder="e.g. March 2026 (Leave blank to auto-generate from month/year)"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">
                                            Target Month
                                        </label>
                                        <select
                                            className="w-full bg-bg-primary border border-border-subtle rounded-md px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-accent-orange"
                                            value={month}
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMonth(Number(e.target.value))}
                                        >
                                            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                                <option key={m} value={m}>
                                                    {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-secondary mb-1">
                                            Year
                                        </label>
                                        <Input
                                            type="number"
                                            value={year}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYear(Number(e.target.value))}
                                            min={2026}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border-subtle">
                                    <label className="block text-sm font-medium text-text-secondary mb-3">
                                        Categories
                                    </label>
                                    <CategoryBuilder
                                        categories={categories}
                                        onChange={setCategories}
                                    />
                                </div>

                                <div className="pt-4 border-t border-border-subtle">
                                    <label className="block text-sm font-medium text-text-secondary mb-3">
                                        Voting Deadline (When voting automatically closes)
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                                            <Input
                                                type="date"
                                                required
                                                className="pl-10"
                                                value={votingCloseDate}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVotingCloseDate(e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-text-muted" />
                                            <Input
                                                type="time"
                                                required
                                                className="pl-10"
                                                value={votingCloseTime}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setVotingCloseTime(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full"
                                >
                                    {isSubmitting ? 'Creating Contest...' : 'Launch New Contest'}
                                </Button>
                                {activeContest && (
                                    <p className="text-xs text-center text-accent-orange mt-2">
                                        Warning: Creating a new contest will make it the active contest.
                                        Be sure the current one is fully finished!
                                    </p>
                                )}
                            </div>
                        </form>
                    </Card>
                </div>

            </div>
        </div>
    );
}
