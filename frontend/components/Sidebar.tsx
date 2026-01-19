"use client";
import Link from 'next/image';
import NextLink from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { calendarService } from '@/services/calendarService';
import { useAppSelector } from '@/store/hooks';
import { useLanguage } from '@/context/LanguageContext';
import { useUI } from '@/context/UIContext';
import { useQuery } from '@tanstack/react-query';

export default function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();
    const { isSidebarOpen, setSidebarOpen } = useUI();
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Fetch alerts for badge using TanStack Query
    // It's much cleaner than useEffect + setInterval
    const { data: events } = useQuery({
        queryKey: ['calendar-events-count'],
        queryFn: () => calendarService.getAllEvents(),
        enabled: mounted && !!user, // Only fetch if user is logged in
        refetchInterval: 60000, // Refresh every minute
        staleTime: 30000,
    });

    const todayCount = events ? (() => {
        const today = new Date();
        const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        return events.filter(e => e.date === todayStr).length;
    })() : 0;

    // Initial check for mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close sidebar on mobile after navigation
    useEffect(() => {
        if (isMobile) {
            setSidebarOpen(false);
        }
    }, [pathname, isMobile, setSidebarOpen]);

    const getLinkClasses = (path: string) => {
        const isActive = path === "/dashboard" ? pathname === "/dashboard" : pathname?.startsWith(path);
        const baseClasses = "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden";
        const activeClasses = "bg-primary/10 text-primary border border-primary/20 font-bold shadow-lg shadow-primary/5";
        const inactiveClasses = "text-text-muted hover:text-text-main hover:bg-surface-hover font-medium";

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    if (!mounted) return null;

    return (
        <>
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside className={`
                fixed lg:relative z-50
                h-full flex flex-col 
                bg-background-main border-r border-border-main
                transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full lg:translate-x-0 w-80'}
            `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-border-main">
                    <NextLink href="/" className="flex items-center gap-3 group/logo w-full">
                        <div className="relative size-10 shrink-0 bg-slate-900 rounded-lg p-1 border border-white/5 transition-transform group-hover/logo:scale-105">
                            <Image src="/ApplyFollowLogo.png" alt="ApplyFollow" fill className="object-contain" priority />
                        </div>
                        <h1 className="text-xl font-black text-text-main tracking-tighter animate-in fade-in slide-in-from-left-2 transition-all group-hover/logo:text-primary">
                            Apply<span className="text-primary font-black">Follow</span>
                        </h1>
                    </NextLink>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-8 flex flex-col gap-2.5 px-4 scrollbar-hide">
                    <NextLink href="/dashboard" className={getLinkClasses("/dashboard")}>
                        <span className="material-symbols-outlined text-[24px]">grid_view</span>
                        <span className="whitespace-nowrap transition-all">{t('sidebar.overview')}</span>
                        {pathname === "/dashboard" && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                    </NextLink>

                    <NextLink href="/applications" className={getLinkClasses("/applications")}>
                        <span className="material-symbols-outlined text-[24px]">work</span>
                        <span className="whitespace-nowrap">{t('sidebar.applications')}</span>
                        {pathname?.startsWith("/applications") && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                    </NextLink>

                    <NextLink href="/calendar" className={getLinkClasses("/calendar")}>
                        <span className="material-symbols-outlined text-[24px]">event</span>
                        <div className="flex items-center justify-between w-full">
                            <span className="whitespace-nowrap">{t('sidebar.schedule')}</span>
                            {todayCount > 0 && (
                                <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full ring-1 ring-primary/30">
                                    {todayCount}
                                </span>
                            )}
                        </div>
                        {pathname?.startsWith("/calendar") && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                    </NextLink>

                    <NextLink href="/my-cv" className={getLinkClasses("/my-cv")}>
                        <span className="material-symbols-outlined text-[24px]">description</span>
                        <span className="whitespace-nowrap">{t('sidebar.cvBuilder')}</span>
                        {pathname?.startsWith("/my-cv") && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                    </NextLink>

                    {/* Section Spacer / Label */}
                    <div className="mt-8 mb-2 px-3">
                        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('sidebar.management')}</p>
                    </div>

                    <NextLink href="/profile" className={getLinkClasses("/profile")}>
                        <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
                        <span className="whitespace-nowrap">{t('sidebar.settings')}</span>
                    </NextLink>

                    {/* Admin Section */}
                    {user?.role === 'ADMIN' && (
                        <>
                            <div className="mt-8 mb-2 px-3">
                                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t('sidebar.adminPanel')}</p>
                            </div>

                            <NextLink href="/admin/users" className={getLinkClasses("/admin/users")}>
                                <span className="material-symbols-outlined text-[24px]">group</span>
                                <span className="whitespace-nowrap">{t('sidebar.users')}</span>
                                {pathname?.startsWith("/admin/users") && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                            </NextLink>

                            <NextLink href="/admin/messages" className={getLinkClasses("/admin/messages")}>
                                <span className="material-symbols-outlined text-[24px]">forum</span>
                                <span className="whitespace-nowrap">{t('sidebar.messages')}</span>
                                {pathname?.startsWith("/admin/messages") && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                            </NextLink>
                        </>
                    )}
                </nav>

                {/* Bottom Section */}
                <div className="px-4 py-8 border-t border-border-main scrollbar-hide">
                    <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                        <p className="text-[10px] font-bold text-primary uppercase mb-1">{t('sidebar.upgradePlan')}</p>
                        <p className="text-xs text-text-muted mb-3 leading-snug">{t('sidebar.proVersion')}</p>
                        <button className="w-full py-2 bg-primary text-black text-xs font-black rounded-lg hover:bg-primary-dark transition-colors">
                            {t('sidebar.proButton')}
                        </button>
                    </div>
                </div>
            </aside>
        </>
    );
}
