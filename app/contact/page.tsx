import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'
import ContactForm from './ContactForm'

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
