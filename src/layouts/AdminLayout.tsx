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
import { motion, AnimatePresence } from 'framer-motion';

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

    const SidebarContent = () => (
        <>
            {/* Logo */}
            <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.05]">
                <Link to="/admin" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-orange to-[#FF6B00] flex items-center justify-center font-heading font-bold text-white text-xs shadow-[0_2px_8px_rgba(232,117,10,0.4)]">
                        V
                    </div>
                    <div className="leading-tight">
                        <div className="font-heading font-bold text-[13px] tracking-wide text-text-primary">VITAL RP</div>
                        <div className="text-[10px] text-text-muted tracking-wider">Admin Panel</div>
                    </div>
                </Link>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                <div className="px-2 pb-2 pt-1">
                    <span className="text-[10px] font-semibold tracking-widest text-text-muted uppercase">Navigation</span>
                </div>
                {sidebarLinks.map((link) => {
                    const active = isActive(link.path, link.exact);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setSidebarOpen(false)}
                            className={cn(
                                'relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group',
                                active
                                    ? 'text-accent-orange'
                                    : 'text-text-muted hover:text-text-secondary'
                            )}
                        >
                            {active && (
                                <motion.div
                                    layoutId="admin-nav-active"
                                    className="absolute inset-0 bg-accent-orange/[0.08] border border-accent-orange/[0.15] rounded-xl"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                            {!active && (
                                <div className="absolute inset-0 rounded-xl bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-200" />
                            )}
                            <link.icon className="relative z-10 w-4 h-4 flex-shrink-0" />
                            <span className="relative z-10">{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="border-t border-white/[0.05]">
                {user && (
                    <div className="flex items-center gap-3 px-5 py-4">
                        <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="w-8 h-8 rounded-full ring-1 ring-white/10 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-[13px] font-medium text-text-primary truncate">{user.username}</p>
                            <p className="text-[10px] text-accent-orange font-semibold tracking-wider uppercase">Administrator</p>
                        </div>
                    </div>
                )}
                <Link
                    to="/"
                    className="flex items-center gap-2.5 px-5 py-3.5 border-t border-white/[0.04] text-text-muted hover:text-text-secondary hover:bg-white/[0.03] transition-all duration-200 text-[12px] font-medium"
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back to Site
                </Link>
            </div>
        </>
    );

    return (
        <div className="min-h-screen bg-[#09090B] flex">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-40 w-60 flex-col bg-[#0C0C0E] border-r border-white/[0.05]">
                <SidebarContent />
            </aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col md:hidden bg-[#0C0C0E] border-r border-white/[0.05]"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="flex-1 md:ml-60">
                {/* Mobile Top Bar */}
                <div className="md:hidden h-14 bg-[#0C0C0E] border-b border-white/[0.05] flex items-center gap-3 px-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-xl text-text-muted hover:text-text-primary hover:bg-white/[0.04] transition-all"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="w-5 h-5 rounded bg-gradient-to-br from-accent-orange to-[#FF6B00] flex items-center justify-center font-heading font-bold text-white text-[9px]">
                        V
                    </div>
                    <span className="font-heading font-bold text-[13px] tracking-wide text-text-primary">ADMIN PANEL</span>
                </div>

                {/* Page Content */}
                <main className="p-5 sm:p-6 lg:p-8 min-h-screen">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
