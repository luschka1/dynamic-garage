import Link from 'next/link'
import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'

export const metadata = {
  title: 'Terms of Service — Dynamic Garage',
  description: 'The terms and conditions governing your use of Dynamic Garage.',
}

const LAST_UPDATED = 'April 22, 2026'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <h2 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '1.25rem',
        fontWeight: 900,
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
        color: 'var(--text-primary)',
        marginBottom: '0.75rem',
        paddingBottom: '0.5rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        {title}
      </h2>
      <div style={{ fontSize: '0.925rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
        {children}
      </div>
    </section>
  )
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ marginBottom: '0.75rem' }}>{children}</p>
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: '1.25rem', marginBottom: '0.75rem' }}>
      {items.map((item, i) => (
        <li key={i} style={{ marginBottom: '0.35rem' }}>{item}</li>
      ))}
    </ul>
  )
}

export default function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <PublicNav />

      <main style={{ flex: 1, maxWidth: 760, margin: '0 auto', width: '100%', padding: '4rem 1.5rem 6rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.5rem' }}>
            Legal
          </p>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: 'clamp(2.2rem, 5vw, 3rem)',
            fontWeight: 900,
            letterSpacing: '0.01em',
            color: 'var(--text-primary)',
            lineHeight: 1,
            marginBottom: '0.75rem',
          }}>
            TERMS OF SERVICE
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <Section title="Agreement to Terms">
          <P>
            By accessing or using Dynamic Garage (&ldquo;the Service&rdquo;) at dynamicgarage.app, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service.
          </P>
          <P>
            These Terms apply to all visitors, users, and anyone who accesses the Service. We reserve the right to update these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
          </P>
        </Section>

        <Section title="Description of Service">
          <P>
            Dynamic Garage is a vehicle management platform that allows users to document modifications, service history, photos, and documents for any make and model of vehicle. Users may optionally make their vehicle profiles publicly shareable.
          </P>
          <P>
            The Service is currently offered free of charge during an early access period. We reserve the right to introduce paid plans in the future with reasonable notice to existing users.
          </P>
        </Section>

        <Section title="Account Registration">
          <P>To use the Service, you must create an account. You agree to:</P>
          <Ul items={[
            'Provide accurate and complete information when registering',
            'Keep your account credentials secure and confidential',
            'Notify us immediately if you suspect unauthorised access to your account',
            'Be responsible for all activity that occurs under your account',
            'Not share your account with others or create accounts on behalf of third parties',
          ]} />
          <P>
            You must be at least 13 years of age to use the Service. By registering, you represent that you meet this requirement.
          </P>
        </Section>

        <Section title="Acceptable Use">
          <P>You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of others. You must not:</P>
          <Ul items={[
            'Upload content that is illegal, harmful, defamatory, or violates any third-party rights',
            'Attempt to gain unauthorised access to other users\' accounts or data',
            'Use the Service to transmit spam, malware, or any unsolicited communications',
            'Scrape, crawl, or systematically extract data from the Service without permission',
            'Impersonate another person or entity',
            'Use the Service for any commercial purpose without our prior written consent',
            'Attempt to reverse-engineer, decompile, or disassemble any part of the Service',
          ]} />
        </Section>

        <Section title="User Content">
          <P>
            You retain ownership of all content you upload to the Service, including vehicle information, photos, and documents (&ldquo;User Content&rdquo;). By uploading content, you grant Dynamic Garage a non-exclusive, royalty-free licence to store, display, and process that content solely for the purpose of providing the Service to you.
          </P>
          <P>
            You are solely responsible for the accuracy and legality of your User Content. You represent that you have all necessary rights to upload and share any content you submit.
          </P>
          <P>
            When you mark a vehicle as public, you acknowledge that your vehicle information, photos, and associated records will be accessible to anyone with the link. You can make a vehicle private at any time.
          </P>
        </Section>

        <Section title="Intellectual Property">
          <P>
            The Dynamic Garage name, logo, design, and all original content created by us are protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works from our proprietary materials without prior written consent.
          </P>
          <P>
            We respect intellectual property rights. If you believe any content on the Service infringes your copyright, please contact us via our{' '}
            <Link href="/contact" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 600 }}>contact page</Link>.
          </P>
        </Section>

        <Section title="Disclaimers">
          <P>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses or other harmful components.
          </P>
          <P>
            Vehicle information, modification records, and service history displayed on the Service are entered by users and have not been independently verified by Dynamic Garage. We make no representations regarding the accuracy or completeness of any vehicle data.
          </P>
        </Section>

        <Section title="Limitation of Liability">
          <P>
            To the maximum extent permitted by law, Dynamic Garage and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service, including but not limited to loss of data, loss of profits, or business interruption.
          </P>
          <P>
            Our total liability to you for any claims arising under these Terms shall not exceed the amount you have paid us in the twelve months preceding the claim, or $10 USD if you have not made any payments.
          </P>
        </Section>

        <Section title="Termination">
          <P>
            You may delete your account at any time. We reserve the right to suspend or terminate your account at our discretion if we believe you have violated these Terms, without prior notice.
          </P>
          <P>
            Upon termination, your right to use the Service ceases immediately. We will delete your personal data in accordance with our{' '}
            <Link href="/privacy" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 600 }}>Privacy Policy</Link>.
          </P>
        </Section>

        <Section title="Governing Law">
          <P>
            These Terms are governed by and construed in accordance with applicable law. Any disputes arising under these Terms shall be resolved through good-faith negotiation before pursuing any other remedy.
          </P>
        </Section>

        <Section title="Contact Us">
          <P>
            If you have any questions about these Terms, please reach out via our{' '}
            <Link href="/contact" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 600 }}>
              contact page
            </Link>
            .
          </P>
        </Section>

      </main>

      <PublicFooter />
    </div>
  )
}
