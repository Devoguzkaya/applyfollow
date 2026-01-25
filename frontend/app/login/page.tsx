"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authService } from '@/services/authService';
import { login } from '@/store/features/auth/authSlice';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { MdArrowBack, MdEmail, MdLockOutline } from 'react-icons/md';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export default function LoginPage() {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
    const [shouldShowForm, setShouldShowForm] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Redirect if already logged in (Check LocalStorage directly for speed)
    useEffect(() => {
        setMounted(true);
        const user = authService.getCurrentUser();
        if (user || isAuthenticated) {
            router.push('/dashboard');
        } else {
            setShouldShowForm(true);
        }
    }, [isAuthenticated, router]);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    if (!shouldShowForm) return null;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(login({ email, password })).unwrap();
            toast.success("Welcome back!");
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Login Error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Login failed";
            toast.error(errorMessage);
        }
    };

    return (
        <main className="min-h-screen bg-background-main flex items-start justify-center p-6 pt-32 relative overflow-hidden transition-colors selection:bg-primary/30">
            {/* Background Effects */}
            <div className={`fixed top-[-10%] left-[-10%] w-[40%] h-[40%] ${theme === 'dark' ? 'bg-primary/5' : 'bg-primary/10'} blur-[120px] rounded-full -z-10`}></div>
            <div className={`fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${theme === 'dark' ? 'bg-indigo-500/5' : 'bg-indigo-500/10'} blur-[120px] rounded-full -z-10`}></div>
            <div className="technical-grid opacity-20 -z-10"></div>

            <Navbar isAuthPage />

            <div className={`w-full max-w-md bg-surface-card border border-border-main rounded-[32px] p-6 md:p-8 transition-all ${theme === 'dark' ? 'shadow-2xl' : 'shadow-card'} animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10`}>
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-display font-black text-text-main mb-2 tracking-tight italic">{t('auth.login.title')}</h1>
                    <p className="text-text-muted opacity-70 leading-relaxed text-xs">{t('auth.login.subtitle')}</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <div className="relative group">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1.5 ml-1 opacity-50">{t('landing.contact.form.email')}</label>
                        <div className="relative">
                            <MdEmail className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-surface-darker/50 border border-border-main rounded-2xl pl-12 pr-4 py-2.5 text-text-main focus:border-primary focus:bg-surface-card outline-none transition-all placeholder:text-text-muted/30 text-sm font-medium"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>

                    <div className="relative group">
                        <div className="flex justify-between items-center mb-1.5 px-1">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-50">{t('auth.register.password')}</label>
                            <Link href="#" className="text-[10px] font-black text-primary hover:text-primary-dark transition-colors uppercase tracking-[0.1em]">{t('auth.login.forgotPassword')}</Link>
                        </div>
                        <div className="relative">
                            <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted group-focus-within:text-primary transition-colors" />
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-surface-darker/50 border border-border-main rounded-2xl pl-12 pr-4 py-2.5 text-text-main focus:border-primary focus:bg-surface-card outline-none transition-all placeholder:text-text-muted/30 text-sm font-medium"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 mt-2 rounded-2xl bg-primary text-slate-950 font-black text-base hover:bg-emerald-400 shadow-glow transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest"
                    >
                        {isLoading && <span className="size-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>}
                        {t('auth.login.submit')}
                    </button>
                </form>

                <div className="flex items-center gap-4 my-6">
                    <div className="h-px bg-border-main flex-1 opacity-50"></div>
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40">{t('common.or')}</span>
                    <div className="h-px bg-border-main flex-1 opacity-50"></div>
                </div>

                <div className="grid grid-cols-2 gap-4 h-11 mb-6">
                    <button
                        type="button"
                        onClick={() => {
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                            window.location.href = `${apiUrl}/oauth2/authorization/google`;
                        }}
                        className="flex items-center justify-center gap-2 bg-surface-card border border-border-main text-text-main font-bold text-xs rounded-xl hover:border-primary transition-all active:scale-[0.98] shadow-sm"
                    >
                        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="size-4" />
                        Google
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
                            window.location.href = `${apiUrl}/oauth2/authorization/github`;
                        }}
                        className="flex items-center justify-center gap-2 bg-surface-card border border-border-main text-text-main font-bold text-xs rounded-xl hover:border-primary transition-all active:scale-[0.98] shadow-sm"
                    >
                        <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className={`size-4 ${theme === 'dark' ? 'invert' : ''} opacity-70`} />
                        GitHub
                    </button>
                </div>

                <div className="text-center text-sm">
                    <span className="text-text-muted opacity-60">{t('auth.login.noAccount')}</span>{" "}
                    <Link href="/register" className="text-primary hover:text-primary-dark font-black tracking-tight transition-colors">{t('auth.login.createAccount')}</Link>
                </div>
            </div>
        </main>
    );
}
