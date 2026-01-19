"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { checkAuth } from '@/store/features/auth/authSlice';

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-8 rounded-[32px] bg-surface-card border border-border-main hover:border-primary/20 transition-all group">
      <div className="size-14 rounded-2xl bg-surface-hover border border-border-main flex items-center justify-center mb-6 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
        <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
      </div>
      <h3 className="text-xl font-bold text-text-main mb-3 group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-text-muted leading-relaxed text-sm">{description}</p>
    </div>
  );
}

export default function Home() {
  const dispatch = useAppDispatch();
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    dispatch(checkAuth());
  }, [dispatch]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;

    setSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (response.ok) {
        alert("Message sent successfully!");
        setContactForm({ name: '', email: '', subject: '', message: '' });
      } else {
        alert("Something went wrong. Please try again later.");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to server.");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-background-main text-text-main">

      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-50"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full -z-10"></div>

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-[100] bg-surface-card/80 backdrop-blur-md border-b border-border-main transition-colors">
        <div className="w-full max-w-7xl mx-auto p-4 md:p-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group/logo z-50 relative">
            <div className="relative size-10 md:size-12 shrink-0 bg-slate-900 rounded-xl p-2 border border-white/10 transition-transform group-hover/logo:scale-105">
              <Image
                src="/ApplyFollowLogo.png"
                alt="ApplyFollow Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display font-black text-xl md:text-2xl tracking-tighter text-text-main">Apply<span className="text-primary">Follow</span></span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">{t('landing.nav.features')}</a>
            <a href="#about" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">{t('landing.nav.about')}</a>
            <a href="#contact" className="text-sm font-medium text-text-muted hover:text-text-main transition-colors">{t('landing.nav.contact')}</a>
          </div>

          <div className="flex items-center gap-3 md:gap-4">

            {/* Language Toggle (Visible on Mobile too) */}
            <div className="flex bg-surface-hover rounded-xl p-1 border border-border-main transition-colors">
              <button
                onClick={() => { setLanguage('tr'); }}
                className={`px-2 md:px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${language === 'tr' ? 'bg-primary text-black' : 'text-text-muted hover:text-text-main'}`}
              >
                TR
              </button>
              <button
                onClick={() => { setLanguage('en'); }}
                className={`px-2 md:px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all ${language === 'en' ? 'bg-primary text-black' : 'text-text-muted hover:text-text-main'}`}
              >
                EN
              </button>
            </div>

            {/* Desktop Auth & Theme */}
            <div className="flex items-center gap-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="size-10 flex items-center justify-center rounded-xl bg-surface-hover border border-border-main text-text-main hover:border-primary transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {theme === 'dark' ? 'light_mode' : 'dark_mode'}
                </span>
              </button>

              {/* Auth Buttons (Desktop Only) */}
              <div className="hidden md:flex items-center gap-4">
                {isMounted && isAuthenticated ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all font-bold group"
                  >
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    <span className="text-sm">{t('sidebar.overview')}</span>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" className="px-5 py-2 rounded-lg border border-border-main hover:bg-surface-hover transition-colors text-sm font-medium text-text-main">{t('landing.nav.login')}</Link>
                    <Link href="/register" className="px-5 py-2 rounded-lg bg-primary text-black font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20">{t('landing.nav.signup')}</Link>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex md:hidden items-center gap-3">
              <button
                onClick={toggleMobileMenu}
                className="size-10 flex items-center justify-center rounded-xl bg-surface-hover border border-border-main text-text-main active:scale-95 z-50 relative"
              >
                <span className="material-symbols-outlined text-2xl">
                  {isMobileMenuOpen ? 'close' : 'menu'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown - Solid Distinct Color & Premium Glossy Style */}
        {isMobileMenuOpen && (
          <div
            className="absolute top-full left-0 right-0 bg-[#0f172a] border-b border-t border-primary/30 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] md:hidden animate-in slide-in-from-top-2 duration-300 overflow-hidden rounded-b-[2.5rem]"
          >
            <div className="flex flex-col p-10 gap-8 items-center text-center relative">
              {/* Glossy Top Highlight */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent shadow-[0_0_15px_rgba(var(--primary-rgb),0.3)]" />

              <div className="flex flex-col gap-6">
                <a onClick={closeMobileMenu} href="#features" className="text-xl font-display font-medium text-text-main active:scale-95 transition-all">{t('landing.nav.features')}</a>
                <a onClick={closeMobileMenu} href="#about" className="text-xl font-display font-medium text-text-main active:scale-95 transition-all">{t('landing.nav.about')}</a>
                <a onClick={closeMobileMenu} href="#contact" className="text-xl font-display font-medium text-text-main active:scale-95 transition-all">{t('landing.nav.contact')}</a>
              </div>

              <div className="w-12 h-px bg-white/10" />

              <div className="flex flex-col w-full gap-4 max-w-xs mx-auto mb-4">
                {isMounted && isAuthenticated ? (
                  <Link
                    onClick={closeMobileMenu}
                    href="/dashboard"
                    className="w-full py-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
                  >
                    <span className="material-symbols-outlined">dashboard</span>
                    <span>{t('sidebar.overview')}</span>
                  </Link>
                ) : (
                  <>
                    <Link onClick={closeMobileMenu} href="/login" className="w-full py-4 rounded-2xl border border-border-main text-center font-bold text-text-main bg-surface-card active:scale-95 transition-all">
                      {t('landing.nav.login')}
                    </Link>
                    <Link onClick={closeMobileMenu} href="/register" className="w-full py-4 rounded-2xl bg-primary text-black text-center font-black shadow-lg shadow-primary/20 active:scale-95 transition-all">
                      {t('landing.nav.signup')}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <div className="pt-20 md:pt-24 h-full"> {/* Offset for navbar */}
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-20 flex flex-col items-center text-center">


          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-display font-black leading-[1.1] mb-6 text-text-main animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100 px-4">
            {t('landing.hero.title')}
          </h1>

          <p className="max-w-2xl text-base md:text-xl text-text-muted mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 px-4">
            {t('landing.hero.subtitle')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link
              href="/register"
              className="h-12 px-8 rounded-lg bg-primary text-black font-bold text-base flex items-center gap-2 hover:opacity-90 hover:scale-105 transition-all shadow-lg shadow-primary/20"
            >
              {t('landing.hero.getStarted')}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>

          {/* Mockup / Visual */}
          <div className="mt-12 relative w-full max-w-5xl aspect-video rounded-3xl bg-surface-card border border-border-main shadow-[0_0_80px_-15px_rgba(var(--primary-rgb),0.15)] overflow-hidden group animate-in fade-in zoom-in duration-1000 delay-500">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none"></div>

            {/* Actual Dashboard UI Representation */}
            <div className="p-4 md:p-8 h-full flex gap-6 opacity-60 group-hover:opacity-100 transition-all duration-700 scale-105 group-hover:scale-100">
              {/* Sidebar Mock */}
              <div className="hidden md:flex w-60 h-full flex-col gap-6 border-r border-border-main/50 pr-6">
                <div className="flex items-center gap-2 px-2">
                  <div className="size-8 bg-primary rounded-lg"></div>
                  <div className="h-4 w-24 bg-text-main/20 rounded-full"></div>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { icon: 'dashboard', label: t('sidebar.overview'), active: true },
                    { icon: 'work', label: t('sidebar.applications'), active: false },
                    { icon: 'calendar_month', label: t('sidebar.schedule'), active: false },
                    { icon: 'description', label: t('sidebar.cvBuilder'), active: false },
                    { icon: 'settings', label: t('sidebar.settings'), active: false }
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all ${item.active ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-transparent border-transparent text-text-muted'}`}>
                      <span className="material-symbols-outlined text-xl">{item.icon}</span>
                      <span className="text-xs font-bold">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Mock */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Header Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { label: t('dashboard.stats.total'), value: '32', color: 'text-text-main', icon: 'analytics' },
                    { label: t('dashboard.stats.interviews'), value: '7', color: 'text-amber-400', icon: 'groups' },
                    { label: 'Offers', value: '3', color: 'text-emerald-400', icon: 'verified' },
                    { label: t('dashboard.stats.pending'), value: '22', color: 'text-blue-400', icon: 'pending' }
                  ].map((stat, i) => (
                    <div key={i} className="bg-surface-hover rounded-2xl border border-border-main p-4 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="material-symbols-outlined text-text-muted text-lg">{stat.icon}</span>
                        <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
                      </div>
                      <p className="text-[10px] text-text-muted font-bold uppercase">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Cards Grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { company: 'Microsoft', pos: 'Software Engineer II', status: 'INTERVIEW', color: 'bg-amber-400/10 text-amber-400', logo: 'M' },
                    { company: 'Amazon', pos: 'Cloud Engineer', status: 'APPLIED', color: 'bg-blue-400/10 text-blue-400', logo: 'A' },
                    { company: 'Stripe', pos: 'Fullstack Developer', status: 'OFFER', color: 'bg-emerald-400/10 text-emerald-400', logo: 'S' },
                    { company: 'Netflix', pos: 'Data Scientist', status: 'REJECTED', color: 'bg-red-400/10 text-red-400', logo: 'N' },
                    { company: 'Apple', pos: 'iOS Developer', status: 'APPLIED', color: 'bg-blue-400/10 text-blue-400', logo: 'A' },
                    { company: 'Google', pos: 'Product Manager', status: 'INTERVIEW', color: 'bg-amber-400/10 text-amber-400', logo: 'G' }
                  ].map((card, i) => (
                    <div key={i} className="bg-surface-hover rounded-2xl border border-border-main p-5 flex flex-col gap-4 hover:border-primary/30 transition-all">
                      <div className="flex items-start justify-between">
                        <div className="size-10 rounded-xl bg-background flex items-center justify-center font-black text-lg border border-border-main">{card.logo}</div>
                        <div className={`px-2 py-1 rounded-md text-[10px] font-black ${card.color}`}>{card.status}</div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-text-main truncate">{card.pos}</h4>
                        <p className="text-xs text-text-muted">{card.company}</p>
                      </div>
                      <div className="mt-auto h-8 w-full bg-surface-card rounded-lg border border-border-main flex items-center justify-center">
                        <span className="text-[10px] font-bold text-text-muted">Details</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* Features Grid */}
        <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-border-main">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-black mb-4 text-text-main">{t('landing.features.title')}</h2>
            <p className="text-text-muted">{t('landing.features.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="dashboard"
              title={t('landing.features.cards.allInOne.title')}
              description={t('landing.features.cards.allInOne.desc')}
            />
            <FeatureCard
              icon="notifications_active"
              title={t('landing.features.cards.reminders.title')}
              description={t('landing.features.cards.reminders.desc')}
            />
            <FeatureCard
              icon="insights"
              title={t('landing.features.cards.analytics.title')}
              description={t('landing.features.cards.analytics.desc')}
            />
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="max-w-7xl mx-auto px-6 py-20 border-t border-border-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/10 transition-colors duration-500 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-background to-transparent z-20"></div>
              <Image
                src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2032&auto=format&fit=crop"
                alt="Empowering Professionals"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">{t('landing.about.badge')}</div>
              <h2 className="text-4xl md:text-6xl font-display font-black mb-8 leading-tight text-text-main">{t('landing.about.title')}</h2>
              <p className="text-text-muted text-lg leading-relaxed mb-6">
                {t('landing.about.desc1')}
              </p>
              <p className="text-text-muted text-lg leading-relaxed mb-10">
                {t('landing.about.desc2')}
              </p>

            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="max-w-7xl mx-auto px-6 py-20 border-t border-border-main">
          <div className="bg-surface-card border border-border-main rounded-[40px] p-8 md:p-16 relative overflow-hidden transition-colors">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full -z-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-4xl md:text-6xl font-display font-black mb-8 text-text-main">{t('landing.contact.title')}</h2>
                <p className="text-text-muted text-lg mb-12 max-w-md">
                  {t('landing.contact.subtitle')}
                </p>
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-surface-hover border border-border-main flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">mail</span>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted font-bold uppercase">{t('landing.contact.info.email')}</p>
                      <p className="text-text-main font-bold">dev.oguzhankaya@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-surface-hover border border-border-main flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary">location_on</span>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted font-bold uppercase">{t('landing.contact.info.location')}</p>
                      <p className="text-text-main font-bold">Sinop, Türkiye</p>
                    </div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleContactSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder={t('landing.contact.form.name')}
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    className="h-14 bg-background border border-border-main rounded-2xl px-6 text-text-main outline-none focus:border-primary transition-colors text-sm"
                    required
                  />
                  <input
                    type="email"
                    placeholder={t('landing.contact.form.email')}
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    className="h-14 bg-background border border-border-main rounded-2xl px-6 text-text-main outline-none focus:border-primary transition-colors text-sm"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder={t('landing.contact.form.subject')}
                  value={contactForm.subject}
                  onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                  className="h-14 bg-background border border-border-main rounded-2xl px-6 text-text-main outline-none focus:border-primary transition-colors text-sm"
                  required
                />
                <textarea
                  placeholder={t('landing.contact.form.message')}
                  rows={5}
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  className="bg-background border border-border-main rounded-2xl p-6 text-text-main outline-none focus:border-primary transition-colors text-sm resize-none"
                  required
                ></textarea>
                <button
                  type="submit"
                  disabled={sending}
                  className="h-14 bg-primary text-black font-black rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-primary/20 mt-4 flex items-center justify-center gap-2"
                >
                  {sending && <span className="size-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>}
                  {sending ? t('landing.contact.form.sending') : t('landing.contact.form.send')}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-12 text-text-muted text-sm border-t border-border-main bg-surface-card transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-6 group/flogo">
            <div className="relative size-16 shrink-0 bg-slate-900 rounded-xl p-2 border border-white/10 transition-transform group-hover/flogo:scale-105">
              <Image
                src="/ApplyFollowLogo.png"
                alt="ApplyFollow Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display font-bold text-text-main tracking-tight">Apply<span className="text-primary">Follow</span></span>
          </Link>
          <p>{t('landing.footer.rights')}</p>
          <div className="flex items-center gap-6">
            <a href="https://www.linkedin.com/in/oğuzhan-kaya-fullstackdeveloper" target="_blank" rel="noreferrer" className="hover:text-text-main transition-colors">LinkedIn</a>
            <Link href="#" className="hover:text-text-main transition-colors">{t('landing.footer.links.terms')}</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}
