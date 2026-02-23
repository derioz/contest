import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
    LayoutDashboard, Trophy, Users, ShieldBan,
    FileBarChart, ChevronLeft, Menu, X,
} from 'lucide-react';
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

    const SidebarInner = () => (
        <div className="flex flex-col h-full">
            {/* Logo Header */}
            <div
                className="h-16 flex items-center justify-between px-5 flex-shrink-0"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
                <Link to="/admin" className="flex items-center gap-2.5 group" onClick={() => setSidebarOpen(false)}>
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-sm"
                        style={{
                            background: 'linear-gradient(135deg, #E8750A 0%, #FF6B00 100%)',
                            boxShadow: '0 4px 14px rgba(232,117,10,0.4)',
                        }}
                    >
                        V
                    </div>
                    <div className="leading-tight">
                        <div className="font-bold text-xs tracking-widest text-white uppercase">Vital RP</div>
                        <div className="text-[10px] tracking-wider" style={{ color: '#52525B' }}>Admin Panel</div>
                    </div>
                </Link>
                <button
                    onClick={() => setSidebarOpen(false)}
                    className="md:hidden p-1.5 rounded-lg transition-all"
                    style={{ color: '#52525B' }}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
                <div className="px-3 pb-3">
                    <span className="text-[10px] font-semibold tracking-widest uppercase" style={{ color: '#3F3F46' }}>
                        Navigation
                    </span>
                </div>
                {sidebarLinks.map((link) => {
                    const active = isActive(link.path, link.exact);
                    return (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setSidebarOpen(false)}
                            className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group"
                            style={{
                                color: active ? '#E8750A' : '#71717A',
                                background: active ? 'rgba(232,117,10,0.08)' : 'transparent',
                                border: active ? '1px solid rgba(232,117,10,0.15)' : '1px solid transparent',
                            }}
                            onMouseEnter={e => {
                                if (!active) (e.currentTarget as HTMLElement).style.color = '#A1A1AA';
                                if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                            }}
                            onMouseLeave={e => {
                                if (!active) (e.currentTarget as HTMLElement).style.color = '#71717A';
                                if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent';
                            }}
                        >
                            <link.icon className="w-4 h-4 flex-shrink-0" />
                            <span>{link.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {user && (
                    <div className="flex items-center gap-3 px-5 py-4">
                        <img
                            src={user.avatarUrl}
                            alt={user.username}
                            className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate" style={{ color: '#FAFAFA' }}>{user.username}</p>
                            <p className="text-[10px] font-semibold tracking-wider uppercase" style={{ color: '#E8750A' }}>
                                Administrator
                            </p>
                        </div>
                    </div>
                )}
                <Link
                    to="/"
                    className="flex items-center gap-2.5 px-5 py-3.5 text-xs font-medium transition-all duration-200"
                    style={{ borderTop: '1px solid rgba(255,255,255,0.04)', color: '#52525B' }}
                    onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.color = '#A1A1AA';
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                    }}
                    onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.color = '#52525B';
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Back to Site
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen flex" style={{ backgroundColor: '#09090B' }}>
            {/* Desktop Sidebar */}
            <aside
                className="hidden md:flex fixed inset-y-0 left-0 z-40 w-60 flex-col"
                style={{
                    backgroundColor: '#0C0C0E',
                    borderRight: '1px solid rgba(255,255,255,0.06)',
                }}
            >
                <SidebarInner />
            </aside>

            {/* Mobile overlay + drawer */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="fixed inset-0 z-40 md:hidden"
                            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                            onClick={() => setSidebarOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col md:hidden"
                            style={{ backgroundColor: '#0C0C0E', borderRight: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <SidebarInner />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main */}
            <div className="flex-1 md:ml-60">
                {/* Mobile topbar */}
                <div
                    className="md:hidden h-14 flex items-center gap-3 px-4"
                    style={{ backgroundColor: '#0C0C0E', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 rounded-xl transition-all"
                        style={{ color: '#71717A' }}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div
                        className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-white text-[10px]"
                        style={{ background: 'linear-gradient(135deg, #E8750A, #FF6B00)' }}
                    >
                        V
                    </div>
                    <span className="font-bold text-sm tracking-wide" style={{ color: '#FAFAFA' }}>ADMIN PANEL</span>
                </div>

                <main className="p-5 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
