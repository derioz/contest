import { useAuth } from '@/contexts/AuthContext';
import Badge from '@/components/ui/Badge';
import {
    Trophy,
    FileBarChart,
    Users,
    ShieldBan,
    ArrowRight,
    Activity,
    BarChart3,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

const stagger = {
    container: { animate: { transition: { staggerChildren: 0.06 } } },
    item: {
        initial: { opacity: 0, y: 16 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } },
    },
};

const stats = [
    { label: 'Active Contests', value: '—', icon: Trophy, color: 'text-accent-orange', glow: 'rgba(232,117,10,0.12)' },
    { label: 'Total Submissions', value: '—', icon: BarChart3, color: 'text-green-400', glow: 'rgba(34,197,94,0.12)' },
    { label: 'Registered Users', value: '—', icon: Users, color: 'text-blue-400', glow: 'rgba(96,165,250,0.12)' },
    { label: 'Banned Users', value: '—', icon: ShieldBan, color: 'text-red-400', glow: 'rgba(248,113,113,0.12)' },
];

const quickLinks = [
    {
        label: 'Manage Contests',
        description: 'Create, edit, and manage monthly photo contests',
        icon: Trophy,
        path: '/admin/contests',
    },
    {
        label: 'Submissions',
        description: 'Review and moderate submitted photos',
        icon: FileBarChart,
        path: '/admin/submissions',
    },
    {
        label: 'Users',
        description: 'View registered users and their submissions',
        icon: Users,
        path: '/admin/users',
    },
    {
        label: 'Ban List',
        description: 'Manage banned Discord IDs',
        icon: ShieldBan,
        path: '/admin/bans',
    },
];

function StatCard({ stat }: { stat: typeof stats[0] }) {
    const [hovered, setHovered] = useState(false);

    return (
        <motion.div
            variants={stagger.item}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            className="relative rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl cursor-default"
            style={{ boxShadow: hovered ? `0 0 40px ${stat.glow}, 0 20px 50px -12px rgba(0,0,0,0.5)` : '0 20px 50px -12px rgba(0,0,0,0.4)' }}
        >
            {/* Hover glow layer */}
            <motion.div
                className="absolute inset-0 pointer-events-none"
                animate={{ opacity: hovered ? 1 : 0 }}
                transition={{ duration: 0.3 }}
                style={{ background: `radial-gradient(circle at 50% 0%, ${stat.glow} 0%, transparent 70%)` }}
            />

            <div className="relative p-5">
                {/* Icon + label row */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[11px] font-medium tracking-wider uppercase text-text-muted">{stat.label}</p>
                    <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                        <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                </div>

                {/* Value */}
                <motion.p
                    className={`text-4xl font-heading font-bold ${stat.color}`}
                    animate={{ y: hovered ? -2 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {stat.value}
                </motion.p>

                {/* Bottom indicator bar */}
                <motion.div
                    className="absolute bottom-0 left-0 h-[2px] rounded-full"
                    style={{ background: `linear-gradient(90deg, ${stat.glow.replace('0.12', '0.8')}, transparent)` }}
                    animate={{ width: hovered ? '60%' : '0%' }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                />
            </div>
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
            className="space-y-8"
        >
            {/* Header */}
            <motion.div variants={stagger.item} className="flex items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-accent-orange" />
                        <span className="text-[11px] font-medium tracking-widest uppercase text-text-muted">Dashboard</span>
                    </div>
                    <h1 className="heading text-3xl text-text-primary leading-tight">
                        Welcome back,{' '}
                        <span className="text-gradient">{user?.username ?? '...'}</span>
                    </h1>
                    <p className="text-text-muted text-sm mt-1.5">
                        Manage contests, moderate submissions, and oversee the community.
                    </p>
                </div>
                <div className="hidden sm:block shrink-0 px-3 py-1.5 rounded-full bg-accent-orange/10 border border-accent-orange/20 text-accent-orange text-[11px] font-semibold tracking-wide mt-1">
                    Administrator
                </div>
            </motion.div>

            {/* Stat Cards — uitripled GlassmorphismStatisticsCard pattern */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <StatCard key={stat.label} stat={stat} />
                ))}
            </div>

            {/* Quick Actions */}
            <motion.div variants={stagger.item}>
                <h2 className="heading text-base text-text-primary mb-4 flex items-center gap-2">
                    <span className="w-1 h-4 rounded-full bg-accent-orange block" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickLinks.map((link, i) => (
                        <motion.div key={link.path} variants={stagger.item}>
                            <Link to={link.path}>
                                <motion.div
                                    whileHover={{ y: -2 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-colors duration-300 group cursor-pointer"
                                >
                                    <div className="w-11 h-11 rounded-xl bg-accent-orange/8 border border-accent-orange/12 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-orange/15 group-hover:border-accent-orange/25 transition-all duration-300">
                                        <link.icon className="w-5 h-5 text-accent-orange" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-heading font-semibold text-text-primary text-[13px] mb-0.5">
                                            {link.label}
                                        </h3>
                                        <p className="text-text-muted text-[12px] truncate">{link.description}</p>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent-orange group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                                </motion.div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
}
