import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-bg-primary">
            <Navbar />
            {/* Main content with padding for fixed navbar */}
            <main className="pt-16">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="border-t border-border-subtle bg-bg-surface mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded gradient-accent flex items-center justify-center font-heading font-bold text-white text-xs">
                                V
                            </div>
                            <span className="font-heading font-semibold text-sm tracking-wider">
                                <span className="text-text-primary">VITAL</span>
                                <span className="text-accent-orange ml-1">RP</span>
                            </span>
                        </div>
                        <p className="text-text-muted text-xs">
                            &copy; {new Date().getFullYear()} Vital RP — Monthly Photo Contest
                        </p>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://discord.gg/vitalrp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-accent-orange transition-colors text-xs font-heading uppercase tracking-wider"
                            >
                                Discord
                            </a>
                            <a
                                href="https://vitalrp.net"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-accent-orange transition-colors text-xs font-heading uppercase tracking-wider"
                            >
                                Website
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
