import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { loginWithDiscord } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { LogOut, Shield, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { user, isAdmin, signOut } = useAuth();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const navLinks = [
        { label: 'Home', path: '/' },
        { label: 'Submit', path: '/submit' },
        { label: 'Vote', path: '/vote' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center font-heading font-bold text-white text-sm
              group-hover:shadow-[0_0_20px_rgba(232,117,10,0.4)] transition-shadow duration-300">
                            V
                        </div>
                        <span className="font-heading font-bold text-lg tracking-wider">
                            <span className="text-text-primary">VITAL</span>
                            <span className="text-accent-orange ml-1">CONTEST</span>
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-heading uppercase tracking-wider transition-all duration-200',
                                    location.pathname === link.path
                                        ? 'text-accent-orange bg-accent-orange-muted'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}

                        {isAdmin && (
                            <Link
                                to="/admin"
                                className={cn(
                                    'px-4 py-2 rounded-lg text-sm font-heading uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5',
                                    location.pathname.startsWith('/admin')
                                        ? 'text-accent-orange bg-accent-orange-muted'
                                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
                                )}
                            >
                                <Shield className="w-3.5 h-3.5" />
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Auth Section */}
                    <div className="hidden md:flex items-center gap-3">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2">
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.username}
                                        className="w-8 h-8 rounded-full border-2 border-border-subtle"
                                    />
                                    <span className="text-sm text-text-secondary font-medium">
                                        {user.username}
                                    </span>
                                </div>
                                <button
                                    onClick={signOut}
                                    className="p-2 rounded-lg text-text-muted hover:text-red-400 hover:bg-bg-surface-hover transition-all duration-200"
                                    title="Sign out"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <Button onClick={loginWithDiscord} size="sm">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 00.031.057 19.9 19.9 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z" />
                                </svg>
                                Login with Discord
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-all"
                    >
                        {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={cn(
                    'md:hidden transition-all duration-300 overflow-hidden border-t border-border-subtle',
                    mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
                )}
            >
                <div className="px-4 py-3 space-y-1 bg-bg-surface">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className={cn(
                                'block px-4 py-2.5 rounded-lg text-sm font-heading uppercase tracking-wider transition-all duration-200',
                                location.pathname === link.path
                                    ? 'text-accent-orange bg-accent-orange-muted'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover'
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}

                    {isAdmin && (
                        <Link
                            to="/admin"
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-heading uppercase tracking-wider text-text-secondary hover:text-text-primary hover:bg-bg-surface-hover transition-all duration-200"
                        >
                            <Shield className="w-3.5 h-3.5" />
                            Admin
                        </Link>
                    )}

                    <div className="pt-2 border-t border-border-subtle">
                        {user ? (
                            <div className="flex items-center justify-between px-4 py-2">
                                <div className="flex items-center gap-2">
                                    <img src={user.avatarUrl} alt={user.username} className="w-7 h-7 rounded-full" />
                                    <span className="text-sm text-text-secondary">{user.username}</span>
                                </div>
                                <button
                                    onClick={() => { signOut(); setMobileMenuOpen(false); }}
                                    className="text-text-muted hover:text-red-400 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="px-4 py-2">
                                <Button onClick={loginWithDiscord} size="sm" className="w-full">
                                    Login with Discord
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
