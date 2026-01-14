"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { applicationService, ApplicationResponse } from '@/services/applicationService';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<ApplicationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const data = await applicationService.getAllApplications();
                setApplications(data);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchApps();
    }, []);

    const filteredApplications = applications.filter(app =>
        app.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusBadge = (status: string) => {
        const styles = {
            'APPLIED': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            'INTERVIEW': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            'OFFER': 'bg-primary/10 text-primary border-primary/20',
            'REJECTED': 'bg-red-500/10 text-red-400 border-red-500/20',
            'GHOSTED': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
        };
        // @ts-ignore
        const activeStyle = styles[status] || styles['APPLIED'];

        return (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border ${activeStyle} uppercase tracking-wider`}>
                {status === 'INTERVIEW' && <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span></span>}
                {status}
            </span>
        );
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight font-display">Applications</h1>
                    <p className="text-slate-400">Manage and track all your opportunities in one place.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                        <input
                            type="text"
                            placeholder="Search companies..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 pl-10 pr-4 bg-surface-dark border border-border-dark rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-64 transition-all"
                        />
                    </div>
                    <Link
                        href="/applications/new"
                        className="h-11 px-6 bg-primary hover:bg-emerald-400 text-[#101618] font-bold rounded-xl flex items-center gap-2 shadow-glow transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="hidden md:inline">New</span>
                    </Link>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-surface-dark border border-border-dark rounded-2xl overflow-hidden shadow-lg">
                {loading ? (
                    <div className="p-12 text-center text-slate-500">Loading your applications...</div>
                ) : applications.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4 text-center">
                        <div className="size-20 rounded-full bg-surface-hover flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-slate-500">inbox</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white mb-1">No applications yet</h3>
                            <p className="text-slate-400 max-w-sm mx-auto">Start your journey by adding your first job application.</p>
                        </div>
                        <Link href="/applications/new" className="mt-2 text-primary font-bold hover:underline">Add Application</Link>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        No applications matching "{searchTerm}" found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-dark bg-surface-hover/30">
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Company</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Position</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Date</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-dark">
                                {filteredApplications.map((app) => (
                                    <tr key={app.id} className="group hover:bg-surface-hover/50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-black border border-white/10 flex items-center justify-center flex-shrink-0 text-white font-bold">
                                                    {app.company.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-white">{app.company.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-slate-300 font-medium">{app.position}</div>
                                            <div className="text-xs text-slate-500 mt-0.5 truncate max-w-[150px]">{app.jobUrl || 'No URL'}</div>
                                        </td>
                                        <td className="p-5">
                                            {getStatusBadge(app.status)}
                                        </td>
                                        <td className="p-5 text-slate-400 font-medium text-sm">
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 text-right">
                                            <Link
                                                href={`/applications/${app.id}`}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-dark text-slate-400 hover:text-white hover:bg-surface-hover hover:border-primary/50 transition-all"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
