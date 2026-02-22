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
                <p className="text-text-secondary mt-2">
                    Manage photo contests, moderate submissions, and oversee the community.
                </p>
            </div>

            {/* Stats Grid placeholder */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Active Contests', value: '—', color: 'text-accent-orange' },
                    { label: 'Total Submissions', value: '—', color: 'text-accent-green' },
                    { label: 'Registered Users', value: '—', color: 'text-blue-400' },
                    { label: 'Banned Users', value: '—', color: 'text-red-400' },
                ].map((stat) => (
                    <Card key={stat.label} padding="md">
                        <p className="text-text-muted text-xs font-heading uppercase tracking-wider mb-1">
                            {stat.label}
                        </p>
                        <p className={`text-3xl font-heading font-bold ${stat.color}`}>
                            {stat.value}
                        </p>
                    </Card>
                ))}
            </div>

            {/* Quick Links */}
            <div>
                <h2 className="heading text-lg text-text-primary mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickLinks.map((link) => (
                        <Link key={link.path} to={link.path}>
                            <Card variant="interactive" className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-xl bg-accent-orange-muted flex items-center justify-center flex-shrink-0 group-hover:bg-accent-orange/20 transition-colors">
                                    <link.icon className="w-6 h-6 text-accent-orange" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <h3 className="font-heading font-semibold text-text-primary uppercase tracking-wider text-sm">
                                            {link.label}
                                        </h3>
                                        <Badge variant="default">{link.badge}</Badge>
                                    </div>
                                    <p className="text-text-muted text-xs truncate">{link.description}</p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent-orange group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
