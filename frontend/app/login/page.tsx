"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { authService } from '@/services/authService';
import { login } from '@/store/features/auth/authSlice';
import toast from 'react-hot-toast';

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
    const [shouldShowForm, setShouldShowForm] = useState(false);

    // Redirect if already logged in (Check LocalStorage directly for speed)
    useEffect(() => {
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
        <main className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full -z-10"></div>

            <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-slate-400">Enter your credentials to access your dashboard.</p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
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
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide">Password</label>
                            <a href="#" className="text-xs text-primary hover:underline">Forgot?</a>
                        </div>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-input-bg border border-border-dark rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-lg bg-primary text-[#101618] font-bold text-base hover:bg-emerald-400 shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading && <span className="size-4 border-2 border-[#101618] border-t-transparent rounded-full animate-spin"></span>}
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account? <Link href="/register" className="text-primary hover:underline font-bold">Sign up</Link>
                </div>
            </div>
        </main>
    );
}
