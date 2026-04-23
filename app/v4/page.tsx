import Link from 'next/link'
import { Wrench, ClipboardList, FileText, Share2, ChevronRight } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import VariantSwitcher from '@/components/VariantSwitcher'

export default function HomePageV4() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── NAV ── */}
      <nav style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2.5rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        {/* Wordmark */}
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: '1.05rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
        }}>
          Dynamic Garage
        </span>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Link href="/login" className="prestige-nav-link">
            Sign In
          </Link>
          <span style={{
            display: 'inline-block',
            width: 1,
            height: 14,
            background: 'var(--border-default)',
            margin: '0 0.5rem',
          }} />
          <Link href="/register" className="prestige-nav-link">
            Get Started
          </Link>
          <span style={{
            display: 'inline-block',
            width: 1,
            height: 14,
            background: 'var(--border-default)',
            margin: '0 0.5rem',
          }} />
          <ThemeToggle />
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        textAlign: 'center',
        padding: '10rem 2rem',
        background: 'var(--bg-base)',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

          {/* Eyebrow */}
          <p style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 400,
            fontSize: '0.72rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            Dynamic Garage
          </p>

          {/* Gold rule */}
          <div style={{
            width: 40,
            height: 1,
            background: 'var(--gold)',
            margin: '1.5rem auto',
          }} />

          {/* Display heading */}
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(3.5rem, 8vw, 6rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            margin: 0,
            letterSpacing: '-0.01em',
          }}>
            The Complete Record<br />
            <em style={{ fontStyle: 'italic' }}>for Every Vehicle.</em>
          </h1>

          {/* Gold rule */}
          <div style={{
            width: 40,
            height: 1,
            background: 'var(--gold)',
            margin: '2rem auto',
          }} />

          {/* Value statement */}
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '1.25rem',
            lineHeight: 1.8,
            color: 'var(--text-secondary)',
            maxWidth: 580,
            margin: '0 auto',
          }}>
            "Capture every detail of your vehicle in one place - creating a verified history
            that builds value, trust, and confidence for enthusiasts, collectors, and buyers."
          </p>

          {/* Spacer */}
          <div style={{ height: '2.5rem' }} />

          {/* CTA buttons */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <Link href="/register" className="prestige-btn prestige-btn-gold">
              Create Your Record
            </Link>
            <Link href="/login" className="prestige-btn prestige-btn-muted">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS STRIP ── */}
      <div style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '3rem 2rem',
      }}>
        <div style={{
          maxWidth: 960,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '2rem',
        }}>
          {[
            { value: 'Any Make', label: 'Any Model' },
            { value: 'Free', label: 'No Credit Card' },
            { value: 'Unlimited', label: 'Vehicles & Records' },
            { value: 'Secure', label: 'Cloud Storage' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontWeight: 900,
                fontSize: 'clamp(1.4rem, 3vw, 1.75rem)',
                letterSpacing: '0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}>
                {s.value}
              </div>
              <div style={{
                fontSize: '0.68rem',
                fontVariant: 'small-caps',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--text-muted)',
                marginTop: '0.4rem',
              }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{
        background: 'var(--bg-base)',
        padding: '6rem 2rem',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>

          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{
              width: 24,
              height: 1,
              background: 'var(--gold)',
              margin: '0 auto 1.75rem',
            }} />
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 300,
              fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
              color: 'var(--text-primary)',
              margin: 0,
              lineHeight: 1.2,
            }}>
              Four pillars of a complete build record.
            </h2>
          </div>

          {/* Feature columns */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '3rem',
          }}>
            {[
              {
                title: 'Mod Log',
                desc: 'Every upgrade documented - part number, vendor, cost, install date, and notes. A permanent record of every decision made.',
              },
              {
                title: 'Service History',
                desc: 'Complete maintenance records tied to mileage and date. Every oil change, every brake job, every shop visit - logged and searchable.',
              },
              {
                title: 'Document Vault',
                desc: 'Upload receipts, window stickers, manuals, and photos. Securely stored and accessible anywhere, on any device.',
              },
              {
                title: 'Public Build Pages',
                desc: 'Share a living build page with anyone - buyers, judges, forums, or shows. A verifiable record that speaks for itself.',
              },
            ].map(f => (
              <div key={f.title}>
                <div style={{
                  width: 24,
                  height: 1,
                  background: 'var(--gold)',
                  marginBottom: '1.25rem',
                }} />
                <h3 style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  marginBottom: '0.75rem',
                }}>
                  {f.title}
                </h3>
                <p style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.7,
                  margin: 0,
                }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PULL QUOTE ── */}
      <section style={{
        background: 'var(--bg-elevated)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '6rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: '5rem',
            lineHeight: 1,
            color: 'var(--gold)',
            marginBottom: '-1rem',
            userSelect: 'none',
          }}>
            &ldquo;
          </div>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '1.75rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            margin: '0 0 2rem',
          }}>
            Every modification, every service record, every receipt - together they tell
            the story of a vehicle cared for with purpose.
          </p>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.72rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            margin: 0,
          }}>
            The Dynamic Garage philosophy
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: 'var(--bg-base)',
        padding: '5rem 2rem',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{
            width: 40,
            height: 1,
            background: 'var(--gold)',
            margin: '0 auto 2.5rem',
          }} />
          <h2 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontWeight: 300,
            fontSize: '3rem',
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            margin: '0 0 1rem',
          }}>
            Begin Your Record.
          </h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: '1.15rem',
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            margin: '0 0 2.25rem',
          }}>
            One place for the full story of every vehicle you care about.
          </p>
          <Link href="/register" className="prestige-btn prestige-btn-gold">
            Create Your Record
          </Link>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '0.75rem',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            margin: '1.5rem 0 0',
          }}>
            Free forever &middot; Any vehicle &middot; Any era
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.75rem 2rem',
        textAlign: 'center',
        background: 'var(--bg-elevated)',
      }}>
        <p style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 600,
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--text-muted)',
          margin: 0,
        }}>
          Dynamic Garage &nbsp;&middot;&nbsp; &copy; 2025 &nbsp;&middot;&nbsp; Built for enthusiasts.
        </p>
      </footer>

      <VariantSwitcher />

      <style>{`
        /* ── Prestige nav links ── */
        .prestige-nav-link {
          font-family: 'Inter', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          text-decoration: none;
          padding: 0.35rem 0.6rem;
          transition: color 200ms;
        }
        .prestige-nav-link:hover {
          color: var(--text-primary);
        }

        /* ── Prestige buttons ── */
        .prestige-btn {
          border: 1px solid var(--border-default);
          background: transparent;
          color: var(--text-primary);
          padding: 0.8rem 2.2rem;
          border-radius: 4px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 200ms;
        }
        .prestige-btn:hover {
          border-color: var(--gold);
          color: var(--gold);
        }

        /* Gold variant */
        .prestige-btn-gold {
          border-color: var(--gold);
          color: var(--gold);
        }
        .prestige-btn-gold:hover {
          background: var(--gold);
          color: var(--bg-base);
        }

        /* Muted variant */
        .prestige-btn-muted {
          border-color: var(--border-default);
          color: var(--text-muted);
        }
        .prestige-btn-muted:hover {
          border-color: var(--text-muted);
          color: var(--text-primary);
        }
      `}</style>
    </div>
  )
}
