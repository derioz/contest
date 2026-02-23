import { useAuth } from '@/contexts/AuthContext';
import {
    Trophy, FileBarChart, Users, ShieldBan,
    ArrowRight, Activity, BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.07 } } },
    item: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
    },
};

const stats = [
    { label: 'Active Contests', value: '—', icon: Trophy, color: '#E8750A', glow: 'rgba(232,117,10,0.15)' },
    { label: 'Total Submissions', value: '—', icon: BarChart3, color: '#4ade80', glow: 'rgba(74,222,128,0.15)' },
    { label: 'Registered Users', value: '—', icon: Users, color: '#60a5fa', glow: 'rgba(96,165,250,0.15)' },
    { label: 'Banned Users', value: '—', icon: ShieldBan, color: '#f87171', glow: 'rgba(248,113,113,0.15)' },
];

const quickLinks = [
    { label: 'Manage Contests', description: 'Create, edit, and manage monthly photo contests', icon: Trophy, path: '/admin/contests' },
    { label: 'Submissions', description: 'Review and moderate submitted photos', icon: FileBarChart, path: '/admin/submissions' },
    { label: 'Users', description: 'View registered users and their submissions', icon: Users, path: '/admin/users' },
    { label: 'Ban List', description: 'Manage banned Discord IDs', icon: ShieldBan, path: '/admin/bans' },
];

function StatCard({ stat }: { stat: typeof stats[0] }) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            variants={stagger.item}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            style={{
                background: hovered
                    ? `radial-gradient(circle at 50% 0%, ${stat.glow} 0%, rgba(255,255,255,0.02) 70%)`
                    : 'rgba(255,255,255,0.02)',
                border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
                borderRadius: '16px',
                padding: '20px',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default',
                boxShadow: hovered
                    ? `0 0 40px ${stat.glow}, 0 20px 50px -12px rgba(0,0,0,0.6)`
                    : '0 4px 24px rgba(0,0,0,0.4)',
                transition: 'all 0.3s ease',
            }}
        >
            {/* Icon + Label */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#52525B' }}>
                    {stat.label}
                </span>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: `${stat.glow}`,
                    border: `1px solid ${stat.color}22`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <stat.icon style={{ width: '15px', height: '15px', color: stat.color }} />
                </div>
            </div>

            {/* Big number */}
            <div style={{ fontSize: '38px', fontWeight: 800, color: stat.color, lineHeight: 1, marginBottom: '4px' }}>
                {stat.value}
            </div>

            {/* Animated bottom line */}
            <motion.div
                style={{
                    position: 'absolute', bottom: 0, left: 0, height: '2px',
                    background: `linear-gradient(90deg, ${stat.color}, transparent)`,
                    borderRadius: '999px',
                }}
                animate={{ width: hovered ? '60%' : '0%' }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
            />
        </motion.div>
    );
}

export default function AdminDashboard() {
    const { user } = useAuth();

    return (
        <motion.div
            variants={stagger.container}
            initial="initial"
            animate="animate"
            style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
            {/* Header */}
            <motion.div variants={stagger.item}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <Activity style={{ width: '14px', height: '14px', color: '#E8750A' }} />
                    <span style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#52525B' }}>
                        Dashboard
                    </span>
                </div>
                <h1 style={{ fontSize: '30px', fontWeight: 800, color: '#FAFAFA', lineHeight: 1.1, marginBottom: '8px' }}>
                    Welcome back,{' '}
                    <span style={{
                        background: 'linear-gradient(135deg, #FF8C1A 0%, #E8750A 50%, #FF6B00 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {user?.username ?? '...'}
                    </span>
                </h1>
                <p style={{ fontSize: '14px', color: '#52525B' }}>
                    Manage contests, moderate submissions, and oversee the community.
                </p>
            </motion.div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}
                className="stats-grid">
                <style>{`@media(min-width:1024px) { .stats-grid { grid-template-columns: repeat(4, 1fr); } }`}</style>
                {stats.map((stat) => <StatCard key={stat.label} stat={stat} />)}
            </div>

            {/* Quick Actions */}
            <motion.div variants={stagger.item}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '4px', height: '18px', background: '#E8750A', borderRadius: '999px' }} />
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#FAFAFA' }}>Quick Actions</h2>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}
                    className="action-grid">
                    <style>{`@media(min-width:768px) { .action-grid { grid-template-columns: repeat(2, 1fr); } }`}</style>
                    {quickLinks.map((link) => (
                        <motion.div key={link.path} variants={stagger.item}>
                            <Link to={link.path} style={{ textDecoration: 'none' }}>
                                <motion.div
                                    whileHover={{ y: -3 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '16px',
                                        padding: '20px',
                                        borderRadius: '16px',
                                        background: 'rgba(255,255,255,0.02)',
                                        border: '1px solid rgba(255,255,255,0.06)',
                                        cursor: 'pointer',
                                    }}
                                    className="quick-card group"
                                >
                                    {/* Icon */}
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                                        background: 'rgba(232,117,10,0.1)',
                                        border: '1px solid rgba(232,117,10,0.15)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <link.icon style={{ width: '20px', height: '20px', color: '#E8750A' }} />
                                    </div>

                                    {/* Text */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#FAFAFA', marginBottom: '3px' }}>
                                            {link.label}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#52525B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {link.description}
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <ArrowRight style={{ width: '16px', height: '16px', color: '#52525B', flexShrink: 0 }} />
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
