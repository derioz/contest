import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { loginWithDiscord } from '@/lib/auth';
import type { Contest } from '@/lib/firestore-schema';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Camera, Vote, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stagger = {
    container: {
        animate: { transition: { staggerChildren: 0.1 } },
    },
    item: {
        initial: { opacity: 0, y: 30 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
    },
};

const glass = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: 24,
    ...extra,
});

export default function Home() {
    const { user } = useAuth();
    const [activeContest, setActiveContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchActiveContest() {
            try {
                const contestsRef = collection(db, 'contests');
                const q = query(contestsRef, orderBy('createdAt', 'desc'), limit(1));
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    const contest = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Contest;
                    if (contest.phase === 'submission' || contest.phase === 'voting') {
                        setActiveContest(contest);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch active contest:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchActiveContest();
    }, []);

    const isSubmission = activeContest?.phase === 'submission';
    const isVoting = activeContest?.phase === 'voting';
    const badgeColor = isSubmission ? '#4ade80' : isVoting ? '#E8750A' : '#71717A';
    const badgeText = isSubmission ? 'Submissions Open' : isVoting ? 'Voting Live' : 'Closed';

    return (
        <motion.div variants={stagger.container} initial="initial" animate="animate" style={{ paddingBottom: 100 }}>
            {/* ─── Hero Section ────────────────────────── */}
            <section style={{ position: 'relative', minHeight: '85vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {/* Decorative glowing orb */}
                <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 400, background: 'radial-gradient(circle, rgba(232,117,10,0.15) 0%, transparent 70%)', filter: 'blur(60px)', pointerEvents: 'none' }} />

                {/* Huge Watermark Text */}
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', userSelect: 'none' }}>
                    <span style={{ fontSize: '24vw', fontWeight: 900, color: 'rgba(255,255,255,0.015)', lineHeight: 1, letterSpacing: '-0.05em' }}>
                        VITAL
                    </span>
                </div>

                <div style={{ position: 'relative', maxWidth: 1000, margin: '0 auto', padding: '0 24px', textAlign: 'center', zIndex: 10 }}>
                    {/* Status Pill */}
                    <motion.div variants={stagger.item} style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                            <span style={{ position: 'relative', display: 'flex', width: 8, height: 8 }}>
                                <span style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: '50%', background: '#E8750A', opacity: 0.7, animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' }} />
                                <span style={{ position: 'relative', width: '100%', height: '100%', borderRadius: '50%', background: '#E8750A' }} />
                            </span>
                            <span style={{ color: '#A1A1AA', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em' }}>
                                {activeContest ? 'Contest is live' : 'Next contest coming soon'}
                            </span>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1 variants={stagger.item} style={{ fontSize: 'clamp(48px, 6vw, 84px)', fontWeight: 800, color: '#FAFAFA', lineHeight: 1.05, marginBottom: 24, letterSpacing: '-0.02em' }}>
                        Monthly Photo<br />
                        <span style={{ background: 'linear-gradient(135deg, #E8750A 0%, #FFB067 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Contest</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p variants={stagger.item} style={{ color: '#A1A1AA', fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 40px' }}>
                        Capture the best moments in Vital RP. Submit your screenshots,
                        vote for your favorites, and compete for monthly recognition.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div variants={stagger.item} style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                        {user ? (
                            <>
                                {isSubmission && (
                                    <Link to="/submit" style={{ textDecoration: 'none' }}>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 14, background: 'linear-gradient(135deg, #E8750A 0%, #FF5500 100%)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 30px rgba(232,117,10,0.3)' }}>
                                            <Camera style={{ width: 18, height: 18 }} />
                                            Submit Your Photo
                                        </motion.button>
                                    </Link>
                                )}
                                {isVoting && (
                                    <Link to="/vote" style={{ textDecoration: 'none' }}>
                                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 14, background: 'linear-gradient(135deg, #E8750A 0%, #FF5500 100%)', color: '#fff', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 30px rgba(232,117,10,0.3)' }}>
                                            <Vote style={{ width: 18, height: 18 }} />
                                            Vote Now
                                        </motion.button>
                                    </Link>
                                )}
                                {!activeContest && (
                                    <button disabled style={{ padding: '16px 32px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', color: '#71717A', fontSize: 16, fontWeight: 700, border: 'none', cursor: 'not-allowed' }}>
                                        No Active Contest
                                    </button>
                                )}
                            </>
                        ) : (
                            <motion.button onClick={loginWithDiscord} whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }} whileTap={{ scale: 0.98 }} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px 32px', borderRadius: 14, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#FAFAFA', fontSize: 16, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
                                <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                                </svg>
                                Get Started with Discord
                            </motion.button>
                        )}
                    </motion.div>
                </div>

                <style>{`
                    @keyframes ping {
                        75%, 100% { transform: scale(2); opacity: 0; }
                    }
                    .home-grid { grid-template-columns: repeat(3, 1fr); gap: 24px; display: grid; }
                    @media (max-width: 860px) { .home-grid { grid-template-columns: 1fr; } }
                    @media (max-width: 640px) { .contest-banner { flex-direction: column !important; align-items: flex-start !important; } }
                `}</style>
            </section>

            {/* ─── Active Contest Banner ──────────────────────── */}
            <section style={{ maxWidth: 900, margin: '-60px auto 100px', padding: '0 24px', position: 'relative', zIndex: 10 }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><LoadingSpinner /></div>
                ) : activeContest ? (
                    <motion.div variants={stagger.item}>
                        <div className="contest-banner" style={{ ...glass({ background: 'rgba(255,255,255,0.03)' }), padding: '28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, position: 'relative', overflow: 'hidden' }}>
                            {/* subtle glow overlay on card */}
                            <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', background: `linear-gradient(270deg, ${badgeColor}15 0%, transparent 100%)`, pointerEvents: 'none' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, position: 'relative', zIndex: 2 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 999, background: `${badgeColor}15`, border: `1px solid ${badgeColor}30`, color: badgeColor, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: badgeColor, boxShadow: `0 0 10px ${badgeColor}` }} />
                                        {badgeText}
                                    </span>
                                </div>
                                <h2 style={{ fontSize: 28, fontWeight: 800, color: '#FAFAFA', letterSpacing: '-0.02em', margin: 0 }}>
                                    {activeContest.name}
                                </h2>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {activeContest.categories.map(cat => (
                                        <span key={cat.id} style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#A1A1AA', fontSize: 12, fontWeight: 500 }}>
                                            {cat.name}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div style={{ position: 'relative', zIndex: 2 }}>
                                <Link to={isSubmission ? '/submit' : '/vote'} style={{ textDecoration: 'none' }}>
                                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#FAFAFA', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}>
                                        {isSubmission ? 'Submit Entry' : 'Vote Now'}
                                        <ArrowRight style={{ width: 16, height: 16 }} />
                                    </motion.button>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div variants={stagger.item}>
                        <div style={{ ...glass({ borderStyle: 'dashed' }), padding: '48px 24px', textAlign: 'center' }}>
                            <Trophy style={{ width: 48, height: 48, color: '#3F3F46', margin: '0 auto 16px' }} />
                            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#A1A1AA', marginBottom: 8 }}>No Active Contest</h2>
                            <p style={{ color: '#71717A', fontSize: 14 }}>Check back soon for the next monthly photo contest</p>
                        </div>
                    </motion.div>
                )}
            </section>

            {/* ─── How It Works ──────────────────────────────── */}
            <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 24px' }}>
                <motion.div variants={stagger.item} style={{ textAlign: 'center', marginBottom: 60 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 999, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#A1A1AA', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
                        <Sparkles style={{ width: 14, height: 14, color: '#E8750A' }} />
                        How it works
                    </div>
                    <h2 style={{ fontSize: 'clamp(32px, 4vw, 42px)', fontWeight: 800, color: '#FAFAFA', letterSpacing: '-0.02em', margin: 0 }}>
                        Three simple steps
                    </h2>
                </motion.div>

                <div className="home-grid">
                    {[
                        { icon: Camera, title: 'Submit', num: '01', desc: 'Upload your best in-game screenshot. Must be at least 1920×1080.' },
                        { icon: Vote, title: 'Vote', num: '02', desc: 'Browse the gallery and upvote your favorites once submissions close.' },
                        { icon: Trophy, title: 'Win', num: '03', desc: 'The most-voted photo wins! Winners announced at the end of each month.' },
                    ].map(item => (
                        <motion.div key={item.num} variants={stagger.item} whileHover={{ y: -6 }} style={{ ...glass(), padding: 32, position: 'relative', overflow: 'hidden', transition: 'all 0.3s' }}>
                            {/* Giant background number overlay */}
                            <div style={{ position: 'absolute', top: 10, right: 10, fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.02)', lineHeight: 1, pointerEvents: 'none', transition: 'color 0.4s' }}
                                onMouseEnter={e => e.currentTarget.style.color = 'rgba(232,117,10,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.02)'}
                            >
                                {item.num}
                            </div>

                            <div style={{ width: 48, height: 48, borderRadius: 16, background: 'rgba(232,117,10,0.1)', border: '1px solid rgba(232,117,10,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24, position: 'relative', zIndex: 2 }}>
                                <item.icon style={{ width: 24, height: 24, color: '#E8750A' }} />
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#FAFAFA', marginBottom: 12, position: 'relative', zIndex: 2 }}>
                                {item.title}
                            </h3>
                            <p style={{ color: '#A1A1AA', fontSize: 14, lineHeight: 1.6, margin: 0, position: 'relative', zIndex: 2 }}>
                                {item.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </motion.div>
    );
}
