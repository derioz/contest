import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { LayoutDashboard, Trophy, Users, ShieldBan, FileBarChart, ChevronLeft, Menu } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SIDEBAR_W = 240;

const navLinks = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Contests', path: '/admin/contests', icon: Trophy },
    { label: 'Submissions', path: '/admin/submissions', icon: FileBarChart },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Ban List', path: '/admin/bans', icon: ShieldBan },
];

const S = {
    sidebar: {
        position: 'fixed' as const,
        top: 0, left: 0, bottom: 0,
        width: SIDEBAR_W,
        display: 'flex',
        flexDirection: 'column' as const,
        backgroundColor: '#0D0D0F',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        zIndex: 40,
        overflowY: 'auto' as const,
    },
    logoArea: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '0 20px',
        height: 64,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
    },
    logoIcon: {
        width: 32, height: 32,
        borderRadius: 10,
        background: 'linear-gradient(135deg, #E8750A 0%, #FF5500 100%)',
        boxShadow: '0 4px 16px rgba(232,117,10,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 800,
        fontSize: 14,
        color: '#fff',
        flexShrink: 0,
    },
    logoText: {
        display: 'flex',
        flexDirection: 'column' as const,
        lineHeight: 1.2,
    },
    navSection: {
        flex: 1,
        padding: '16px 12px 0',
        overflowY: 'auto' as const,
    },
    navLabel: {
        fontSize: 10,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: '#3F3F46',
        padding: '0 12px',
        marginBottom: 6,
    },
    footer: {
        borderTop: '1px solid rgba(255,255,255,0.06)',
        flexShrink: 0,
    },
    userRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '14px 20px',
    },
    avatar: {
        width: 32, height: 32,
        borderRadius: '50%',
        flexShrink: 0,
        border: '1.5px solid rgba(255,255,255,0.12)',
    },
    backLink: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '12px 20px',
        fontSize: 12,
        color: '#52525B',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        textDecoration: 'none',
        transition: 'color 0.15s',
        cursor: 'pointer',
    },
};

function NavLink({ link, location, onClose }: { link: typeof navLinks[0], location: { pathname: string }, onClose: () => void }) {
    const active = link.exact ? location.pathname === link.path : location.pathname.startsWith(link.path);
    const [hovered, setHovered] = useState(false);

    return (
        <Link
            to={link.path}
            onClick={onClose}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                color: active ? '#E8750A' : hovered ? '#A1A1AA' : '#71717A',
                backgroundColor: active ? 'rgba(232,117,10,0.1)' : hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
                border: `1px solid ${active ? 'rgba(232,117,10,0.18)' : 'transparent'}`,
                textDecoration: 'none',
                marginBottom: 2,
                transition: 'all 0.15s',
            }}
        >
            <link.icon style={{ width: 16, height: 16, flexShrink: 0 }} />
            <span>{link.label}</span>
        </Link>
    );
}

function Sidebar({ location, onClose }: { location: { pathname: string }, onClose: () => void }) {
    const { user } = useAuth();
    return (
        <div style={S.sidebar}>
            {/* Logo */}
            <div style={S.logoArea}>
                <div style={S.logoIcon}>V</div>
                <div style={S.logoText}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#FAFAFA', letterSpacing: '0.05em' }}>VITAL RP</span>
                    <span style={{ fontSize: 10, color: '#52525B', letterSpacing: '0.06em' }}>Admin Panel</span>
                </div>
            </div>

            {/* Nav */}
            <div style={S.navSection}>
                <div style={S.navLabel}>Navigation</div>
                {navLinks.map(link => <NavLink key={link.path} link={link} location={location} onClose={onClose} />)}
            </div>

            {/* User + Back */}
            <div style={S.footer}>
                {user && (
                    <div style={S.userRow}>
                        <img src={user.avatarUrl} alt={user.username} style={S.avatar} />
                        <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#FAFAFA', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user.username}
                            </div>
                            <div style={{ fontSize: 10, color: '#E8750A', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                                Administrator
                            </div>
                        </div>
                    </div>
                )}
                <Link to="/" style={S.backLink}>
                    <ChevronLeft style={{ width: 14, height: 14 }} />
                    Back to Site
                </Link>
            </div>
        </div>
    );
}

export default function AdminLayout() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#09090B', display: 'flex' }}>
            {/* Desktop sidebar always visible */}
            <div className="hidden md:block" style={{ width: SIDEBAR_W, flexShrink: 0 }}>
                <Sidebar location={location} onClose={() => { }} />
            </div>

            {/* Mobile sidebar */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.75)', zIndex: 50, backdropFilter: 'blur(4px)' }}
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -SIDEBAR_W }} animate={{ x: 0 }} exit={{ x: -SIDEBAR_W }}
                            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                            style={{ position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 60 }}
                        >
                            <Sidebar location={location} onClose={() => setMobileOpen(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Main */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                {/* Mobile topbar */}
                <div
                    className="flex md:hidden"
                    style={{ height: 56, alignItems: 'center', gap: 12, padding: '0 16px', backgroundColor: '#0D0D0F', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                    <button
                        onClick={() => setMobileOpen(true)}
                        style={{ padding: 8, borderRadius: 8, color: '#71717A', background: 'transparent', border: 'none', cursor: 'pointer' }}
                    >
                        <Menu style={{ width: 20, height: 20 }} />
                    </button>
                    <div style={{ ...S.logoIcon, width: 26, height: 26, borderRadius: 8, fontSize: 11 }}>V</div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#FAFAFA', letterSpacing: '0.05em' }}>ADMIN PANEL</span>
                </div>

                {/* Page */}
                <main style={{ flex: 1, padding: 32, maxWidth: 1200 }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
