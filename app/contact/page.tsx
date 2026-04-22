import type { Metadata } from 'next'
import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'
import ContactForm from './ContactForm'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Dynamic Garage team. We\'re happy to help with any questions about the app.',
  alternates: { canonical: 'https://dynamicgarage.app/contact' },
}

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />
      <div style={{ flex: 1 }}>
        <ContactForm />
      </div>
      <PublicFooter />
    </div>
  )
}
