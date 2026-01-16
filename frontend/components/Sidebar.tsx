"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { calendarService } from '@/services/calendarService';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setSidebarOpen } from '@/store/features/ui/uiSlice';
import { useLanguage } from '@/context/LanguageContext';

export default function Sidebar() {
    const pathname = usePathname();
    const dispatch = useAppDispatch();
    const { t } = useLanguage();
    const isSidebarOpen = useAppSelector((state) => state.ui.isSidebarOpen);
    const { user } = useAppSelector((state) => state.auth);
    const [todayCount, setTodayCount] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Initial check for mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch alerts for badge
    useEffect(() => {
        const fetchCount = async () => {
            try {
                const events = await calendarService.getAllEvents();
                const today = new Date();
                const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                const count = events.filter(e => e.date === todayStr).length;
                setTodayCount(count);
            } catch (error) {
                console.error("Failed to fetch sidebar counts", error);
            }
        };
        fetchCount();
        const interval = setInterval(fetchCount, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close sidebar on mobile after navigation
    useEffect(() => {
        if (isMobile) { // lg breakpoint
            dispatch(setSidebarOpen(false));
        }
    }, [pathname, dispatch, isMobile]);

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
                    onClick={() => dispatch(setSidebarOpen(false))}
                />
            )}

            <aside className={`
                fixed lg:relative z-50
                h-full flex flex-col 
                bg-background-main border-r border-border-main
                transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 w-72 lg:w-24'}
            `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-6 border-b border-border-main">
                    <Link href="/" className="flex items-center gap-3 group/logo w-full">
                        <div className="relative size-10 shrink-0 bg-slate-900 rounded-lg p-1 border border-white/5 transition-transform group-hover/logo:scale-105">
                            <Image src="/ApplyFollowLogo.png" alt="ApplyFollow" fill className="object-contain" priority />
                        </div>
                        {(isSidebarOpen || isMobile) && (
                            <h1 className="text-xl font-black text-text-main tracking-tighter animate-in fade-in slide-in-from-left-2 transition-all group-hover/logo:text-primary">
                                Apply<span className="text-primary font-black">Follow</span>
                            </h1>
                        )}
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-8 flex flex-col gap-2.5 px-4 scrollbar-hide">
                    <Link href="/dashboard" className={getLinkClasses("/dashboard")}>
                        <span className="material-symbols-outlined text-[24px]">grid_view</span>
                        {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap transition-all">{t('sidebar.overview')}</span>}
                        {pathname === "/dashboard" && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                    </Link>

                    <Link href="/applications" className={getLinkClasses("/applications")}>
                        <span className="material-symbols-outlined text-[24px]">work</span>
                        {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap">{t('sidebar.applications')}</span>}
                        {pathname?.startsWith("/applications") && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                    </Link>

                    <Link href="/calendar" className={getLinkClasses("/calendar")}>
                        <span className="material-symbols-outlined text-[24px]">event</span>
                        {(isSidebarOpen || isMobile) && (
                            <div className="flex items-center justify-between w-full">
                                <span className="whitespace-nowrap">{t('sidebar.schedule')}</span>
                                {todayCount > 0 && (
                                    <span className="bg-primary/20 text-primary text-[10px] font-black px-2 py-0.5 rounded-full ring-1 ring-primary/30">
                                        {todayCount}
                                    </span>
                                )}
                            </div>
                        )}
                        {pathname?.startsWith("/calendar") && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                    </Link>

                    <Link href="/my-cv" className={getLinkClasses("/my-cv")}>
                        <span className="material-symbols-outlined text-[24px]">description</span>
                        {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap">{t('sidebar.cvBuilder')}</span>}
                        {pathname?.startsWith("/my-cv") && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                    </Link>

                    {/* Section Spacer / Label */}
                    <div className={`mt-8 mb-2 px-3 ${(isSidebarOpen || isMobile) ? '' : 'flex justify-center'}`}>
                        <div className={`h-px bg-border-main w-full ${(isSidebarOpen || isMobile) ? 'hidden' : 'block'}`}></div>
                        {(isSidebarOpen || isMobile) && (
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">{t('sidebar.management')}</p>
                        )}
                    </div>

                    <Link href="/profile" className={getLinkClasses("/profile")}>
                        <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
                        {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap">{t('sidebar.settings')}</span>}
                    </Link>

                    {/* Admin Section */}
                    {user?.role === 'ADMIN' && (
                        <>
                            <div className={`mt-8 mb-2 px-3 ${(isSidebarOpen || isMobile) ? '' : 'flex justify-center'}`}>
                                <div className={`h-px bg-border-main w-full ${(isSidebarOpen || isMobile) ? 'hidden' : 'block'}`}></div>
                                {(isSidebarOpen || isMobile) && (
                                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{t('sidebar.adminPanel')}</p>
                                )}
                            </div>

                            <Link href="/admin/users" className={getLinkClasses("/admin/users")}>
                                <span className="material-symbols-outlined text-[24px]">group</span>
                                {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap">{t('sidebar.users')}</span>}
                                {pathname?.startsWith("/admin/users") && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                            </Link>

                            <Link href="/admin/messages" className={getLinkClasses("/admin/messages")}>
                                <span className="material-symbols-outlined text-[24px]">forum</span>
                                {(isSidebarOpen || isMobile) && <span className="whitespace-nowrap">{t('sidebar.messages')}</span>}
                                {pathname?.startsWith("/admin/messages") && <span className="absolute left-0 w-1 h-6 bg-primary rounded-full"></span>}
                            </Link>
                        </>
                    )}
                </nav>

                {/* Bottom Section */}
                <div className="px-4 py-8 border-t border-border-main scrollbar-hide">
                    {(isSidebarOpen || isMobile) && (
                        <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                            <p className="text-[10px] font-bold text-primary uppercase mb-1">{t('sidebar.upgradePlan')}</p>
                            <p className="text-xs text-text-muted mb-3 leading-snug">{t('sidebar.proVersion')}</p>
                            <button className="w-full py-2 bg-primary text-black text-xs font-black rounded-lg hover:bg-primary-dark transition-colors">
                                {t('sidebar.proButton')}
                            </button>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}
