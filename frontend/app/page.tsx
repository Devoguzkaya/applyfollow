"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useState, useEffect } from "react";

// --- Custom Fragments (No more Cards) ---

function FeatureFragment({ icon, title, description, delay, align = 'left' }: { icon: string; title: string; description: string; delay: string; align?: 'left' | 'right' }) {
  return (
    <div className={`flex flex-col ${align === 'right' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} max-w-xl mb-24 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 ${delay}`}>
      <div className={`absolute -z-10 text-[6rem] font-black text-white/[0.03] select-none pointer-events-none -top-12 ${align === 'right' ? '-right-6' : '-left-6'}`}>
        {icon.toUpperCase().substring(0, 3)}
      </div>
      <div className="size-12 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all">
        <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
      </div>
      <h3 className="text-2xl md:text-3xl font-display font-black text-white mb-4 tracking-tighter capitalize">{title}</h3>
      <p className="text-text-muted leading-relaxed text-base opacity-70 max-w-sm">{description}</p>
    </div>
  );
}

function DataFragment({ code, delay, className }: { code: string; delay: string; className: string }) {
  return (
    <div className={`absolute -z-10 p-4 rounded-lg bg-white/[0.02] border border-white/[0.05] font-mono text-[10px] text-primary/30 pointer-events-none select-none animate-in fade-in duration-1000 ${delay} ${className}`}>
      <pre>{code}</pre>
    </div>
  );
}

function QuoteFragment({ text, author }: { text: string; author: string }) {
  return (
    <div className="relative py-14 border-y border-white/5 group">
      <span className="material-symbols-outlined absolute -top-6 left-0 text-primary/10 text-[6rem] select-none">format_quote</span>
      <p className="text-2xl md:text-3xl font-display font-bold text-white leading-tight mb-6 relative z-10 italic">"{text}"</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-px bg-primary/40"></div>
        <p className="text-primary font-bold tracking-widest uppercase text-[10px]">{author}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t, language, setLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-background transition-colors selection:bg-primary/30">

      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-[#0A0C10] overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-surface-card/80 backdrop-blur-md border-b border-border-main py-4' : 'bg-transparent py-6'}`}>
        <div className="w-full px-8 md:px-16 lg:px-24 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group/logo">
            <div className="relative size-10 md:size-12 shrink-0 bg-slate-900 rounded-xl p-2 border border-white/10 transition-transform group-hover/logo:scale-105">
              <Image src="/logo.svg" alt="ApplyFollow" width={40} height={40} className="w-full h-full" priority />
            </div>
            <span className="text-xl md:text-2xl font-display font-black tracking-tight text-white group-hover/logo:text-primary transition-colors">
              ApplyFollow
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            {['features', 'how-it-works', 'about', 'contact'].map((item) => (
              <a key={item} href={`#${item}`} className="text-sm font-bold text-text-muted hover:text-primary transition-colors uppercase tracking-widest">
                {t(`landing.nav.${item.replace('-', '')}`)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="px-3 py-1.5 rounded-lg bg-surface-hover border border-border-main text-xs font-bold text-text-main hover:border-primary transition-all uppercase"
            >
              {language === 'tr' ? 'EN' : 'TR'}
            </button>
            <Link href="/login" className="hidden sm:block text-sm font-bold text-text-main hover:text-primary transition-colors">
              {t('landing.nav.login')}
            </Link>
            <Link href="/register" className="px-6 py-2.5 rounded-xl bg-primary text-slate-950 text-sm font-bold hover:bg-emerald-400 transition-all shadow-glow hover:-translate-y-0.5 active:translate-y-0 text-center">
              {t('landing.nav.signup')}
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-32 pb-20">

        {/* --- Hero Section --- */}
        <section className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 flex flex-col lg:flex-row items-center gap-16 min-h-[80vh] relative">
          <DataFragment code={`GET /api/v1/apps\nStatus: 200 OK\nCache: HIT`} delay="delay-500" className="top-20 -left-10" />
          <DataFragment code={`{\n  "id": "app_921",\n  "status": "INTERVIEW"\n}`} delay="delay-700" className="bottom-40 right-20" />

          <div className="flex-1 text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <span className="material-symbols-outlined text-[14px] animate-pulse">rocket_launch</span>
              {t('landing.hero.badge')}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[0.95] mb-8 text-white animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 italic tracking-tighter">
              {t('landing.hero.title')}
            </h1>

            <p className="max-w-lg text-base md:text-lg text-text-muted mb-10 leading-relaxed opacity-60 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {t('landing.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link href="/register" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-slate-950 font-black text-base hover:bg-primary transition-all shadow-glow-white-10 hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                {t('landing.hero.getStarted')}
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
              <a href="https://github.com/oguzkaya/applyfollow" target="_blank" className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-white/10 bg-white/5 text-white font-bold text-base hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                <Image src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" width={20} height={20} className="invert opacity-70" />
                {t('landing.hero.starGithub')}
              </a>
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-square lg:aspect-auto lg:h-[500px] animate-in fade-in slide-in-from-right-12 duration-1000 delay-500">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 blur-[120px] rounded-full"></div>
            <div className="relative w-full h-full rounded-2xl bg-slate-900 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden group rotate-1 hover:rotate-0 transition-transform duration-700">
              <Image src="/landing/hero.png" alt="Dashboard Preview" fill className="object-cover group-hover:scale-[1.05] transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-tr from-background/80 via-transparent to-transparent pointer-events-none"></div>
            </div>

            {/* Float Elements */}
            <div className="absolute -top-6 -right-6 p-4 bg-surface-card border border-white/10 rounded-xl shadow-2xl animate-bounce duration-[3000ms] hidden md:block">
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-bold text-white tracking-widest uppercase">Live Process</span>
              </div>
            </div>
          </div>
        </section>


        {/* --- Features Section --- */}
        <section id="features" className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 py-24 border-t border-white/5 relative">
          <div className="technical-grid opacity-40"></div>
          <DataFragment code={`[System]: Optimizing timeline...\nProcessing ID: 88219-X`} delay="delay-200" className="top-40 right-10" />

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-[20%] right-[-5%] text-[12rem] font-black text-white/[0.02] rotate-90 select-none uppercase">Features</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 relative z-10">
            <div className="md:pt-24">
              <FeatureFragment
                icon="dashboard"
                title={t('landing.features.cards.allInOne.title')}
                description={t('landing.features.cards.allInOne.desc')}
                delay="delay-100"
              />
              <FeatureFragment
                icon="bar_chart"
                title={t('landing.features.cards.analytics.title')}
                description={t('landing.features.cards.analytics.desc')}
                delay="delay-300"
              />
            </div>
            <div>
              <FeatureFragment
                icon="notifications_active"
                title={t('landing.features.cards.reminders.title')}
                description={t('landing.features.cards.reminders.desc')}
                delay="delay-200"
                align="right"
              />
              <FeatureFragment
                icon="description"
                title={t('landing.features.cards.cvBuilder.title')}
                description={t('landing.features.cards.cvBuilder.desc')}
                delay="delay-400"
                align="right"
              />
            </div>
          </div>
        </section>

        {/* --- How It Works Section (Flow) --- */}
        <section id="how-it-works" className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 py-24 relative border-t border-white/5 overflow-hidden">
          <div className="technical-grid opacity-20"></div>
          <div className="flex flex-col lg:flex-row items-start gap-16 relative z-10">
            <div className="lg:sticky lg:top-40 lg:max-w-xs">
              <h2 className="text-4xl md:text-6xl font-display font-black mb-6 text-white leading-[0.8] italic">{t('landing.howItWorks.title')}</h2>
              <p className="text-text-muted text-lg opacity-50 leading-relaxed border-l-2 border-primary pl-5">{t('landing.howItWorks.subtitle')}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className={`flex flex-col gap-4 animate-in fade-in slide-in-from-right-12 duration-1000 delay-${num}00`}>
                  <div className="text-4xl font-display font-black text-primary/10 select-none">0{num}</div>
                  <h4 className="text-xl font-display font-black text-white tracking-tight capitalize">{t(`landing.howItWorks.steps.step${num}.title`)}</h4>
                  <p className="text-text-muted text-base max-w-xs leading-relaxed opacity-70">{t(`landing.howItWorks.steps.step${num}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- About Us / Mission Section --- */}
        <section id="about" className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 py-24 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-16 relative">
            <DataFragment code={`MISSION_CRITICAL\nTARGET_DATE: 2026\nAUTH: ENABLED`} delay="delay-600" className="bottom-0 -right-10" />
            <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl group shrink-0 border border-white/10">
              <Image src="/landing/hero.png" alt="Mission" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
            </div>
            <div className="flex-1">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">{t('landing.about.badge')}</div>
              <h2 className="text-3xl md:text-4xl font-display font-black mb-6 leading-tight text-white">{t('landing.about.title')}</h2>
              <div className="space-y-4">
                <p className="text-text-muted text-base leading-relaxed opacity-70">{t('landing.about.desc1')}</p>
                <p className="text-text-muted text-base leading-relaxed opacity-70">{t('landing.about.desc2')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Testimonials (Editorial Style) --- */}
        <section className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 py-32 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <QuoteFragment text={t('landing.testimonials.quotes.0.text')} author={t('landing.testimonials.quotes.0.author')} />
            <div className="h-16 lg:h-32"></div>
            <div className="md:pl-32">
              <QuoteFragment text={t('landing.testimonials.quotes.1.text')} author={t('landing.testimonials.quotes.1.author')} />
            </div>
          </div>
        </section>

        {/* --- FAQ Section (Modern Minimal) --- */}
        <section className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 py-24 bg-slate-950/20 border-t border-white/5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-display font-black text-white leading-tight mb-8 italic">{t('landing.faq.title')}</h2>
              <div className="size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">help_outline</span>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-10">
              {[0, 1].map((idx) => (
                <div key={idx} className="group border-b border-white/5 pb-10">
                  <h3 className="text-xl font-display font-bold text-white mb-4 group-hover:text-primary transition-colors flex items-center justify-between">
                    {t(`landing.faq.items.${idx}.q`)}
                    <span className="material-symbols-outlined text-white/20 group-hover:rotate-45 transition-transform text-xl">add</span>
                  </h3>
                  <p className="text-text-muted opacity-50 text-base leading-relaxed max-w-xl">{t(`landing.faq.items.${idx}.a`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Contact Section --- */}
        <section id="contact" className="w-full px-8 md:px-16 lg:px-24 py-32 border-t border-border-main">
          <div className="bg-surface-card border border-border-main rounded-[48px] p-8 md:p-16 relative overflow-hidden transition-all shadow-glow-emerald/10">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -z-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
              <div>
                <h2 className="text-4xl md:text-6xl font-display font-black mb-8 text-white">{t('landing.contact.title')}</h2>
                <p className="text-text-muted text-lg mb-12 max-w-md opacity-80 leading-relaxed">
                  {t('landing.contact.subtitle')}
                </p>
                <div className="flex flex-col gap-8">
                  <div className="flex items-center gap-6 group">
                    <div className="size-14 rounded-2xl bg-surface-hover border border-border-main flex items-center justify-center group-hover:border-primary transition-all">
                      <span className="material-symbols-outlined text-primary text-2xl">mail</span>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase font-bold tracking-widest mb-1">{t('landing.contact.info.email')}</p>
                      <p className="text-white font-bold text-lg">hello@applyfollow.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 group">
                    <div className="size-14 rounded-2xl bg-surface-hover border border-border-main flex items-center justify-center group-hover:border-primary transition-all">
                      <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                    </div>
                    <div>
                      <p className="text-xs text-text-muted uppercase font-bold tracking-widest mb-1">{t('landing.contact.info.location')}</p>
                      <p className="text-white font-bold text-lg">Istanbul, Turkey</p>
                    </div>
                  </div>
                </div>
              </div>

              <form className="bg-white/5 p-12 rounded-[40px] border border-white/5 flex flex-col gap-8 backdrop-blur-sm shadow-2xl relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1 opacity-50">{t('landing.contact.form.name')}</label>
                    <input type="text" className="bg-transparent border-b border-white/10 px-0 py-3 text-white focus:border-primary outline-none transition-all placeholder:text-white/10" placeholder="Oğuzhan Kaya" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1 opacity-50">{t('landing.contact.form.email')}</label>
                    <input type="email" className="bg-transparent border-b border-white/10 px-0 py-3 text-white focus:border-primary outline-none transition-all placeholder:text-white/10" placeholder="oguz@applyfollow.com" />
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1 opacity-50">{t('landing.contact.form.subject')}</label>
                  <input type="text" className="bg-transparent border-b border-white/10 px-0 py-3 text-white focus:border-primary outline-none transition-all placeholder:text-white/10" placeholder="How can we help?" />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1 opacity-50">{t('landing.contact.form.message')}</label>
                  <textarea className="bg-transparent border-b border-white/10 px-0 py-4 text-white resize-none h-32 focus:border-primary outline-none transition-all placeholder:text-white/10" placeholder="..." />
                </div>
                <button className="w-full py-5 rounded-full bg-primary text-slate-950 font-black text-lg hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow-emerald-20 mt-4 uppercase tracking-widest">
                  {t('landing.contact.form.send')}
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full text-center py-16 text-text-muted text-sm border-t border-border-main bg-background transition-colors">
        <div className="w-full px-8 md:px-16 lg:px-24 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-10">
            <Link href="/" className="flex items-center gap-4 group/flogo">
              <div className="relative size-12 shrink-0 bg-slate-900 rounded-xl p-2.5 border border-white/10 transition-transform group-hover/flogo:scale-105">
                <Image src="/logo.svg" alt="ApplyFollow" width={40} height={40} className="w-full h-full" />
              </div>
              <span className="text-xl font-display font-black text-white tracking-tighter">ApplyFollow</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-8">
              <Link href="/legal/terms" className="hover:text-primary transition-colors hover:underline underline-offset-4">{t('landing.footer.links.terms')}</Link>
              <Link href="/legal/privacy" className="hover:text-primary transition-colors hover:underline underline-offset-4">Gizlilik</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <a href="#" className="size-10 rounded-full border border-border-main flex items-center justify-center hover:border-primary hover:text-primary transition-all"><span className="material-symbols-outlined text-[18px]">public</span></a>
            <a href="#" className="size-10 rounded-full border border-border-main flex items-center justify-center hover:border-primary hover:text-primary transition-all"><span className="material-symbols-outlined text-[18px]">alternate_email</span></a>
          </div>

          <p className="opacity-60">{t('landing.footer.rights')}</p>
        </div>
      </footer>
    </main>
  );
}
