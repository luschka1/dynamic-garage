'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const FAQS = [
  {
    q: "Is it really free? What's the catch?",
    a: "No catch. During early access, every feature is completely free. When pricing eventually comes, early access users will get a significant discount and plenty of notice. You won't be surprised.",
  },
  {
    q: 'iOS, Android, or web?',
    a: "It's a web app — works in any browser on your phone, tablet, or desktop. No download required. Open it on your phone at a car show, pull it up on your laptop at home. It works everywhere.",
  },
  {
    q: 'What happens when early access ends?',
    a: "We'll communicate clearly before anything changes. Early access users will always be taken care of. The goal is to build something people actually pay for because it's worth it — not to bait-and-switch.",
  },
]

export default function EarlyAccessFAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {FAQS.map((faq, i) => (
        <div key={i} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 10,
          overflow: 'hidden',
        }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: '1rem', padding: '1rem 1.25rem',
              background: 'none', border: 'none', cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {faq.q}
            </span>
            <ChevronDown
              size={16}
              color="var(--text-muted)"
              style={{ flexShrink: 0, transition: 'transform 0.2s', transform: open === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
          {open === i && (
            <div style={{
              padding: '0 1.25rem 1rem',
              fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7,
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: '0.85rem',
            }}>
              {faq.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
