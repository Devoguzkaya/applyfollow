"use client";

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-[#0A0C10] text-white">

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full -z-10"></div>

      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto p-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">work_history</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">ApplyFollow</span>
        </div>
        <div>
          <Link href="/login" className="px-5 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium">Log In</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-dark border border-white/10 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="size-2 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">v1.0 Public Beta</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Land Your Dream Job <br /> Without the Chaos.
        </h1>

        <p className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          Stop using spreadsheets. Track applications, manage interviews, and organize your network in one powerful workspace designed for developers.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link
            href="/register"
            className="h-12 px-8 rounded-lg bg-primary text-[#101618] font-bold text-base flex items-center gap-2 hover:bg-emerald-400 hover:scale-105 transition-all shadow-glow"
          >
            Get Started
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <a
            href="https://github.com/Devoguzkaya/applyfollow"
            target="_blank"
            rel="noreferrer"
            className="h-12 px-8 rounded-lg bg-surface-dark border border-white/10 text-white font-medium text-base flex items-center gap-2 hover:bg-white/5 transition-all"
          >
            <i className="devicon-github-original text-xl"></i>
            Star on GitHub
          </a>
        </div>

        {/* Mockup / Visual */}
        <div className="mt-20 relative w-full max-w-5xl aspect-video rounded-xl bg-surface-dark border border-border-dark shadow-2xl overflow-hidden group animate-in fade-in zoom-in duration-1000 delay-500">
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-transparent to-transparent z-10"></div>

          {/* Abstract Dashboard UI Representation */}
          <div className="p-8 h-full flex flex-col gap-6 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
            <div className="flex gap-6 h-full">
              {/* Sidebar Mock */}
              <div className="w-64 h-full bg-surface-hover/30 rounded-lg border border-white/5"></div>
              {/* Main Content Mock */}
              <div className="flex-1 flex flex-col gap-6">
                <div className="h-32 w-full bg-surface-hover/30 rounded-lg border border-white/5"></div>
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div className="bg-surface-hover/20 rounded-lg border border-white/5"></div>
                  <div className="bg-surface-hover/20 rounded-lg border border-white/5"></div>
                  <div className="bg-surface-hover/20 rounded-lg border border-white/5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="dashboard"
            title="All in One Place"
            description="Ditch the messy Excel sheets. View all your applications, statuses, and notes in a unified dashboard."
          />
          <FeatureCard
            icon="notifications_active"
            title="Smart Reminders"
            description="Never miss an interview. Get automated notifications for upcoming calls and follow-ups."
          />
          <FeatureCard
            icon="insights"
            title="Pipeline Analytics"
            description="Visualize your progress. See how many applications are sent, interviewed, or offered."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full text-center py-8 text-slate-600 text-sm border-t border-white/5">
        <p>© 2026 ApplyFollow. Built with ❤️ by Oguzhan.</p>
      </footer>

    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: string, title: string, description: string }) {
  return (
    <div className="p-6 rounded-2xl bg-surface-dark border border-border-dark hover:border-primary/30 transition-colors group">
      <div className="size-12 rounded-xl bg-surface-hover flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
        <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
}
