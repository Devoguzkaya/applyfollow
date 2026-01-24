import type { Metadata } from 'next'
import { Space_Grotesk, Noto_Sans } from 'next/font/google'
import './globals.css'
import AppProviders from '@/components/providers/AppProviders'

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
  icons: {
    icon: '/ApplyFollowLogo.png',
    shortcut: '/ApplyFollowLogo.png',
    apple: '/ApplyFollowLogo.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${notoSans.variable} font-body antialiased`}>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <AppProviders>
          {children}
        </AppProviders>
      </body>
    </html>
  )
}
