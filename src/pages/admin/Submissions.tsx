import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Contest, Submission } from '@/lib/firestore-schema';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Check, X, ImageIcon, Filter, CheckSquare, Square, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.05 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
    }
};

const glass = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: 20,
    ...extra,
});

export default function Submissions() {
    const [contests, setContests] = useState<Contest[]>([]);
    const [selectedContestId, setSelectedContestId] = useState<string>('');
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [selectedSubmissions, setSelectedSubmissions] = useState<Set<string>>(new Set());

    // 1. Fetch all contests
    useEffect(() => {
        const fetchContests = async () => {
            try {
                const q = query(collection(db, 'contests')); // Not ordering to save another index, can sort in JS if needed
                const snapshot = await getDocs(q);
                let fetchedContests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Contest[];

                // Sort by createdAt descending
                fetchedContests.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

                setContests(fetchedContests);
                if (fetchedContests.length > 0) setSelectedContestId(fetchedContests[0].id!);
            } catch (error) {
                console.error("Error fetching contests:", error);
                toast.error("Failed to load contests.");
            }
        };
        fetchContests();
    }, []);

    // 2. Fetch submissions
    useEffect(() => {
        if (!selectedContestId) {
            setLoading(false);
            return;
        }

        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                // BUGFIX: Removed orderBy('createdAt', 'desc') to bypass the missing composite index error.
                // We will sort them in memory instead since contest sizes are small enough.
                const q = query(
                    collection(db, 'submissions'),
                    where('contestId', '==', selectedContestId)
                );

                const snapshot = await getDocs(q);
                let fetchedSubmissions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Submission[];

                // Sort descending by createdAt in JS
                fetchedSubmissions.sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());

                if (statusFilter !== 'all') {
                    fetchedSubmissions = fetchedSubmissions.filter(s => s.status === statusFilter);
                }

                setSubmissions(fetchedSubmissions);
                setSelectedSubmissions(new Set());
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
            setSubmissions(current => current.map(sub => sub.id === submissionId ? { ...sub, status: newStatus } : sub));
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
                batch.update(doc(db, 'submissions', id), { status: newStatus });
            });
            await batch.commit();

            setSubmissions(current => current.map(sub => selectedSubmissions.has(sub.id!) ? { ...sub, status: newStatus } : sub));
            setSelectedSubmissions(new Set());
            toast.success(`${selectedSubmissions.size} submissions ${newStatus}`);
        } catch (error) {
            console.error("Error bulk updating:", error);
            toast.error("Failed to update multiple");
        }
    };

    const toggleSelection = (id: string) => {
        setSelectedSubmissions(prev => {
            const newSet = new Set(prev);
            newSet.has(id) ? newSet.delete(id) : newSet.add(id);
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

    const getStatusColor = (status: string) => {
        if (status === 'approved') return '#4ade80';
        if (status === 'rejected') return '#ef4444';
        return '#fbbf24';
    };

    if (loading && contests.length === 0) {
        return <div style={{ padding: 100, display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>;
    }

    return (
        <motion.div variants={stagger.container} initial="initial" animate="animate" style={{ maxWidth: 1400, margin: '0 auto', paddingBottom: 60 }}>

            {/* Header Area */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
                <motion.div variants={stagger.item}>
                    <h1 style={{ fontSize: 36, fontWeight: 800, color: '#FAFAFA', letterSpacing: '-0.02em', margin: '0 0 8px 0' }}>
                        Submissions manager
                    </h1>
                    <p style={{ color: '#A1A1AA', fontSize: 16, margin: 0 }}>Review, approve, and filter entries for your active contests.</p>
                </motion.div>

                {/* Filters */}
                <motion.div variants={stagger.item} style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ position: 'relative' }}>
                        <Layers style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 16, height: 16, color: '#71717A' }} />
                        <select
                            value={selectedContestId}
                            onChange={(e) => setSelectedContestId(e.target.value)}
                            style={{ appearance: 'none', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: '10px 40px', color: '#FAFAFA', fontSize: 14, fontWeight: 500, outline: 'none', cursor: 'pointer' }}
                        >
                            {contests.length === 0 && <option value="">No contests</option>}
                            {contests.map((c) => <option key={c.id} value={c.id} style={{ background: '#0D0D0F' }}>{c.name} ({c.phase})</option>)}
                        </select>
                    </div>

                    <div style={{ ...glass({ padding: 4, borderRadius: 12 }), display: 'flex', gap: 4, alignItems: 'center' }}>
                        <Filter style={{ width: 14, height: 14, color: '#71717A', marginLeft: 12, marginRight: 8 }} />
                        {(['all', 'pending', 'approved', 'rejected'] as const).map(status => {
                            const isActive = statusFilter === status;
                            return (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    style={{ background: isActive ? '#E8750A' : 'transparent', color: isActive ? '#FFF' : '#A1A1AA', border: 'none', padding: '6px 16px', borderRadius: 8, fontSize: 13, fontWeight: 600, textTransform: 'capitalize', cursor: 'pointer', transition: 'all 0.2s' }}
                                >
                                    {status}
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedSubmissions.size > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        style={{ overflow: 'hidden', marginBottom: 24 }}
                    >
                        <div style={{ background: 'rgba(232,117,10,0.1)', border: '1px solid rgba(232,117,10,0.2)', borderRadius: 16, padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <span style={{ color: '#FAFAFA', fontSize: 15, fontWeight: 600 }}>{selectedSubmissions.size} Selected</span>
                                <button onClick={toggleSelectAll} style={{ background: 'rgba(255,255,255,0.05)', color: '#A1A1AA', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '6px 14px', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
                                    {selectedSubmissions.size === submissions.length ? 'Deselect All' : 'Select All'}
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                                <button onClick={() => handleBulkStatusChange('approved')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(74,222,128,0.15)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                                    <Check style={{ width: 16, height: 16 }} /> Approve All
                                </button>
                                <button onClick={() => handleBulkStatusChange('rejected')} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
                                    <X style={{ width: 16, height: 16 }} /> Reject All
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content Grid */}
            {loading ? (
                <div style={{ padding: 100, display: 'flex', justifyContent: 'center' }}><LoadingSpinner /></div>
            ) : submissions.length === 0 ? (
                <div style={{ ...glass({ borderStyle: 'dashed', borderRadius: 24 }), padding: '80px 24px', textAlign: 'center' }}>
                    <ImageIcon style={{ width: 48, height: 48, color: '#3F3F46', margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: '#A1A1AA', marginBottom: 8 }}>No submissions found</h3>
                    <p style={{ color: '#71717A', fontSize: 14 }}>There are no submissions matching your current filters.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
                    {submissions.map((sub) => {
                        const isSelected = selectedSubmissions.has(sub.id!);
                        const sColor = getStatusColor(sub.status);

                        return (
                            <motion.div key={sub.id} variants={stagger.item} style={{ ...glass(), overflow: 'hidden', position: 'relative', boxShadow: isSelected ? '0 0 0 2px #E8750A' : 'none', transition: 'box-shadow 0.2s' }}>
                                {/* Image Box */}
                                <div style={{ position: 'relative', aspectRatio: '16/9', backgroundColor: '#000', overflow: 'hidden' }}>

                                    {/* Selection Checkbox overlay */}
                                    <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 10 }}>
                                        <button
                                            onClick={() => toggleSelection(sub.id!)}
                                            style={{ background: isSelected ? '#E8750A' : 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', border: `1px solid ${isSelected ? '#E8750A' : 'rgba(255,255,255,0.2)'}`, color: '#FFF', borderRadius: 8, padding: 6, display: 'flex', cursor: 'pointer', transition: 'all 0.2s' }}
                                        >
                                            {isSelected ? <CheckSquare style={{ width: 18, height: 18 }} /> : <Square style={{ width: 18, height: 18 }} />}
                                        </button>
                                    </div>

                                    {/* Status Badge overlay */}
                                    <div style={{ position: 'absolute', top: 12, right: 12, zIndex: 10 }}>
                                        <span style={{ background: `${sColor}20`, border: `1px solid ${sColor}40`, color: sColor, padding: '4px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', backdropFilter: 'blur(4px)' }}>
                                            {sub.status}
                                        </span>
                                    </div>

                                    <img
                                        src={sub.imageUrl}
                                        alt="Submission"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: sub.status === 'rejected' ? 0.4 : 1, filter: sub.status === 'rejected' ? 'grayscale(100%)' : 'none', transition: 'transform 0.5s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                        loading="lazy"
                                    />
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', pointerEvents: 'none' }} />

                                    {/* Submitter Info */}
                                    <div style={{ position: 'absolute', bottom: 16, left: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <img src={sub.avatarUrl || '/default-avatar.png'} alt="P" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.1)' }} />
                                        <div>
                                            <div style={{ color: '#FFF', fontSize: 14, fontWeight: 600, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{sub.username}</div>
                                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, fontWeight: 500 }}>ID: {sub.userId}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ padding: 16, display: 'flex', gap: 8, background: 'rgba(0,0,0,0.2)' }}>
                                    {sub.status !== 'approved' && (
                                        <button
                                            onClick={() => handleStatusChange(sub.id!, 'approved')}
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(74,222,128,0.15)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(74,222,128,0.1)'}
                                        >
                                            <Check style={{ width: 14, height: 14 }} /> Approve
                                        </button>
                                    )}
                                    {sub.status !== 'rejected' && (
                                        <button
                                            onClick={() => handleStatusChange(sub.id!, 'rejected')}
                                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 0', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                                        >
                                            <X style={{ width: 14, height: 14 }} /> Reject
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </motion.div>
    );
}
