import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Dynamic Garage — Track Your Mods & Service',
  description: 'Keep track of your car\'s modifications, service records, and documents all in one place.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        {/* Runs before React hydrates — prevents flash of wrong theme */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
