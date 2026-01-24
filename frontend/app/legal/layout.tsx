import React from 'react';
import Link from 'next/link';

export default function LegalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#0A0C10] text-slate-300">
            <header className="border-b border-border-dark bg-surface-dark/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/" className="font-display font-bold text-xl text-white tracking-tight">
                        ApplyFollow
                    </Link>
                    <nav className="flex gap-4 text-sm font-medium">
                        <Link href="/legal/terms" className="hover:text-primary transition-colors">Kullanım Şartları</Link>
                        <Link href="/legal/privacy" className="hover:text-primary transition-colors">Gizlilik</Link>
                        <Link href="/legal/kvkk" className="hover:text-primary transition-colors">KVKK</Link>
                    </nav>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
                <div className="prose prose-invert prose-slate max-w-none">
                    {children}
                </div>
            </main>

            <footer className="border-t border-border-dark py-8 mt-12 text-center text-sm text-slate-500">
                <p>&copy; {new Date().getFullYear()} ApplyFollow. Tüm hakları saklıdır.</p>
            </footer>
        </div>
    );
}
