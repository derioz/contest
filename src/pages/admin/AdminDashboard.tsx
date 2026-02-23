import { useAuth } from '@/contexts/AuthContext';
import { Trophy, FileBarChart, Users, ShieldBan, ArrowRight, Activity, BarChart3 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ease = [0.16, 1, 0.3, 1] as const;

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};
const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease } },
};

const stats = [
    { label: 'Active Contests', value: '—', Icon: Trophy, color: '#E8750A', glow: 'rgba(232,117,10,0.18)' },
    { label: 'Total Submissions', value: '—', Icon: BarChart3, color: '#4ade80', glow: 'rgba(74,222,128,0.18)' },
    { label: 'Registered Users', value: '—', Icon: Users, color: '#60a5fa', glow: 'rgba(96,165,250,0.18)' },
    { label: 'Banned Users', value: '—', Icon: ShieldBan, color: '#f87171', glow: 'rgba(248,113,113,0.18)' },
];

const actions = [
    { label: 'Manage Contests', desc: 'Create, edit, and manage monthly photo contests', Icon: Trophy, path: '/admin/contests' },
    { label: 'Submissions', desc: 'Review and moderate submitted photos', Icon: FileBarChart, path: '/admin/submissions' },
    { label: 'Users', desc: 'View registered users and their submissions', Icon: Users, path: '/admin/users' },
    { label: 'Ban List', desc: 'Manage banned Discord IDs', Icon: ShieldBan, path: '/admin/bans' },
];

/* ── Glassmorphism stat card ─────────────────────────── */
function StatCard({ s }: { s: typeof stats[0] }) {
    const [hov, setHov] = useState(false);

    return (
        <motion.div
            variants={fadeUp}
            onHoverStart={() => setHov(true)}
            onHoverEnd={() => setHov(false)}
            style={{
                position: 'relative',
                borderRadius: 16,
                padding: 20,
                overflow: 'hidden',
                cursor: 'default',
                background: hov
                    ? `radial-gradient(circle at 50% -20%, ${s.glow} 0%, rgba(255,255,255,0.025) 65%)`
                    : 'rgba(255,255,255,0.025)',
                border: `1px solid ${hov ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}`,
                boxShadow: hov
                    ? `0 0 48px ${s.glow}, 0 24px 48px rgba(0,0,0,0.5)`
                    : '0 8px 32px rgba(0,0,0,0.4)',
                transition: 'background 0.3s, border 0.3s, box-shadow 0.3s',
            }}
        >
            {/* label + icon */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.09em', textTransform: 'uppercase', color: '#52525B' }}>
                    {s.label}
                </span>
                <div style={{
                    width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: s.glow, border: `1px solid ${s.color}30`,
                }}>
                    <s.Icon style={{ width: 16, height: 16, color: s.color }} />
                </div>
            </div>

            {/* value */}
            <div style={{ fontSize: 40, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>

            {/* hover bottom bar */}
            <motion.div
                style={{
                    position: 'absolute', bottom: 0, left: 0, height: 2, borderRadius: 999,
                    background: `linear-gradient(90deg, ${s.color}, transparent)`,
                }}
                animate={{ width: hov ? '55%' : '0%' }}
                transition={{ duration: 0.4, ease }}
            />
        </motion.div>
    );
}

/* ── Quick action card ───────────────────────────────── */
function ActionCard({ a }: { a: typeof actions[0] }) {
    const [hov, setHov] = useState(false);

    return (
        <motion.div variants={fadeUp}>
            <Link to={a.path} style={{ textDecoration: 'none', display: 'block' }}>
                <motion.div
                    onHoverStart={() => setHov(true)}
                    onHoverEnd={() => setHov(false)}
                    whileHover={{ y: -4 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    style={{
                        display: 'flex', alignItems: 'center', gap: 16,
                        padding: '18px 20px', borderRadius: 16,
                        background: hov ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.025)',
                        border: `1px solid ${hov ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)'}`,
                        boxShadow: hov ? '0 12px 36px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.3)',
                        transition: 'background 0.2s, border 0.2s, box-shadow 0.2s',
                        cursor: 'pointer',
                    }}
                >
                    {/* icon */}
                    <div style={{
                        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: hov ? 'rgba(232,117,10,0.18)' : 'rgba(232,117,10,0.10)',
                        border: `1px solid ${hov ? 'rgba(232,117,10,0.28)' : 'rgba(232,117,10,0.14)'}`,
                        transition: 'all 0.2s',
                    }}>
                        <a.Icon style={{ width: 20, height: 20, color: '#E8750A' }} />
                    </div>

                    {/* text */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: '#FAFAFA', marginBottom: 3 }}>{a.label}</div>
                        <div style={{ fontSize: 12, color: '#52525B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {a.desc}
                        </div>
                    </div>

                    {/* arrow */}
                    <motion.div animate={{ x: hov ? 3 : 0 }} transition={{ duration: 0.2 }}>
                        <ArrowRight style={{ width: 16, height: 16, color: hov ? '#E8750A' : '#52525B', flexShrink: 0, transition: 'color 0.2s' }} />
                    </motion.div>
                </motion.div>
            </Link>
        </motion.div>
    );
}

/* ── Page ────────────────────────────────────────────── */
export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <motion.div variants={container} initial="hidden" animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: 36, maxWidth: 960 }}
        >
            {/* Header */}
            <motion.div variants={fadeUp}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <Activity style={{ width: 14, height: 14, color: '#E8750A' }} />
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#52525B' }}>
                        Dashboard
                    </span>
                </div>

                <h1 style={{ fontSize: 32, fontWeight: 800, lineHeight: 1.1, color: '#FAFAFA', marginBottom: 8 }}>
                    Welcome back,{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #FF8C1A 0%, #E8750A 60%, #FF5500 100%)',
                        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    }}>
                        {user?.username ?? '...'}
                    </span>
                </h1>

                <p style={{ fontSize: 14, color: '#71717A', lineHeight: 1.6 }}>
                    Manage photo contests, moderate submissions, and oversee the community.
                </p>
            </motion.div>

            {/* Divider */}
            <motion.div variants={fadeUp}
                style={{ height: 1, background: 'linear-gradient(90deg, rgba(232,117,10,0.3), rgba(255,255,255,0.04), transparent)' }}
            />

            {/* Stats row */}
            <motion.div variants={fadeUp}
                className="stat-grid"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
            >
                {/* Inline responsive via style tag */}
                <style>{`
                    @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr) !important; } }
                    @media (max-width: 480px) { .stat-grid { grid-template-columns: repeat(1, 1fr) !important; } }
                    @media (max-width: 900px) { .action-grid { grid-template-columns: repeat(1, 1fr) !important; } }
                `}</style>
                {stats.map(s => <StatCard key={s.label} s={s} />)}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeUp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Section header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 3, height: 18, background: '#E8750A', borderRadius: 999 }} />
                    <h2 style={{ fontSize: 15, fontWeight: 700, color: '#FAFAFA' }}>Quick Actions</h2>
                </div>

                {/* 2-col grid */}
                <div className="action-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
                    {actions.map(a => <ActionCard key={a.path} a={a} />)}
                </div>
            </motion.div>
        </motion.div>
    );
}
