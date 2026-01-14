"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { calendarService } from '@/services/calendarService';

export default function Sidebar() {
    const pathname = usePathname();
    const [todayCount, setTodayCount] = useState(0);

    useEffect(() => {
        const fetchCount = async () => {
            try {
                const events = await calendarService.getAllEvents();
                const today = new Date();
                const year = today.getFullYear();
                const month = String(today.getMonth() + 1).padStart(2, '0');
                const day = String(today.getDate()).padStart(2, '0');
                const todayStr = `${year}-${month}-${day}`;

                const count = events.filter(e => e.date === todayStr).length;
                setTodayCount(count);
            } catch (error) {
                console.error("Failed to fetch sidebar counts", error);
            }
        };

        fetchCount();

        // Refresh every minute to stay sync
        const interval = setInterval(fetchCount, 60000);
        return () => clearInterval(interval);
    }, []);

    const getLinkClasses = (path: string) => {
        // Exact match for dashboard home, startsWith for others to handle subpages
        const isActive = path === "/dashboard"
            ? pathname === "/dashboard"
            : pathname?.startsWith(path);

        // Base classes
        const baseClasses = "flex items-center gap-4 px-3 py-3 rounded-xl transition-all group";
        const activeClasses = "bg-primary/10 text-primary border border-primary/20 font-bold";
        const inactiveClasses = "text-slate-400 hover:text-white hover:bg-surface-hover font-medium";

        return `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`;
    };

    return (
        <aside className="w-20 lg:w-72 h-full flex flex-col border-r border-border-dark bg-[#101618] flex-shrink-0 transition-all duration-300 relative z-20">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-4 lg:px-8 gap-3 border-b border-border-dark/30">
                <div className="relative size-14 shrink-0">
                    <Image
                        src="/ApplyFollowLogo.png"
                        alt="ApplyFollow Brand"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <h1 className="text-xl font-bold text-white hidden lg:block tracking-tight font-display">ApplyFollow</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
                <Link
                    href="/dashboard"
                    className={getLinkClasses("/dashboard")}
                >
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">dashboard</span>
                    <span className="hidden lg:block">Dashboard</span>
                </Link>
                <Link
                    href="/applications"
                    className={getLinkClasses("/applications")}
                >
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">folder_open</span>
                    <span className="hidden lg:block">Applications</span>
                </Link>
                <Link
                    href="/calendar"
                    className={getLinkClasses("/calendar")}
                >
                    <span className="material-symbols-outlined group-hover:scale-110 transition-transform">calendar_month</span>
                    <span className="hidden lg:block">Calendar</span>
                    {todayCount > 0 && (
                        <span className="hidden lg:flex ml-auto bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-full animate-in fade-in zoom-in">
                            {todayCount}
                        </span>
                    )}
                </Link>


                <div className="mt-8 px-3 hidden lg:block">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Settings</p>
                    <Link href="/profile" className={getLinkClasses("/profile")}>
                        <span className="material-symbols-outlined text-[20px]">account_circle</span>
                        <span className="">Profile</span>
                    </Link>
                </div>
            </nav>
        </aside>
    );
}
