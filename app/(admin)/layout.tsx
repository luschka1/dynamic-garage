import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/dashboard')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Sidebar - always dark, consistent with main nav */}
      <aside style={{
        width: 220,
        minHeight: '100vh',
        background: 'var(--nav-bg)',
        borderRight: '1px solid rgba(255,255,255,0.07)',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        flexShrink: 0,
      }}>
        {/* Red accent line at top */}
        <div style={{ height: 2, background: 'linear-gradient(90deg, #e03535 0%, transparent 60%)' }} />

        {/* Brand */}
        <div style={{ padding: '1.25rem 1.25rem 0.5rem' }}>
          <div style={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 900,
            fontSize: '1.1rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            <span style={{ color: '#a8a8a8' }}>Dynamic</span>
            <span style={{ color: '#e03535' }}> Garage</span>
          </div>
          <div style={{
            marginTop: '0.35rem',
            fontSize: '0.6rem',
            fontWeight: 800,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#e03535',
            borderTop: '1px solid rgba(224,53,53,0.3)',
            paddingTop: '0.4rem',
          }}>
            Admin Panel
          </div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          {[
            { href: '/admin', label: 'Overview' },
            { href: '/admin/vehicles', label: 'Vehicles' },
            { href: '/admin/media', label: 'Media' },
            { href: '/admin/users', label: 'Users' },
            { href: '/admin/feedback', label: '💡 Feature Requests' },
          ].map(({ href, label }) => (
            <AdminNavLink key={href} href={href} label={label} />
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(245,245,243,0.35)' }}>
              Theme
            </span>
            <ThemeToggle />
          </div>
          <Link
            href="/dashboard"
            style={{
              fontSize: '0.75rem',
              color: 'rgba(245,245,243,0.4)',
              fontWeight: 500,
              textDecoration: 'none',
              letterSpacing: '0.04em',
            }}
          >
            ← Back to App
          </Link>
        </div>
      </aside>

      {/* Main content - respects theme */}
      <main style={{ flex: 1, minHeight: '100vh', overflowY: 'auto', background: 'var(--bg-base)' }}>
        {children}
      </main>
    </div>
  )
}

// Server-side nav link - active state handled via a client wrapper
function AdminNavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        padding: '0.55rem 0.75rem',
        borderRadius: 6,
        fontSize: '0.82rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'rgba(245,245,243,0.65)',
        textDecoration: 'none',
        transition: 'all 150ms',
      }}
    >
      {label}
    </Link>
  )
}
