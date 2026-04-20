'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const VARIANTS = [
  { href: '/',   label: 'V1', name: 'Editorial' },
  { href: '/v2', label: 'V2', name: 'Maximal'   },
  { href: '/v3', label: 'V3', name: 'Clarity'   },
  { href: '/v4', label: 'V4', name: 'Prestige'  },
]

export default function VariantSwitcher() {
  const pathname = usePathname()

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 500,
      display: 'flex', alignItems: 'center', gap: '0.35rem',
      background: 'rgba(0,0,0,0.88)',
      padding: '0.45rem 0.65rem',
      borderRadius: 100,
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.12)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.45)',
    }}>
      <span style={{
        color: 'rgba(255,255,255,0.3)',
        fontSize: '0.58rem', fontWeight: 800,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        marginRight: '0.2rem', userSelect: 'none',
      }}>
        Design
      </span>
      {VARIANTS.map(v => {
        const active = pathname === v.href
        return (
          <Link
            key={v.href}
            href={v.href}
            title={v.name}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: 30, height: 30, borderRadius: '50%',
              background: active ? '#cc1f1f' : 'rgba(255,255,255,0.07)',
              color: active ? 'white' : 'rgba(255,255,255,0.55)',
              fontSize: '0.65rem', fontWeight: 800,
              textDecoration: 'none',
              transition: 'all 150ms',
              border: active ? '2px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.1)',
              letterSpacing: '-0.01em',
            }}
          >
            {v.label}
          </Link>
        )
      })}
    </div>
  )
}
