'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface Item {
  q: string
  a: string
}

export default function HelpAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div
            key={i}
            style={{
              background: 'var(--bg-card)',
              border: `1px solid ${isOpen ? 'var(--border-default)' : 'var(--border-subtle)'}`,
              borderRadius: 10,
              overflow: 'hidden',
              transition: 'border-color 150ms',
            }}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem',
                padding: '1rem 1.25rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <span style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                color: isOpen ? 'var(--red)' : 'var(--text-primary)',
                lineHeight: 1.4,
                transition: 'color 150ms',
              }}>
                {item.q}
              </span>
              <ChevronDown
                size={18}
                color="var(--text-muted)"
                style={{
                  flexShrink: 0,
                  transform: isOpen ? 'rotate(180deg)' : 'none',
                  transition: 'transform 200ms',
                }}
              />
            </button>

            {isOpen && (
              <div style={{
                padding: '0 1.25rem 1.1rem',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '0.9rem',
              }}>
                {item.a}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
