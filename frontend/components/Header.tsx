"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@/context/NotificationContext';
// Redux Imports
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout, checkAuth } from '@/store/features/auth/authSlice';
import toast from 'react-hot-toast';

import { MdNotifications, MdNotificationsOff, MdPerson, MdExpandMore, MdSettings, MdLogout, MdInfo, MdAlarm } from "react-icons/md";

export default function Header() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    // Auth State from Redux
    const { user, isAuthenticated } = useAppSelector((state) => state.auth);

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
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-20 bg-[#1A2321]/90 backdrop-blur-md sticky top-0 w-full shrink-0">
            {/* Left Side: Welcome Message */}
            <div className="flex flex-col justify-center">
                <p className="text-[#9db8a9] text-xs font-medium uppercase tracking-wider mb-0.5">Dashboard</p>
                <div className="flex items-center gap-3">
                    <div className="relative size-12 shrink-0">
                        <Image
                            src="/ApplyFollowLogo.png"
                            alt="ApplyFollow Brand"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                    <h2 className="text-white text-lg font-bold leading-tight tracking-tight">ApplyFollow</h2>
                    <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/20"></span>
                    <p className="hidden sm:block text-slate-400 text-sm font-medium">
                        Welcome, <span className="text-emerald-400">{(mounted && user?.fullName?.split(' ')[0]) || 'Guest'}</span>
                    </p>
                </div>
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center gap-3 sm:gap-5 relative" ref={dropdownRef}>

                {/* Notifications Trigger */}
                <button
                    onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                    className={`size-10 rounded-xl flex items-center justify-center transition-all relative group
                    ${showNotifications ? 'bg-primary/10 text-primary ring-2 ring-primary/20' : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'}
                `}
                >
                    {unreadCount > 0 && (
                        <span className="absolute top-2.5 right-2.5 size-2 bg-[#ef4444] rounded-full ring-2 ring-[#1A2321] animate-pulse"></span>
                    )}
                    <MdNotifications className="text-[22px] group-hover:scale-110 transition-transform" />
                </button>

                {/* Vertical Divider */}
                <div className="w-px h-8 bg-white/10 mx-1"></div>

                {/* Profile Trigger */}
                <div className="relative">
                    <button
                        onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                        className="flex items-center gap-3 py-1 pl-1 pr-1 sm:pr-4 rounded-full hover:bg-white/5 border border-transparent hover:border-white/5 transition-all group"
                    >
                        <div className="size-10 rounded-full bg-gradient-to-br from-primary to-emerald-700 p-[2px] shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
                            <div className="w-full h-full rounded-full bg-[#1A2321] flex items-center justify-center text-white font-bold text-sm relative overflow-hidden">
                                {mounted && user?.fullName ? user.fullName.charAt(0).toUpperCase() : (
                                    <MdPerson className="text-[20px] text-slate-400" />
                                )}
                            </div>
                        </div>
                        <div className="hidden sm:block text-left">
                            <p className="text-sm font-bold text-white leading-none mb-0.5">{(mounted && user?.fullName) || 'Guest User'}</p>
                            <p className="text-[10px] text-[#9db8a9] font-medium leading-none">View Profile</p>
                        </div>
                        <MdExpandMore className="hidden sm:block text-slate-500 group-hover:text-white transition-colors text-[20px]" />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {showProfileMenu && (
                        <div className="absolute top-14 right-0 w-72 bg-[#1A2321] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 z-50 ring-1 ring-black/50">
                            {/* User Info Header */}
                            <div className="p-5 border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                                <p className="text-xs font-bold text-[#9db8a9] uppercase tracking-wider mb-1">Signed in as</p>
                                <p className="text-sm font-medium text-white truncate font-mono bg-black/20 p-2 rounded-lg border border-white/5">
                                    {(mounted && user?.email) || 'guest@example.com'}
                                </p>
                            </div>

                            {/* Menu Items */}
                            <div className="p-2 flex flex-col gap-1">
                                <Link href="/profile" onClick={() => setShowProfileMenu(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 hover:pl-4 transition-all group">
                                    <div className="p-1.5 rounded-lg bg-white/5 text-slate-400 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                        <MdPerson className="text-[20px]" />
                                    </div>
                                    Your Profile
                                </Link>
                                <button onClick={() => toast.success("Settings coming soon!")} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 hover:pl-4 transition-all w-full text-left group">
                                    <div className="p-1.5 rounded-lg bg-white/5 text-slate-400 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                                        <MdSettings className="text-[20px]" />
                                    </div>
                                    Settings
                                </button>
                            </div>

                            {/* Logout Footer */}
                            <div className="p-2 border-t border-white/5 mt-1 bg-red-500/5">
                                <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 hover:pl-4 transition-all w-full text-left font-bold group">
                                    <MdLogout className="text-[20px] group-hover:rotate-180 transition-transform duration-300" />
                                    Log out
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Notifications Dropdown Panel */}
                {showNotifications && (
                    <div className="absolute top-14 right-14 sm:right-16 w-80 sm:w-96 bg-[#1A2321] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 z-50 ring-1 ring-black/50">
                        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                            <h3 className="font-bold text-white text-sm flex items-center gap-2">
                                <MdNotifications className="text-primary text-[20px]" />
                                Notifications
                                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full">{notifications.length}</span>
                            </h3>
                            {notifications.length > 0 && (
                                <button onClick={clearAll} className="text-xs text-[#9db8a9] font-medium hover:text-white hover:underline transition-colors">Clear all</button>
                            )}
                        </div>

                        {notifications.length === 0 ? (
                            <div className="p-10 flex flex-col items-center justify-center text-center gap-4 min-h-[250px]">
                                <div className="size-16 rounded-full bg-white/5 flex items-center justify-center ring-1 ring-white/10">
                                    <MdNotificationsOff className="text-slate-600 text-3xl" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <p className="text-white font-bold text-sm">All caught up!</p>
                                    <p className="text-slate-500 text-xs max-w-[200px] mx-auto">No new notifications at the moment. We'll alert you when something happens.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                                {notifications.map((notif) => (
                                    <div
                                        key={notif.id}
                                        onClick={() => handleNotificationClick(notif.id, notif.read)}
                                        className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 flex gap-4 ${notif.read ? 'opacity-60 saturate-0' : 'bg-primary/5 border-l-2 border-l-primary'}`}
                                    >
                                        <div className={`mt-1 size-10 rounded-full flex items-center justify-center shrink-0 border border-white/5 ${notif.type === 'alarm' ? 'bg-amber-500/20 text-amber-500' : 'bg-primary/20 text-primary'}`}>
                                            {notif.type === 'alarm' ? <MdAlarm className="text-[20px]" /> : <MdInfo className="text-[20px]" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start gap-2">
                                                <p className={`text-sm text-white mb-0.5 truncate ${!notif.read ? 'font-bold' : 'font-medium'}`}>{notif.title}</p>
                                                <span className="text-[10px] text-slate-500 whitespace-nowrap bg-black/20 px-1.5 py-0.5 rounded">
                                                    {notif.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <p className="text-xs text-[#9db8a9] leading-relaxed line-clamp-2">{notif.message}</p>
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
