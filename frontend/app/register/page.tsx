"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authService } from '@/services/authService';
import { register } from '@/store/features/auth/authSlice';
import toast from 'react-hot-toast';
import { useLanguage } from '@/context/LanguageContext';

export default function RegisterPage() {
    const { t } = useLanguage();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
    const [shouldShowForm, setShouldShowForm] = useState(false);

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
        <main className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>

            <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">{t('landing.nav.signup')}</h1>
                    <p className="text-slate-400">Start tracking your job applications today.</p>
                </div>

                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">Full Name</label>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="w-full bg-input-bg border border-border-dark rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-input-bg border border-border-dark rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wide">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-input-bg border border-border-dark rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Consents */}
                    <div className="flex flex-col gap-4 mt-2 p-4 bg-white/5 rounded-xl border border-white/5">
                        <ConsentCheckbox
                            checked={termsAccepted}
                            onChange={(checked) => setTermsAccepted(checked)}
                            required
                        >
                            <span>
                                {t('auth.consent.term2')}{" "}
                                <Link href="/legal/terms" target="_blank" className="text-primary hover:underline font-bold transition-colors">Kullanım Şartları</Link>
                                {" "}&{" "}
                                <Link href="/legal/privacy" target="_blank" className="text-primary hover:underline font-bold transition-colors">Gizlilik Politikası</Link>
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
                        className="w-full h-12 mt-2 rounded-lg bg-primary text-[#101618] font-bold text-base hover:bg-emerald-400 shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading && <span className="size-4 border-2 border-[#101618] border-t-transparent rounded-full animate-spin"></span>}
                        {t('landing.nav.signup')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Already have an account? <Link href="/login" className="text-primary hover:underline font-bold">{t('landing.nav.login')}</Link>
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
    return (
        <label className="flex items-start gap-3 cursor-pointer group relative">
            <div className="relative flex items-center mt-0.5">
                <input
                    type="checkbox"
                    required={required}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer h-5 w-5 min-w-[20px] cursor-pointer appearance-none rounded border border-slate-600 bg-input-bg checked:border-primary checked:bg-primary transition-all hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 material-symbols-outlined text-[16px] font-bold pointer-events-none transition-opacity duration-200">
                    check
                </span>
            </div>
            <div className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors select-none">
                {children}
            </div>
        </label>
    );
}
