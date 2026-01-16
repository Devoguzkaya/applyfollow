"use client";

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { adminService, ContactMessage, PageResponse } from '@/services/adminService';
import toast from 'react-hot-toast';

export default function AdminMessagesPage() {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    const [messagesPage, setMessagesPage] = useState<PageResponse<ContactMessage> | null>(null);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Protection
    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            router.push('/dashboard');
        }
    }, [user, router]);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getMessages(page, 10);
            setMessagesPage(data);
        } catch (error) {
            console.error("Failed to fetch messages", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchMessages();
        }
    }, [page, user]);

    const toggleReplied = async (id: string) => {
        try {
            await adminService.toggleMessageReplied(id);
            toast.success("Replied status updated");
            fetchMessages();
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const deleteMessage = async (id: string) => {
        if (!confirm("Are you sure you want to delete this message?")) return;
        try {
            await adminService.deleteMessage(id);
            toast.success("Message deleted");
            fetchMessages();
        } catch (error) {
            toast.error("Failed to delete message");
        }
    };

    if (user?.role !== 'ADMIN') return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div>
                <h1 className="text-3xl font-display font-black text-white tracking-tight">System Messages</h1>
                <p className="text-slate-400 mt-1">Contact form submissions from the landing page.</p>
            </div>

            {/* Messages Grid */}
            <div className="grid gap-6">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="h-40 bg-white/5 border border-border-dark rounded-2xl animate-pulse"></div>
                    ))
                ) : messagesPage?.content.length === 0 ? (
                    <div className="text-center py-20 bg-surface-dark border border-border-dark rounded-2xl">
                        <span className="material-symbols-outlined text-5xl text-slate-700 mb-4">mail_outline</span>
                        <p className="text-slate-500 font-medium">No messages found.</p>
                    </div>
                ) : (
                    messagesPage?.content.map((msg) => (
                        <div key={msg.id} className="bg-surface-dark border border-border-dark rounded-2xl p-6 group hover:border-primary/30 transition-all">
                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                <div className="flex items-start gap-4">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${msg.replied ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                                        }`}>
                                        <span className="material-symbols-outlined text-2xl">
                                            {msg.replied ? 'done_all' : 'mark_email_unread'}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{msg.subject}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-sm font-medium text-slate-200">{msg.name}</span>
                                            <span className="size-1 bg-slate-700 rounded-full"></span>
                                            <span className="text-xs text-slate-500">{msg.email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-2">
                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                                        {new Date(msg.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleReplied(msg.id)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${msg.replied
                                                ? 'bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500/20'
                                                : 'bg-primary text-black hover:bg-emerald-400'
                                                }`}
                                        >
                                            {msg.replied ? 'Mark as Unreplied' : 'Mark as Replied'}
                                        </button>
                                        <button
                                            onClick={() => deleteMessage(msg.id)}
                                            className="p-1.5 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#0A0C10] border border-border-dark rounded-xl p-4 text-slate-400 text-sm leading-relaxed">
                                {msg.message}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {messagesPage && messagesPage.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        disabled={messagesPage.number === 0}
                        onClick={() => setPage(p => p - 1)}
                        className="p-2 rounded-xl bg-surface-dark border border-border-dark text-white disabled:opacity-20 hover:bg-white/5 transition-all"
                    >
                        <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    <div className="text-sm font-bold text-slate-400">
                        Page {messagesPage.number + 1} of {messagesPage.totalPages}
                    </div>
                    <button
                        disabled={messagesPage.number === messagesPage.totalPages - 1}
                        onClick={() => setPage(p => p + 1)}
                        className="p-2 rounded-xl bg-surface-dark border border-border-dark text-white disabled:opacity-20 hover:bg-white/5 transition-all"
                    >
                        <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                </div>
            )}
        </div>
    );
}
