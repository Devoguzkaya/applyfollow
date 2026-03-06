"use client";

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authService } from '@/services/authService';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { MdLockOutline, MdArrowBack, MdCheckCircle } from 'react-icons/md';
import toast from 'react-hot-toast';
import Navbar from '@/components/Navbar';

function ResetPasswordForm() {
    const { t } = useLanguage();
    const { theme } = useTheme();
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) {
            toast.error("Invalid or missing reset token.");
            router.push('/login');
        }
    }, [token, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setIsLoading(true);
        try {
            await authService.resetPassword(token as string, password);
            setIsSuccess(true);
            toast.success("Password has been reset successfully.");
        } catch (error: any) {
            console.error("Reset Password Error:", error);
            const errorMessage = error.response?.data?.message || error.message || "Failed to reset password. The link might be expired.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) return null;

    return (
        <div className={`w-full max-w-md bg-surface-card border border-border-main rounded-[32px] p-6 md:p-8 transition-all ${theme === 'dark' ? 'shadow-2xl' : 'shadow-card'} animate-in fade-in slide-in-from-bottom-8 duration-500 relative z-10`}>
            {isSuccess ? (
                <div className="text-center py-4">
                    <MdCheckCircle className="text-6xl text-emerald-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-black text-text-main mb-2">Password Reset!</h2>
                    <p className="text-text-muted text-sm mb-8 leading-relaxed">Your password has been changed successfully. You can now login with your new password.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full h-12 rounded-2xl bg-primary text-slate-950 font-black text-base hover:bg-emerald-400 shadow-glow transition-all active:scale-[0.98] uppercase tracking-widest"
                    >
                        Go to Login
                    </button>
                </div>
            ) : (
                <>
                    <Link href="/login" className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-6 border border-border-main px-3 py-1.5 rounded-full hover:border-primary/30">
                        <MdArrowBack /> {t('common.back')}
                    </Link>

                    <div className="text-center mb-6">
                        <h1 className="text-3xl font-display font-black text-text-main mb-2 tracking-tight italic">New Password</h1>
                        <p className="text-text-muted opacity-70 leading-relaxed text-xs">Enter your new secure password below to regain access to your account.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="relative group">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1.5 ml-1 opacity-50">New Password</label>
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

                        <div className="relative group">
                            <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1.5 ml-1 opacity-50">Confirm Password</label>
                            <div className="relative">
                                <MdLockOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-surface-darker/50 border border-border-main rounded-2xl pl-12 pr-4 py-2.5 text-text-main focus:border-primary focus:bg-surface-card outline-none transition-all placeholder:text-text-muted/30 text-sm font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 mt-4 rounded-2xl bg-primary text-slate-950 font-black text-base hover:bg-emerald-400 shadow-glow transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-widest"
                        >
                            {isLoading && <span className="size-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>}
                            Reset Password
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    const { theme } = useTheme();

    return (
        <main className="min-h-screen bg-background-main flex items-start justify-center p-6 pt-32 relative overflow-hidden transition-colors selection:bg-primary/30">
            {/* Background Effects */}
            <div className={`fixed top-[-10%] left-[-10%] w-[40%] h-[40%] ${theme === 'dark' ? 'bg-primary/5' : 'bg-primary/10'} blur-[120px] rounded-full -z-10`}></div>
            <div className={`fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] ${theme === 'dark' ? 'bg-indigo-500/5' : 'bg-indigo-500/10'} blur-[120px] rounded-full -z-10`}></div>
            <div className="technical-grid opacity-20 -z-10"></div>

            <Navbar isAuthPage />

            <Suspense fallback={<div className="text-text-muted animate-pulse font-bold tracking-widest">LOADING...</div>}>
                <ResetPasswordForm />
            </Suspense>
        </main>
    );
}
