import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Dynamic Garage — Track Your Mods & Service',
  description: 'Log every mod, service record, receipt, and photo for your build. Share a clean public page at shows, on forums, or when it\'s time to sell.',
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://dynamicgarage.app'),
  openGraph: {
    title: 'Dynamic Garage — Track Your Mods & Service',
    description: 'Log every mod, service record, receipt, and photo for your build. Share a clean public page at shows, on forums, or when it\'s time to sell.',
    url: 'https://dynamicgarage.app',
    siteName: 'Dynamic Garage',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dynamic Garage — Track Your Mods & Service',
    description: 'Log every mod, service record, receipt, and photo for your build.',
  },
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
