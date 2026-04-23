'use client'

import { useState } from 'react'
import {
  Wrench, ClipboardList, FileText, Camera, Share2, Layers,
  Tag, MessageSquare, ScanLine, Link2, Moon, Car, QrCode, Bell, ShieldCheck,
} from 'lucide-react'

/* ─── Feature data ─────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: <Wrench size={18} />,
    title: 'Mod Log',
    desc: 'Track every dollar — prove your build is worth it.',
    iconBg: 'var(--red-dim)', iconColor: 'var(--red)',
    group: 'build' as const,
  },
  {
    icon: <ClipboardList size={18} />,
    title: 'Service History',
    desc: 'Show buyers and judges your car was done right.',
    iconBg: 'var(--blue-dim)', iconColor: 'var(--blue)',
    group: 'build' as const,
  },
  {
    icon: <FileText size={18} />,
    title: 'Document Vault',
    desc: 'Receipts, titles, window stickers — all in one place, forever.',
    iconBg: 'var(--green-dim)', iconColor: 'var(--green)',
    group: 'build' as const,
  },
  {
    icon: <Camera size={18} />,
    title: 'Photo Gallery',
    desc: 'Every stage of the build, organized and shareable.',
    iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6',
    group: 'build' as const,
  },
  {
    icon: <ScanLine size={18} />,
    title: 'VIN Decoder',
    desc: 'Drop in your VIN — year, make, model, trim fills itself.',
    iconBg: 'var(--blue-dim)', iconColor: 'var(--blue)',
    group: 'build' as const,
  },
  {
    icon: <Share2 size={18} />,
    title: 'Public Build Pages',
    desc: 'One link that proves everything about your car.',
    iconBg: 'var(--gold-dim)', iconColor: 'var(--gold)',
    group: 'showcase' as const,
  },
  {
    icon: <Layers size={18} />,
    title: 'Public Garage',
    desc: 'Your whole collection at a single URL.',
    iconBg: 'rgba(20,184,166,0.12)', iconColor: '#14b8a6',
    group: 'showcase' as const,
  },
  {
    icon: <QrCode size={18} />,
    title: 'QR Show Cards',
    desc: 'Set it on your dash — anyone who scans it sees your full build.',
    iconBg: 'var(--gold-dim)', iconColor: 'var(--gold)',
    group: 'showcase' as const,
  },
  {
    icon: <Link2 size={18} />,
    title: 'Social Sharing',
    desc: 'Share to X, Facebook, or WhatsApp with a rich preview card.',
    iconBg: 'rgba(99,102,241,0.12)', iconColor: '#6366f1',
    group: 'showcase' as const,
  },
  {
    icon: <Moon size={18} />,
    title: 'Dark & Light Mode',
    desc: 'Dark or light — your garage, your vibe.',
    iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6',
    group: 'showcase' as const,
  },
  {
    icon: <Tag size={18} />,
    title: 'For Sale Listings',
    desc: 'List it for sale with a badge buyers can\'t miss.',
    iconBg: 'var(--green-dim)', iconColor: 'var(--green)',
    group: 'protect' as const,
  },
  {
    icon: <MessageSquare size={18} />,
    title: 'Contact Seller',
    desc: 'Buyers reach you directly — your email stays private.',
    iconBg: 'rgba(249,115,22,0.12)', iconColor: '#f97316',
    group: 'protect' as const,
  },
  {
    icon: <Bell size={18} />,
    title: 'NHTSA Recall Alerts',
    desc: 'We watch your VIN. If a recall drops, you hear about it first.',
    iconBg: 'rgba(220,38,38,0.1)', iconColor: '#dc2626',
    group: 'protect' as const,
  },
  {
    icon: <ShieldCheck size={18} />,
    title: 'Insurance Documentation',
    desc: 'Print-ready mod package your insurer will actually accept.',
    iconBg: 'rgba(22,163,74,0.1)', iconColor: '#16a34a',
    group: 'protect' as const,
  },
  {
    icon: <Car size={18} />,
    title: 'Any Make & Model',
    desc: 'Corvette, Mustang, Porsche, BMW — every car, every year.',
    iconBg: 'var(--red-dim)', iconColor: 'var(--red)',
    group: 'protect' as const,
  },
]

const GROUPS = [
  {
    key: 'build' as const,
    num: '01',
    label: 'Build & Document',
    tagline: 'Track every dollar. Prove your build is worth it.',
    color: '#3b82f6',
    colorDim: 'rgba(59,130,246,0.08)',
    colorBorder: 'rgba(59,130,246,0.2)',
  },
  {
    key: 'showcase' as const,
    num: '02',
    label: 'Showcase & Share',
    tagline: 'One link. Your entire build. Anywhere.',
    color: '#f59e0b',
    colorDim: 'rgba(245,158,11,0.08)',
    colorBorder: 'rgba(245,158,11,0.2)',
  },
  {
    key: 'protect' as const,
    num: '03',
    label: 'Sell & Protect',
    tagline: 'Selling or insuring — you\'re covered either way.',
    color: '#16a34a',
    colorDim: 'rgba(22,163,74,0.08)',
    colorBorder: 'rgba(22,163,74,0.2)',
  },
]

/* ─── Grouped A: Bordered cards, colored header strip ──────────── */
function DesignGroupedA() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }} className="fs-3col">
      {GROUPS.map(group => {
        const features = FEATURES.filter(f => f.group === group.key)
        return (
          <div key={group.key} style={{
            border: `1px solid ${group.colorBorder}`,
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--bg-base)',
          }}>
            <div style={{
              background: group.colorDim,
              borderBottom: `1px solid ${group.colorBorder}`,
              padding: '1.25rem 1.5rem',
            }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: group.color, marginBottom: '0.3rem' }}>
                {group.label}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                {group.tagline}
              </div>
            </div>
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
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{f.title}</div>
                    <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
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

/* ─── Grouped B: Numbered headers, 2-col feature grid ──────────── */
function DesignGroupedB() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }} className="fs-3col">
      {GROUPS.map(group => {
        const features = FEATURES.filter(f => f.group === group.key)
        return (
          <div key={group.key}>
            {/* Big numbered header */}
            <div style={{
              background: group.colorDim,
              border: `1px solid ${group.colorBorder}`,
              borderRadius: 14,
              padding: '1.5rem',
              marginBottom: '1rem',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Watermark number */}
              <div style={{
                position: 'absolute', right: 12, top: -8,
                fontSize: '5rem', fontWeight: 900, lineHeight: 1,
                color: group.color, opacity: 0.08,
                fontFamily: "'Barlow Condensed', sans-serif",
                userSelect: 'none',
              }}>{group.num}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: group.color, marginBottom: '0.4rem' }}>
                {group.num} — {group.label}
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                {group.tagline}
              </div>
            </div>
            {/* 2-col feature mini grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
              {features.map(f => (
                <div key={f.title} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.5rem',
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 10,
                  padding: '0.75rem',
                }}>
                  <div style={{
                    width: 26, height: 26, borderRadius: 6,
                    background: f.iconBg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: f.iconColor, flexShrink: 0,
                  }}>{f.icon}</div>
                  <div style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, paddingTop: '0.15rem' }}>
                    {f.title}
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

/* ─── Pillars A: Pill labels, gradient accent line ──────────────── */
function DesignPillarsA() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2.5rem' }} className="fs-3col">
      {GROUPS.map(group => {
        const features = FEATURES.filter(f => f.group === group.key)
        return (
          <div key={group.key}>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center',
                background: group.colorDim,
                border: `1px solid ${group.colorBorder}`,
                borderRadius: 100,
                padding: '0.35rem 0.9rem',
                marginBottom: '0.75rem',
              }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: group.color }}>
                  {group.label}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {group.tagline}
              </div>
            </div>
            <div style={{ height: 2, background: `linear-gradient(90deg, ${group.color}, transparent)`, borderRadius: 2, marginBottom: '1.5rem', opacity: 0.45 }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {features.map(f => (
                <div key={f.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: f.iconBg, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: f.iconColor, flexShrink: 0, marginTop: 1,
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{f.title}</div>
                    <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
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

/* ─── Pillars B: Bold left-border columns, flat icon style ─────── */
function DesignPillarsB() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0' }} className="fs-3col-flush">
      {GROUPS.map((group, gi) => {
        const features = FEATURES.filter(f => f.group === group.key)
        return (
          <div key={group.key} style={{
            borderLeft: `3px solid ${group.color}`,
            paddingLeft: '1.75rem',
            paddingRight: gi < 2 ? '2rem' : 0,
          }}>
            {/* Bold category header */}
            <div style={{ marginBottom: '1.75rem' }}>
              <div style={{
                fontSize: '1.25rem', fontWeight: 900,
                fontFamily: "'Barlow Condensed', sans-serif",
                letterSpacing: '0.04em', textTransform: 'uppercase',
                color: group.color, lineHeight: 1, marginBottom: '0.5rem',
              }}>
                {group.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {group.tagline}
              </div>
            </div>
            {/* Features — flat icon style */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {features.map((f, i) => (
                <div key={f.title} style={{
                  display: 'flex', alignItems: 'flex-start', gap: '0.65rem',
                  padding: '0.8rem 0',
                  borderBottom: i < features.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <div style={{
                    color: f.iconColor,
                    flexShrink: 0, marginTop: 2, opacity: 0.9,
                  }}>{f.icon}</div>
                  <div>
                    <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.12rem' }}>{f.title}</div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{f.desc}</div>
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
  { key: 'grouped-a', label: 'Grouped A' },
  { key: 'grouped-b', label: 'Grouped B' },
  { key: 'pillars-a', label: 'Pillars A' },
  { key: 'pillars-b', label: 'Pillars B' },
] as const

export default function FeatureShowcase() {
  const [active, setActive] = useState<typeof DESIGNS[number]['key']>('grouped-a')

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
            display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
            background: 'var(--bg-base)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 100,
            padding: '0.3rem',
          }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0 0.6rem', userSelect: 'none' }}>
              Layout
            </span>
            {DESIGNS.map(d => (
              <button
                key={d.key}
                onClick={() => setActive(d.key)}
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  padding: '0.3rem 0.9rem',
                  borderRadius: 100,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  background: active === d.key ? 'var(--red)' : 'transparent',
                  color: active === d.key ? '#fff' : 'var(--text-secondary)',
                  letterSpacing: '0.01em',
                  whiteSpace: 'nowrap',
                }}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active design */}
        {active === 'grouped-a' && <DesignGroupedA />}
        {active === 'grouped-b' && <DesignGroupedB />}
        {active === 'pillars-a' && <DesignPillarsA />}
        {active === 'pillars-b' && <DesignPillarsB />}

      </div>

      <style>{`
        @media (max-width: 768px) {
          .fs-3col { grid-template-columns: 1fr !important; }
          .fs-3col-flush { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 768px) {
          .fs-3col-flush > div {
            padding-right: 0 !important;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </section>
  )
}
