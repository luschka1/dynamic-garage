import {
  Wrench, ClipboardList, FileText, Camera, Share2, Layers,
  Tag, MessageSquare, ScanLine, Link2, Moon, Car,
} from 'lucide-react'

const FEATURES = [
  {
    icon: <Wrench size={20} />,
    title: 'Mod Log',
    desc: 'Track every upgrade — part, cost, vendor, install date, and notes.',
    iconBg: 'var(--red-dim)', iconColor: 'var(--red)',
  },
  {
    icon: <ClipboardList size={20} />,
    title: 'Service History',
    desc: 'Full maintenance records with mileage, shop, and cost per visit.',
    iconBg: 'var(--blue-dim)', iconColor: 'var(--blue)',
  },
  {
    icon: <FileText size={20} />,
    title: 'Document Vault',
    desc: 'Store receipts, titles, window stickers, and manuals — always accessible.',
    iconBg: 'var(--green-dim)', iconColor: 'var(--green)',
  },
  {
    icon: <Camera size={20} />,
    title: 'Photo Gallery',
    desc: 'Upload and organize multiple photos per vehicle.',
    iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6',
  },
  {
    icon: <ScanLine size={20} />,
    title: 'VIN Decoder',
    desc: 'Auto-fill year, make, model, and trim from the VIN — no manual typing.',
    iconBg: 'var(--blue-dim)', iconColor: 'var(--blue)',
  },
  {
    icon: <Share2 size={20} />,
    title: 'Public Build Pages',
    desc: 'A shareable live page for every vehicle — perfect for shows, forums, and buyers.',
    iconBg: 'var(--gold-dim)', iconColor: 'var(--gold)',
  },
  {
    icon: <Layers size={20} />,
    title: 'Public Garage',
    desc: 'Share your entire collection at a single URL.',
    iconBg: 'rgba(20,184,166,0.12)', iconColor: '#14b8a6',
  },
  {
    icon: <Tag size={20} />,
    title: 'For Sale Listings',
    desc: 'Mark vehicles for sale with a badge visible on your public page.',
    iconBg: 'var(--green-dim)', iconColor: 'var(--green)',
  },
  {
    icon: <MessageSquare size={20} />,
    title: 'Contact Seller',
    desc: 'Buyers message you directly — your email stays private.',
    iconBg: 'rgba(249,115,22,0.12)', iconColor: '#f97316',
  },
  {
    icon: <Link2 size={20} />,
    title: 'Social Sharing',
    desc: 'One-click share to X, Facebook, and WhatsApp with rich preview cards.',
    iconBg: 'rgba(99,102,241,0.12)', iconColor: '#6366f1',
  },
  {
    icon: <Moon size={20} />,
    title: 'Dark & Light Mode',
    desc: 'System-aware theming that respects your preference — switchable any time.',
    iconBg: 'rgba(139,92,246,0.12)', iconColor: '#8b5cf6',
  },
  {
    icon: <Car size={20} />,
    title: 'Any Make & Model',
    desc: 'Corvette, Mustang, Porsche, BMW — works with every vehicle, every year.',
    iconBg: 'var(--red-dim)', iconColor: 'var(--red)',
  },
]

const half = Math.ceil(FEATURES.length / 2)
const left = FEATURES.slice(0, half)
const right = FEATURES.slice(half)

function Item({ title, desc, icon, iconBg, iconColor, last }: typeof FEATURES[0] & { last: boolean }) {
  return (
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
        background: iconBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: iconColor,
        flexShrink: 0,
        marginTop: 2,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '0.01em', marginBottom: '0.2rem' }}>
          {title}
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          {desc}
        </div>
      </div>
    </div>
  )
}

export default function FeatureShowcase() {
  return (
    <section style={{ background: 'var(--bg-elevated)', padding: '5rem 2rem', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <p className="page-eyebrow" style={{ marginBottom: '0.6rem' }}>EVERYTHING INCLUDED</p>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 900, letterSpacing: '0.01em', color: 'var(--text-primary)', marginBottom: '0.75rem' }}>
            Built for serious enthusiasts
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
            Every tool you need to document, protect, and share your build — all in one place.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 4rem' }}>
          <div>
            {left.map((f, i) => (
              <Item key={f.title} {...f} last={i === left.length - 1} />
            ))}
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '4rem' }}>
            {right.map((f, i) => (
              <Item key={f.title} {...f} last={i === right.length - 1} />
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
