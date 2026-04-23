import {
  Wrench, ClipboardList, FileText, Camera, Share2, Layers,
  Tag, MessageSquare, ScanLine, Link2, Moon, Car, QrCode, Bell, ShieldCheck,
} from 'lucide-react'

const FEATURES = [
  {
    icon: <Wrench size={18} />,
    title: 'Mod Log',
    desc: 'Track every dollar — prove your build is worth it.',
    iconColor: 'var(--red)',
    group: 'build' as const,
  },
  {
    icon: <ClipboardList size={18} />,
    title: 'Service History',
    desc: 'Show buyers and judges your car was done right.',
    iconColor: 'var(--blue)',
    group: 'build' as const,
  },
  {
    icon: <FileText size={18} />,
    title: 'Document Vault',
    desc: 'Receipts, titles, window stickers — all in one place, forever.',
    iconColor: 'var(--green)',
    group: 'build' as const,
  },
  {
    icon: <Camera size={18} />,
    title: 'Photo Gallery',
    desc: 'Every stage of the build, organized and shareable.',
    iconColor: '#8b5cf6',
    group: 'build' as const,
  },
  {
    icon: <ScanLine size={18} />,
    title: 'VIN Decoder',
    desc: 'Drop in your VIN — year, make, model, trim fills itself.',
    iconColor: 'var(--blue)',
    group: 'build' as const,
  },
  {
    icon: <Share2 size={18} />,
    title: 'Public Build Pages',
    desc: 'One link that proves everything about your car.',
    iconColor: 'var(--gold)',
    group: 'showcase' as const,
  },
  {
    icon: <Layers size={18} />,
    title: 'Public Garage',
    desc: 'Your whole collection at a single URL.',
    iconColor: '#14b8a6',
    group: 'showcase' as const,
  },
  {
    icon: <QrCode size={18} />,
    title: 'QR Show Cards',
    desc: 'Set it on your dash — anyone who scans it sees your full build.',
    iconColor: 'var(--gold)',
    group: 'showcase' as const,
  },
  {
    icon: <Link2 size={18} />,
    title: 'Social Sharing',
    desc: 'Share to X, Facebook, or WhatsApp with a rich preview card.',
    iconColor: '#6366f1',
    group: 'showcase' as const,
  },
  {
    icon: <Moon size={18} />,
    title: 'Dark & Light Mode',
    desc: 'Dark or light — your garage, your vibe.',
    iconColor: '#8b5cf6',
    group: 'showcase' as const,
  },
  {
    icon: <Tag size={18} />,
    title: 'For Sale Listings',
    desc: 'List it for sale with a badge buyers can\'t miss.',
    iconColor: 'var(--green)',
    group: 'protect' as const,
  },
  {
    icon: <MessageSquare size={18} />,
    title: 'Contact Seller',
    desc: 'Buyers reach you directly — your email stays private.',
    iconColor: '#f97316',
    group: 'protect' as const,
  },
  {
    icon: <Bell size={18} />,
    title: 'NHTSA Recall Alerts',
    desc: 'We watch your VIN. If a recall drops, you hear about it first.',
    iconColor: '#dc2626',
    group: 'protect' as const,
  },
  {
    icon: <ShieldCheck size={18} />,
    title: 'Insurance Documentation',
    desc: 'Print-ready mod package your insurer will actually accept.',
    iconColor: '#16a34a',
    group: 'protect' as const,
  },
  {
    icon: <Car size={18} />,
    title: 'Any Make & Model',
    desc: 'Corvette, Mustang, Porsche, BMW — every car, every year.',
    iconColor: 'var(--red)',
    group: 'protect' as const,
  },
]

const GROUPS = [
  {
    key: 'build' as const,
    label: 'Build & Document',
    tagline: 'Track every dollar. Prove your build is worth it.',
    color: '#3b82f6',
  },
  {
    key: 'showcase' as const,
    label: 'Showcase & Share',
    tagline: 'One link. Your entire build. Anywhere.',
    color: '#f59e0b',
  },
  {
    key: 'protect' as const,
    label: 'Sell & Protect',
    tagline: 'Selling or insuring — you\'re covered either way.',
    color: '#16a34a',
  },
]

export default function FeatureShowcase() {
  return (
    <section style={{
      background: 'var(--bg-elevated)',
      padding: '5rem 2rem',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="page-eyebrow" style={{ marginBottom: '0.6rem' }}>EVERYTHING INCLUDED</p>
          <h2 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 900,
            letterSpacing: '0.01em',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
          }}>
            Built for people who give a damn about their cars
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
            Whether you&apos;re building, showing, or selling — everything you need to prove what you&apos;ve got.
          </p>
        </div>

        {/* Pillars */}
        <div className="fs-pillars">
          {GROUPS.map((group, gi) => {
            const features = FEATURES.filter(f => f.group === group.key)
            return (
              <div key={group.key} className="fs-pillar" style={{
                borderLeft: `3px solid ${group.color}`,
                paddingLeft: '1.75rem',
                paddingRight: gi < 2 ? '2.5rem' : 0,
              }}>
                {/* Category header */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    fontFamily: "'Barlow Condensed', sans-serif",
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    color: group.color,
                    lineHeight: 1,
                    marginBottom: '0.5rem',
                  }}>
                    {group.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    {group.tagline}
                  </div>
                </div>

                {/* Feature rows */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {features.map((f, i) => (
                    <div key={f.title} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.65rem',
                      padding: '0.8rem 0',
                      borderBottom: i < features.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                    }}>
                      <div style={{ color: f.iconColor, flexShrink: 0, marginTop: 2, opacity: 0.9 }}>
                        {f.icon}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.12rem' }}>
                          {f.title}
                        </div>
                        <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {f.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

      </div>

      <style>{`
        .fs-pillars {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 768px) {
          .fs-pillars { grid-template-columns: 1fr !important; }
          .fs-pillar { padding-right: 0 !important; margin-bottom: 2.5rem; }
          .fs-pillar:last-child { margin-bottom: 0; }
        }
      `}</style>
    </section>
  )
}
