import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Wrench, ClipboardList, Camera, Share2, QrCode, Bell } from 'lucide-react'
import PublicFooter from '@/components/layout/PublicFooter'
import ThemeToggle from '@/components/ThemeToggle'
import EarlyAccessCTA from './EarlyAccessCTA'
import EarlyAccessFAQ from './EarlyAccessFAQ'

export const metadata: Metadata = {
  title: 'Early Access - Dynamic Garage',
  description: 'The app built for car enthusiasts who give a damn. Log every mod, service record, document, and photo. Share your build with one link. Free during early access.',
  robots: { index: false, follow: false },
}

const PROOF = ['Free during early access', 'No credit card required', 'Any make and model', 'Works on mobile']

const FEATURES = [
  { icon: <Wrench size={18} />,       color: '#e53e3e', title: 'Mod Log',           desc: 'Every part, every dollar. Documented and provable.' },
  { icon: <ClipboardList size={18} />, color: '#2563eb', title: 'Service History',   desc: 'Show buyers and judges your car was done right.' },
  { icon: <Camera size={18} />,        color: '#8b5cf6', title: 'Photo Gallery',     desc: 'Every stage of the build, organized and shareable.' },
  { icon: <Share2 size={18} />,        color: '#f59e0b', title: 'Public Build Page', desc: 'One link. Your entire car. Anyone can see it.' },
  { icon: <QrCode size={18} />,        color: '#14b8a6', title: 'QR Show Cards',     desc: 'Set it on your dash. Anyone who scans it sees your full build.' },
  { icon: <Bell size={18} />,          color: '#dc2626', title: 'Recall Alerts',     desc: 'We watch your VIN. If a recall drops, you hear about it first.' },
]

const SCREENSHOTS = [
  { src: '/screenshots/export1.png',       alt: 'Vehicle report with full build documentation', caption: 'Vehicle Report' },
  { src: '/screenshots/timeline1.png',     alt: 'Build timeline showing all events chronologically', caption: 'Build Timeline' },
  { src: '/screenshots/dd_car1.png',       alt: 'Public build page anyone can view', caption: 'Public Build Page' },
  { src: '/screenshots/screen-report4.png', alt: 'QR show card for car shows', caption: 'QR Show Card' },
]

export default function EarlyAccessPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* Nav */}
      <nav style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg, var(--red) 0%, transparent 60%)', position: 'absolute', top: 0, left: 0, right: 0 }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <span style={{ color: '#a8a8a8' }}>Dynamic</span><span style={{ color: 'var(--red)' }}> Garage</span>
            </span>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ThemeToggle />
            <EarlyAccessCTA size="small" />
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Green badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(22,163,74,0.12)', border: '1px solid rgba(22,163,74,0.3)',
            borderRadius: 100, padding: '0.4rem 1.1rem', marginBottom: '1.75rem',
          }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#16a34a', display: 'inline-block', animation: 'pulse 2s infinite', flexShrink: 0 }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#16a34a' }}>
              Free during early access · Any make · Any model
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            fontWeight: 900, lineHeight: 1.0, letterSpacing: '-0.01em',
            color: 'var(--text-primary)', marginBottom: '1.25rem',
          }}>
            Your build deserves better than a spreadsheet.
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)',
            color: 'var(--text-secondary)', lineHeight: 1.75,
            maxWidth: 520, margin: '0 auto 2.5rem',
          }}>
            Document every mod, service record, and photo. Share your full build with one link. Built for people who give a damn about their cars.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <EarlyAccessCTA size="large" />
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

      {/* ── SCREENSHOTS ── */}
      <section style={{ padding: '0 1.5rem 5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="ea-screenshots">
            {SCREENSHOTS.map(s => (
              <div key={s.src} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{
                  borderRadius: 12, overflow: 'hidden',
                  border: '1px solid var(--border-subtle)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={s.src} alt={s.alt} style={{ width: '100%', display: 'block' }} />
                </div>
                <p style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textAlign: 'center', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {s.caption}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6 FEATURES ── */}
      <section style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'clamp(3rem, 6vw, 5rem) 1.5rem',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.5rem' }}>What you get</p>
            <h2 style={{
              fontFamily: "'Barlow Condensed'",
              fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
              fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1,
            }}>
              Everything your build needs. Nothing it doesn&apos;t.
            </h2>
          </div>

          <div className="ea-features">
            {FEATURES.map(f => (
              <div key={f.title} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12, padding: '1.25rem',
                display: 'flex', gap: '0.85rem', alignItems: 'flex-start',
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}28`,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{f.title}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOUNDER STORY ── */}
      <section style={{ padding: 'clamp(3rem, 6vw, 5rem) 1.5rem' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/screenshots/dd_inCar.jpg"
            alt="David in his Corvette"
            style={{
              width: 120, height: 120, borderRadius: '50%',
              objectFit: 'cover', objectPosition: 'center top',
              margin: '0 auto 1.25rem', display: 'block',
              border: '3px solid var(--border-default)',
              boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            }}
          />
          <blockquote style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(1.4rem, 3vw, 1.9rem)',
            fontWeight: 700, lineHeight: 1.35,
            color: 'var(--text-primary)', marginBottom: '1.25rem',
            fontStyle: 'normal',
          }}>
            &ldquo;I built this because I was tracking my own Corvette build across five different apps and spreadsheets and it was a mess. I wanted one place that did it all.&rdquo;
          </blockquote>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
            David — Corvette owner, New Brunswick, Canada
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
            2022 C8 Stingray · Solo builder · Not a startup
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: 'clamp(3rem, 6vw, 4.5rem) 1.5rem',
      }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
            fontWeight: 900, color: 'var(--text-primary)',
            textAlign: 'center', marginBottom: '1.75rem',
          }}>
            Quick questions
          </h2>
          <EarlyAccessFAQ />
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section style={{ padding: 'clamp(3.5rem, 7vw, 6rem) 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h2 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 900, lineHeight: 1.05,
            color: 'var(--text-primary)', marginBottom: '1rem',
          }}>
            Receipts in a shoebox. Mods in a spreadsheet. Photos on your phone. ENOUGH!<br />
            <span style={{ color: 'var(--red)' }}>Start your garage today.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Free during early access. Any make, any model. Takes 60 seconds to set up.
          </p>
          <EarlyAccessCTA size="large" />
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            No credit card. No commitment. Cancel anytime.
          </p>
        </div>
      </section>

      <PublicFooter />

      <style>{`
        .ea-screenshots {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          align-items: start;
        }
        .ea-features {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.85rem;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 900px) {
          .ea-screenshots { grid-template-columns: repeat(2, 1fr); }
          .ea-features { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .ea-screenshots { grid-template-columns: repeat(2, 1fr); gap: 0.5rem; }
          .ea-features { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
