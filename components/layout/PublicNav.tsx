import Link from 'next/link'
import { LayoutGrid } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import MobileNav from '@/app/MobileNav'
import { createClient } from '@/lib/supabase/server'

interface Props {
  /** Optional small badge shown right of the logo — e.g. "Public Build" or "Gallery" */
  badge?: React.ReactNode
}

export default async function PublicNav({ badge }: Props) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <nav style={{
      background: 'var(--bg-elevated)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
    }}>
      {/* Left: logo + optional badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span style={{ color: '#a8a8a8' }}>Dynamic</span><span style={{ color: 'var(--red)' }}> Garage</span>
          </span>
        </Link>
        {badge && (
          <>
            <span style={{ width: 1, height: 18, background: 'var(--border-default)', display: 'inline-block', flexShrink: 0 }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
              {badge}
            </span>
          </>
        )}
      </div>

      {/* Right: desktop links + toggle + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>

        {/* Desktop links — hidden on mobile */}
        <Link href="/gallery" className="pub-nav-link pub-nav-desktop" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0.4rem 0.65rem', borderRadius: 6, textDecoration: 'none', transition: 'color 150ms' }}>
          <LayoutGrid size={13} /> Gallery
        </Link>
        <Link href="/contact" className="pub-nav-link pub-nav-desktop" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', padding: '0.4rem 0.65rem', borderRadius: 6, textDecoration: 'none', transition: 'color 150ms' }}>
          Contact
        </Link>
        {!user && (
          <Link href="/login" className="pub-nav-link pub-nav-desktop" style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)', padding: '0.4rem 0.65rem', borderRadius: 6, textDecoration: 'none', transition: 'color 150ms' }}>
            Sign In
          </Link>
        )}

        <ThemeToggle />

        {user ? (
          <Link href="/dashboard" className="btn-primary pub-nav-desktop" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: 34, letterSpacing: '0.04em' }}>
            My Garage
          </Link>
        ) : (
          <Link href="/register" className="btn-primary pub-nav-desktop" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: 34, letterSpacing: '0.04em' }}>
            Get Started
          </Link>
        )}

        {/* Hamburger — mobile only */}
        <div className="pub-nav-mobile">
          <MobileNav isLoggedIn={!!user} />
        </div>
      </div>

      <style>{`
        .pub-nav-link:hover { color: var(--text-primary) !important; background: rgba(127,127,127,0.06); }
        .pub-nav-mobile { display: none; }
        @media (max-width: 640px) {
          .pub-nav-desktop { display: none !important; }
          .pub-nav-mobile { display: block; }
        }
      `}</style>
    </nav>
  )
}
