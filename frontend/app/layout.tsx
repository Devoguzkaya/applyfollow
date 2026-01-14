import type { Metadata } from 'next'
import { Space_Grotesk, Noto_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast';
import StoreProvider from '@/store/StoreProvider';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
})

const notoSans = Noto_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sans',
})

export const metadata: Metadata = {
  title: 'ApplyFollow',
  description: 'Track your job applications intelligently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${notoSans.variable}`}>
      <body className="bg-background-light dark:bg-background-dark font-body antialiased text-slate-200">
        {/* Material Symbols Icon CDN */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

        <StoreProvider>
          {/* Notifications */}
          <Toaster position="top-right"
            toastOptions={{
              style: {
                background: '#1A2321', // surface-dark
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                fontFamily: 'var(--font-noto-sans)'
              },
              success: {
                iconTheme: {
                  primary: '#17cf63',
                  secondary: '#1A2321'
                }
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff'
                }
              }
            }}
          />

          {children}
        </StoreProvider>
      </body>
    </html>
  )
}
