import Link from 'next/link'
import { Wrench, ClipboardList, FileText, Share2, ChevronRight, Check, Shield, LayoutGrid } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ── STICKY NAV ── */}
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 64,
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontStyle: 'italic', fontSize: '1.25rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span style={{ color: 'var(--red)' }}>Dynamic</span><span style={{ color: 'var(--text-muted)' }}> Garage</span>
          </span>
        </Link>

        {/* Right: gallery + sign in + toggle + cta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link href="/gallery" className="v3-nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0.4rem 0.75rem', borderRadius: 6, textDecoration: 'none', transition: 'color 150ms' }}>
            <LayoutGrid size={14} /> Gallery
          </Link>
          <Link href="/login" className="v3-nav-link" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', padding: '0.4rem 0.75rem', borderRadius: 6, textDecoration: 'none', transition: 'color 150ms' }}>
            Sign In
          </Link>
          <ThemeToggle />
          <Link href="/register" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem', minHeight: 36, letterSpacing: '0.04em' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '55% 45%', gap: '4rem', alignItems: 'center' }} className="hero-grid">

          {/* Left column */}
          <div>
            {/* Shield Logo */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{ width: 90, height: 90, background: '#0d0d0d', borderRadius: 14, overflow: 'hidden', boxShadow: '0 6px 24px rgba(0,0,0,0.22)' }}>
                <img src="/logo.png" alt="Dynamic Garage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
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
              Track everything.<br />
              <span style={{ color: 'var(--red)' }}>Build real value.</span>
            </h1>

            {/* Value statement */}
            <p style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.75,
              maxWidth: 480,
              marginBottom: '2.25rem',
            }}>
              Capture every detail of your vehicle in one place - creating a verified history that builds value, trust, and confidence for enthusiasts, collectors, and buyers.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.75rem' }}>
              <Link href="/register" className="btn-primary" style={{ fontSize: '0.95rem', padding: '0.7rem 1.5rem', minHeight: 44 }}>
                Get Started Free <ChevronRight size={16} />
              </Link>
              <Link href="/login" className="btn-secondary" style={{ fontSize: '0.95rem', padding: '0.7rem 1.5rem', minHeight: 44 }}>
                Sign In
              </Link>
            </div>

            {/* Trust row */}
            <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { icon: <Check size={13} strokeWidth={2.5} />, label: 'Free during early access' },
                { icon: <Check size={13} strokeWidth={2.5} />, label: 'No card required now' },
                { icon: <Shield size={13} strokeWidth={2} />, label: 'Secure cloud' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <span style={{ color: 'var(--green)', display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — App UI Mockup */}
          <div style={{
            borderRadius: 16,
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-card)',
            overflow: 'hidden',
            background: 'var(--bg-card)',
            userSelect: 'none',
          }}>
            {/* Mockup header bar */}
            <div style={{
              background: 'var(--bg-elevated)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '0.65rem 1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                {/* Traffic lights */}
                <div style={{ display: 'flex', gap: '0.35rem' }}>
                  {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                    <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c, opacity: 0.85 }} />
                  ))}
                </div>
                <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.06em', marginLeft: '0.25rem', textTransform: 'uppercase' }}>
                  <span style={{ color: 'var(--red)' }}>Dynamic</span><span style={{ color: 'var(--text-muted)' }}> Garage</span>
                </span>
              </div>
              <button style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--red)', background: 'var(--red-dim)', border: '1px solid rgba(204,31,31,0.2)', borderRadius: 4, padding: '0.25rem 0.55rem', cursor: 'default', fontFamily: "'Inter', sans-serif" }}>
                + Add Car
              </button>
            </div>

            {/* Car card with real photo */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{
                height: 110,
                borderRadius: 8,
                marginBottom: '0.85rem',
                position: 'relative',
                overflow: 'hidden',
              }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/corvette-hero.jpg"
                  alt="2019 Chevrolet Corvette Z06"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {/* Overlay gradient */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 55%)' }} />
                <div style={{ position: 'absolute', bottom: 10, left: 12, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)' }} />
                  <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: '0.04em' }}>Z06 · VIN ···1847</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: '1rem', letterSpacing: '0.04em', color: 'var(--text-primary)' }}>
                  2019 Corvette Z06
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  4 Mods &middot; 2 Service
                </span>
              </div>
            </div>

            {/* Mods list */}
            <div style={{ padding: '0.75rem 1.25rem 1.25rem' }}>
              <div style={{ fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                Recent Mods
              </div>
              {[
                { name: 'Corsa Sport Exhaust', cat: 'Performance', price: '$1,249' },
                { name: 'Stage 2 Tune',        cat: 'Performance', price: '$899'   },
                { name: 'Eibach Coilovers',    cat: 'Suspension',  price: '$1,450' },
              ].map((mod, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.55rem 0.65rem',
                  marginBottom: '0.35rem',
                  borderLeft: '3px solid var(--red)',
                  background: 'var(--bg-base)',
                  borderRadius: '0 6px 6px 0',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {mod.name}
                    </div>
                    <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>{mod.cat}</div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', flexShrink: 0, marginLeft: '0.5rem' }}>
                    {mod.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
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
          Works with any vehicle &mdash; Corvette, Mustang, Porsche, BMW, Ferrari, and everything in between.
        </p>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ background: 'var(--bg-base)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Section header */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p className="page-eyebrow" style={{ marginBottom: '0.6rem' }}>WHAT&apos;S INSIDE</p>
            <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '0.01em', color: 'var(--text-primary)' }}>
              Everything your build needs
            </h2>
          </div>

          {/* Feature cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              {
                icon: <Wrench size={22} />,
                title: 'Mod Log',
                desc: 'Every upgrade tracked — part number, cost, vendor, install date, and notes.',
                iconBg: 'var(--red-dim)',
                iconColor: 'var(--red)',
              },
              {
                icon: <ClipboardList size={22} />,
                title: 'Service History',
                desc: 'Complete maintenance records with mileage, shop, and cost per visit.',
                iconBg: 'var(--blue-dim)',
                iconColor: 'var(--blue)',
              },
              {
                icon: <FileText size={22} />,
                title: 'Document Vault',
                desc: 'Upload receipts, window stickers, manuals, and photos — secure and accessible.',
                iconBg: 'var(--green-dim)',
                iconColor: 'var(--green)',
              },
              {
                icon: <Share2 size={22} />,
                title: 'Public Build Pages',
                desc: 'Share a live build page with anyone — perfect for shows, sales, or forums.',
                iconBg: 'var(--gold-dim)',
                iconColor: 'var(--gold)',
              },
            ].map(f => (
              <div key={f.title} className="v3-feature-card" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 12,
                padding: '1.75rem',
                transition: 'box-shadow 180ms ease, border-color 180ms ease, transform 180ms ease',
              }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  background: f.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: f.iconColor,
                  marginBottom: '1.1rem',
                  flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.15rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: 'var(--bg-elevated)', padding: '5rem 2rem', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <p className="page-eyebrow" style={{ marginBottom: '0.6rem' }}>GET STARTED IN MINUTES</p>
            <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '0.01em', color: 'var(--text-primary)' }}>
              How it works
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2.5rem' }}>
            {[
              {
                num: '01',
                title: 'Create Your Garage',
                desc: 'Create your garage in seconds — any make, any model, any year. Free during early access.',
              },
              {
                num: '02',
                title: 'Log Everything',
                desc: 'Mods, service records, documents, photos — all in one organized, searchable place.',
              },
              {
                num: '03',
                title: 'Share Your Build',
                desc: 'Generate a public page, QR code, or share a verified history link with buyers.',
              },
            ].map(step => (
              <div key={step.num} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  fontFamily: "'Barlow Condensed'",
                  fontSize: '4rem',
                  fontWeight: 900,
                  lineHeight: 1,
                  color: 'var(--red)',
                  marginBottom: '0.75rem',
                  letterSpacing: '-0.02em',
                }}>
                  {step.num}
                </div>
                <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.04em', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            &ldquo;Capture every detail of your vehicle in one place - creating a verified history that builds value, trust, and confidence.&rdquo;
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
            YOUR GARAGE AWAITS.
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2.25rem' }}>
            Free during early access — no credit card required.
          </p>
          <Link href="/register" className="btn-primary" style={{ fontSize: '1.1rem', padding: '0.85rem 2.5rem', minHeight: 52 }}>
            Start Free — No Card Needed <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.5rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'var(--bg-elevated)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontStyle: 'italic', fontSize: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span style={{ color: 'var(--red)' }}>Dynamic</span><span style={{ color: 'var(--text-muted)' }}> Garage</span>
          </span>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          &copy; {new Date().getFullYear()} DynamicGarage.app &mdash; Built for enthusiasts.
        </span>
        <div style={{ display: 'flex', gap: '1.25rem' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <Link key={l} href="#" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 150ms' }} className="v3-footer-link">
              {l}
            </Link>
          ))}
        </div>
      </footer>

      {/* ── STYLES ── */}
      <style>{`
        .v3-nav-link:hover {
          color: var(--text-primary) !important;
          background: rgba(127,127,127,0.06);
        }
        .v3-feature-card:hover {
          box-shadow: var(--shadow-hover) !important;
          border-color: var(--border-default) !important;
          transform: translateY(-2px) !important;
        }
        .v3-footer-link:hover {
          color: var(--text-secondary) !important;
        }
        @media (max-width: 768px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
