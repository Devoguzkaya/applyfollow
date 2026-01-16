"use client";

import { useState, useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { adminService, UserAdminResponse, PageResponse } from '@/services/adminService';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
    const router = useRouter();
    const { user } = useAppSelector((state) => state.auth);

    const [usersPage, setUsersPage] = useState<PageResponse<UserAdminResponse> | null>(null);
    const [page, setPage] = useState(0);
    const [searchEmail, setSearchEmail] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Protection
    useEffect(() => {
        if (user && user.role !== 'ADMIN') {
            router.push('/dashboard');
            toast.error("Unauthorized access");
        }
    }, [user, router]);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const data = await adminService.getUsers(page, 10, searchEmail);
            setUsersPage(data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast.error("Failed to load users");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchUsers();
        }
    }, [page, user]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(0);
        fetchUsers();
    };

    const toggleStatus = async (id: string) => {
        try {
            await adminService.toggleUserStatus(id);
            toast.success("User status updated");
            fetchUsers(); // Refresh
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    if (user?.role !== 'ADMIN') return null;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black text-white tracking-tight">User Management</h1>
                    <p className="text-slate-400 mt-1">Manage platform users and account statuses.</p>
                </div>

                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xl">search</span>
                        <input
                            type="text"
                            placeholder="Search by email..."
                            value={searchEmail}
                            onChange={(e) => setSearchEmail(e.target.value)}
                            className="bg-surface-dark border border-border-dark rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-primary outline-none transition-all w-64"
                        />
                    </div>
                    <button type="submit" className="bg-primary hover:bg-emerald-400 text-black px-5 py-2.5 rounded-xl font-bold text-sm transition-all">
                        Search
                    </button>
                </form>
            </div>

            {/* Users Table */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border-dark bg-white/5">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border-dark">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={4} className="px-6 py-8 h-16 bg-white/5 opacity-20"></td>
                                    </tr>
                                ))
                            ) : usersPage?.content.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-medium">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            ) : (
                                usersPage?.content.map((u) => (
                                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                    {u.fullName.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold text-white">{u.fullName}</div>
                                                    <div className="text-xs text-slate-500 font-medium">{u.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${u.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20' : 'bg-blue-500/10 text-blue-500 ring-1 ring-blue-500/20'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${u.active ? 'text-primary bg-primary/10' : 'text-rose-500 bg-rose-500/10'
                                                }`}>
                                                <span className={`size-1.5 rounded-full ${u.active ? 'bg-primary' : 'bg-rose-500'}`}></span>
                                                {u.active ? 'Active' : 'Suspended'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => toggleStatus(u.id)}
                                                    className={`p-2 rounded-lg transition-all ${u.active ? 'text-rose-400 hover:bg-rose-400/10' : 'text-emerald-400 hover:bg-emerald-400/10'
                                                        }`}
                                                    title={u.active ? "Suspend Account" : "Activate Account"}
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">
                                                        {u.active ? 'person_off' : 'person_check'}
                                                    </span>
                                                </button>
                                                <button
                                                    onClick={() => toast.error("Coming soon: View User Dashboard")}
                                                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                                                    title="View Dashboard"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">monitoring</span>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {usersPage && usersPage.totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-border-dark flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                            Showing page <span className="text-white font-bold">{usersPage.number + 1}</span> of <span className="text-white font-bold">{usersPage.totalPages}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                disabled={usersPage.number === 0}
                                onClick={() => setPage(p => p - 1)}
                                className="size-8 flex items-center justify-center rounded-lg border border-border-dark text-slate-400 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </button>
                            {Array.from({ length: usersPage.totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i)}
                                    className={`size-8 text-xs font-bold rounded-lg transition-all ${usersPage.number === i ? 'bg-primary text-black' : 'text-slate-400 hover:bg-white/5'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                disabled={usersPage.number === usersPage.totalPages - 1}
                                onClick={() => setPage(p => p + 1)}
                                className="size-8 flex items-center justify-center rounded-lg border border-border-dark text-slate-400 hover:bg-white/5 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
                            >
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
