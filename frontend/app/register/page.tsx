"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Redux
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register } from '@/store/features/auth/authSlice';
import toast from 'react-hot-toast';

export default function RegisterPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading } = useAppSelector((state) => state.auth);

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await dispatch(register({ fullName, email, password })).unwrap();
            toast.success("Account created successfully!");
            router.push('/dashboard');
        } catch (error: any) {
            console.error("Register Error:", error);
            toast.error(error || "Registration failed");
        }
    };

    return (
        <main className="min-h-screen bg-[#0A0C10] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/10 blur-[120px] rounded-full -z-10"></div>

            <div className="w-full max-w-md bg-surface-dark border border-border-dark rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in duration-300">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold text-white mb-2">Create Account</h1>
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

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 rounded-lg bg-primary text-[#101618] font-bold text-base hover:bg-emerald-400 shadow-glow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading && <span className="size-4 border-2 border-[#101618] border-t-transparent rounded-full animate-spin"></span>}
                        Sign Up
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Already have an account? <Link href="/login" className="text-primary hover:underline font-bold">Log in</Link>
                </div>
            </div>
        </main>
    );
}
