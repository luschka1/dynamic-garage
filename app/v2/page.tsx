import Link from 'next/link'
import { Wrench, ClipboardList, FileText, Share2, ChevronRight } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import VariantSwitcher from '@/components/VariantSwitcher'

export default function HomePageV2() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── NAV ── */}
      <nav style={{
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '0 2rem',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(12px)',
        zIndex: 50,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            background: 'var(--red)',
            width: 28,
            height: 28,
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: '0.85rem', color: '#fff', letterSpacing: '0.04em' }}>DG</span>
          </div>
          <span style={{
            fontFamily: "'Barlow Condensed'",
            fontWeight: 900,
            fontSize: '1.25rem',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: '#f0f0f0',
          }}>
            Dynamic<span style={{ color: 'var(--red)' }}> Garage</span>
          </span>
        </div>

        {/* Desktop links + actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Link
            href="/dashboard"
            className="v2-nav-link"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(240,240,240,0.5)',
              textDecoration: 'none',
              transition: 'color 150ms',
            }}
          >
            My Garage
          </Link>
          <Link
            href="/login"
            className="v2-nav-link"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(240,240,240,0.5)',
              textDecoration: 'none',
              transition: 'color 150ms',
            }}
          >
            Sign In
          </Link>
          <div style={{ marginLeft: '0.5rem' }}>
            <ThemeToggle />
          </div>
          <Link
            href="/register"
            className="btn-primary"
            style={{ marginLeft: '0.5rem', padding: '0.55rem 1.4rem', minHeight: 40, fontSize: '0.88rem' }}
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: 'relative',
        overflow: 'hidden',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {/* Grid-line background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.5,
          pointerEvents: 'none',
        }} />

        {/* Red radial glow - center-bottom */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 900,
          height: 500,
          background: 'radial-gradient(ellipse at center bottom, rgba(204,31,31,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* Center content */}
        <div style={{
          position: 'relative',
          maxWidth: 960,
          margin: '0 auto',
          textAlign: 'center',
          padding: '6rem 2rem 0',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Pill badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--red-dim)',
            border: '1px solid rgba(204,31,31,0.3)',
            borderRadius: 999,
            padding: '0.35rem 1rem',
            marginBottom: '2.25rem',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', flexShrink: 0 }} />
            <span style={{
              fontFamily: "'Barlow Condensed'",
              fontSize: '0.8rem',
              fontWeight: 800,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--red)',
            }}>
              The Ultimate Garage Log
            </span>
          </div>

          {/* Giant headline */}
          <h1 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(5rem, 13vw, 11rem)',
            fontWeight: 900,
            lineHeight: 0.88,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            marginBottom: 0,
            color: 'var(--text-primary)',
          }}>
            EVERY MOD.<br />
            EVERY MILE.<br />
            <span style={{ color: 'var(--red)' }}>EVERY DETAIL.</span>
          </h1>

          {/* Thin red rule */}
          <div style={{
            width: 60,
            height: 2,
            background: 'var(--red)',
            margin: '1.5rem auto',
            borderRadius: 1,
          }} />

          {/* Value statement */}
          <p style={{
            fontSize: '1.1rem',
            color: 'var(--text-secondary)',
            maxWidth: 560,
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            The professional-grade tool for serious enthusiasts. Track modifications, service history, and documents for any vehicle - in one clean, fast app.
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/register" className="btn-primary" style={{ fontSize: '1.15rem', padding: '0.9rem 2.25rem', minHeight: 56, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
              Build Your Garage <ChevronRight size={18} />
            </Link>
            <Link href="/login" className="btn-secondary" style={{ fontSize: '1.15rem', padding: '0.9rem 2.25rem', minHeight: 56 }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Marquee belt - pinned to bottom of hero */}
        <div style={{
          overflow: 'hidden',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-elevated)',
          padding: '0.75rem 0',
          marginTop: '3rem',
        }}>
          <div
            className="v2-marquee"
            style={{ display: 'flex', gap: '2rem', whiteSpace: 'nowrap', width: 'max-content' }}
          >
            {[...Array(2)].map((_, i) => (
              <span key={i} style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                {['MOD LOG', 'SERVICE HISTORY', 'DOCUMENT VAULT', 'PUBLIC BUILD PAGES', 'CARFAX INTEGRATION', 'PHOTO GALLERY', 'QR SHARING'].map(item => (
                  <span key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '1.25rem' }}>
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.45)',
                    }}>
                      {item}
                    </span>
                    <span style={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: 'var(--red)',
                      display: 'inline-block',
                      flexShrink: 0,
                    }} />
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        background: 'var(--bg-elevated)',
        padding: '2.5rem 2rem',
      }}>
        <div style={{
          maxWidth: 900,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          {[
            { value: '12,000+', label: 'Cars Tracked' },
            { value: 'Free', label: 'No Credit Card' },
            { value: 'Unlimited', label: 'Vehicles' },
            { value: 'Secure', label: 'Cloud Storage' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Barlow Condensed'",
                fontSize: 'clamp(2rem, 4vw, 2.75rem)',
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '0.02em',
                lineHeight: 1,
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
                marginTop: '0.35rem',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES 2×2 GRID ── */}
      <section style={{ padding: '5.5rem 2rem', background: 'var(--bg-base)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <h2 style={{
              fontFamily: "'Barlow Condensed'",
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}>
              PURPOSE-BUILT FOR ENTHUSIASTS
            </h2>
          </div>

          {/* 2×2 card grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.25rem' }}>
            {[
              {
                icon: <Wrench size={26} />,
                title: 'Mod Log',
                desc: 'Every upgrade tracked - part number, cost, vendor, install date, and notes.',
                accent: 'var(--red)',
              },
              {
                icon: <ClipboardList size={26} />,
                title: 'Service History',
                desc: 'Complete maintenance records including mileage, shop, and cost per visit.',
                accent: 'var(--blue)',
              },
              {
                icon: <FileText size={26} />,
                title: 'Document Vault',
                desc: 'Upload receipts, window stickers, manuals, and photos - all secure and accessible.',
                accent: 'var(--green)',
              },
              {
                icon: <Share2 size={26} />,
                title: 'Public Build Pages',
                desc: 'Share a live build page with anyone - perfect for shows, sales, or forums.',
                accent: 'var(--gold)',
              },
            ].map(f => (
              <div
                key={f.title}
                className="v2-feature-card"
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: 12,
                  padding: '2rem',
                  borderLeft: `3px solid ${f.accent}`,
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                  cursor: 'default',
                }}
              >
                <div style={{ color: f.accent, marginBottom: '1rem' }}>{f.icon}</div>
                <h3 style={{
                  fontFamily: "'Barlow Condensed'",
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem',
                }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ── */}
      <section style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '6rem 2rem',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontFamily: "'Barlow Condensed'",
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          color: 'var(--text-primary)',
          marginBottom: '0.75rem',
          lineHeight: 1,
        }}>
          YOUR GARAGE AWAITS.
        </h2>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.05rem',
          marginBottom: '2.5rem',
          maxWidth: 420,
          margin: '0 auto 2.5rem',
          lineHeight: 1.65,
        }}>
          Free forever. Any car. Any era. Start building your definitive vehicle history today.
        </p>
        <Link
          href="/register"
          className="btn-primary"
          style={{ fontSize: '1.2rem', padding: '1rem 3rem', minHeight: 58, display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          Create Free Account <ChevronRight size={20} />
        </Link>
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
        background: 'var(--bg-base)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div style={{
            background: 'var(--red)',
            width: 22,
            height: 22,
            borderRadius: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: '0.7rem', color: '#fff' }}>DG</span>
          </div>
          <span style={{
            fontFamily: "'Barlow Condensed'",
            fontWeight: 900,
            fontSize: '1rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
          }}>
            Dynamic<span style={{ color: 'var(--red)' }}> Garage</span>
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Built for enthusiasts.</span>
      </footer>

      <VariantSwitcher />

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .v2-marquee {
          animation: marquee 22s linear infinite;
        }
        .v2-nav-link:hover {
          color: rgba(240,240,240,0.9) !important;
        }
        .v2-feature-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-hover);
        }
      `}</style>
    </div>
  )
}
