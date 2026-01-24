"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { logout } from '@/store/features/auth/authSlice';
import toast from 'react-hot-toast';

export default function AuthWatcher() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const handleUnauthorized = () => {
            // 1. Clear Redux State
            dispatch(logout());

            // 2. Show Message
            toast.error("Oturum süreniz doldu. Lütfen tekrar giriş yapın.");

            // 3. Redirect using Next.js Router (SPA Navigation)
            router.push('/login?expired=true');
        };

        // Listen for the custom event dispatched from api.ts
        window.addEventListener('auth:unauthorized', handleUnauthorized);

        // Cleanup
        return () => {
            window.removeEventListener('auth:unauthorized', handleUnauthorized);
        };
    }, [dispatch, router]);

    return null; // This component renders nothing
}
