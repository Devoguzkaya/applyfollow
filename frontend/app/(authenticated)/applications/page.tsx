"use client";

import Link from 'next/link';
import { useState } from 'react';
import { applicationService, ApplicationResponse } from '@/services/applicationService';
import { useLanguage } from "@/context/LanguageContext";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import KanbanBoard from '@/components/applications/KanbanBoard';

import StatusSelect from '@/components/applications/StatusSelect';

export default function ApplicationsPage() {
    const { t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const queryClient = useQueryClient();

    // 1. Fetch All Applications
    const { data: applications = [], isLoading: loading } = useQuery({
        queryKey: ['applications'],
        queryFn: applicationService.getAllApplications
    });

    // 2. Update Status Mutation
    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string, status: string }) =>
            applicationService.updateApplicationStatus(id, status),
        onSuccess: () => {
            // Automatically refetch the list to show updated status
            queryClient.invalidateQueries({ queryKey: ['applications'] });
        },
        onError: (err) => {
            console.error("Status update failed:", err);
        }
    });

    const filteredApplications = applications.filter(app =>
        app.company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.position.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleStatusUpdate = (id: string, newStatus: string) => {
        updateStatusMutation.mutate({ id, status: newStatus });
    };

    const getStatusBadge = (app: ApplicationResponse) => {
        const isMutating = updateStatusMutation.isPending && updateStatusMutation.variables?.id === app.id;
        return (
            <StatusSelect
                value={app.status as string}
                onChange={(newStatus) => handleStatusUpdate(app.id, newStatus)}
                disabled={isMutating}
            />
        );
    };

    return (
        <div className="w-full flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight font-display">{t('applications.title')}</h1>
                    <p className="text-text-muted">{t('applications.subtitle')}</p>
                </div>
                <div className="flex flex-col md:flex-row items-center gap-3">
                    {/* View Toggle */}
                    <div className="bg-surface-card border border-border-main p-1 rounded-xl flex">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'list' ? 'bg-surface-hover text-text-main shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">table_rows</span>
                            <span className="hidden sm:inline">Liste</span>
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${viewMode === 'kanban' ? 'bg-surface-hover text-text-main shadow-sm' : 'text-text-muted hover:text-text-main'}`}
                        >
                            <span className="material-symbols-outlined text-[20px]">view_kanban</span>
                            <span className="hidden sm:inline">Kanban</span>
                        </button>
                    </div>

                    <div className="relative w-full md:w-auto">
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
                        className="h-11 px-6 bg-primary hover:bg-emerald-400 text-[#101618] font-bold rounded-xl flex items-center gap-2 shadow-glow transition-all whitespace-nowrap"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span className="hidden md:inline">{t('applications.newButton')}</span>
                    </Link>
                </div>
            </div>

            {/* List/Kanban View */}
            {viewMode === 'kanban' ? (
                <div className="animate-in fade-in duration-300">
                    <KanbanBoard applications={filteredApplications} />
                </div>
            ) : (
                /* Table Container */
                <div className="bg-surface-card border border-border-main rounded-2xl overflow-hidden shadow-lg animate-in fade-in duration-300">
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
            )}
        </div>
    );
}
