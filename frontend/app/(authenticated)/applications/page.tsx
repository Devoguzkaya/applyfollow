"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { applicationService, ApplicationResponse } from '@/services/applicationService';
import { useLanguage } from "@/context/LanguageContext";

export default function ApplicationsPage() {
    const { t } = useLanguage();
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

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await applicationService.updateApplicationStatus(id, newStatus);
            setApplications(prev => prev.map(app =>
                app.id === id ? { ...app, status: newStatus as any } : app
            ));
        } catch (error) {
            console.error("Status update failed:", error);
        }
    };

    const getStatusBadge = (app: ApplicationResponse) => {
        const styles = {
            'APPLIED': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
            'INTERVIEW': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
            'OFFER': 'text-primary bg-primary/10 border-primary/20',
            'REJECTED': 'text-red-400 bg-red-500/10 border-red-500/20',
            'GHOSTED': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
        };

        const activeStyle = styles[app.status] || styles['APPLIED'];

        return (
            <div className="relative group/status w-fit">
                <select
                    value={app.status}
                    onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                    className={`appearance-none bg-transparent border rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider cursor-pointer outline-none focus:ring-1 focus:ring-primary transition-all pr-7 ${activeStyle}`}
                >
                    <option value="APPLIED" className="bg-surface-card">{t('applications.status.APPLIED')}</option>
                    <option value="INTERVIEW" className="bg-surface-card">{t('applications.status.INTERVIEW')}</option>
                    <option value="OFFER" className="bg-surface-card">{t('applications.status.OFFER')}</option>
                    <option value="REJECTED" className="bg-surface-card">{t('applications.status.REJECTED')}</option>
                    <option value="GHOSTED" className="bg-surface-card">{t('applications.status.GHOSTED')}</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none opacity-50">expand_more</span>
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight font-display">{t('applications.title')}</h1>
                    <p className="text-text-muted">{t('applications.subtitle')}</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                        <input
                            type="text"
                            placeholder={t('applications.searchPlaceholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="h-11 pl-10 pr-4 bg-surface-card border border-border-main rounded-xl text-text-main placeholder-text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-64 transition-all"
                        />
                    </div>
                    <Link
                        href="/applications/new"
                        className="h-11 px-6 bg-primary hover:bg-emerald-400 text-[#101618] font-bold rounded-xl flex items-center gap-2 shadow-glow transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="hidden md:inline">{t('applications.newButton')}</span>
                    </Link>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-surface-card border border-border-main rounded-2xl overflow-hidden shadow-lg">
                {loading ? (
                    <div className="p-12 text-center text-text-muted">{t('applications.list.loading')}</div>
                ) : applications.length === 0 ? (
                    <div className="p-20 flex flex-col items-center justify-center gap-4 text-center bg-surface-darker/30">
                        <div className="size-20 rounded-full bg-surface-hover flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-text-muted">inbox</span>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-text-main mb-1">{t('applications.list.emptyTitle')}</h3>
                            <p className="text-text-muted max-w-sm mx-auto">{t('applications.list.emptyDesc')}</p>
                        </div>
                        <Link href="/applications/new" className="mt-2 text-primary font-bold hover:underline">{t('applications.list.emptyAction')}</Link>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="p-12 text-center text-text-muted">
                        {t('applications.list.noResult').replace("{query}", searchTerm)}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border-main bg-surface-hover/30">
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">{t('applications.list.company')}</th>
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">{t('applications.list.position')}</th>
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">{t('applications.list.status')}</th>
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider">{t('applications.list.appliedDate')}</th>
                                    <th className="p-5 text-xs font-bold text-text-muted uppercase tracking-wider text-right">{t('applications.list.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border-main">
                                {filteredApplications.map((app) => (
                                    <tr key={app.id} className="group hover:bg-surface-hover/50 transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-4">
                                                <div className="size-10 rounded-lg bg-background-main border border-border-main flex items-center justify-center flex-shrink-0 text-text-main font-bold">
                                                    {app.company.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-text-main">{app.company.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <div className="text-text-main font-medium">{app.position}</div>
                                            <div className="text-xs text-text-muted mt-0.5 truncate max-w-[150px]">{app.jobUrl || 'No URL'}</div>
                                        </td>
                                        <td className="p-5">
                                            {getStatusBadge(app)}
                                        </td>
                                        <td className="p-5 text-text-muted font-medium text-sm">
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                        </td>
                                        <td className="p-5 text-right">
                                            <Link
                                                href={`/applications/${app.id}`}
                                                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-main text-text-muted hover:text-text-main hover:bg-surface-hover hover:border-primary/50 transition-all"
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
