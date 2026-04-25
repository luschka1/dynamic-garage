'use client'

import type { FeatureRequest } from '@/lib/types'

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  open:     { label: 'Submitted',  bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
  will_do:  { label: 'On Roadmap', bg: 'rgba(22,163,74,0.12)',   color: '#16a34a' },
  maybe:    { label: 'Considering', bg: 'rgba(234,179,8,0.12)',  color: '#ca8a04' },
  no:       { label: 'Not Planned', bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
  done:     { label: 'Shipped! 🚀', bg: 'rgba(139,92,246,0.12)', color: '#8b5cf6' },
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function FeedbackHistory({ items }: { items: FeatureRequest[] }) {
  return (
    <div>
      <h2 style={{
        fontFamily: "'Barlow Condensed'",
        fontSize: '1rem', fontWeight: 900,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--text-secondary)',
        marginBottom: '0.75rem',
        paddingBottom: '0.4rem',
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        Your Past Requests
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map(item => {
          const s = STATUS_STYLES[item.status] ?? STATUS_STYLES.open
          return (
            <div key={item.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 8,
              padding: '0.85rem 1rem',
              display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{item.title}</span>
                  {item.category && (
                    <span style={{
                      fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.05em',
                      background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                      borderRadius: 4, padding: '0.1rem 0.4rem', color: 'var(--text-muted)',
                    }}>{item.category}</span>
                  )}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.35rem' }}>
                  {item.description}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{fmtDate(item.created_at)}</span>
              </div>
              <div style={{
                flexShrink: 0,
                fontSize: '0.7rem', fontWeight: 700,
                background: s.bg, color: s.color,
                borderRadius: 5, padding: '0.2rem 0.55rem',
                whiteSpace: 'nowrap',
              }}>
                {s.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
