import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Dynamic Garage — Track Your Mods & Service',
  description: 'Keep track of your car\'s modifications, service records, and documents all in one place.',
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
