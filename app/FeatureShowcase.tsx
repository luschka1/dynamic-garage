'use client'

import { useState } from 'react'
import {
  Wrench, ClipboardList, FileText, Camera, Share2, Layers,
  Tag, MessageSquare, ScanLine, Link2, Moon, Car,
} from 'lucide-react'

type Layout = 'A' | 'B' | 'C' | 'D'

interface Feature {
  icon: React.ReactNode
  title: string
  desc: string
  iconBg: string
  iconColor: string
  category: 'track' | 'share' | 'built'
  wide?: boolean
}

const FEATURES: Feature[] = [
  {
    icon: <Wrench size={20} />,
    title: 'Mod Log',
    desc: 'Track every upgrade — part, cost, vendor, install date, and notes.',
    iconBg: 'var(--red-dim)', iconColor: 'var(--red)',
    category: 'track', wide: true,
  },
  {
    icon: <ClipboardList size={20} />,
    title: 'Service History',
    desc: 'Full maintenance records with mileage, shop, and cost per visit.',
    iconBg: 'var(--blue-dim)', iconColor: 'var(--blue)',
    category: 'track',
  },
  {
    icon: <FileText size={20} />,
    title: 'Document Vault',
    desc: 'Store receipts, titles, window stickers, and manuals — always accessible.',
    iconBg: 'var(--green-dim)', iconColor: 'var(--green)',
    category: 'track',
  },
  {
    icon: <Camera size={20} />,
    title: 'Photo Gallery',
    desc: 'Upload and organize multiple photos per vehicle.',
    iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6',
    category: 'track',
  },
  {
    icon: <ScanLine size={20} />,
    title: 'VIN Decoder',
    desc: 'Auto-fill year, make, model, and trim from the VIN — no manual typing.',
    iconBg: 'var(--blue-dim)', iconColor: 'var(--blue)',
    category: 'built',
  },
  {
    icon: <Share2 size={20} />,
    title: 'Public Build Pages',
    desc: 'A shareable live page for every vehicle — perfect for shows, forums, and buyers.',
    iconBg: 'var(--gold-dim)', iconColor: 'var(--gold)',
    category: 'share', wide: true,
  },
  {
    icon: <Layers size={20} />,
    title: 'Public Garage',
    desc: 'Share your entire collection at a single URL.',
    iconBg: 'rgba(20,184,166,0.12)', iconColor: '#14b8a6',
    category: 'share',
  },
  {
    icon: <Tag size={20} />,
    title: 'For Sale Listings',
    desc: 'Mark vehicles for sale with a badge visible on your public page.',
    iconBg: 'var(--green-dim)', iconColor: 'var(--green)',
    category: 'share',
  },
  {
    icon: <MessageSquare size={20} />,
    title: 'Contact Seller',
    desc: 'Buyers message you directly — your email stays private.',
    iconBg: 'rgba(249,115,22,0.12)', iconColor: '#f97316',
    category: 'share',
  },
  {
    icon: <Link2 size={20} />,
    title: 'Social Sharing',
    desc: 'One-click share to X, Facebook, and WhatsApp with rich preview cards.',
    iconBg: 'rgba(99,102,241,0.12)', iconColor: '#6366f1',
    category: 'share',
  },
  {
    icon: <Moon size={20} />,
    title: 'Dark & Light Mode',
    desc: 'System-aware theming that respects your preference — switchable any time.',
    iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6',
    category: 'built',
  },
  {
    icon: <Car size={20} />,
    title: 'Any Make & Model',
    desc: 'Corvette, Mustang, Porsche, BMW — works with every vehicle, every year.',
    iconBg: 'var(--red-dim)', iconColor: 'var(--red)',
    category: 'built', wide: true,
  },
]

// ─── Layout A: Bento Grid ────────────────────────────────────────────────────
function BentoGrid() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
      {FEATURES.map(f => (
        <div
          key={f.title}
          className="showcase-card"
          style={{
            gridColumn: f.wide ? 'span 2' : 'span 1',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 16,
            padding: f.wide ? '2rem' : '1.5rem',
            display: 'flex',
            flexDirection: f.wide ? 'row' : 'column',
            alignItems: f.wide ? 'center' : undefined,
            gap: f.wide ? '1.25rem' : '0.85rem',
            transition: 'box-shadow 180ms, border-color 180ms, transform 180ms',
          }}
        >
          <div style={{
            width: f.wide ? 52 : 42,
            height: f.wide ? 52 : 42,
            borderRadius: 12,
            background: f.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: f.iconColor,
            flexShrink: 0,
          }}>
            {f.wide
              ? <span style={{ transform: 'scale(1.2)', display: 'flex' }}>{f.icon}</span>
              : f.icon}
          </div>
          <div>
            <h3 style={{
              fontFamily: "'Barlow Condensed'",
              fontSize: f.wide ? '1.25rem' : '1.05rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              marginBottom: '0.3rem',
            }}>
              {f.title}
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
              {f.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Layout B: Two-Column Checklist ─────────────────────────────────────────
function ChecklistRows() {
  const half = Math.ceil(FEATURES.length / 2)
  const left = FEATURES.slice(0, half)
  const right = FEATURES.slice(half)

  const Item = ({ f, last }: { f: Feature; last: boolean }) => (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
      padding: '1.1rem 0',
      borderBottom: last ? 'none' : '1px solid var(--border-subtle)',
    }}>
      <div style={{
        width: 36,
        height: 36,
        borderRadius: 8,
        background: f.iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: f.iconColor,
        flexShrink: 0,
        marginTop: 2,
      }}>
        {f.icon}
      </div>
      <div>
        <div style={{
          fontSize: '0.9rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '0.01em',
          marginBottom: '0.2rem',
        }}>
          {f.title}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          {f.desc}
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 4rem' }}>
      <div>
        {left.map((f, i) => <Item key={f.title} f={f} last={i === left.length - 1} />)}
      </div>
      <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '4rem' }}>
        {right.map((f, i) => <Item key={f.title} f={f} last={i === right.length - 1} />)}
      </div>
    </div>
  )
}

// ─── Layout C: Grouped by Category ──────────────────────────────────────────
function GroupedCategories() {
  const groups = [
    {
      label: 'Track It',
      color: 'var(--red)',
      dimColor: 'var(--red-dim)',
      features: FEATURES.filter(f => f.category === 'track'),
    },
    {
      label: 'Share It',
      color: 'var(--gold)',
      dimColor: 'var(--gold-dim)',
      features: FEATURES.filter(f => f.category === 'share'),
    },
    {
      label: 'Built Right',
      color: '#14b8a6',
      dimColor: 'rgba(20,184,166,0.1)',
      features: FEATURES.filter(f => f.category === 'built'),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {groups.map(group => (
        <div key={group.label}>
          {/* Group header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.25rem',
          }}>
            <div style={{ width: 4, height: 28, background: group.color, borderRadius: 2, flexShrink: 0 }} />
            <span style={{
              fontFamily: "'Barlow Condensed'",
              fontSize: '1.4rem',
              fontWeight: 900,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}>
              {group.label}
            </span>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: group.color,
              background: group.dimColor,
              padding: '0.2rem 0.6rem',
              borderRadius: 4,
            }}>
              {group.features.length} features
            </span>
          </div>

          {/* Feature cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '0.85rem',
          }}>
            {group.features.map(f => (
              <div
                key={f.title}
                className="showcase-card"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  padding: '1.25rem',
                  display: 'flex',
                  gap: '0.85rem',
                  alignItems: 'flex-start',
                  transition: 'box-shadow 180ms, border-color 180ms, transform 180ms',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: f.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: f.iconColor,
                  flexShrink: 0,
                }}>
                  {f.icon}
                </div>
                <div>
                  <div style={{
                    fontFamily: "'Barlow Condensed'",
                    fontSize: '1rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
                    marginBottom: '0.25rem',
                  }}>
                    {f.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                    {f.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Layout D: Alternating Rows ──────────────────────────────────────────────
function AlternatingRows() {
  return (
    <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
      {FEATURES.map((f, i) => (
        <div
          key={f.title}
          className="alt-row"
          style={{
            display: 'grid',
            gridTemplateColumns: '56px 1fr 2fr',
            alignItems: 'center',
            gap: '1.25rem',
            padding: '1.25rem 1.75rem',
            background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-elevated)',
            borderBottom: i < FEATURES.length - 1 ? '1px solid var(--border-subtle)' : 'none',
            transition: 'background 150ms',
          }}
        >
          {/* Icon */}
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 10,
            background: f.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: f.iconColor,
            flexShrink: 0,
          }}>
            {f.icon}
          </div>

          {/* Title */}
          <div style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: '1.1rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
          }}>
            {f.title}
          </div>

          {/* Description */}
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
            {f.desc}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default function FeatureShowcase() {
  const [layout, setLayout] = useState<Layout>('A')

  const tabs: { id: Layout; label: string; sub: string }[] = [
    { id: 'A', label: 'Bento Grid',   sub: 'Mixed sizes' },
    { id: 'B', label: 'Checklist',    sub: 'Two columns' },
    { id: 'C', label: 'Grouped',      sub: 'By category' },
    { id: 'D', label: 'Row List',     sub: 'Alternating' },
  ]

  return (
    <section style={{ background: 'var(--bg-elevated)', padding: '5rem 2rem', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <p className="page-eyebrow" style={{ marginBottom: '0.6rem' }}>EVERYTHING INCLUDED</p>
          <h2 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            fontWeight: 900,
            letterSpacing: '0.01em',
            color: 'var(--text-primary)',
            marginBottom: '0.75rem',
          }}>
            Built for serious enthusiasts
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
            Every tool you need to document, protect, and share your build — all in one place.
          </p>
        </div>

        {/* Layout toggle */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '2.5rem',
          flexWrap: 'wrap',
        }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setLayout(t.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.1rem',
                padding: '0.55rem 1.1rem',
                borderRadius: 8,
                border: layout === t.id
                  ? '1px solid var(--red)'
                  : '1px solid var(--border-default)',
                background: layout === t.id ? 'var(--red-dim)' : 'var(--bg-card)',
                color: layout === t.id ? 'var(--red)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 150ms',
              }}
            >
              <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.04em' }}>
                {t.id} · {t.label}
              </span>
              <span style={{ fontSize: '0.68rem', letterSpacing: '0.03em', opacity: 0.75 }}>
                {t.sub}
              </span>
            </button>
          ))}
        </div>

        {/* Active layout */}
        <div>
          {layout === 'A' && <BentoGrid />}
          {layout === 'B' && <ChecklistRows />}
          {layout === 'C' && <GroupedCategories />}
          {layout === 'D' && <AlternatingRows />}
        </div>
      </div>

      <style>{`
        .showcase-card:hover {
          box-shadow: var(--shadow-hover) !important;
          border-color: var(--border-default) !important;
          transform: translateY(-2px) !important;
        }
        .alt-row:hover {
          background: var(--bg-card) !important;
        }
      `}</style>
    </section>
  )
}
