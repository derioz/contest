import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard,
    Trophy,
    Users,
    ShieldBan,
    FileBarChart,
    ChevronLeft,
    Menu,
    X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const sidebarLinks = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Contests', path: '/admin/contests', icon: Trophy },
    { label: 'Submissions', path: '/admin/submissions', icon: FileBarChart },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Ban List', path: '/admin/bans', icon: ShieldBan },
];

export default function AdminLayout() {
    const { user } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const isActive = (path: string, exact?: boolean) => {
        if (exact) return location.pathname === path;
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-bg-primary flex">
            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-bg-surface border-r border-border-subtle flex flex-col',
                    'transform transition-transform duration-300 md:translate-x-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle">
                    <Link to="/admin" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center font-heading font-bold text-white text-sm">
                            V
                        </div>
                        <div>
                            <span className="font-heading font-bold text-sm tracking-wider text-text-primary">
                                ADMIN
                            </span>
                            <p className="text-[10px] text-text-muted font-heading uppercase tracking-wider">
                                Contest Manager
                            </p>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-1 text-text-muted hover:text-text-primary transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 py-4 px-3 space-y-1">
                    {sidebarLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                                isActive(link.path, link.exact)
                                    ? 'bg-accent-orange-muted text-accent-orange'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
                            )}
                        >
                            <link.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="font-heading uppercase tracking-wider text-xs">
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </nav>

                {/* User Info */}
                <div className="p-4 border-t border-border-subtle">
                    <div className="flex items-center gap-3">
                        {user && (
                            <>
                                <img
                                    src={user.avatarUrl}
                                    alt={user.username}
                                    className="w-8 h-8 rounded-full border border-border-subtle"
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium text-text-primary truncate">
                                        {user.username}
                                    </p>
                                    <p className="text-[10px] text-accent-orange font-heading uppercase tracking-wider">
                                        Administrator
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Back to Site */}
                <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-3 border-t border-border-subtle text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-all"
                >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="text-xs font-heading uppercase tracking-wider">
                        Back to Site
                    </span>
                </Link>
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <div className="flex-1 md:ml-64">
                {/* Mobile header */}
                <div className="md:hidden h-14 bg-bg-surface border-b border-border-subtle flex items-center px-4 gap-3">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-heading font-bold text-sm tracking-wider text-text-primary">
                        ADMIN PANEL
                    </span>
                </div>

                <main className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
