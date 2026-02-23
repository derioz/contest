import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Contest, Submission } from '@/lib/firestore-schema';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Check, X, ImageIcon, Filter, CheckSquare, Square } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Submissions() {
    const [contests, setContests] = useState<Contest[]>([]);
    const [selectedContestId, setSelectedContestId] = useState<string>('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());

    // 1. Fetch all contests so admin can pick which one to view
    useEffect(() => {
        const fetchContests = async () => {
            try {
                const q = query(collection(db, 'contests'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const fetchedContests = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Contest[];
                setContests(fetchedContests);

                if (fetchedContests.length > 0) {
                    setSelectedContestId(fetchedContests[0].id!);
                }
            } catch (error) {
                console.error("Error fetching contests:", error);
                toast.error("Failed to load contests.");
            }
        };
        fetchContests();
    }, []);

    // 2. Fetch submissions when selectedContestId or statusFilter changes
    useEffect(() => {
        if (!selectedContestId) {
            setLoading(false);
            return;
        }

        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                let q = query(
                    collection(db, 'submissions'),
                    where('contestId', '==', selectedContestId),
                    orderBy('createdAt', 'desc')
                );

                const snapshot = await getDocs(q);
                let fetchedSubmissions = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Submission[];

                if (statusFilter !== 'all') {
                    fetchedSubmissions = fetchedSubmissions.filter(s => s.status === statusFilter);
                }

                setSubmissions(fetchedSubmissions);
                setSelectedSubmissions(new Set()); // Reset selection when fetching
            } catch (error) {
                console.error("Error fetching submissions:", error);
                toast.error("Failed to load submissions.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubmissions();
    }, [selectedContestId, statusFilter]);


    const handleStatusChange = async (submissionId: string, newStatus: 'approved' | 'rejected' | 'pending') => {
        try {
            const subRef = doc(db, 'submissions', submissionId);
            await updateDoc(subRef, { status: newStatus });

            setSubmissions(current =>
                current.map(sub => sub.id === submissionId ? { ...sub, status: newStatus } : sub)
            );
            toast.success(`Submission ${newStatus}`);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const handleBulkStatusChange = async (newStatus: 'approved' | 'rejected') => {
        if (selectedSubmissions.size === 0) return;

        try {
            const batch = writeBatch(db);
            selectedSubmissions.forEach(id => {
                const subRef = doc(db, 'submissions', id);
                batch.update(subRef, { status: newStatus });
            });
            await batch.commit();

            setSubmissions(current =>
                current.map(sub => selectedSubmissions.has(sub.id!) ? { ...sub, status: newStatus } : sub)
            );
            setSelectedSubmissions(new Set());
            toast.success(`${selectedSubmissions.size} submissions ${newStatus}`);
        } catch (error) {
            console.error("Error bulk updating status:", error);
            toast.error("Failed to update multiple submissions");
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedSubmissions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) newSet.delete(id);
            else newSet.add(id);
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedSubmissions.size === submissions.length) {
            setSelectedSubmissions(new Set());
        } else {
            setSelectedSubmissions(new Set(submissions.map(s => s.id!)));
        }
    };

    if (loading && contests.length === 0) {
        return <div className="py-20 flex justify-center"><LoadingSpinner /></div>;
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="heading text-3xl text-text-primary mb-2">Submissions</h1>
                    <p className="text-text-secondary">Review and moderate entries for your contests.</p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                    <select
                        value={selectedContestId}
                        onChange={(e) => setSelectedContestId(e.target.value)}
                        className="bg-bg-tertiary border border-border-default text-text-primary rounded-lg px-4 py-2 focus:outline-none focus:border-accent-orange"
                    >
                        {contests.length === 0 && <option value="">No contests found</option>}
                        {contests.map((c) => (
                            <option key={c.id} value={c.id}>{c.name} ({c.phase})</option>
                        ))}
                    </select>

                    <div className="flex items-center gap-2 bg-bg-tertiary border border-border-default rounded-lg p-1">
                        <Filter className="w-4 h-4 text-text-muted ml-2" />
                        {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
                            <button
                                key={status}
                                onClick={() => setStatusFilter(status)}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${statusFilter === status
                                    ? 'bg-accent-orange text-white'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                                    }`}
                            >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {selectedSubmissions.size > 0 && (
                <div className="bg-accent-orange/10 border border-accent-orange/20 rounded-lg p-4 flex items-center justify-between animate-fade-in">
                    <span className="text-text-primary font-medium">{selectedSubmissions.size} Selected</span>
                    <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={toggleSelectAll}>
                            Select All
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleBulkStatusChange('approved')}>
                            <Check className="w-4 h-4 mr-2" /> Approve All
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleBulkStatusChange('rejected')}>
                            <X className="w-4 h-4 mr-2" /> Reject All
                        </Button>
                    </div>
                </div>
            )}

            {loading ? (
                <div className="py-20 flex justify-center"><LoadingSpinner /></div>
            ) : submissions.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                    <ImageIcon className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-50" />
                    <h3 className="heading text-xl text-text-primary mb-2">No submissions found</h3>
                    <p className="text-text-secondary">
                        There are no submissions matching your current filters for this contest.
                    </p>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {submissions.map((sub) => {
                        const isSelected = selectedSubmissions.has(sub.id!);
                        return (
                            <Card key={sub.id} className={`overflow-hidden relative transition-all duration-200 ${isSelected ? 'ring-2 ring-accent-orange' : ''}`}>
                                <div className="absolute top-2 left-2 z-10">
                                    <button
                                        onClick={() => toggleSelection(sub.id!)}
                                        className={`p-1.5 rounded bg-black/50 backdrop-blur border transition-all ${isSelected ? 'border-accent-orange text-accent-orange' : 'border-white/20 text-white/50 hover:text-white'}`}
                                    >
                                        {isSelected ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                                    </button>
                                </div>
                                <div className="relative aspect-video group bg-bg-tertiary">
                                    <img
                                        src={sub.imageUrl}
                                        alt="Submission"
                                        className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${sub.status === 'rejected' ? 'grayscale opacity-50' : ''}`}
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                                </div>

                                <div className="p-5 flex flex-col gap-4">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <img src={sub.avatarUrl || '/default-avatar.png'} alt={sub.username} className="w-10 h-10 rounded-full border border-border-default" />
                                            <div>
                                                <p className="font-heading font-medium text-text-primary leading-tight">{sub.username}</p>
                                                <p className="text-xs text-text-muted mt-0.5 max-w-[150px] truncate" title={sub.userId}>{sub.userId}</p>
                                            </div>
                                        </div>
                                        <Badge variant={sub.status === 'approved' ? 'green' : sub.status === 'rejected' ? 'red' : 'amber'} className="capitalize shrink-0">
                                            {sub.status}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-auto pt-2 border-t border-border-default">
                                        {sub.status !== 'approved' && (
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1 bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20 hover:border-green-500/30"
                                                onClick={() => handleStatusChange(sub.id!, 'approved')}
                                            >
                                                <Check className="w-4 h-4 mr-1.5" /> Approve
                                            </Button>
                                        )}
                                        {sub.status !== 'rejected' && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                className="flex-1"
                                                onClick={() => handleStatusChange(sub.id!, 'rejected')}
                                            >
                                                <X className="w-4 h-4 mr-1.5" /> Reject
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
