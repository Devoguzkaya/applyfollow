"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { authService } from '@/services/authService';
import { fetchUser } from '@/store/features/auth/authSlice';
import toast from 'react-hot-toast';

export default function AuthCallbackPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
            toast.error("Giriş yapılamadı: " + error);
            router.push('/login');
            return;
        }

        if (token) {
            // Token'ı kaydet
            authService.setToken(token);

            // Kullanıcı bilgilerini çek ve Redux'a yükle
            dispatch(fetchUser())
                .unwrap()
                .then(() => {
                    toast.success("Giriş başarılı!");
                    router.push('/dashboard');
                })
                .catch((err) => {
                    console.error("Kullanıcı bilgileri alınamadı:", err);
                    toast.error("Oturum açılamadı.");
                    router.push('/login');
                });
        } else {
            console.error("Token bulunamadı");
            router.push('/login');
        }
    }, [searchParams, router, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0A0C10]">
            <div className="flex flex-col items-center gap-4">
                <div className="size-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 font-medium animate-pulse">Giriş yapılıyor...</p>
            </div>
        </div>
    );
}
