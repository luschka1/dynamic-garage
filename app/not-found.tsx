import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import PublicNav from '@/components/layout/PublicNav'
import PublicFooter from '@/components/layout/PublicFooter'

export default async function NotFound() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <PublicNav user={user} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1.5rem', textAlign: 'center' }}>

        {/* Big 404 */}
        <div style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 'clamp(7rem, 20vw, 14rem)',
          fontWeight: 900,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          color: 'var(--bg-elevated)',
          userSelect: 'none',
          marginBottom: '-1rem',
          position: 'relative',
        }}>
          404
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, var(--red) 0%, transparent 60%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            opacity: 0.15,
          }}>
            404
          </div>
        </div>

        {/* Accent line */}
        <div style={{ width: 48, height: 3, background: 'var(--red)', borderRadius: 2, margin: '1.5rem auto' }} />

        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          fontWeight: 900,
          letterSpacing: '0.02em',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
          marginBottom: '0.75rem',
        }}>
          Wrong Turn
        </h1>

        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 400, lineHeight: 1.7, marginBottom: '2.5rem' }}>
          This page doesn&apos;t exist or was moved. Head back to your garage and pick up where you left off.
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {user ? (
            <>
              <Link href="/dashboard" className="btn-primary">
                My Garage
              </Link>
              <Link href="/" className="btn-secondary">
                Homepage
              </Link>
            </>
          ) : (
            <>
              <Link href="/" className="btn-primary">
                Go Home
              </Link>
              <Link href="/login" className="btn-secondary">
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      <PublicFooter />
    </div>
  )
}
