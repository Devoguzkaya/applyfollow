"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { applicationService, ApplicationResponse } from '@/services/applicationService';
import { calendarService, CalendarEvent } from '@/services/calendarService';

export default function DashboardPage() {
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data on Load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsData, eventsData] = await Promise.all([
          applicationService.getAllApplications(),
          calendarService.getAllEvents()
        ]);
        setApplications(appsData);
        setEvents(eventsData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calculate App Stats
  const totalApps = applications.length;
  const interviews = applications.filter(app => app.status === 'INTERVIEW').length;
  const rejections = applications.filter(app => app.status === 'REJECTED').length;
  const offers = applications.filter(app => app.status === 'OFFER').length;
  const ghosted = applications.filter(app => app.status === 'GHOSTED').length;
  const applied = applications.filter(app => app.status === 'APPLIED').length;

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
    if (totalApps === 0) return '#1e293b';
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
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-2">Dashboard</h1>
        <p className="text-slate-400 text-lg">Overview of your job search progress.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div><p className="text-slate-400 text-sm font-medium">Total Applications</p><p className="text-3xl font-bold text-white mt-1">{totalApps}</p></div>
          <div className="size-12 rounded-xl bg-surface-hover flex items-center justify-center"><span className="material-symbols-outlined text-slate-400">send</span></div>
        </div>
        <div className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div><p className="text-slate-400 text-sm font-medium">Response Rate</p><p className="text-3xl font-bold text-primary mt-1">{responseRate}%</p></div>
          <div className="size-12 rounded-xl bg-surface-hover flex items-center justify-center"><span className="material-symbols-outlined text-slate-400">percent</span></div>
        </div>
        <div className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div><p className="text-slate-400 text-sm font-medium">Interviews</p><p className="text-3xl font-bold text-amber-400 mt-1">{interviews}</p></div>
          <div className="size-12 rounded-xl bg-surface-hover flex items-center justify-center"><span className="material-symbols-outlined text-slate-400">video_camera_front</span></div>
        </div>
        <div className="bg-surface-dark border border-border-dark p-6 rounded-2xl flex items-center justify-between shadow-lg">
          <div><p className="text-slate-400 text-sm font-medium">Offers</p><p className="text-3xl font-bold text-emerald-400 mt-1">{offers}</p></div>
          <div className="size-12 rounded-xl bg-surface-hover flex items-center justify-center"><span className="material-symbols-outlined text-slate-400">thumb_up</span></div>
        </div>
      </div>

      {/* Charts & Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status Breakdown (Left) */}
        <div className="bg-surface-dark border border-border-dark p-8 rounded-2xl shadow-lg relative overflow-hidden flex flex-col justify-between">
          <h3 className="text-xl font-bold text-white mb-6">Status Breakdown</h3>
          <div className="space-y-4">
            {[
              { label: 'Applied', count: applied, color: 'bg-blue-500', total: totalApps },
              { label: 'Interview', count: interviews, color: 'bg-amber-500', total: totalApps },
              { label: 'Offer', count: offers, color: 'bg-emerald-400', total: totalApps },
              { label: 'Rejected', count: rejections, color: 'bg-red-500', total: totalApps },
              { label: 'Ghosted', count: ghosted, color: 'bg-slate-500', total: totalApps },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-1">
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
        <div className="bg-surface-dark border border-border-dark p-8 rounded-2xl shadow-lg flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-6">Outcomes</h3>
          <div className="size-48 rounded-full relative shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]" style={{ background: getGradient(), borderRadius: '50%' }}>
            <div className="absolute inset-4 bg-surface-dark rounded-full flex flex-col items-center justify-center z-10">
              <span className="text-4xl font-bold text-white">{totalApps}</span>
              <span className="text-xs text-slate-500 uppercase tracking-widest mt-1">Total</span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <div className="flex items-center gap-1 text-xs text-slate-400"><span className="size-2 rounded-full bg-emerald-400"></span>Offer</div>
            <div className="flex items-center gap-1 text-xs text-slate-400"><span className="size-2 rounded-full bg-amber-500"></span>Interview</div>
            <div className="flex items-center gap-1 text-xs text-slate-400"><span className="size-2 rounded-full bg-red-500"></span>Rejected</div>
          </div>
        </div>

        {/* Upcoming Events (Right - NEW!) */}
        <div className="bg-surface-dark border border-border-dark p-8 rounded-2xl shadow-lg flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white">Upcoming</h3>
            <Link href="/calendar" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-2">
              <span className="material-symbols-outlined text-slate-600 text-3xl">event_busy</span>
              <p className="text-slate-500 text-sm">No upcoming events.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {upcomingEvents.map(event => (
                <div key={event.id} className="p-3 rounded-xl bg-surface-hover/30 border border-white/5 flex gap-3 items-center group cursor-default">
                  <div className="flex flex-col items-center justify-center min-w-[50px] bg-black/20 rounded-lg py-1 border border-white/5">
                    <span className="text-[10px] text-red-400 font-bold uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                    <span className="text-lg font-bold text-white">{new Date(event.date).getDate()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white truncate group-hover:text-primary transition-colors">{event.title}</p>
                    <p className="text-xs text-slate-500">{event.time.substring(0, 5)} • {event.type}</p>
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
          <h2 className="text-2xl font-bold text-white">Recent Applications</h2>
          <Link href="/applications" className="text-primary text-sm font-bold hover:underline">View All</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {loading && <div className="col-span-full text-center py-10 text-slate-500">Loading applications...</div>}

          {!loading && applications.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-10 text-slate-500 border border-dashed border-border-dark rounded-2xl bg-surface-dark/50">
              <p>No recent activity. Start applying!</p>
            </div>
          )}

          {applications.slice(0, 3).map((app) => (
            <Link key={app.id} href={`/applications/${app.id}`} className="group relative bg-surface-dark rounded-2xl p-6 border border-border-dark hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 block cursor-pointer">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-xl bg-black flex items-center justify-center p-1 border border-white/10 overflow-hidden">
                    {app.company.logoUrl ? (
                      <img src={app.company.logoUrl} alt={app.company.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-white font-bold text-lg">{app.company.name.charAt(0)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{app.company.name}</h3>
                    <p className="text-xs text-slate-400">{app.position}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className={`flex items-center gap-2 px-2 py-1 rounded-md border ${getStatusColor(app.status)}`}>
                  <span className="text-[10px] font-bold tracking-wide uppercase">{app.status}</span>
                </div>
                <p className="text-xs text-slate-500">
                  {new Date(app.appliedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          ))}

          {/* Add New Button Card */}
          <Link href="/applications/new" className="group relative rounded-2xl p-6 border-2 border-dashed border-border-dark hover:border-primary/50 transition-all duration-300 flex flex-col items-center justify-center gap-2 text-center min-h-[160px]">
            <div className="size-10 rounded-full bg-surface-hover flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <span className="material-symbols-outlined text-slate-400 text-xl group-hover:text-primary transition-colors">add</span>
            </div>
            <h4 className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Add New</h4>
          </Link>
        </div>
      </div>
    </div>
  );
}
