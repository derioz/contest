import { useState, useEffect } from 'react';
import {
    collection, query, orderBy, limit, getDocs,
    addDoc, updateDoc, doc, Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Contest, Category } from '@/lib/firestore-schema';
import { useAuth } from '@/contexts/AuthContext';
import CategoryBuilder from '@/components/admin/CategoryBuilder';
import toast from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trophy, Calendar, Clock, Users, Rocket, CheckCircle2,
    Vote, Lock, Sparkles, Plus, AlertTriangle, ChevronRight,
} from 'lucide-react';

/* ─── animation helpers from uitripled timeline pattern ─── */
const ease = [0.16, 1, 0.3, 1] as const;
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

/* ─── primitives ─────────────────────────────────────────── */
const glass = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    background: 'rgba(255,255,255,0.025)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: 16,
    ...extra,
});

function Pill({ children, color = '#E8750A' }: { children: React.ReactNode; color?: string }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '3px 10px', borderRadius: 999, fontSize: 10,
            fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
            background: `${color}18`, border: `1px solid ${color}30`, color,
        }}>
            {children}
        </span>
    );
}

function Label({ children }: { children: React.ReactNode }) {
    return (
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#52525B', marginBottom: 6 }}>
            {children}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: '100%', boxSizing: 'border-box',
    padding: '10px 14px', borderRadius: 10, fontSize: 13,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#FAFAFA', outline: 'none',
    transition: 'border 0.15s',
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div>
            <Label>{label}</Label>
            {children}
        </div>
    );
}

/* ─── phase badge ────────────────────────────────────────── */
const phaseConfig = {
    submission: { color: '#4ade80', label: 'Submission Phase', Icon: Rocket },
    voting: { color: '#E8750A', label: 'Voting Phase', Icon: Vote },
    closed: { color: '#71717A', label: 'Closed', Icon: Lock },
};

/* ─── main page ──────────────────────────────────────────── */
export default function ContestManager() {
    const { user } = useAuth();
    const [activeContest, setActiveContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState('');
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [categories, setCategories] = useState<Category[]>([]);
    const [votingCloseDate, setVotingCloseDate] = useState('');
    const [votingCloseTime, setVotingCloseTime] = useState('23:59');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => { fetchActiveContest(); }, []);

    const fetchActiveContest = async () => {
        try {
            const q = query(collection(db, 'contests'), orderBy('createdAt', 'desc'), limit(1));
            const snap = await getDocs(q);
            if (!snap.empty) {
                const d = snap.docs[0];
                setActiveContest({ id: d.id, ...d.data() } as Contest);
            }
        } catch { toast.error('Failed to load active contest'); }
        finally { setLoading(false); }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (categories.length === 0) { toast.error('Add at least one category.'); return; }
        if (!votingCloseDate || !votingCloseTime) { toast.error('Set a voting deadline.'); return; }
        setIsSubmitting(true);
        try {
            const closeDate = new Date(`${votingCloseDate}T${votingCloseTime}`);
            const contest: Omit<Contest, 'id'> = {
                name: name.trim() || `${new Date(year, month - 1).toLocaleString('default', { month: 'long' })} ${year}`,
                month, year, categories,
                phase: 'submission',
                votingCloseDate: Timestamp.fromDate(closeDate),
                createdAt: Timestamp.now(),
                createdBy: user.uid,
            };
            const ref = await addDoc(collection(db, 'contests'), contest);
            setActiveContest({ id: ref.id, ...contest });
            toast.success('Contest launched!');
            setName(''); setCategories([]); setVotingCloseDate(''); setVotingCloseTime('23:59');
        } catch { toast.error('Failed to create contest.'); }
        finally { setIsSubmitting(false); }
    };

    const updatePhase = async (p: 'submission' | 'voting' | 'closed') => {
        if (!activeContest) return;
        try {
            await updateDoc(doc(db, 'contests', activeContest.id), { phase: p });
            setActiveContest({ ...activeContest, phase: p });
            toast.success(`Phase → ${p}`);
        } catch { toast.error('Failed to update phase'); }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '80px 0' }}>
                <LoadingSpinner />
            </div>
        );
    }

    const phaseInfo = activeContest ? phaseConfig[activeContest.phase] : null;

    return (
        <motion.div variants={container} initial="hidden" animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: 32, maxWidth: 1100 }}
        >
            {/* ── Page header ──────────────────────────────────── */}
            <motion.div variants={item}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <Trophy style={{ width: 14, height: 14, color: '#E8750A' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#52525B' }}>
                        Contest Manager
                    </span>
                </div>
                <h1 style={{ fontSize: 28, fontWeight: 800, color: '#FAFAFA', lineHeight: 1.1, marginBottom: 6 }}>
                    Manage Contests
                </h1>
                <p style={{ fontSize: 14, color: '#71717A' }}>
                    Create new contests, manage phases, and configure voting deadlines.
                </p>
            </motion.div>

            {/* ── gradient divider ─────────────────────────────── */}
            <motion.div variants={item}
                style={{ height: 1, background: 'linear-gradient(90deg, rgba(232,117,10,0.35), rgba(255,255,255,0.04), transparent)' }}
            />

            {/* ── Main 2-col grid ───────────────────────────────── */}
            <div className="cm-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
                <style>{`@media(max-width:860px){.cm-grid{grid-template-columns:1fr!important;}}`}</style>

                {/* LEFT — Active Contest Panel */}
                <motion.div variants={item}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#52525B', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 3, height: 14, background: '#4ade80', borderRadius: 999 }} />
                        Active Contest
                    </div>

                    <AnimatePresence mode="wait">
                        {activeContest ? (
                            <motion.div
                                key="active"
                                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.4, ease }}
                                style={{ ...glass(), padding: 24, position: 'relative', overflow: 'hidden' }}
                            >
                                {/* background trophy watermark */}
                                <Trophy style={{ position: 'absolute', right: -16, top: -16, width: 120, height: 120, color: '#E8750A', opacity: 0.05 }} />

                                {/* Name + Phase */}
                                <div style={{ marginBottom: 20 }}>
                                    <div style={{ fontSize: 20, fontWeight: 800, color: '#FAFAFA', marginBottom: 8 }}>
                                        {activeContest.name}
                                    </div>
                                    {phaseInfo && (
                                        <Pill color={phaseInfo.color}>
                                            <phaseInfo.Icon style={{ width: 10, height: 10 }} />
                                            {phaseInfo.label}
                                        </Pill>
                                    )}
                                </div>

                                {/* Meta rows — uitripled timeline item style */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, padding: '16px 0', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#A1A1AA' }}>
                                        <Calendar style={{ width: 14, height: 14, color: '#52525B', flexShrink: 0 }} />
                                        <span>Voting closes: <strong style={{ color: '#FAFAFA' }}>{activeContest.votingCloseDate.toDate().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#A1A1AA' }}>
                                        <Clock style={{ width: 14, height: 14, color: '#52525B', flexShrink: 0 }} />
                                        <span>Time: <strong style={{ color: '#FAFAFA' }}>{activeContest.votingCloseDate.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#A1A1AA' }}>
                                        <Users style={{ width: 14, height: 14, color: '#52525B', flexShrink: 0 }} />
                                        <span>Submissions: <strong style={{ color: '#FAFAFA' }}>0</strong></span>
                                    </div>
                                </div>

                                {/* Categories */}
                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#52525B', marginBottom: 10 }}>
                                        Categories ({activeContest.categories.length})
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                                        {activeContest.categories.map(cat => (
                                            <span key={cat.id} style={{
                                                padding: '4px 10px', borderRadius: 999, fontSize: 11,
                                                background: 'rgba(255,255,255,0.04)',
                                                border: '1px solid rgba(255,255,255,0.08)',
                                                color: '#A1A1AA',
                                            }}>
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Phase controls — bento card style */}
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#52525B', marginBottom: 12 }}>
                                        Phase Controls
                                    </div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {(['submission', 'voting', 'closed'] as const).map(p => {
                                            const cfg = phaseConfig[p];
                                            const isActive = activeContest.phase === p;
                                            return (
                                                <button
                                                    key={p}
                                                    onClick={() => updatePhase(p)}
                                                    disabled={isActive}
                                                    style={{
                                                        flex: 1, padding: '10px 8px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                                                        cursor: isActive ? 'default' : 'pointer',
                                                        background: isActive ? `${cfg.color}18` : 'rgba(255,255,255,0.03)',
                                                        border: isActive ? `1px solid ${cfg.color}35` : '1px solid rgba(255,255,255,0.07)',
                                                        color: isActive ? cfg.color : '#71717A',
                                                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                                                        transition: 'all 0.15s',
                                                    }}
                                                >
                                                    {isActive ? <CheckCircle2 style={{ width: 14, height: 14 }} /> : <cfg.Icon style={{ width: 14, height: 14 }} />}
                                                    <span style={{ textTransform: 'capitalize' }}>{p}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <p style={{ fontSize: 11, color: '#3F3F46', marginTop: 8, lineHeight: 1.5 }}>
                                        Changing the phase updates the website in real-time.
                                    </p>
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                style={{ ...glass({ borderStyle: 'dashed' }), padding: 40, textAlign: 'center' }}
                            >
                                <Trophy style={{ width: 40, height: 40, color: '#3F3F46', margin: '0 auto 12px' }} />
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#71717A', marginBottom: 4 }}>No Active Contest</div>
                                <div style={{ fontSize: 12, color: '#3F3F46' }}>Create your first contest using the form →</div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* RIGHT — Create Form (glassmorphism-launch-timeline style) */}
                <motion.div variants={item}>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#52525B', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 3, height: 14, background: '#E8750A', borderRadius: 999 }} />
                        Create New Contest
                    </div>

                    <div style={{ ...glass(), padding: 24, position: 'relative', overflow: 'hidden' }}>
                        {/* subtle gradient overlay from uitripled bento pattern */}
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(232,117,10,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />

                        {activeContest && (
                            <div style={{
                                display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 14px', borderRadius: 10, marginBottom: 16,
                                background: 'rgba(232,117,10,0.08)', border: '1px solid rgba(232,117,10,0.2)',
                            }}>
                                <AlertTriangle style={{ width: 14, height: 14, color: '#E8750A', flexShrink: 0, marginTop: 1 }} />
                                <p style={{ fontSize: 12, color: '#E8750A', lineHeight: 1.5, margin: 0 }}>
                                    Creating a new contest will replace the current active one. Ensure the current contest is fully finished.
                                </p>
                            </div>
                        )}

                        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: 20, position: 'relative' }}>

                            {/* Name */}
                            <Field label="Contest Display Name">
                                <input
                                    style={inputStyle}
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="e.g. March 2026 (auto-generated if blank)"
                                    onFocus={e => (e.target.style.borderColor = 'rgba(232,117,10,0.5)')}
                                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                                />
                            </Field>

                            {/* Month + Year */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                <Field label="Target Month">
                                    <select
                                        style={{ ...inputStyle, cursor: 'pointer' }}
                                        value={month}
                                        onChange={e => setMonth(Number(e.target.value))}
                                    >
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                                            <option key={m} value={m} style={{ background: '#0D0D0F', color: '#FAFAFA' }}>
                                                {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                </Field>
                                <Field label="Year">
                                    <input
                                        type="number"
                                        style={inputStyle}
                                        value={year}
                                        onChange={e => setYear(Number(e.target.value))}
                                        min={2026}
                                        onFocus={e => (e.target.style.borderColor = 'rgba(232,117,10,0.5)')}
                                        onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                                    />
                                </Field>
                            </div>

                            {/* Categories section */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                                    <Plus style={{ width: 13, height: 13, color: '#E8750A' }} />
                                    <Label>Categories</Label>
                                </div>
                                <CategoryBuilder categories={categories} onChange={setCategories} />
                            </div>

                            {/* Voting Deadline */}
                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
                                    <Clock style={{ width: 13, height: 13, color: '#E8750A' }} />
                                    <Label>Voting Deadline</Label>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                    <div style={{ position: 'relative' }}>
                                        <Calendar style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#52525B', pointerEvents: 'none' }} />
                                        <input
                                            type="date"
                                            required
                                            style={{ ...inputStyle, paddingLeft: 34 }}
                                            value={votingCloseDate}
                                            onChange={e => setVotingCloseDate(e.target.value)}
                                            onFocus={e => (e.target.style.borderColor = 'rgba(232,117,10,0.5)')}
                                            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                                        />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Clock style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: '#52525B', pointerEvents: 'none' }} />
                                        <input
                                            type="time"
                                            required
                                            style={{ ...inputStyle, paddingLeft: 34 }}
                                            value={votingCloseTime}
                                            onChange={e => setVotingCloseTime(e.target.value)}
                                            onFocus={e => (e.target.style.borderColor = 'rgba(232,117,10,0.5)')}
                                            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.08)')}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit */}
                            <div style={{ paddingTop: 8 }}>
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting}
                                    whileHover={isSubmitting ? {} : { scale: 1.01 }}
                                    whileTap={isSubmitting ? {} : { scale: 0.99 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                    style={{
                                        width: '100%', padding: '13px 20px', borderRadius: 12, fontSize: 14,
                                        fontWeight: 700, cursor: isSubmitting ? 'not-allowed' : 'pointer', border: 'none',
                                        background: isSubmitting
                                            ? 'rgba(255,255,255,0.06)'
                                            : 'linear-gradient(135deg, #E8750A 0%, #FF5500 100%)',
                                        color: isSubmitting ? '#52525B' : '#fff',
                                        boxShadow: isSubmitting ? 'none' : '0 4px 20px rgba(232,117,10,0.4)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                        transition: 'background 0.2s, box-shadow 0.2s',
                                    }}
                                >
                                    {isSubmitting ? (
                                        <>Creating contest...</>
                                    ) : (
                                        <>
                                            <Sparkles style={{ width: 16, height: 16 }} />
                                            Launch New Contest
                                            <ChevronRight style={{ width: 14, height: 14 }} />
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
