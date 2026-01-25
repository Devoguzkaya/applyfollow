"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/context/NotificationContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, checkAuth } from '@/store/features/auth/authSlice';
import toast from 'react-hot-toast';

import { MdNotifications, MdNotificationsOff, MdPerson, MdExpandMore, MdSettings, MdLogout, MdInfo, MdAlarm, MdMenu } from "react-icons/md";
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useUI } from '@/context/UIContext';

export default function Header() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { t, language, setLanguage } = useLanguage();
    const { theme, toggleTheme } = useTheme();
    const { toggleSidebar } = useUI();

    // Auth State from Redux
    const { user } = useAppSelector((state) => state.auth);

    const [mounted, setMounted] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const { notifications, unreadCount, markAsRead, clearAll } = useNotifications();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        // Redux: Check auth on mount
        dispatch(checkAuth());

        // Handle clicks outside dropdowns
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowProfileMenu(false);
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dispatch]);

    const handleNotificationClick = (id: string, read: boolean) => {
        if (!read) markAsRead(id);
    };

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        router.push('/login');
    };

    return (
        <header className="h-20 border-b border-border-main flex items-center justify-between px-4 sm:px-6 lg:px-10 z-20 bg-background-main sticky top-0 w-full shrink-0 transition-colors">
            {/* Left Side: Hamburger & Brand */}
            <div className="flex items-center gap-3 sm:gap-4">
                {/* Mobile Menu Trigger */}
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden size-10 rounded-xl bg-surface-hover flex items-center justify-center text-text-muted hover:text-text-main transition-all active:scale-95 border border-border-main"
                >
                    <MdMenu className="text-2xl" />
                </button>

                <div className="flex flex-col justify-center">
                    <p className="text-text-muted text-sm font-medium">
                        {t('dashboard.welcome')}, <span className="text-primary font-bold">{(mounted && user?.fullName?.split(' ')[0]) || 'Guest'}</span>
                    </p>
                </div>
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center gap-2 sm:gap-4 relative" ref={dropdownRef}>

                {/* Language Toggle (Desktop) */}
                <div className="hidden md:flex bg-surface-hover rounded-xl p-1 border border-border-main transition-colors">
                    <button
                        onClick={() => setLanguage('tr')}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${language === 'tr' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-main'}`}
                    >
                        TR
                    </button>
                    <button
                        onClick={() => setLanguage('en')}
                        className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${language === 'en' ? 'bg-primary text-black shadow-lg shadow-primary/20' : 'text-text-muted hover:text-text-main'}`}
                    >
                        EN
                    </button>
                </div>

                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="size-10 flex items-center justify-center rounded-xl bg-surface-hover border border-border-main text-text-main hover:border-primary transition-all active:scale-95 shadow-sm"
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>

                {/* Notifications Trigger */}
                <button
                    onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                    className={`size-10 rounded-xl flex items-center justify-center transition-all relative group border border-border-main
                    ${showNotifications ? 'bg-primary/10 text-primary ring-2 ring-primary/20' : 'bg-surface-hover text-text-muted hover:text-text-main hover:bg-surface-hover/80'}
                `}
                >
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full ring-2 ring-surface-card animate-pulse"></span>
                    )}
                    <MdNotifications className="text-[22px] group-hover:scale-110 transition-transform" />
                </button>

                {/* Vertical Divider */}
                <div className="hidden sm:block w-px h-8 bg-border-main mx-1"></div>

                {/* Profile Trigger */}
                <div className="relative">
                    <button
                        onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                        className="flex items-center gap-3 py-1 pl-1 pr-1 sm:pr-4 rounded-full hover:bg-surface-hover border border-transparent hover:border-border-main transition-all group"
                    >
                        <div className="size-10 rounded-full bg-gradient-to-br from-primary to-emerald-700 p-[2px] shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                            <div className="w-full h-full rounded-full bg-surface-card flex items-center justify-center text-text-main font-bold text-sm relative overflow-hidden transition-colors">
                                {mounted && user?.fullName ? user.fullName.charAt(0).toUpperCase() : (
                                    <MdPerson className="text-[20px] text-text-muted" />
                                )}
                            </div>
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-bold text-text-main leading-none mb-0.5">{(mounted && user?.fullName) || 'Guest User'}</p>
                            <p className="text-[10px] text-text-muted font-medium leading-none">View Profile</p>
                        </div>
                        <MdExpandMore className="hidden sm:block text-text-muted group-hover:text-text-main transition-colors text-[20px]" />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {showProfileMenu && (
                        <div className="absolute top-14 right-0 w-72 bg-surface-card border border-border-main rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 z-50 ring-1 ring-black/50 transition-colors">
                            {/* User Info Header */}
                            <div className="p-5 border-b border-border-main bg-gradient-to-r from-background-main to-transparent">
                                <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">{t('profile.signedInAs')}</p>
                                <p className="text-sm font-medium text-text-main truncate font-mono bg-background-main p-2 rounded-lg border border-border-main">
                                    {(mounted && user?.email) || 'guest@example.com'}
                                </p>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2 flex flex-col gap-1">
                                <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text-main hover:bg-surface-hover hover:pl-4 transition-all group">
                                    <div className="p-1.5 rounded-lg bg-background-main text-text-muted group-hover:bg-primary/20 group-hover:text-primary transition-colors border border-border-main">
                                        <MdPerson className="text-[20px]" />
                                    </div>
                                    {t('profile.yourProfile')}
                                </Link>
                                <button onClick={() => toast.success("Settings coming soon!")} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-text-muted hover:text-text-main hover:bg-surface-hover hover:pl-4 transition-all w-full text-left group">
                                    <div className="p-1.5 rounded-lg bg-background-main text-text-muted group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors border border-border-main">
                                        <MdSettings className="text-[20px]" />
                                    </div>
                                    {t('sidebar.settings')}
                                </button>
                            </div>

                            {/* Logout Footer */}
                            <div className="p-2 border-t border-border-main mt-1 bg-red-500/5">
                                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:text-red-400 hover:bg-red-500/10 hover:pl-4 transition-all w-full text-left font-bold group">
                                    <MdLogout className="text-[20px] group-hover:rotate-180 transition-transform duration-300" />
                                    {t('profile.logout')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                    <div className="absolute top-14 right-14 sm:right-16 w-80 sm:w-96 bg-surface-card border border-border-main rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 z-50 ring-1 ring-black/50 transition-colors">
                        <div className="p-4 border-b border-border-main flex items-center justify-between bg-surface-hover/30">
                            <h3 className="font-bold text-text-main text-sm flex items-center gap-2">
                                <MdNotifications className="text-primary text-[20px]" />
                                {t('notifications.title')}
                                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{notifications.length}</span>
                            </h3>
                            {notifications.length > 0 && (
                                <button onClick={clearAll} className="text-xs text-text-muted font-medium hover:text-text-main hover:underline transition-colors">{t('notifications.clearAll')}</button>
                            )}
                        </div>

                        {notifications.length === 0 ? (
                            <div className="p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[250px]">
                                <div className="size-16 rounded-full bg-background-main flex items-center justify-center ring-1 ring-border-main">
                                    <MdNotificationsOff className="text-text-muted text-3xl" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-text-main font-bold text-sm">{t('notifications.allCaughtUp')}</p>
                                    <p className="text-text-muted text-xs max-w-[200px] mx-auto">{t('notifications.noNotifications')}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif.id, notif.read)}
                                        className={`p-4 border-b border-border-main cursor-pointer transition-all hover:bg-surface-hover flex gap-4 ${notif.read ? 'opacity-60 saturate-0' : 'bg-primary/5 border-l-2 border-l-primary'}`}
                                    >
                                        <div className={`mt-1 size-10 rounded-full flex items-center justify-center shrink-0 border border-border-main ${notif.type === 'alarm' ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/20 text-primary'}`}>
                                            {notif.type === 'alarm' ? <MdAlarm className="text-[20px]" /> : <MdInfo className="text-[20px]" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className={`text-sm text-text-main mb-0.5 truncate ${!notif.read ? 'font-bold' : 'font-medium'}`}>{notif.title}</p>
                                                <span className="text-[10px] text-text-muted whitespace-nowrap bg-background-main px-1.5 py-0.5 rounded border border-border-main">
                                                    {notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-text-muted leading-relaxed line-clamp-2">{notif.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
