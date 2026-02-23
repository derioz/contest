import { Outlet } from 'react-router-dom';
import Navbar from '@/components/Navbar';

export default function PublicLayout() {
    return (
        <div className="min-h-screen">
            <Navbar />
            {/* Main content with spacing for fixed navbar */}
            <main className="pt-16">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="relative border-t border-white/[0.04]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        {/* Logo */}
                        <div className="flex items-center gap-2.5">
                            <div className="w-5 h-5 rounded bg-gradient-to-br from-accent-orange to-[#FF6B00] flex items-center justify-center font-heading font-bold text-white text-[10px]
                                shadow-[0_2px_6px_rgba(232,117,10,0.25)]">
                                V
                            </div>
                            <span className="font-heading font-semibold text-xs tracking-wide">
                                <span className="text-text-secondary">VITAL</span>
                                <span className="text-accent-orange ml-0.5">RP</span>
                            </span>
                        </div>

                        {/* Copyright */}
                        <p className="text-text-muted text-[11px] tracking-wide">
                            &copy; {new Date().getFullYear()} Vital RP — Monthly Photo Contest
                        </p>

                        {/* Links */}
                        <div className="flex items-center gap-6">
                            <a
                                href="https://discord.gg/vitalrp"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-text-secondary transition-colors text-[11px] font-medium tracking-wide"
                            >
                                Discord
                            </a>
                            <a
                                href="https://vitalrp.net"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-text-muted hover:text-text-secondary transition-colors text-[11px] font-medium tracking-wide"
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
