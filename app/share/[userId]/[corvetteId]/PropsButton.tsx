'use client'

import { useState } from 'react'
import { Flame } from 'lucide-react'

interface Props {
  corvetteId: string
  initialCount: number
  initialHasPropped: boolean
  isOwner: boolean
  isLoggedIn: boolean
}

export default function PropsButton({ corvetteId, initialCount, initialHasPropped, isOwner, isLoggedIn }: Props) {
  const [count, setCount] = useState(initialCount)
  const [hasPropped, setHasPropped] = useState(initialHasPropped)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'info' | 'error'>('info')

  function showMessage(msg: string, type: 'info' | 'error' = 'info') {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 4500)
  }

  async function handleClick() {
    if (isOwner) { showMessage("You can't give Props to your own build.", 'info'); return }

    if (!isLoggedIn) {
      window.location.href = `/register?next=${encodeURIComponent(window.location.pathname)}`
      return
    }

    setLoading(true)
    const method = hasPropped ? 'DELETE' : 'POST'
    const res = await fetch('/api/props', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ corvetteId }),
    })
    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      if (data.requiresAuth) {
        window.location.href = `/register?next=${encodeURIComponent(window.location.pathname)}`
        return
      }
      showMessage(data.error ?? 'Something went wrong.', 'error')
      return
    }

    setHasPropped(!hasPropped)
    setCount(data.props_count)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
      <button
        onClick={handleClick}
        disabled={loading}
        title={isOwner ? "This is your build" : hasPropped ? "Remove Props" : "Give Props"}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.3rem',
          background: hasPropped ? 'rgba(249,115,22,0.12)' : 'var(--bg-card)',
          border: `2px solid ${hasPropped ? 'rgba(249,115,22,0.5)' : 'var(--border-default)'}`,
          borderRadius: 12,
          padding: '0.75rem 1.1rem',
          cursor: isOwner ? 'default' : 'pointer',
          transition: 'all 150ms',
          opacity: loading ? 0.7 : isOwner ? 0.5 : 1,
          minWidth: 72,
        }}
        className={isOwner ? 'props-btn-owner' : 'props-btn'}
      >
        <Flame
          size={22}
          color={hasPropped ? '#f97316' : 'var(--text-muted)'}
          fill={hasPropped ? '#f97316' : 'none'}
          strokeWidth={hasPropped ? 1.5 : 2}
        />
        <span style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontSize: '1.3rem',
          fontWeight: 900,
          lineHeight: 1,
          color: hasPropped ? '#f97316' : 'var(--text-primary)',
        }}>
          {count}
        </span>
        <span style={{
          fontSize: '0.6rem',
          fontWeight: 800,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: hasPropped ? '#f97316' : 'var(--text-muted)',
        }}>
          Props
        </span>
      </button>

      {message && (
        <div style={{
          position: 'fixed',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          background: messageType === 'error' ? '#1a0a0a' : 'var(--bg-elevated)',
          border: `1px solid ${messageType === 'error' ? 'rgba(220,38,38,0.4)' : 'var(--border-subtle)'}`,
          borderRadius: 10,
          padding: '0.85rem 1.5rem',
          fontSize: '0.9rem',
          color: messageType === 'error' ? '#fca5a5' : 'var(--text-primary)',
          fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
          zIndex: 999,
          maxWidth: '90vw',
          textAlign: 'center',
          lineHeight: 1.5,
        }}>
          {message}
        </div>
      )}

      <style>{`
        .props-btn:hover {
          border-color: rgba(249,115,22,0.4) !important;
          background: rgba(249,115,22,0.06) !important;
        }
        .props-btn-owner {
          pointer-events: auto;
        }
      `}</style>
    </div>
  )
}
