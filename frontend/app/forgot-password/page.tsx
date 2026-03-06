"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { MdEmail, MdArrowBack } from 'react-icons/md';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

export default function ForgotPasswordPage() {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await authService.forgotPassword(email);
            setIsSubmitted(true);
            toast.success("Password reset link sent to your email.");
        } catch (error: any) {
            console.error("Forgot Password Error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to send reset link";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
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
                <Link href="/login" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-6 border border-border-main px-3 py-1.5 rounded-full hover:border-primary/30">
                    <MdArrowBack /> {t('common.back')}
                </Link>

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-display font-black text-text-main mb-2 tracking-tight italic">Reset Password</h1>
                    <p className="text-text-muted opacity-70 leading-relaxed text-xs">Enter your email address and we'll send you a link to reset your password.</p>
                </div>

                {isSubmitted ? (
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center">
                        <h3 className="text-emerald-500 font-bold mb-2">Check your inbox</h3>
                        <p className="text-text-muted text-sm leading-relaxed">We've sent a password reset link to <span className="text-text-main font-bold">{email}</span>. Please check your spam folder if you don't see it.</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="mt-6 w-full h-11 rounded-xl bg-surface-darker border border-border-main text-text-main font-bold text-sm hover:border-primary transition-all uppercase tracking-widest"
                        >
                            Return to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 mt-2 rounded-2xl bg-primary text-slate-950 font-black text-base hover:bg-emerald-400 shadow-glow transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest"
                        >
                            {isLoading && <span className="size-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>}
                            Send Reset Link
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
