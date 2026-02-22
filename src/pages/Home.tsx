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
import { Camera, Vote, Trophy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
        <div className="animate-fade-in">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Gradient background */}
                <div className="absolute inset-0 bg-gradient-to-b from-accent-orange/5 via-bg-primary to-bg-primary" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(232,117,10,0.1)_0%,_transparent_60%)]" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
                    <div className="text-center max-w-3xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-orange-muted border border-accent-orange/20 mb-8">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-orange opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-orange" />
                            </span>
                            <span className="text-accent-orange text-xs font-heading uppercase tracking-wider font-semibold">
                                {activeContest ? 'Contest Active' : 'Coming Soon'}
                            </span>
                        </div>

                        <h1 className="heading text-4xl sm:text-5xl lg:text-6xl text-text-primary mb-4">
                            Monthly Photo{' '}
                            <span className="text-gradient">Contest</span>
                        </h1>
                        <p className="text-text-secondary text-lg sm:text-xl mb-10 leading-relaxed max-w-2xl mx-auto">
                            Capture the best moments in Vital RP. Submit your screenshots, vote for your favorites,
                            and compete for monthly recognition.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {user ? (
                                <>
                                    {activeContest?.phase === 'submission' && (
                                        <Link to="/submit">
                                            <Button size="lg">
                                                <Camera className="w-5 h-5" />
                                                Submit Your Photo
                                            </Button>
                                        </Link>
                                    )}
                                    {activeContest?.phase === 'voting' && (
                                        <Link to="/vote">
                                            <Button size="lg">
                                                <Vote className="w-5 h-5" />
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
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                                    </svg>
                                    Login with Discord to Get Started
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Active Contest Card */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 mb-16">
                {loading ? (
                    <div className="py-12">
                        <LoadingSpinner size="lg" />
                    </div>
                ) : activeContest ? (
                    <Card variant="glow" className="max-w-2xl mx-auto">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div>
                                <Badge variant={getPhaseBadgeVariant(activeContest.phase)} pulse>
                                    {getPhaseLabel(activeContest.phase)}
                                </Badge>
                                <h2 className="heading text-2xl text-text-primary mt-3">
                                    {activeContest.name}
                                </h2>
                                <p className="text-text-secondary text-sm mt-1">
                                    {activeContest.categories.length} {activeContest.categories.length === 1 ? 'category' : 'categories'} available
                                </p>
                            </div>
                            <Link
                                to={activeContest.phase === 'submission' ? '/submit' : '/vote'}
                                className="flex-shrink-0"
                            >
                                <Button variant="secondary" size="sm">
                                    {activeContest.phase === 'submission' ? 'Submit' : 'Vote'}
                                    <ArrowRight className="w-4 h-4" />
                                </Button>
                            </Link>
                        </div>

                        {/* Category Tags */}
                        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border-subtle">
                            {activeContest.categories.map((cat) => (
                                <span
                                    key={cat.id}
                                    className="px-3 py-1 rounded-full bg-bg-elevated text-text-secondary text-xs font-heading uppercase tracking-wider"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    </Card>
                ) : (
                    <Card className="max-w-2xl mx-auto text-center">
                        <Trophy className="w-12 h-12 text-text-muted mx-auto mb-3" />
                        <h2 className="heading text-xl text-text-primary mb-2">
                            No Active Contest
                        </h2>
                        <p className="text-text-secondary text-sm">
                            Check back soon for the next monthly photo contest!
                        </p>
                    </Card>
                )}
            </section>

            {/* How It Works */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="heading text-3xl text-center text-text-primary mb-12">
                    How It <span className="text-gradient">Works</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: Camera,
                            title: 'Submit',
                            description: 'Upload your best in-game screenshot during the submission phase. Must be at least 1920x1080.',
                            step: '01',
                        },
                        {
                            icon: Vote,
                            title: 'Vote',
                            description: 'Once submissions close, browse the gallery and upvote your favorites. Every vote counts!',
                            step: '02',
                        },
                        {
                            icon: Trophy,
                            title: 'Win',
                            description: 'The photo with the most votes wins! Winners are announced at the end of each month.',
                            step: '03',
                        },
                    ].map((item) => (
                        <Card key={item.step} variant="interactive" className="relative group">
                            <span className="absolute top-4 right-4 text-4xl font-heading font-bold text-border-subtle group-hover:text-accent-orange/20 transition-colors duration-300">
                                {item.step}
                            </span>
                            <div className="w-12 h-12 rounded-xl bg-accent-orange-muted flex items-center justify-center mb-4 group-hover:bg-accent-orange/20 transition-colors duration-300">
                                <item.icon className="w-6 h-6 text-accent-orange" />
                            </div>
                            <h3 className="heading text-lg text-text-primary mb-2">{item.title}</h3>
                            <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                        </Card>
                    ))}
                </div>
            </section>
        </div>
    );
}
