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

  function showMessage(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(''), 3500)
  }

  async function handleClick() {
    if (isOwner) { showMessage("You can't give Props to your own build."); return }

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
      showMessage(data.error ?? 'Something went wrong.')
      return
    }

    setHasPropped(!hasPropped)
    setCount(data.props_count)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
      <button
        onClick={handleClick}
        disabled={loading || isOwner}
        title={isOwner ? "Your build" : hasPropped ? "Remove Props" : "Give Props"}
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
          opacity: loading ? 0.7 : 1,
          minWidth: 72,
        }}
        className="props-btn"
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
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8,
          padding: '0.75rem 1.25rem',
          fontSize: '0.88rem',
          color: 'var(--text-primary)',
          fontWeight: 600,
          boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
          zIndex: 999,
          whiteSpace: 'nowrap',
        }}>
          {message}
        </div>
      )}

      <style>{`
        .props-btn:hover:not(:disabled) {
          border-color: rgba(249,115,22,0.4) !important;
          background: rgba(249,115,22,0.06) !important;
        }
      `}</style>
    </div>
  )
}
