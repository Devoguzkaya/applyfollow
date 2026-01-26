"use client";

import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import { MdWbSunny, MdDarkMode } from "react-icons/md";
import Navbar from "@/components/Navbar";

// --- Custom Fragments (No more Cards) ---

function FeatureFragment({ icon, title, description, delay, align = 'left', theme }: { icon: string; title: string; description: string; delay: string; align?: 'left' | 'right'; theme: string }) {
  return (
    <div className={`flex flex-col ${align === 'right' ? 'md:items-end md:text-right' : 'md:items-start md:text-left'} max-w-xl mb-16 relative animate-in fade-in slide-in-from-bottom-12 duration-1000 ${delay}`}>
      <div className={`absolute -z-10 text-[6rem] font-black ${theme === 'dark' ? 'text-white/[0.03]' : 'text-text-main/[0.05]'} select-none pointer-events-none -top-12 ${align === 'right' ? '-right-6' : '-left-6'}`}>
        {icon.toUpperCase().substring(0, 3)}
      </div>
      <div className="size-12 rounded-full bg-primary/5 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all">
        <span className="material-symbols-outlined text-primary text-2xl">{icon}</span>
      </div>
      <h3 className="text-2xl md:text-3xl font-display font-black text-text-main mb-4 tracking-tighter capitalize">{title}</h3>
      <p className="text-text-muted leading-relaxed text-base max-w-sm">{description}</p>
    </div>
  );
}

function DataFragment({ code, delay, className, theme }: { code: string; delay: string; className: string; theme: string }) {
  return (
    <div className={`absolute -z-10 p-4 rounded-lg ${theme === 'dark' ? 'bg-white/[0.02] border-white/[0.05]' : 'bg-text-main/[0.02] border-border-main/20'} border font-mono text-[10px] text-primary/30 pointer-events-none select-none animate-in fade-in duration-1000 ${delay} ${className}`}>
      <pre>{code}</pre>
    </div>
  );
}

function QuoteFragment({ text, author }: { text: string; author: string }) {
  return (
    <div className="relative py-14 border-y border-border-main/10 group">
      <span className="material-symbols-outlined absolute -top-6 left-0 text-primary/10 text-[6rem] select-none">format_quote</span>
      <p className="text-2xl md:text-3xl font-display font-bold text-text-main leading-tight mb-6 relative z-10 italic">"{text}"</p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-px bg-primary/40"></div>
        <p className="text-primary font-bold tracking-widest uppercase text-[10px]">{author}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-background transition-colors selection:bg-primary/30">

      {/* Decorative Gradients */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 bg-background-main overflow-hidden pointer-events-none transition-colors duration-500">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${theme === 'dark' ? 'bg-primary/10' : 'bg-primary/20'} blur-[120px] rounded-full`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${theme === 'dark' ? 'bg-indigo-500/10' : 'bg-indigo-500/20'} blur-[120px] rounded-full`}></div>
      </div>

      <Navbar />

      <div className="pt-32 pb-20">

        {/* --- Hero Section --- */}
        <section className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 flex flex-col lg:flex-row items-center gap-16 min-h-[80vh] relative">
          <DataFragment code={`GET /api/v1/apps\nStatus: 200 OK\nCache: HIT`} delay="delay-500" className="top-20 -left-10" theme={theme} />
          <DataFragment code={`{\n  "id": "app_921",\n  "status": "INTERVIEW"\n}`} delay="delay-700" className="bottom-40 right-20" theme={theme} />

          <div className="flex-1 text-left relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-widest mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
              <span className="material-symbols-outlined text-[14px] animate-pulse">rocket_launch</span>
              {t('landing.hero.badge')}
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black leading-[0.95] mb-8 text-text-main animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 italic tracking-tighter">
              {t('landing.hero.title')}
            </h1>

            <p className="max-w-lg text-base md:text-lg text-text-muted mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              {t('landing.hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
              <Link href="/register" className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-primary text-slate-950 font-black text-base hover:bg-primary-dark transition-all shadow-glow hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
                {t('landing.hero.getStarted')}
                <span className="material-symbols-outlined text-xl">arrow_forward</span>
              </Link>
              <a href="https://github.com/Devoguzkaya/applyfollow" target="_blank" className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-border-main bg-surface-card/10 text-text-main font-bold text-base hover:bg-surface-hover transition-all flex items-center justify-center gap-3">
                <Image src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" width={20} height={20} className={`${theme === 'dark' ? 'invert' : ''} opacity-70`} />
                {t('landing.hero.starGithub')}
              </a>
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-square lg:aspect-auto lg:h-[500px] animate-in fade-in slide-in-from-right-12 duration-1000 delay-500">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-primary/5 blur-[120px] rounded-full"></div>
            <div className={`relative w-full h-full rounded-2xl bg-surface-card border border-border-main ${theme === 'dark' ? 'shadow-[0_0_80px_rgba(0,0,0,0.5)]' : 'shadow-card'} overflow-hidden group rotate-1 hover:rotate-0 transition-transform duration-700`}>
              <Image src="/landing/hero.png" alt="Dashboard Preview" fill className="object-cover group-hover:scale-[1.05] transition-transform duration-1000" />
              <div className={`absolute inset-0 bg-gradient-to-tr ${theme === 'dark' ? 'from-background/80' : 'from-background/20'} via-transparent to-transparent pointer-events-none`}></div>
            </div>

            {/* Float Elements */}
            <div className="absolute -top-6 -right-6 p-4 bg-surface-card border border-white/10 rounded-xl shadow-2xl animate-bounce duration-[3000ms] hidden md:block">
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-primary animate-pulse"></div>
                <span className="text-xs font-bold text-text-main tracking-widest uppercase">Live Process</span>
              </div>
            </div>
          </div>
        </section>


        {/* --- Features Section --- */}
        <section id="features" className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 pt-24 pb-12 border-t border-border-main/10 relative">
          <div className="technical-grid opacity-40"></div>
          <DataFragment code={`[System]: Optimizing timeline...\nProcessing ID: 88219-X`} delay="delay-200" className="top-40 right-10" theme={theme} />

          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
            <div className={`absolute top-[20%] right-[-5%] text-[12rem] font-black ${theme === 'dark' ? 'text-white/[0.02]' : 'text-text-main/[0.03]'} rotate-90 select-none uppercase`}>Features</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 relative z-10">
            <div className="md:pt-24">
              <FeatureFragment
                icon="dashboard"
                title={t('landing.features.cards.allInOne.title')}
                description={t('landing.features.cards.allInOne.desc')}
                delay="delay-100"
                theme={theme}
              />
              <FeatureFragment
                icon="bar_chart"
                title={t('landing.features.cards.analytics.title')}
                description={t('landing.features.cards.analytics.desc')}
                delay="delay-300"
                theme={theme}
              />
            </div>
            <div>
              <FeatureFragment
                icon="notifications_active"
                title={t('landing.features.cards.reminders.title')}
                description={t('landing.features.cards.reminders.desc')}
                delay="delay-200"
                align="right"
                theme={theme}
              />
              <FeatureFragment
                icon="description"
                title={t('landing.features.cards.cvBuilder.title')}
                description={t('landing.features.cards.cvBuilder.desc')}
                delay="delay-400"
                align="right"
                theme={theme}
              />
            </div>
          </div>
        </section>

        {/* --- How It Works Section (Flow) --- */}
        <section id="how-it-works" className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 pt-12 pb-24 relative border-t border-border-main/10 overflow-hidden">
          <div className="technical-grid opacity-20"></div>
          <div className="flex flex-col lg:flex-row items-start gap-16 relative z-10">
            <div className="lg:sticky lg:top-40 lg:max-w-xs">
              <h2 className="text-4xl md:text-6xl font-display font-black mb-6 text-text-main leading-[0.8] italic">{t('landing.howItWorks.title')}</h2>
              <p className="text-text-muted text-lg leading-relaxed border-l-2 border-primary pl-5">{t('landing.howItWorks.subtitle')}</p>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-12 relative">
              {/* Left Column (1, 3, 5) */}
              <div className="flex flex-col gap-12">
                {[1, 3, 5].map((num) => (
                  <div key={num} className={`flex flex-col gap-4 animate-in fade-in slide-in-from-right-12 duration-1000 delay-${num}00`}>
                    <div className="text-4xl font-display font-black text-primary/10 select-none">0{num}</div>
                    <h4 className="text-xl font-display font-black text-text-main tracking-tight capitalize">{t(`landing.howItWorks.steps.step${num}.title`)}</h4>
                    <p className="text-text-muted text-base leading-relaxed">{t(`landing.howItWorks.steps.step${num}.desc`)}</p>
                  </div>
                ))}
              </div>

              {/* Right Column (2, 4, 6) - with top margin */}
              <div className="flex flex-col gap-12 md:mt-16">
                {[2, 4, 6].map((num) => (
                  <div key={num} className={`flex flex-col gap-4 animate-in fade-in slide-in-from-right-12 duration-1000 delay-${num}00`}>
                    <div className="text-4xl font-display font-black text-primary/10 select-none">0{num}</div>
                    <h4 className="text-xl font-display font-black text-text-main tracking-tight capitalize">{t(`landing.howItWorks.steps.step${num}.title`)}</h4>
                    <p className="text-text-muted text-base leading-relaxed">{t(`landing.howItWorks.steps.step${num}.desc`)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* --- About Us / Mission Section --- */}
        <section id="about" className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 py-24 overflow-hidden">
          <div className="flex flex-col lg:flex-row items-center gap-16 relative">
            <DataFragment code={`MISSION_CRITICAL\nTARGET_DATE: 2026\nAUTH: ENABLED`} delay="delay-600" className="bottom-0 -right-10" theme={theme} />
            <div className="relative aspect-square w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl group shrink-0 border border-white/10">
              <Image src="/landing/hero.png" alt="Mission" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[0.5] group-hover:grayscale-0" />
              <div className="absolute inset-0 bg-primary/20 mix-blend-overlay"></div>
            </div>
            <div className="flex-1">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">{t('landing.about.badge')}</div>
              <h2 className="text-3xl md:text-4xl font-display font-black mb-6 leading-tight text-text-main">{t('landing.about.title')}</h2>
              <div className="space-y-4">
                <p className="text-text-muted text-base leading-relaxed">{t('landing.about.desc1')}</p>
                <p className="text-text-muted text-base leading-relaxed">{t('landing.about.desc2')}</p>
              </div>
            </div>
          </div>
        </section>


        {/* --- FAQ Section (Modern Minimal) --- */}
        <section className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 py-24 border-t border-border-main/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-display font-black text-text-main leading-tight mb-8 italic">{t('landing.faq.title')}</h2>
              <div className="size-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-3xl">help_outline</span>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {[0, 1, 2, 3].map((idx) => (
                <div key={idx} className="group border-b border-border-main/20 pb-6">
                  <h3 className="text-xl font-display font-bold text-text-main mb-2 group-hover:text-primary transition-colors flex items-center justify-between">
                    {t(`landing.faq.items.${idx}.q`)}
                    <span className="material-symbols-outlined text-text-muted group-hover:rotate-45 transition-transform text-xl">add</span>
                  </h3>
                  <p className="text-text-muted text-base leading-relaxed max-w-xl">{t(`landing.faq.items.${idx}.a`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- Contact Section --- */}
        <section id="contact" className="w-full max-w-screen-2xl mx-auto px-12 md:px-24 lg:px-32 py-24 border-t border-border-main/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1">
              <h2 className="text-4xl font-display font-black text-text-main leading-tight mb-8 italic">{t('landing.contact.title')}</h2>
              <p className="text-text-muted text-base leading-relaxed mb-8">
                {t('landing.contact.subtitle')}
              </p>

              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4 group">
                  <div className="size-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="material-symbols-outlined text-primary text-xl">mail</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold tracking-widest mb-0.5">{t('landing.contact.info.email')}</p>
                    <a href="mailto:dev.oguzhankaya@gmail.com" className="text-text-main font-bold text-base hover:text-primary transition-colors">dev.oguzhankaya@gmail.com</a>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <form className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2 group">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1 opacity-70 group-focus-within:text-primary transition-colors">{t('landing.contact.form.name')}</label>
                    <input type="text" className="w-full bg-surface-card/50 border border-border-main rounded-xl px-4 py-3 text-text-main focus:border-primary focus:bg-surface-card focus:shadow-lg outline-none transition-all placeholder:text-text-muted/30 text-sm font-medium" placeholder="Oğuzhan Kaya" />
                  </div>
                  <div className="flex flex-col gap-2 group">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1 opacity-70 group-focus-within:text-primary transition-colors">{t('landing.contact.form.email')}</label>
                    <input type="email" className="w-full bg-surface-card/50 border border-border-main rounded-xl px-4 py-3 text-text-main focus:border-primary focus:bg-surface-card focus:shadow-lg outline-none transition-all placeholder:text-text-muted/30 text-sm font-medium" placeholder="oguz@applyfollow.com" />
                  </div>
                </div>
                <div className="flex flex-col gap-2 group">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1 opacity-70 group-focus-within:text-primary transition-colors">{t('landing.contact.form.subject')}</label>
                  <input type="text" className="w-full bg-surface-card/50 border border-border-main rounded-xl px-4 py-3 text-text-main focus:border-primary focus:bg-surface-card focus:shadow-lg outline-none transition-all placeholder:text-text-muted/30 text-sm font-medium" placeholder="How can we help?" />
                </div>
                <div className="flex flex-col gap-2 group">
                  <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-1 opacity-70 group-focus-within:text-primary transition-colors">{t('landing.contact.form.message')}</label>
                  <textarea className="w-full bg-surface-card/50 border border-border-main rounded-xl px-4 py-3 text-text-main resize-none h-32 focus:border-primary focus:bg-surface-card focus:shadow-lg outline-none transition-all placeholder:text-text-muted/30 text-sm font-medium" placeholder="..." />
                </div>
                <button className="w-full sm:w-auto self-start px-10 py-4 rounded-full bg-primary text-slate-950 font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all shadow-glow-emerald-20 mt-2 uppercase tracking-widest flex items-center justify-center gap-2">
                  {t('landing.contact.form.send')}
                  <span className="material-symbols-outlined text-lg">send</span>
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
              <div className="relative size-12 shrink-0 bg-surface-darker rounded-xl p-1.5 border border-border-main transition-transform group-hover/flogo:scale-105">
                <Image src="/ApplyFollowLogo.png" alt="ApplyFollow" width={48} height={48} className="w-full h-full object-contain" />
              </div>
              <span className="text-xl font-display font-black text-text-main tracking-tighter">ApplyFollow</span>
            </Link>
            <nav className="hidden sm:flex items-center gap-8">
              <Link href="/legal/terms" className="hover:text-primary transition-colors hover:underline underline-offset-4">{t('landing.footer.links.terms')}</Link>
              <Link href="/legal/privacy" className="hover:text-primary transition-colors hover:underline underline-offset-4">Gizlilik</Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            {/* GitHub */}
            <a href="https://github.com/Devoguzkaya" target="_blank" className="size-10 rounded-full border border-border-main flex items-center justify-center hover:border-primary hover:text-primary transition-all group/icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="opacity-70 group-hover/icon:opacity-100 transition-opacity"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </a>
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/oğuzhan-kaya-fullstackdeveloper" target="_blank" className="size-10 rounded-full border border-border-main flex items-center justify-center hover:border-primary hover:text-primary transition-all group/icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-70 group-hover/icon:opacity-100 transition-opacity"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
            {/* Email */}
            <a href="mailto:dev.oguzhankaya@gmail.com" className="size-10 rounded-full border border-border-main flex items-center justify-center hover:border-primary hover:text-primary transition-all">
              <span className="material-symbols-outlined text-[20px]">alternate_email</span>
            </a>
          </div>

          <p className="opacity-60">{t('landing.footer.rights')}</p>
        </div>
      </footer>
    </main>
  );
}
