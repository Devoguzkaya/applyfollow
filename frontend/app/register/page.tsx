"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authService } from '@/services/authService';
import { register } from '@/store/features/auth/authSlice';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { MdArrowBack, MdEmail, MdLockOutline, MdPersonOutline } from 'react-icons/md';

export default function RegisterPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
    const [shouldShowForm, setShouldShowForm] = useState(false);
    const { theme } = useTheme();

    // Redirect if already logged in
    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user || isAuthenticated) {
            router.push('/dashboard');
        } else {
            setShouldShowForm(true);
        }
    }, [isAuthenticated, router]);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [marketConsent, setMarketConsent] = useState(false);

    if (!shouldShowForm) return null;

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!termsAccepted) {
            toast.error(t('auth.consent.validation'));
            return;
        }

        try {
            await dispatch(register({ fullName, email, password, marketDataConsent: marketConsent })).unwrap();
            toast.success("Account created successfully!");
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Register Error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Registration failed";
            toast.error(errorMessage);
        }
    };

    return (
        <main className="min-h-screen bg-background-main flex items-start justify-center p-6 pt-24 relative overflow-hidden transition-colors selection:bg-primary/30">
            {/* Background Effects */}
            <div className={`fixed top-[-10%] left-[-10%] w-[40%] h-[40%] ${theme === 'dark' ? 'bg-primary/5' : 'bg-primary/10'} blur-[120px] rounded-full -z-10`}></div>
            <div className={`fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${theme === 'dark' ? 'bg-indigo-500/5' : 'bg-indigo-500/10'} blur-[120px] rounded-full -z-10`}></div>
            <div className="technical-grid opacity-20 -z-10"></div>

            <Navbar isAuthPage />

            <div className={`w-full max-w-md bg-surface-card border border-border-main rounded-[32px] p-6 md:p-8 transition-all ${theme === 'dark' ? 'shadow-2xl' : 'shadow-card'} animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10`}>
                <div className="text-center mb-5">
                    <h1 className="text-3xl font-display font-black text-text-main mb-2 tracking-tight italic">{t('auth.register.title')}</h1>
                    <p className="text-text-muted opacity-70 leading-relaxed text-xs">{t('auth.register.subtitle')}</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-4">
                    <div className="relative group">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1.5 ml-1 opacity-50">{t('auth.register.fullName')}</label>
                        <div className="relative">
                            <MdPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                required
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full bg-surface-darker/50 border border-border-main rounded-2xl pl-12 pr-4 py-2 text-text-main focus:border-primary focus:bg-surface-card outline-none transition-all placeholder:text-text-muted/30 text-sm font-medium"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1.5 ml-1 opacity-50">{t('landing.contact.form.email')}</label>
                        <div className="relative">
                            <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-darker/50 border border-border-main rounded-2xl pl-12 pr-4 py-2 text-text-main focus:border-primary focus:bg-surface-card outline-none transition-all placeholder:text-text-muted/30 text-sm font-medium"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1.5 ml-1 opacity-50">{t('auth.register.password')}</label>
                        <div className="relative">
                            <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-darker/50 border border-border-main rounded-2xl pl-12 pr-4 py-2 text-text-main focus:border-primary focus:bg-surface-card outline-none transition-all placeholder:text-text-muted/30 text-sm font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Consents */}
                    <div className="flex flex-col gap-3 mt-1 p-4 bg-surface-darker/30 rounded-[24px] border border-border-main/50">
                        <ConsentCheckbox
                            checked={termsAccepted}
                            onChange={(checked) => setTermsAccepted(checked)}
                            required
                        >
                            <span>
                                {t('auth.consent.term2')}{" "}
                                <Link href="/legal/terms" target="_blank" className="text-primary hover:text-primary-dark font-black transition-colors">Şartlar</Link>
                                {" "} & {" "}
                                <Link href="/legal/privacy" target="_blank" className="text-primary hover:text-primary-dark font-black transition-colors">Politikalar</Link>
                            </span>
                        </ConsentCheckbox>

                        <ConsentCheckbox
                            checked={marketConsent}
                            onChange={(checked) => setMarketConsent(checked)}
                        >
                            <span>{t('auth.consent.term1')}</span>
                        </ConsentCheckbox>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 mt-1 rounded-2xl bg-primary text-slate-950 font-black text-base hover:bg-emerald-400 shadow-glow transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        {isLoading && <span className="size-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>}
                        {t('auth.register.submit')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm">
                    <span className="text-text-muted opacity-60">{t('auth.register.alreadyHaveAccount')}</span>{" "}
                    <Link href="/login" className="text-primary hover:text-primary-dark font-black tracking-tight transition-colors">{t('landing.nav.login')}</Link>
                </div>
            </div>
        </main>
    );
}

function ConsentCheckbox({
    checked,
    onChange,
    children,
    required
}: {
    checked: boolean;
    onChange: (checked: boolean) => void;
    children: React.ReactNode;
    required?: boolean;
}) {
    const { theme } = useTheme();
    return (
        <label className="flex items-start gap-3 cursor-pointer group relative">
            <div className="relative flex items-center mt-0.5">
                <input
                    type="checkbox"
                    required={required}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer h-5 w-5 min-w-[20px] cursor-pointer appearance-none rounded-lg border border-border-main bg-surface-card checked:border-primary checked:bg-primary transition-all hover:border-primary focus:outline-none"
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-950 opacity-0 peer-checked:opacity-100 material-symbols-outlined text-[16px] font-black pointer-events-none transition-opacity duration-200">
                    check
                </span>
            </div>
            <div className="text-[11px] font-medium text-text-muted leading-relaxed group-hover:text-text-main transition-colors select-none">
                {children}
            </div>
        </label>
    );
}
