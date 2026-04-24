import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: {
    default: 'Dynamic Garage - Build It. Track It. Share It.',
    template: '%s | Dynamic Garage',
  },
  description: 'Track every mod, service record, photo, and document for any vehicle. Share a public build page at car shows, on forums, or when selling.',
  keywords: ['car mods tracker', 'vehicle modification log', 'service history app', 'build sheet', 'car show card', 'corvette mods', 'automotive garage app', 'vehicle history tracker', 'car enthusiast app'],
  authors: [{ name: 'Dynamic Garage', url: 'https://dynamicgarage.app' }],
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://dynamicgarage.app'),
  alternates: { canonical: 'https://dynamicgarage.app' },
  openGraph: {
    title: 'Dynamic Garage - Build It. Track It. Share It.',
    description: 'Track every mod, service record, photo, and document for any vehicle. Share a public build page at car shows, on forums, or when selling.',
    url: 'https://dynamicgarage.app',
    siteName: 'Dynamic Garage',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dynamic Garage - Build It. Track It. Share It.',
    description: 'Track every mod, service record, photo, and document for any vehicle.',
    site: '@dynamicgarage',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        {/* Runs before React hydrates - prevents flash of wrong theme */}
        <Script src="/theme-init.js" strategy="beforeInteractive" />
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
