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
    return (
        <StoreProvider>
            <UIProvider>
                <ThemeProvider>
                    <LanguageProvider>
                        <QueryProvider>
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
                        </QueryProvider>
                    </LanguageProvider>
                </ThemeProvider>
            </UIProvider>
        </StoreProvider>
    );
}
