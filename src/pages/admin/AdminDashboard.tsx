import { useAuth } from '@/contexts/AuthContext';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import {
    Trophy,
    FileBarChart,
    Users,
    ShieldBan,
    ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    const { user } = useAuth();

    const quickLinks = [
        {
            label: 'Manage Contests',
            description: 'Create, edit, and manage monthly photo contests',
            icon: Trophy,
            path: '/admin/contests',
            badge: 'Phase 2',
        },
        {
            label: 'Submissions',
            description: 'Review and moderate submitted photos',
            icon: FileBarChart,
            path: '/admin/submissions',
            badge: 'Phase 2',
        },
        {
            label: 'Users',
            description: 'View registered users and their submissions',
            icon: Users,
            path: '/admin/users',
            badge: 'Phase 3',
        },
        {
            label: 'Ban List',
            description: 'Manage banned Discord IDs',
            icon: ShieldBan,
            path: '/admin/bans',
            badge: 'Phase 3',
        },
    ];

    return (
        <div className="animate-fade-in space-y-8">
            {/* Welcome Header */}
            <div>
                <h1 className="heading text-3xl text-text-primary">
                    Welcome back, <span className="text-gradient">{user?.username}</span>
                </h1>
                <p className="text-text-muted text-sm mt-2">
                    Manage photo contests, moderate submissions, and oversee the community.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Contests', value: '—', color: 'text-accent-orange' },
                    { label: 'Total Submissions', value: '—', color: 'text-green-400' },
                    { label: 'Registered Users', value: '—', color: 'text-blue-400' },
                    { label: 'Banned Users', value: '—', color: 'text-red-400' },
                ].map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-5">
                        <p className="text-text-muted text-[11px] font-medium tracking-wider uppercase mb-2">
                            {stat.label}
                        </p>
                        <p className={`text-3xl font-heading font-bold ${stat.color}`}>
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Links */}
            <div>
                <h2 className="heading text-lg text-text-primary mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {quickLinks.map((link) => (
                        <Link key={link.path} to={link.path}>
                            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group cursor-pointer">
                                <div className="w-11 h-11 rounded-xl bg-accent-orange/10 border border-accent-orange/15 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-orange/15 transition-colors">
                                    <link.icon className="w-5 h-5 text-accent-orange" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-heading font-semibold text-text-primary text-sm">
                                            {link.label}
                                        </h3>
                                        <Badge>{link.badge}</Badge>
                                    </div>
                                    <p className="text-text-muted text-xs truncate">{link.description}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent-orange group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
