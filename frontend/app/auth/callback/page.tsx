"use client";

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setCredentials } from '@/store/features/auth/authSlice';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

function CallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            // 1. Clean URL immediately to prevent token leakage
            window.history.replaceState({}, document.title, window.location.pathname);

            // 2. Persist token to allow API requests (Interceptor reads from localStorage)
            authService.setToken(token);

            // 3. Try to fetch real user profile
            authService.fetchUserProfile()
                .then(user => {
                    // Success: Update Redux with real user data (Token is already in localStorage via setToken)
                    dispatch(setCredentials({ user }));
                    toast.success("Successfully logged in via OAuth!");
                    router.push('/dashboard');
                })
                .catch(err => {
                    console.error("Critical: Failed to fetch real user profile after OAuth success", err);
                    toast.error("Profil bilgileriniz alınamadı. Lütfen tekrar deneyin.");
                    authService.logout(); // Clears storage and redirects to /login
                });
        } else {
            toast.error("Login failed. No token received.");
            router.push('/login');
        }
    }, [searchParams, dispatch, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0C10] text-white">
            <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 animate-pulse">Authenticating...</p>
            </div>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CallbackContent />
        </Suspense>
    );
}
