'use client'

import { useState } from 'react'
import {
  Wrench, ClipboardList, FileText, Camera, Share2, Layers,
  Tag, MessageSquare, ScanLine, Link2, Moon, Car, QrCode, Bell, ShieldCheck,
} from 'lucide-react'

/* ─── Feature data ─────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Wrench size={20} />,
    title: 'Mod Log',
    desc: 'Track every dollar — prove your build is worth it.',
    fullDesc: 'Know exactly what you\'ve spent and what\'s been done — every part, every dollar, every install date.',
    iconBg: 'var(--red-dim)', iconColor: 'var(--red)',
    group: 'build' as const,
  },
  {
    icon: <ClipboardList size={20} />,
    title: 'Service History',
    desc: 'Show buyers and judges your car was done right.',
    fullDesc: 'Full maintenance records with mileage, shop, and cost per visit.',
    iconBg: 'var(--blue-dim)', iconColor: 'var(--blue)',
    group: 'build' as const,
  },
  {
    icon: <FileText size={20} />,
    title: 'Document Vault',
    desc: 'Receipts, titles, window stickers — all in one place, forever.',
    fullDesc: 'Store receipts, titles, window stickers, and manuals — always accessible.',
    iconBg: 'var(--green-dim)', iconColor: 'var(--green)',
    group: 'build' as const,
  },
  {
    icon: <Camera size={20} />,
    title: 'Photo Gallery',
    desc: 'Every stage of the build, organized and shareable.',
    fullDesc: 'Upload and organize multiple photos per vehicle.',
    iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6',
    group: 'build' as const,
  },
  {
    icon: <ScanLine size={20} />,
    title: 'VIN Decoder',
    desc: 'Drop in your VIN — year, make, model, trim fills itself.',
    fullDesc: 'Auto-fill year, make, model, and trim from the VIN — no manual typing.',
    iconBg: 'var(--blue-dim)', iconColor: 'var(--blue)',
    group: 'build' as const,
  },
  {
    icon: <Share2 size={20} />,
    title: 'Public Build Pages',
    desc: 'One link that proves everything about your car.',
    fullDesc: 'Your build\'s own URL — scan it at a show, post it on a forum, send it to a buyer. Live, always up to date.',
    iconBg: 'var(--gold-dim)', iconColor: 'var(--gold)',
    group: 'showcase' as const,
  },
  {
    icon: <Layers size={20} />,
    title: 'Public Garage',
    desc: 'Your whole collection at a single URL.',
    fullDesc: 'Share your entire collection at a single URL.',
    iconBg: 'rgba(20,184,166,0.12)', iconColor: '#14b8a6',
    group: 'showcase' as const,
  },
  {
    icon: <QrCode size={20} />,
    title: 'QR Show Cards',
    desc: 'Set it on your dash — anyone who scans it sees your full build.',
    fullDesc: 'Print a show card or save a PNG. Set it on your dash — anyone who scans it sees your full build instantly.',
    iconBg: 'var(--gold-dim)', iconColor: 'var(--gold)',
    group: 'showcase' as const,
  },
  {
    icon: <Link2 size={20} />,
    title: 'Social Sharing',
    desc: 'Share to X, Facebook, or WhatsApp with a rich preview card.',
    fullDesc: 'One-click share to X, Facebook, and WhatsApp with rich preview cards.',
    iconBg: 'rgba(99,102,241,0.12)', iconColor: '#6366f1',
    group: 'showcase' as const,
  },
  {
    icon: <Moon size={20} />,
    title: 'Dark & Light Mode',
    desc: 'Dark or light — your garage, your vibe.',
    fullDesc: 'System-aware theming that respects your preference — switchable any time.',
    iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6',
    group: 'showcase' as const,
  },
  {
    icon: <Tag size={20} />,
    title: 'For Sale Listings',
    desc: 'List it for sale with a badge buyers can\'t miss.',
    fullDesc: 'Mark vehicles for sale with a badge visible on your public page.',
    iconBg: 'var(--green-dim)', iconColor: 'var(--green)',
    group: 'protect' as const,
  },
  {
    icon: <MessageSquare size={20} />,
    title: 'Contact Seller',
    desc: 'Buyers reach you directly — your email stays private.',
    fullDesc: 'Buyers message you directly — your email stays private.',
    iconBg: 'rgba(249,115,22,0.12)', iconColor: '#f97316',
    group: 'protect' as const,
  },
  {
    icon: <Bell size={20} />,
    title: 'NHTSA Recall Alerts',
    desc: 'We watch your VIN. If a recall drops, you hear about it first.',
    fullDesc: 'We check your VIN against federal recall data every week and email you if something new comes up. You just drive.',
    iconBg: 'rgba(220,38,38,0.1)', iconColor: '#dc2626',
    group: 'protect' as const,
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Insurance Documentation',
    desc: 'Print-ready mod package your insurer will actually accept.',
    fullDesc: 'Know exactly which mods are covered. Declare replacement values, attach receipts, and generate a print-ready package your insurer will actually accept.',
    iconBg: 'rgba(22,163,74,0.1)', iconColor: '#16a34a',
    group: 'protect' as const,
  },
  {
    icon: <Car size={20} />,
    title: 'Any Make & Model',
    desc: 'Corvette, Mustang, Porsche, BMW — every car, every year.',
    fullDesc: 'Corvette, Mustang, Porsche, BMW — works with every vehicle, every year.',
    iconBg: 'var(--red-dim)', iconColor: 'var(--red)',
    group: 'protect' as const,
  },
]

const GROUPS = [
  {
    key: 'build' as const,
    label: 'Build & Document',
    tagline: 'Track every dollar. Prove your build is worth it.',
    color: '#3b82f6',
    colorDim: 'rgba(59,130,246,0.08)',
    colorBorder: 'rgba(59,130,246,0.2)',
  },
  {
    key: 'showcase' as const,
    label: 'Showcase & Share',
    tagline: 'One link. Your entire build. Anywhere.',
    color: '#f59e0b',
    colorDim: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.2)',
  },
  {
    key: 'protect' as const,
    label: 'Sell & Protect',
    tagline: 'Selling or insuring — you\'re covered either way.',
    color: '#16a34a',
    colorDim: 'rgba(22,163,74,0.08)',
    colorBorder: 'rgba(22,163,74,0.2)',
  },
]

/* ─── Design 1: Original list ──────────────────────────────────── */
function DesignOriginal() {
  const half = Math.ceil(FEATURES.length / 2)
  const left = FEATURES.slice(0, half)
  const right = FEATURES.slice(half)

  function Item({ title, fullDesc, icon, iconBg, iconColor, last }: typeof FEATURES[0] & { last: boolean }) {
    return (
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: '1rem',
        padding: '1.1rem 0',
        borderBottom: last ? 'none' : '1px solid var(--border-subtle)',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 8,
          background: iconBg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: iconColor, flexShrink: 0, marginTop: 2,
        }}>{icon}</div>
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.01em', marginBottom: '0.2rem' }}>{title}</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{fullDesc}</div>
        </div>
      </div>
    )
  }

  return (
    <div className="feature-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 4rem' }}>
      <div>{left.map((f, i) => <Item key={f.title} {...f} last={i === left.length - 1} />)}</div>
      <div className="feature-col-right" style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '4rem' }}>
        {right.map((f, i) => <Item key={f.title} {...f} last={i === right.length - 1} />)}
      </div>
    </div>
  )
}

/* ─── Design 2: Grouped categories ─────────────────────────────── */
function DesignGrouped() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="grouped-grid">
      {GROUPS.map(group => {
        const features = FEATURES.filter(f => f.group === group.key)
        return (
          <div key={group.key} style={{
            border: `1px solid ${group.colorBorder}`,
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--bg-base)',
          }}>
            {/* Group header */}
            <div style={{
              background: group.colorDim,
              borderBottom: `1px solid ${group.colorBorder}`,
              padding: '1.25rem 1.5rem',
            }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: group.color, marginBottom: '0.3rem' }}>
                {group.label}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                {group.tagline}
              </div>
            </div>
            {/* Feature rows */}
            <div style={{ padding: '0.5rem 0' }}>
              {features.map((f, i) => (
                <div key={f.title} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                  padding: '0.85rem 1.5rem',
                  borderBottom: i < features.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 7,
                    background: f.iconBg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: f.iconColor, flexShrink: 0, marginTop: 1,
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{f.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Design 3: Card grid ───────────────────────────────────────── */
function DesignCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }} className="cards-grid">
      {FEATURES.map(f => (
        <div key={f.title} className="feature-card" style={{
          border: '1px solid var(--border-subtle)',
          borderRadius: 14,
          padding: '1.25rem',
          background: 'var(--bg-base)',
          transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
          cursor: 'default',
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: f.iconBg, display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: f.iconColor, marginBottom: '0.85rem',
          }}>{f.icon}</div>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem', letterSpacing: '0.01em' }}>
            {f.title}
          </div>
          <div style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {f.desc}
          </div>
        </div>
      ))}
    </div>
  )
}

/* ─── Design 4: Three pillars ───────────────────────────────────── */
function DesignPillars() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="pillars-grid">
      {GROUPS.map(group => {
        const features = FEATURES.filter(f => f.group === group.key)
        return (
          <div key={group.key}>
            {/* Pillar header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: group.colorDim,
                border: `1px solid ${group.colorBorder}`,
                borderRadius: 100,
                padding: '0.35rem 0.9rem',
                marginBottom: '0.75rem',
              }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: group.color }}>
                  {group.label}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {group.tagline}
              </div>
            </div>
            {/* Divider */}
            <div style={{ height: 2, background: `linear-gradient(90deg, ${group.color}, transparent)`, borderRadius: 2, marginBottom: '1.25rem', opacity: 0.4 }} />
            {/* Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {features.map(f => (
                <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: f.iconBg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: f.iconColor, flexShrink: 0, marginTop: 1,
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{f.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Toggle + Section wrapper ──────────────────────────────────── */
const DESIGNS = [
  { key: 'original', label: 'Current' },
  { key: 'grouped',  label: 'Grouped' },
  { key: 'cards',    label: 'Cards' },
  { key: 'pillars',  label: 'Pillars' },
] as const

export default function FeatureShowcase() {
  const [active, setActive] = useState<typeof DESIGNS[number]['key']>('original')

  return (
    <section style={{ background: 'var(--bg-elevated)', padding: '5rem 2rem', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p className="page-eyebrow" style={{ marginBottom: '0.6rem' }}>EVERYTHING INCLUDED</p>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '0.01em', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Built for people who give a damn about their cars
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 1.75rem' }}>
            Whether you&apos;re building, showing, or selling — everything you need to prove what you&apos;ve got.
          </p>

          {/* Design toggle */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 100,
            padding: '0.3rem',
          }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 0.5rem', userSelect: 'none' }}>
              Layout
            </span>
            {DESIGNS.map(d => (
              <button
                key={d.key}
                onClick={() => setActive(d.key)}
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.85rem',
                  borderRadius: 100,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: active === d.key ? 'var(--red)' : 'transparent',
                  color: active === d.key ? '#fff' : 'var(--text-secondary)',
                  letterSpacing: '0.01em',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active design */}
        {active === 'original' && <DesignOriginal />}
        {active === 'grouped'  && <DesignGrouped />}
        {active === 'cards'    && <DesignCards />}
        {active === 'pillars'  && <DesignPillars />}

      </div>

      <style>{`
        @media (max-width: 640px) {
          .feature-cols { grid-template-columns: 1fr !important; gap: 0 !important; }
          .feature-col-right { border-left: none !important; padding-left: 0 !important; }
          .grouped-grid { grid-template-columns: 1fr !important; }
          .cards-grid { grid-template-columns: 1fr 1fr !important; }
          .pillars-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .cards-grid { grid-template-columns: 1fr !important; }
        }
        .feature-card:hover {
          transform: translateY(-2px);
          border-color: var(--border-medium) !important;
          box-shadow: 0 8px 24px rgba(0,0,0,0.15);
        }
      `}</style>
    </section>
  )
}
