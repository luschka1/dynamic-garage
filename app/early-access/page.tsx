import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Check, Wrench, ClipboardList, FileText, Camera, Trophy, GitBranch, Share2, QrCode } from 'lucide-react'
import PublicFooter from '@/components/layout/PublicFooter'
import ThemeToggle from '@/components/ThemeToggle'

export const metadata: Metadata = {
  title: 'Early Access - Dynamic Garage',
  description: 'The app built for car enthusiasts who give a damn. Log every mod, service record, document, and photo. Share your build with one link. Free during early access.',
  robots: { index: false, follow: false }, // don't index ad landing pages
}

const FEATURES = [
  { icon: <Wrench size={16} />, color: '#e53e3e', title: 'Mod Log',            desc: 'Every part, every dollar, documented.' },
  { icon: <ClipboardList size={16} />, color: '#2563eb', title: 'Service History', desc: 'Oil changes to engine builds - all in one place.' },
  { icon: <FileText size={16} />, color: '#16a34a', title: 'Document Vault',    desc: 'Receipts, titles, window stickers - stored forever.' },
  { icon: <Camera size={16} />, color: '#8b5cf6', title: 'Photo Gallery',      desc: 'Every stage of the build, organized.' },
  { icon: <Trophy size={16} />, color: '#f59e0b', title: 'Show History',       desc: 'Log placements, trophies, and event wins.' },
  { icon: <GitBranch size={16} />, color: '#f97316', title: 'Build Timeline',  desc: 'Your entire build, from day one, in order.' },
  { icon: <Share2 size={16} />, color: '#f59e0b', title: 'Public Build Page',  desc: 'One link. Your entire build. Anyone can see it.' },
  { icon: <QrCode size={16} />, color: '#14b8a6', title: 'QR Show Card',       desc: 'Scan at a show - full build, right there.' },
]

const PROOF = [
  'Free during early access',
  'No credit card required',
  'Any make and model',
  'Works on mobile',
]

export default function EarlyAccessPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Minimal nav - logo + theme toggle + CTA only */}
      <nav style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg, var(--red) 0%, transparent 60%)', position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <span style={{ color: '#a8a8a8' }}>Dynamic</span><span style={{ color: 'var(--red)' }}> Garage</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ThemeToggle />
            <Link href="/register" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: 34 }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 1.5rem', background: 'var(--bg-base)', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(204,32,32,0.1)', border: '1px solid rgba(204,32,32,0.25)',
            borderRadius: 100, padding: '0.3rem 0.9rem', marginBottom: '1.75rem',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)' }}>
              Early Access - Free
            </span>
          </div>

          {/* Headline */}
          <h1 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            fontWeight: 900,
            lineHeight: 1.0,
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
            marginBottom: '1.25rem',
          }}>
            Your build deserves better than a spreadsheet.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            maxWidth: 560,
            margin: '0 auto 2.5rem',
          }}>
            Document every mod, service record, photo, and document. Share your full build with one link. Built for people who give a damn about their cars.
          </p>

          {/* Primary CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <Link href="/register" className="btn-primary" style={{
              fontSize: '1.05rem', padding: '0.85rem 2.25rem',
              minHeight: 52, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
              boxShadow: '0 4px 20px rgba(204,32,32,0.35)',
            }}>
              Claim Your Free Garage <ChevronRight size={18} />
            </Link>

            {/* Trust signals */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {PROOF.map(p => (
                <span key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  <Check size={12} color="#16a34a" strokeWidth={3} /> {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SCREENSHOT ── */}
      <section style={{ padding: '0 1.5rem 4rem' }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <div style={{
            borderRadius: 16,
            overflow: 'hidden',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.18)',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/screenshots/screen-dashboard.png"
              alt="Dynamic Garage vehicle profile"
              style={{ width: '100%', display: 'block' }}
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'clamp(3rem, 6vw, 5rem) 1.5rem',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.6rem' }}>
              Everything Included
            </p>
            <h2 style={{
              fontFamily: "'Barlow Condensed'",
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 900, letterSpacing: '0.01em',
              color: 'var(--text-primary)', lineHeight: 1,
            }}>
              One app. Your entire car&apos;s life story.
            </h2>
          </div>

          <div className="ea-grid">
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                padding: '1.25rem',
                display: 'flex',
                gap: '0.85rem',
                alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 9, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${f.color}18`,
                  color: f.color,
                  border: `1px solid ${f.color}30`,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: 'clamp(3.5rem, 7vw, 6rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 580, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            fontWeight: 900, lineHeight: 1.05,
            color: 'var(--text-primary)', marginBottom: '1rem',
          }}>
            Your build is worth documenting.<br />
            <span style={{ color: 'var(--red)' }}>Start today. It&apos;s free.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Join during early access and get full access to every feature at no cost. Any make, any model, any build.
          </p>
          <Link href="/register" className="btn-primary" style={{
            fontSize: '1.05rem', padding: '0.85rem 2.25rem',
            minHeight: 52, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            boxShadow: '0 4px 20px rgba(204,32,32,0.3)',
          }}>
            Get Early Access Free <ChevronRight size={18} />
          </Link>
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            No credit card. No commitment. Cancel anytime.
          </p>
        </div>
      </section>

      <PublicFooter />

      <style>{`
        .ea-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.85rem;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 900px) { .ea-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 480px) { .ea-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  )
}
