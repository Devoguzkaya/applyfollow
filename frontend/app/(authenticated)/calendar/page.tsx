"use client";

import { useState, useEffect } from 'react';
import { calendarService, CalendarEvent } from '@/services/calendarService';
import toast from 'react-hot-toast';

export default function CalendarPage() {
    // State
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");
    const [hasAlarm, setHasAlarm] = useState(false);
    const [alarmTime, setAlarmTime] = useState("");
    const [eventType, setEventType] = useState<'event' | 'interview' | 'deadline'>('event');

    // Fetch events from Backend
    const fetchEvents = async () => {
        try {
            const data = await calendarService.getAllEvents();
            setEvents(data);
        } catch (error) {
            console.error("Failed to fetch calendar events:", error);
            toast.error("Failed to load events.");
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Calendar Helper Functions
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // Adjust to make Monday 0, Sunday 6
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
    const handleToday = () => setCurrentDate(new Date());

    const handleDayClick = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setSelectedDate(dateStr);
        // Reset form
        setTitle("");
        setTime("09:00");
        setNotes("");
        setHasAlarm(false);
        setAlarmTime("");
        setEventType('event');
        setIsModalOpen(true);
    };

    const handleSaveEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !selectedDate) return;

        try {
            // Append :00 to time if necessary for backend LocalTime parsing
            const formattedTime = time.length === 5 ? `${time}:00` : time;
            const formattedAlarmTime = (hasAlarm && alarmTime) ? (alarmTime.length === 5 ? `${alarmTime}:00` : alarmTime) : undefined;

            await calendarService.createEvent({
                date: selectedDate,
                title,
                time: formattedTime,
                notes,
                hasAlarm,
                alarmTime: formattedAlarmTime,
                type: eventType
            });

            await fetchEvents(); // Refresh list
            setIsModalOpen(false);

            // Success Toast
            toast.success("Event created successfully!");

            // Simple alarm notification check (browser API)
            if (hasAlarm && "Notification" in window && Notification.permission !== "granted") {
                Notification.requestPermission();
            }
        } catch (error) {
            console.error("Failed to create event:", error);
            toast.error("Failed to save event.");
        }
    };

    const handleDeleteEvent = async (id: string, eventTitle: string) => {
        // Confirmation is good, but let's make it smoother or just rely on undo? 
        // For now, keep native confirm but maybe custom modal later.
        if (!confirm("Are you sure you want to delete this event?")) return;

        try {
            await calendarService.deleteEvent(id);
            await fetchEvents(); // Refresh list
            toast.success(`Deleted "${eventTitle}"`);
        } catch (error) {
            console.error("Failed to delete event:", error);
            toast.error("Could not delete event.");
        }
    };

    // Render Calendar Grid
    const renderCalendarDays = () => {
        const days = [];
        // Empty cells for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="border-r border-b border-border-dark p-3 bg-surface-hover/5"></div>);
        }

        // Days of current month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
            const dayEvents = events.filter(e => e.date === dateStr);

            days.push(
                <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`border-r border-b border-border-dark p-2 min-h-[100px] relative group hover:bg-surface-hover/30 transition-colors cursor-pointer ${isToday ? 'bg-primary/5' : ''}`}
                >
                    <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-[#101618] font-bold' : 'text-slate-400'}`}>
                        {day}
                    </span>

                    <div className="mt-1 flex flex-col gap-1">
                        {dayEvents.map(event => (
                            <div
                                key={event.id}
                                onClick={(e) => { e.stopPropagation(); handleDeleteEvent(event.id, event.title); }}
                                className={`p-1.5 rounded-md text-xs font-bold truncate transition-transform hover:scale-105 group/event relative
                                ${event.type === 'interview' ? 'bg-primary/20 text-primary border border-primary/20' : ''}
                                ${event.type === 'deadline' ? 'bg-red-500/20 text-red-400 border border-red-500/20' : ''}
                                ${event.type === 'event' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' : ''}
                            `}
                            >
                                <div className="flex items-center gap-1">
                                    {event.hasAlarm && <span className="material-symbols-outlined text-[10px]">notifications</span>}
                                    <span className="truncate">{event.time.substring(0, 5)} {event.title}</span>
                                </div>
                                {/* Delete Overlay */}
                                <div className="absolute inset-0 bg-red-500/90 text-white flex items-center justify-center opacity-0 group-hover/event:opacity-100 transition-opacity rounded-md">
                                    <span className="material-symbols-outlined text-[14px]">delete</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return days;
    };

    return (
        <div className="max-w-7xl mx-auto h-[calc(100vh-140px)] flex flex-col relative">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white font-display">{monthNames[month]} {year}</h1>
                    <p className="text-slate-400">Manage your schedule, interviews, and deadlines.</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handlePrevMonth} className="p-2 rounded-lg border border-border-dark text-slate-400 hover:text-white hover:bg-surface-hover transition-colors">
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <button onClick={handleToday} className="px-4 py-2 rounded-lg border border-border-dark text-white font-medium hover:bg-surface-hover transition-colors">
                        Today
                    </button>
                    <button onClick={handleNextMonth} className="p-2 rounded-lg border border-border-dark text-slate-400 hover:text-white hover:bg-surface-hover transition-colors">
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            </div>

            {/* Calendar Container */}
            <div className="flex-1 bg-surface-dark border border-border-dark rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                {/* Weekday Headers */}
                <div className="grid grid-cols-7 border-b border-border-dark bg-surface-hover/20">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                        <div key={day} className="py-3 text-center text-sm font-bold text-slate-500 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid */}
                <div className="flex-1 grid grid-cols-7 grid-rows-5 md:grid-rows-6">
                    {renderCalendarDays()}
                </div>
            </div>

            {/* Event Modal */}
            {isModalOpen && (
                <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm rounded-2xl">
                    <div className="bg-[#182023] border border-border-dark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-6 border-b border-border-dark flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white">Add Event</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <form onSubmit={handleSaveEvent} className="p-6 space-y-4">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g. Google Interview"
                                    className="w-full h-11 px-4 bg-black/20 border border-border-dark rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                                    autoFocus
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate || ''}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        className="w-full h-11 px-4 bg-black/20 border border-border-dark rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Time</label>
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full h-11 px-4 bg-black/20 border border-border-dark rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Type</label>
                                <div className="flex gap-2">
                                    {['event', 'interview', 'deadline'].map(t => (
                                        <button
                                            key={t}
                                            type="button"
                                            onClick={() => setEventType(t as any)}
                                            className={`flex-1 h-9 rounded-lg text-sm font-bold capitalize transition-all border ${eventType === t
                                                ? 'bg-primary/20 border-primary text-primary'
                                                : 'bg-black/20 border-border-dark text-slate-400 hover:text-white'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Notes</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add details, links, or notes..."
                                    className="w-full h-24 p-4 bg-black/20 border border-border-dark rounded-xl text-white focus:border-primary focus:outline-none transition-colors resize-none"
                                ></textarea>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-black/20 rounded-xl border border-border-dark cursor-pointer transition-colors hover:bg-black/30" onClick={() => setHasAlarm(!hasAlarm)}>
                                    <div className={`size-5 rounded-md border flex items-center justify-center transition-colors ${hasAlarm ? 'bg-primary border-primary' : 'border-slate-600'}`}>
                                        {hasAlarm && <span className="material-symbols-outlined text-black text-[14px] font-bold">check</span>}
                                    </div>
                                    <span className={`text-sm font-medium ${hasAlarm ? 'text-white' : 'text-slate-400'}`}>Set Alarm / Reminder</span>
                                </div>

                                {hasAlarm && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 pl-2 border-l-2 border-primary/20">
                                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Alarm Time</label>
                                        <input
                                            type="time"
                                            value={alarmTime}
                                            onChange={(e) => setAlarmTime(e.target.value)}
                                            className="w-full h-11 px-4 bg-black/20 border border-border-dark rounded-xl text-white focus:border-primary focus:outline-none transition-colors"
                                        />
                                    </div>
                                )}
                            </div>

                            <button type="submit" className="w-full h-12 bg-primary text-[#101618] font-bold rounded-xl mt-4 hover:bg-emerald-400 transition-colors shadow-glow">
                                Save Event
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
