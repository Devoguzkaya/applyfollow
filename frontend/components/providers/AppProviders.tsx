"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';
import StoreProvider from '@/store/StoreProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import QueryProvider from '@/context/QueryProvider';
import { UIProvider } from '@/context/UIContext';
import AuthWatcher from '@/components/auth/AuthWatcher';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    // List of providers, ordered from Outer -> Inner
    const providers = [
        StoreProvider,
        UIProvider,
        ThemeProvider,
        LanguageProvider,
        QueryProvider
    ];

    // Inner content (what's inside the innermost provider)
    const content = (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: 'var(--surface)',
                        color: 'var(--text-color)',
                        border: '1px solid var(--border-color)',
                        fontFamily: 'var(--font-noto-sans)'
                    },
                    success: {
                        iconTheme: {
                            primary: 'var(--primary)',
                            secondary: 'var(--surface)'
                        }
                    }
                }}
            />
            <AuthWatcher />
            {children}
        </>
    );

    // Composer (reduces right-to-left to wrap content)
    return providers.reduceRight((acc, Provider) => {
        return <Provider>{acc}</Provider>;
    }, content);
}
