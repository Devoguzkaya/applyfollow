"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { MdWbSunny, MdDarkMode } from 'react-icons/md';
import { useAppSelector } from '@/store/hooks';

interface NavbarProps {
    isAuthPage?: boolean;
}

export default function Navbar({ isAuthPage = false }: NavbarProps) {
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const [scrolled, setScrolled] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { isAuthenticated } = useAppSelector((state) => state.auth);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogoClick = (e: React.MouseEvent) => {
        if (window.location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled || isAuthPage ? 'bg-surface-card/80 backdrop-blur-md border-b border-border-main py-4' : 'bg-transparent py-6'}`}>
            <div className="w-full px-8 md:px-16 lg:px-24 flex items-center justify-between">
                <Link href="/" onClick={handleLogoClick} className="flex items-center gap-3 group/logo">
                    <div className="relative size-10 md:size-12 shrink-0 bg-surface-darker rounded-xl p-1 border border-border-main transition-transform group-hover/logo:scale-105">
                        <Image src="/ApplyFollowLogo.png" alt="ApplyFollow" width={48} height={48} className="w-full h-full object-contain" priority />
                    </div>
                    <span className="text-xl md:text-2xl font-display font-black tracking-tight text-text-main group-hover/logo:text-primary transition-colors">
                        ApplyFollow
                    </span>
                </Link>

                {!isAuthPage && (
                    <div className="hidden lg:flex items-center gap-10">
                        {['features', 'how-it-works', 'about', 'contact'].map((item) => (
                            <a key={item} href={`#${item}`} className="text-sm font-bold text-text-muted hover:text-primary transition-colors uppercase tracking-widest">
                                {t(`landing.nav.${item === 'how-it-works' ? 'howItWorks' : item}`)}
                            </a>
                        ))}
                    </div>
                )}

                <div className="flex items-center gap-4">
                    {/* Language Toggle Pill */}
                    <div className="hidden sm:flex bg-surface-hover rounded-xl p-1 border border-border-main transition-colors">
                        <button
                            type="button"
                            onClick={() => setLanguage('tr')}
                            className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${language === 'tr' ? 'bg-primary text-slate-950 shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-main'}`}
                        >
                            TR
                        </button>
                        <button
                            type="button"
                            onClick={() => setLanguage('en')}
                            className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all ${language === 'en' ? 'bg-primary text-slate-950 shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-main'}`}
                        >
                            EN
                        </button>
                    </div>

                    <button
                        type="button"
                        onClick={toggleTheme}
                        className="size-10 flex items-center justify-center rounded-xl bg-surface-hover border border-border-main text-text-main hover:border-primary transition-all active:scale-95 shadow-sm"
                    >
                        {mounted && (theme === 'dark' ? <MdWbSunny className="text-xl text-yellow-500" /> : <MdDarkMode className="text-xl text-indigo-500" />)}
                    </button>

                    {!isAuthPage ? (
                        mounted && isAuthenticated ? (
                            <Link href="/dashboard" className="px-6 py-2.5 rounded-xl bg-primary text-slate-950 text-sm font-black hover:bg-emerald-400 transition-all shadow-glow hover:-translate-y-0.5 active:translate-y-0 text-center uppercase tracking-widest">
                                {t('landing.nav.dashboard') || 'Dashboard'}
                            </Link>
                        ) : (
                            <>
                                <Link href="/login" className="hidden sm:block text-sm font-black text-text-muted hover:text-primary transition-colors uppercase tracking-widest">
                                    {t('landing.nav.login')}
                                </Link>
                                <Link href="/register" className="px-6 py-2.5 rounded-xl bg-primary text-slate-950 text-sm font-black hover:bg-emerald-400 transition-all shadow-glow hover:-translate-y-0.5 active:translate-y-0 text-center uppercase tracking-widest">
                                    {t('landing.nav.signup')}
                                </Link>
                            </>
                        )
                    ) : (
                        <Link href="/" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-darker border border-border-main text-xs font-black text-text-muted hover:text-primary hover:border-primary transition-all uppercase tracking-widest group">
                            <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                            {t('common.actions.back')}
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
