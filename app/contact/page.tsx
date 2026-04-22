import PublicNav from '@/components/layout/PublicNav'
import ContactForm from './ContactForm'

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <PublicNav />
      <ContactForm />
    </div>
  )
}
