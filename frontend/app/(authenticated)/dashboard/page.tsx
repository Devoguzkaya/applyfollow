"use client";

import Link from 'next/link';
import { applicationService } from '@/services/applicationService';
import { calendarService } from '@/services/calendarService';
import { useLanguage } from '@/context/LanguageContext';
import { useQuery } from '@tanstack/react-query';

export default function DashboardPage() {
  const { t } = useLanguage();

  // 1. Fetch Applications (TanStack Query)
  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: applicationService.getAllApplications,
  });

  // 2. Fetch Events (TanStack Query)
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['events'],
    queryFn: calendarService.getAllEvents,
  });

  const loading = appsLoading || eventsLoading;

  // Calculate App Stats
  const totalApps = applications.length;
  // Use explicit casting or string comparison to avoid type errors roughly
  const interviews = applications.filter(app => (app.status as string) === 'INTERVIEW').length;
  const rejections = applications.filter(app => (app.status as string) === 'REJECTED').length;
  const offers = applications.filter(app => (app.status as string) === 'OFFER').length;
  const ghosted = applications.filter(app => (app.status as string) === 'GHOSTED').length;
  const applied = applications.filter(app => (app.status as string) === 'APPLIED').length;

  const responseRate = totalApps > 0 ? Math.round(((interviews + rejections + offers) / totalApps) * 100) : 0;

  // Filter Upcoming Events (Sorted by date/time)
  const upcomingEvents = events
    .filter(e => new Date(e.date + 'T' + e.time) >= new Date()) // Simple filtering for future
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime())
    .slice(0, 3);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'INTERVIEW': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'OFFER': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'GHOSTED': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const getGradient = () => {
    if (totalApps === 0) return 'var(--surface)';
    const p1 = Math.round((offers / totalApps) * 100);
    const p2 = p1 + Math.round((interviews / totalApps) * 100);
    const p3 = p2 + Math.round((applied / totalApps) * 100);
    const p4 = p3 + Math.round((rejections / totalApps) * 100);
    return `conic-gradient(#34d399 0% ${p1}%, #f59e0b ${p1}% ${p2}%, #3b82f6 ${p2}% ${p3}%, #ef4444 ${p3}% ${p4}%, #64748b ${p4}% 100%)`;
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-10">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-text-main tracking-tight mb-2">{t('sidebar.overview')}</h1>
        <p className="text-text-muted text-lg">{t('dashboard.summary')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-card border border-border-main p-6 rounded-2xl flex items-center justify-between shadow-lg transition-colors">
          <div><p className="text-text-muted text-sm font-medium">{t('dashboard.stats.total')}</p><p className="text-3xl font-bold text-text-main mt-1">{totalApps}</p></div>
          <div className="size-12 rounded-xl bg-surface-hover flex items-center justify-center"><span className="material-symbols-outlined text-text-muted">send</span></div>
        </div>
        <div className="bg-surface-card border border-border-main p-6 rounded-2xl flex items-center justify-between shadow-lg transition-colors">
          <div><p className="text-text-muted text-sm font-medium">{t('dashboard.stats.responseRate')}</p><p className="text-3xl font-bold text-primary mt-1">{responseRate}%</p></div>
          <div className="size-12 rounded-xl bg-surface-hover flex items-center justify-center"><span className="material-symbols-outlined text-text-muted">percent</span></div>
        </div>
        <div className="bg-surface-card border border-border-main p-6 rounded-2xl flex items-center justify-between shadow-lg transition-colors">
          <div><p className="text-text-muted text-sm font-medium">{t('dashboard.stats.interviews')}</p><p className="text-3xl font-bold text-amber-400 mt-1">{interviews}</p></div>
          <div className="size-12 rounded-xl bg-surface-hover flex items-center justify-center"><span className="material-symbols-outlined text-text-muted">video_camera_front</span></div>
        </div>
        <div className="bg-surface-card border border-border-main p-6 rounded-2xl flex items-center justify-between shadow-lg transition-colors">
          <div><p className="text-text-muted text-sm font-medium">{t('dashboard.stats.offer')}</p><p className="text-3xl font-bold text-emerald-400 mt-1">{offers}</p></div>
          <div className="size-12 rounded-xl bg-surface-hover flex items-center justify-center"><span className="material-symbols-outlined text-text-muted">thumb_up</span></div>
        </div>
      </div>

      {/* Charts & Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown (Left) */}
        <div className="bg-surface-card border border-border-main p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between transition-colors">
          <h3 className="text-xl font-bold text-text-main mb-6">{t('dashboard.charts.statusBreakdown')}</h3>
          <div className="space-y-4">
            {[
              { label: t('dashboard.stats.pending'), count: applied, color: 'bg-blue-500', total: totalApps },
              { label: t('dashboard.stats.interviews'), count: interviews, color: 'bg-amber-500', total: totalApps },
              { label: t('dashboard.stats.offer'), count: offers, color: 'bg-emerald-400', total: totalApps },
              { label: t('dashboard.stats.rejected'), count: rejections, color: 'bg-red-500', total: totalApps },
              { label: t('dashboard.stats.ghosted'), count: ghosted, color: 'bg-slate-500', total: totalApps },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-bold text-text-muted mb-1">
                  <span>{item.label}</span>
                  <span>{item.count}</span>
                </div>
                <div className="h-2 w-full bg-surface-hover rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.total > 0 ? (item.count / item.total) * 100 : 0}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Outcomes Chart (Center) */}
        <div className="bg-surface-card border border-border-main p-8 rounded-2xl shadow-lg flex flex-col items-center transition-colors">
          <h3 className="text-xl font-bold text-text-main mb-6">{t('dashboard.charts.outcomes')}</h3>
          <div className="size-48 rounded-full relative shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] transition-all" style={{ background: getGradient(), borderRadius: '50%' }}>
            <div className="absolute inset-4 bg-surface-card rounded-full flex flex-col items-center justify-center z-10">
              <span className="text-4xl font-bold text-text-main">{totalApps}</span>
              <span className="text-xs text-text-muted uppercase tracking-widest mt-1">{t('dashboard.charts.total')}</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-1 text-xs text-text-muted"><span className="size-2 rounded-full bg-emerald-400"></span>{t('dashboard.stats.offer')}</div>
            <div className="flex items-center gap-1 text-xs text-text-muted"><span className="size-2 rounded-full bg-amber-500"></span>{t('dashboard.stats.interviews')}</div>
            <div className="flex items-center gap-1 text-xs text-text-muted"><span className="size-2 rounded-full bg-red-500"></span>{t('dashboard.stats.rejected')}</div>
          </div>
        </div>

        {/* Upcoming Events (Right) */}
        <div className="bg-surface-card border border-border-main p-8 rounded-2xl shadow-lg flex flex-col transition-colors">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-text-main">{t('dashboard.charts.upcoming')}</h3>
            <Link href="/calendar" className="text-xs font-bold text-primary hover:underline">{t('common.viewAll')}</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
              <span className="material-symbols-outlined text-text-muted text-3xl">event_busy</span>
              <p className="text-text-muted text-sm">{t('dashboard.charts.noEvents')}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="p-3 rounded-xl bg-surface-hover/30 border border-border-main flex gap-3 items-center group cursor-default">
                  <div className="flex flex-col items-center justify-center min-w-[50px] bg-background-main rounded-lg py-1 border border-border-main">
                    <span className="text-[10px] text-red-400 font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg font-bold text-text-main">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-main truncate group-hover:text-primary transition-colors">{event.title}</p>
                    <p className="text-xs text-text-muted">{event.time.substring(0, 5)} • {event.type}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent Applications Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-main">{t('dashboard.recentApps.title')}</h2>
          <Link href="/applications" className="text-primary text-sm font-bold hover:underline">{t('common.viewAll')}</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading && <div className="col-span-full text-center py-10 text-text-muted">{t('common.loading')}</div>}

          {!loading && applications.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-text-muted border border-dashed border-border-main rounded-2xl bg-surface-card/50">
              <p>{t('dashboard.recentApps.noRecentActivity')}</p>
            </div>
          )}

          {applications.slice(0, 3).map((app) => (
            <Link key={app.id} href={`/applications/${app.id}`} className="group relative bg-surface-card rounded-2xl p-6 border border-border-main hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 block cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-background-main flex items-center justify-center p-1 border border-border-main overflow-hidden">
                    {app.company.logoUrl ? (
                      <img src={app.company.logoUrl} alt={app.company.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-text-main font-bold text-lg">{app.company.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-text-main group-hover:text-primary transition-colors">{app.company.name}</h3>
                    <p className="text-xs text-text-muted">{app.position}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-border-main">
                <div className={`flex items-center gap-2 px-2 py-1 rounded-md border ${getStatusColor(app.status as string)}`}>
                  <span className="text-[10px] font-bold tracking-wide uppercase">{app.status}</span>
                </div>
                <p className="text-xs text-text-muted">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}

          {/* Add New Button Card */}
          <Link href="/applications/new" className="group relative rounded-2xl p-6 border-2 border-dashed border-border-main hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center min-h-[160px]">
            <div className="size-10 rounded-full bg-surface-hover flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-text-muted text-xl group-hover:text-primary transition-colors">add</span>
            </div>
            <h4 className="text-sm font-bold text-text-muted group-hover:text-text-main transition-colors">{t('dashboard.recentApps.addNew')}</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}
