import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, Wrench, ClipboardList, FileText, Camera, Trophy, GitBranch, Share2, QrCode, Layers, Tag, MessageSquare, ScanLine, Link2, Moon, Car, Bell, ShieldCheck } from 'lucide-react'
import PublicFooter from '@/components/layout/PublicFooter'
import ThemeToggle from '@/components/ThemeToggle'
import EarlyAccessCTA from './EarlyAccessCTA'

export const metadata: Metadata = {
  title: 'Early Access - Dynamic Garage',
  description: 'The app built for car enthusiasts who give a damn. Log every mod, service record, document, and photo. Share your build with one link. Free during early access.',
  robots: { index: false, follow: false }, // don't index ad landing pages
}

export default function EarlyAccessPage() {
  const GROUPS = [
    {
      label: 'Build & Document',
      color: '#3b82f6',
      tagline: 'Track every dollar. Prove your build is worth it.',
      features: [
        { icon: <Wrench size={15} />,        color: '#e53e3e', title: 'Mod Log',                  desc: 'Track every dollar - prove your build is worth it.' },
        { icon: <ClipboardList size={15} />,  color: '#2563eb', title: 'Service History',          desc: 'Show buyers and judges your car was done right.' },
        { icon: <FileText size={15} />,       color: '#16a34a', title: 'Document Vault',           desc: 'Receipts, titles, window stickers - all in one place, forever.' },
        { icon: <Camera size={15} />,         color: '#8b5cf6', title: 'Photo Gallery',            desc: 'Every stage of the build, organized and shareable.' },
        { icon: <ScanLine size={15} />,       color: '#2563eb', title: 'VIN Decoder',              desc: 'Drop in your VIN - year, make, model, trim fills itself.' },
        { icon: <GitBranch size={15} />,      color: '#f97316', title: 'Build Timeline',           desc: 'Every mod, service, and photo in one chronological story.' },
      ],
    },
    {
      label: 'Showcase & Share',
      color: '#f59e0b',
      tagline: 'One link. Your entire build. Anywhere.',
      features: [
        { icon: <Trophy size={15} />,         color: '#f59e0b', title: 'Show & Event History',     desc: 'Log every car show, placement, and trophy win.' },
        { icon: <Share2 size={15} />,         color: '#f59e0b', title: 'Public Build Pages',       desc: 'One link that proves everything about your car.' },
        { icon: <Layers size={15} />,         color: '#14b8a6', title: 'Public Garage',            desc: 'Your whole collection at a single URL.' },
        { icon: <QrCode size={15} />,         color: '#f59e0b', title: 'QR Show Cards',            desc: 'Set it on your dash - anyone who scans it sees your full build.' },
        { icon: <Link2 size={15} />,          color: '#6366f1', title: 'Social Sharing',           desc: 'Share to X, Facebook, or WhatsApp with a rich preview card.' },
        { icon: <Moon size={15} />,           color: '#8b5cf6', title: 'Dark & Light Mode',        desc: 'Dark or light - your garage, your vibe.' },
      ],
    },
    {
      label: 'Sell & Protect',
      color: '#16a34a',
      tagline: "Selling or insuring - you're covered either way.",
      features: [
        { icon: <Tag size={15} />,            color: '#16a34a', title: 'For Sale Listings',        desc: "List it for sale with a badge buyers can't miss." },
        { icon: <MessageSquare size={15} />,  color: '#f97316', title: 'Contact Seller',           desc: 'Buyers reach you directly - your email stays private.' },
        { icon: <Bell size={15} />,           color: '#dc2626', title: 'NHTSA Recall Alerts',      desc: 'We watch your VIN. If a recall drops, you hear about it first.' },
        { icon: <ShieldCheck size={15} />,    color: '#16a34a', title: 'Insurance Documentation',  desc: 'Print-ready mod package your insurer will actually accept.' },
        { icon: <Car size={15} />,            color: '#e53e3e', title: 'Any Make & Model',         desc: 'Corvette, Mustang, Porsche, BMW - every car, every year.' },
      ],
    },
  ]

  const PROOF = ['Free during early access', 'No credit card required', 'Any make and model', 'Works on mobile']

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
            <EarlyAccessCTA size="small" />
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: 'clamp(3.5rem, 8vw, 6rem) 1.5rem', background: 'var(--bg-base)', textAlign: 'center' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>

          {/* Eyebrow */}
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
            <EarlyAccessCTA size="large" />

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
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
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

          <div className="ea-pillars">
            {GROUPS.map((group, gi) => (
              <div key={group.label} style={{
                borderLeft: `3px solid ${group.color}`,
                paddingLeft: '1.75rem',
                paddingRight: gi < 2 ? '2.5rem' : 0,
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{
                    fontSize: '1.1rem', fontWeight: 900,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: '0.04em', textTransform: 'uppercase',
                    color: group.color, lineHeight: 1, marginBottom: '0.4rem',
                  }}>
                    {group.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {group.tagline}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {group.features.map((f, i) => (
                    <div key={f.title} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
                      padding: '0.75rem 0',
                      borderBottom: i < group.features.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}>
                      <div style={{ color: f.color, flexShrink: 0, marginTop: 2, opacity: 0.9 }}>{f.icon}</div>
                      <div>
                        <div style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.1rem' }}>{f.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
                      </div>
                    </div>
                  ))}
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
          <EarlyAccessCTA size="large" />
          <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            No credit card. No commitment. Cancel anytime.
          </p>
        </div>
      </section>

      <PublicFooter />

      <style>{`
        .ea-pillars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (max-width: 768px) {
          .ea-pillars { grid-template-columns: 1fr !important; }
          .ea-pillars > div { padding-right: 0 !important; margin-bottom: 2.5rem; }
          .ea-pillars > div:last-child { margin-bottom: 0; }
        }
      `}</style>
    </div>
  )
}
