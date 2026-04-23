import Link from 'next/link'
import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'

export const metadata = {
  title: 'Privacy Policy - Dynamic Garage',
  description: 'How Dynamic Garage collects, uses, and protects your personal information.',
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

export default function PrivacyPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <PublicNav />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: '4rem 1.5rem 6rem' }}>

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
            PRIVACY POLICY
          </h1>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <Section title="Overview">
          <P>
            Dynamic Garage (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates dynamicgarage.app. This Privacy Policy explains what information we collect, how we use it, and the choices you have. By using our service, you agree to the collection and use of information in accordance with this policy.
          </P>
          <P>
            We built Dynamic Garage for enthusiasts who care about their vehicles. We take your privacy seriously and will never sell your personal data.
          </P>
        </Section>

        <Section title="Information We Collect">
          <P>We collect information you provide directly when you:</P>
          <Ul items={[
            'Create an account (email address and password)',
            'Add vehicles, modifications, service records, and documents',
            'Upload photos or files',
            'Contact us via the contact form',
          ]} />
          <P>We also collect limited technical information automatically:</P>
          <Ul items={[
            'Browser type and version',
            'Pages visited and features used (via Sentry error monitoring)',
            'Session replays for debugging purposes (sampled, not recorded for all users)',
            'IP address (used for security and fraud prevention only)',
          ]} />
        </Section>

        <Section title="How We Use Your Information">
          <P>We use the information we collect to:</P>
          <Ul items={[
            'Provide, maintain, and improve the Dynamic Garage service',
            'Authenticate your account and keep it secure',
            'Send transactional emails (account confirmation, password resets)',
            'Diagnose bugs and improve reliability using error monitoring',
            'Respond to your support requests',
          ]} />
          <P>
            We do <strong>not</strong> use your data for advertising, sell it to third parties, or share it with anyone except as described in this policy.
          </P>
        </Section>

        <Section title="Public Vehicle Pages">
          <P>
            When you choose to make a vehicle public, the following information becomes visible to anyone with the link:
          </P>
          <Ul items={[
            'Vehicle nickname, year, make, model, trim, and color',
            'Photos you have uploaded',
            'Modifications and service records you have added',
            'Documents you have attached (if any)',
            'Your contact form (if the vehicle is marked For Sale) - messages go to your email, which remains private',
          ]} />
          <P>
            You can make a vehicle private at any time by toggling the visibility setting in the edit form. Private vehicles are never accessible to the public.
          </P>
        </Section>

        <Section title="Data Storage & Security">
          <P>
            Your data is stored securely using <strong>Supabase</strong> (PostgreSQL database) and <strong>Supabase Storage</strong> for files and photos. All data is encrypted in transit using TLS and at rest.
          </P>
          <P>
            We use <strong>Vercel</strong> to host the application. Vercel may log request metadata (IP address, user agent) for operational purposes in accordance with their own privacy policy.
          </P>
          <P>
            Error monitoring is provided by <strong>Sentry</strong>, which may capture anonymised stack traces and session replays to help us fix bugs. We do not send personally identifiable information to Sentry.
          </P>
        </Section>

        <Section title="Cookies & Local Storage">
          <P>
            Dynamic Garage uses browser <strong>local storage</strong> (not cookies) to remember your preferences such as light/dark mode and mileage unit (mi/km). This data never leaves your device and is not transmitted to our servers.
          </P>
          <P>
            Supabase authentication uses a session cookie to keep you logged in. This cookie is strictly necessary for the service to function and does not track you across other websites.
          </P>
        </Section>

        <Section title="Data Retention">
          <P>
            We retain your account and vehicle data for as long as your account is active. If you delete your account, we will delete your personal data within 30 days, except where we are required to retain it for legal or operational reasons.
          </P>
        </Section>

        <Section title="Your Rights">
          <P>You have the right to:</P>
          <Ul items={[
            'Access the personal data we hold about you',
            'Correct inaccurate data',
            'Delete your account and all associated data',
            'Export your vehicle data',
            'Withdraw consent at any time',
          ]} />
          <P>
            To exercise any of these rights, please contact us at{' '}
            <Link href="/contact" style={{ color: 'var(--red)', textDecoration: 'none', fontWeight: 600 }}>
              dynamicgarage.app/contact
            </Link>
            .
          </P>
        </Section>

        <Section title="Children's Privacy">
          <P>
            Dynamic Garage is not directed at children under the age of 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it promptly.
          </P>
        </Section>

        <Section title="Changes to This Policy">
          <P>
            We may update this Privacy Policy from time to time. When we do, we will update the &ldquo;Last updated&rdquo; date at the top of this page. Continued use of Dynamic Garage after any changes constitutes your acceptance of the new policy.
          </P>
        </Section>

        <Section title="Contact Us">
          <P>
            If you have any questions about this Privacy Policy or how we handle your data, please reach out via our{' '}
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
