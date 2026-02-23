import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { loginWithDiscord } from '@/lib/auth';
import type { Contest } from '@/lib/firestore-schema';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge, { getPhaseBadgeVariant, getPhaseLabel } from '@/components/ui/Badge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { Camera, Vote, Trophy, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stagger = {
    container: {
        animate: { transition: { staggerChildren: 0.08 } },
    },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
    },
};

export default function Home() {
    const { user } = useAuth();
    const [activeContest, setActiveContest] = useState<Contest | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchActiveContest() {
            try {
                const contestsRef = collection(db, 'contests');
                const q = query(
                    contestsRef,
                    where('phase', 'in', ['submission', 'voting']),
                    orderBy('createdAt', 'desc'),
                    limit(1)
                );
                const snapshot = await getDocs(q);
                if (!snapshot.empty) {
                    setActiveContest({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Contest);
                }
            } catch (error) {
                console.error('Failed to fetch active contest:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchActiveContest();
    }, []);

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
        >
            {/* ============================
                HERO SECTION
                ============================ */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                {/* Decorative accent line at top */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-px bg-gradient-to-r from-transparent via-accent-orange/30 to-transparent" />

                {/* Huge decorative background number */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
                    <span className="text-[20vw] font-heading font-black text-white/[0.015] leading-none tracking-tighter">
                        VITAL
                    </span>
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Status pill */}
                    <motion.div variants={stagger.item} className="mb-8">
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-orange" />
                            </span>
                            <span className="text-text-secondary text-xs font-medium tracking-wide">
                                {activeContest ? 'Contest is live' : 'Next contest coming soon'}
                            </span>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        variants={stagger.item}
                        className="heading text-5xl sm:text-6xl lg:text-7xl text-text-primary mb-6 leading-[1.05]"
                    >
                        Monthly Photo
                        <br />
                        <span className="text-gradient">Contest</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        variants={stagger.item}
                        className="text-text-secondary text-lg sm:text-xl mb-12 leading-relaxed max-w-xl mx-auto"
                    >
                        Capture the best moments in Vital RP. Submit your screenshots,
                        vote for your favorites, and compete for monthly recognition.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div variants={stagger.item} className="flex flex-col sm:flex-row items-center justify-center gap-3">
                        {user ? (
                            <>
                                {activeContest?.phase === 'submission' && (
                                    <Link to="/submit">
                                        <Button size="lg">
                                            <Camera className="w-4 h-4" />
                                            Submit Your Photo
                                        </Button>
                                    </Link>
                                )}
                                {activeContest?.phase === 'voting' && (
                                    <Link to="/vote">
                                        <Button size="lg">
                                            <Vote className="w-4 h-4" />
                                            Vote Now
                                        </Button>
                                    </Link>
                                )}
                                {!activeContest && (
                                    <Button size="lg" disabled>
                                        No Active Contest
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button size="lg" onClick={loginWithDiscord}>
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                                </svg>
                                Get Started with Discord
                            </Button>
                        )}
                    </motion.div>
                </div>

                {/* Bottom fade gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
            </section>

            {/* ============================
                ACTIVE CONTEST BANNER
                ============================ */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-24 relative z-10">
                {loading ? (
                    <div className="py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : activeContest ? (
                    <motion.div variants={stagger.item}>
                        <Card variant="glow" className="relative overflow-hidden">
                            {/* Decorative gradient */}
                            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-accent-orange/[0.04] to-transparent pointer-events-none" />

                            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-3">
                                    <Badge variant={getPhaseBadgeVariant(activeContest.phase)} pulse>
                                        {getPhaseLabel(activeContest.phase)}
                                    </Badge>
                                    <h2 className="heading text-2xl text-text-primary">
                                        {activeContest.name}
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {activeContest.categories.map((cat) => (
                                            <span
                                                key={cat.id}
                                                className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.06] text-text-muted text-[11px] font-medium tracking-wide"
                                            >
                                                {cat.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <Link to={activeContest.phase === 'submission' ? '/submit' : '/vote'} className="shrink-0">
                                    <Button variant="secondary" size="sm">
                                        {activeContest.phase === 'submission' ? 'Submit Entry' : 'Vote Now'}
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    </motion.div>
                ) : (
                    <motion.div variants={stagger.item}>
                        <Card className="text-center py-12">
                            <Trophy className="w-10 h-10 text-text-muted mx-auto mb-4 opacity-40" />
                            <h2 className="heading text-xl text-text-primary mb-2">
                                No Active Contest
                            </h2>
                            <p className="text-text-muted text-sm">
                                Check back soon for the next monthly photo contest
                            </p>
                        </Card>
                    </motion.div>
                )}
            </section>

            {/* ============================
                HOW IT WORKS
                ============================ */}
            <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
                <motion.div variants={stagger.item} className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-text-muted text-[11px] font-medium tracking-wider uppercase mb-6">
                        <Sparkles className="w-3 h-3" />
                        How it works
                    </div>
                    <h2 className="heading text-3xl sm:text-4xl text-text-primary">
                        Three simple steps
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                        {
                            icon: Camera,
                            title: 'Submit',
                            description: 'Upload your best in-game screenshot. Must be at least 1920×1080.',
                            step: '01',
                        },
                        {
                            icon: Vote,
                            title: 'Vote',
                            description: 'Browse the gallery and upvote your favorites once submissions close.',
                            step: '02',
                        },
                        {
                            icon: Trophy,
                            title: 'Win',
                            description: 'The most-voted photo wins! Winners announced at the end of each month.',
                            step: '03',
                        },
                    ].map((item) => (
                        <motion.div key={item.step} variants={stagger.item}>
                            <Card variant="interactive" className="relative group h-full">
                                {/* Step number */}
                                <span className="absolute top-5 right-5 text-5xl font-heading font-black text-white/[0.03] group-hover:text-accent-orange/[0.06] transition-colors duration-500">
                                    {item.step}
                                </span>

                                {/* Icon */}
                                <div className="w-10 h-10 rounded-xl bg-accent-orange/10 border border-accent-orange/15 flex items-center justify-center mb-5 group-hover:bg-accent-orange/15 group-hover:border-accent-orange/25 transition-all duration-500">
                                    <item.icon className="w-5 h-5 text-accent-orange" />
                                </div>

                                <h3 className="heading text-lg text-text-primary mb-2">{item.title}</h3>
                                <p className="text-text-muted text-sm leading-relaxed">{item.description}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </section>
        </motion.div>
    );
}
