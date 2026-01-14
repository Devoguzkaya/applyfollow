"use client";

import { useEffect, useState, useRef } from 'react';
import { calendarService, CalendarEvent } from '@/services/calendarService';
import { useNotifications } from '@/context/NotificationContext';
import toast from 'react-hot-toast';

export default function AlarmSystem() {
    const [todayEvents, setTodayEvents] = useState<CalendarEvent[]>([]);
    const notifiedEvents = useRef<Set<string>>(new Set());
    const { addNotification } = useNotifications();

    // 1. Initial Setup & Permission
    useEffect(() => {
        if ("Notification" in window && Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        // Fetch events for today immediately
        fetchTODAY();

        // Refresh events data every 1 minute (to catch newly added events)
        const refreshTimer = setInterval(fetchTODAY, 60000);
        return () => clearInterval(refreshTimer);
    }, []);

    const fetchTODAY = async () => {
        try {
            const all = await calendarService.getAllEvents();
            // Get YYYY-MM-DD for local time
            // Note: This matches the date picker format from CalendarPage
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const todayStr = `${year}-${month}-${day}`;

            // Filter: Events happening TODAY && hasAlarm is true
            const relevant = all.filter(e => e.date === todayStr && e.hasAlarm);
            setTodayEvents(relevant);
        } catch (error) {
            console.error("Alarm System check failed:", error);
        }
    };

    // 2. The Loop (Checking Time)
    useEffect(() => {
        const checkAlarms = () => {
            const now = new Date();
            const currentHour = String(now.getHours()).padStart(2, '0');
            const currentMinute = String(now.getMinutes()).padStart(2, '0');
            const currentTime = `${currentHour}:${currentMinute}`;

            todayEvents.forEach(event => {
                // Determine target time: use alarmTime if available, otherwise event time
                const targetTimeFull = event.alarmTime || event.time;
                const targetTime = targetTimeFull ? targetTimeFull.substring(0, 5) : "";

                if (targetTime === currentTime) {
                    // Prevent double notification for the same event
                    if (!notifiedEvents.current.has(event.id)) {
                        triggerNotification(event);
                        notifiedEvents.current.add(event.id);
                    }
                }
            });
        };

        // Check every 5 seconds
        const timer = setInterval(checkAlarms, 5000);
        return () => clearInterval(timer);
    }, [todayEvents]);

    const triggerNotification = (event: CalendarEvent) => {
        // 1. In-App Notification (Notification Bell)
        addNotification(`Reminder: ${event.title}`, event.notes || "It's time!", 'alarm');

        // 2. Custom Toast Notification
        toast.custom((t) => (
            <div
                className={`${t.visible ? 'animate-enter' : 'animate-leave'
                    } max-w-md w-full bg-[#182023] border border-primary/30 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 relative overflow-hidden`}
            >
                {/* Glow Effect */}
                <div className="absolute top-0 right-0 w-[100px] h-[100px] bg-primary/10 rounded-full blur-[40px] pointer-events-none -mr-10 -mt-10"></div>

                <div className="flex-1 w-0 p-4 relative z-10">
                    <div className="flex items-start">
                        <div className="flex-shrink-0 pt-0.5">
                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                                <span className="material-symbols-outlined text-primary text-xl animate-pulse">alarm</span>
                            </div>
                        </div>
                        <div className="ml-3 flex-1">
                            <p className="text-sm font-bold text-white leading-tight">
                                {event.title}
                            </p>
                            <p className="mt-1 text-xs text-slate-400 leading-snug">
                                {event.notes || "Hey! It's time for your scheduled event."}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-[10px] text-primary font-mono bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md font-bold">
                                    {event.time.substring(0, 5)}
                                </span>
                                {event.alarmTime && (
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        (Alarm: {event.alarmTime.substring(0, 5)})
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex border-l border-white/5 relative z-10">
                    <button
                        onClick={() => toast.dismiss(t.id)}
                        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-bold text-primary hover:text-white hover:bg-white/5 transition-colors focus:outline-none"
                    >
                        Dismiss
                    </button>
                </div>
            </div>
        ), { duration: 8000 });

        // 3. Browser Notification
        if (Notification.permission === "granted") {
            new Notification(`🔔 Reminder: ${event.title}`, {
                body: event.notes || "It's time for your scheduled event!",
            });
        }
    };

    return null; // This component handles logic only, no UI
}
