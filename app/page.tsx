import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Check, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Dynamic Garage - Build It. Track It. Share It.',
  description: 'Track every mod, service record, photo, and document for any vehicle. Share a public build page at car shows, on forums, or when selling. Free during early access.',
  alternates: { canonical: 'https://dynamicgarage.app' },
}
import FeatureShowcase from './FeatureShowcase'
import HeroCarousel from './HeroCarousel'
import PublicFooter from '@/components/layout/PublicFooter'
import PublicNav from '@/components/layout/PublicNav'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      <PublicNav />

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(3rem, 8vw, 6rem) 1.5rem', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '55% 45%', gap: '4rem', alignItems: 'center' }} className="hero-grid">

          {/* Left column */}
          <div>
            {/* Shield Logo */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div className="hero-logo" style={{ background: '#0d0d0d', borderRadius: 16, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.22)' }}>
                <img src="/logo.png" alt="Dynamic Garage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            </div>

            {/* H1 */}
            <h1 style={{
              fontFamily: "'Barlow Condensed'",
              fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.0,
              letterSpacing: '-0.01em',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
            }}>
              Your build deserves better than a spreadsheet.<br />
              <span style={{ color: 'var(--red)' }}>Log it. Prove it. Share it.</span>
            </h1>

            {/* Value statement */}
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              maxWidth: 480,
              marginBottom: '2.25rem',
            }}>
              You know what you&apos;ve built. Can you prove it? Everything about your car - mods, history, documents, photos - organized, documented, and ready to share.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
              <Link href="/register" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.7rem 1.5rem', minHeight: 44 }}>
                Get Started Free <ChevronRight size={16} />
              </Link>
              <Link href="/login" className="btn-secondary" style={{ fontSize: '0.95rem', padding: '0.7rem 1.5rem', minHeight: 44 }}>
                Sign In
              </Link>
            </div>

            {/* Pill badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--green-dim)',
              border: '1px solid rgba(21,128,61,0.18)',
              borderRadius: 100,
              padding: '0.3rem 0.85rem 0.3rem 0.6rem',
              marginBottom: '1.75rem',
            }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={11} color="#fff" strokeWidth={3} />
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--green)', letterSpacing: '0.02em' }}>
                Free during early access &middot; Any make &middot; Any model
              </span>
            </div>

            {/* Trust row */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { icon: <Check size={13} strokeWidth={2.5} />, label: 'Free during early access' },
                { icon: <Check size={13} strokeWidth={2.5} />, label: 'Any make · Any model · Any country' },
                { icon: <Shield size={13} strokeWidth={2} />, label: 'Secure cloud' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: 'var(--green)', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column - rotating app screenshots */}
          <HeroCarousel />
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '1.1rem 2rem',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', letterSpacing: '0.01em' }}>
          Works with any vehicle - Corvette, Mustang, Porsche, BMW, Ferrari, and everything in between.
        </p>
      </div>

      {/* ── FEATURE SHOWCASE ── */}
      <FeatureShowcase />

      {/* ── VALUE CALLOUT ── */}
      <section style={{ background: 'var(--nav-bg)', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          {/* Top red line */}
          <div style={{ width: 40, height: 2, background: 'var(--red)', margin: '0 auto 2.5rem', borderRadius: 2 }} />

          <p style={{
            fontFamily: "'Cormorant Garamond', 'Georgia', serif",
            fontSize: 'clamp(1.3rem, 2.8vw, 1.75rem)',
            fontStyle: 'italic',
            fontWeight: 400,
            color: '#f5f5f3',
            lineHeight: 1.65,
            letterSpacing: '0.01em',
          }}>
            &ldquo;The first time you sell a car with a full build sheet, you&apos;ll never go without one again.&rdquo;
          </p>

          {/* Bottom red line */}
          <div style={{ width: 40, height: 2, background: 'var(--red)', margin: '2.5rem auto 0', borderRadius: 2 }} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: 'var(--bg-base)', padding: '5.5rem 2rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <p className="page-eyebrow" style={{ marginBottom: '0.75rem' }}>Ready to start?</p>
          <h2 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(2.2rem, 5vw, 3.5rem)',
            fontWeight: 900,
            letterSpacing: '0.02em',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
            lineHeight: 1.05,
          }}>
            YOUR BUILD HAS A STORY.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2.25rem' }}>
            Start documenting it today - free, no card needed, any vehicle.
          </p>
          <Link href="/register" className="btn-primary hp-cta-btn" style={{ fontSize: '1.1rem', padding: '0.85rem 2.5rem', minHeight: 52 }}>
            Start Free - No Card Needed <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <PublicFooter />

      {/* ── STYLES ── */}
      <style>{`
        .hero-logo { width: 110px; height: 110px; }
        @media (max-width: 640px) {
          .hero-logo { width: 72px !important; height: 72px !important; border-radius: 12px !important; }
          .hp-cta-btn { width: 100%; justify-content: center; font-size: 1rem !important; padding: 0.85rem 1.25rem !important; }
        }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
