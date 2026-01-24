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
            // 1. Manually set/decode payload if needed, or assume backend verified
            // For now, we replicate what logging in does:
            const user = {
                fullName: 'User', // Will update after first profile fetch or decode JWT
                email: 'user@example.com',
                token: token,
                id: 'oauth-user',
                role: 'USER',
                active: true
            };

            // 2. Persist to local storage
            authService.setCurrentUser(user);

            // 3. Update Redux state
            dispatch(setCredentials({ user, token }));

            toast.success("Successfully logged in via OAuth!");
            router.push('/dashboard');
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
