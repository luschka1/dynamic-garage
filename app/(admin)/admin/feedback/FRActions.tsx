'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const ACTIONS = [
  { status: 'will_do', label: 'Will Do',  color: '#16a34a', bg: 'rgba(22,163,74,0.1)',   border: 'rgba(22,163,74,0.3)'   },
  { status: 'maybe',   label: 'Maybe',    color: '#ca8a04', bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.3)'   },
  { status: 'no',      label: 'No',       color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)' },
  { status: 'done',    label: 'Shipped!', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  border: 'rgba(139,92,246,0.3)'  },
  { status: 'open',    label: 'Reset',    color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.3)'  },
]

interface Props {
  requestId: string
  currentStatus: string
  userEmail: string
  title: string
}

export default function FRActions({ requestId, currentStatus, userEmail, title }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [done, setDone] = useState<string | null>(currentStatus !== 'open' ? currentStatus : null)

  async function handleAction(status: string) {
    setLoading(status)
    const res = await fetch('/api/admin/feature-request', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestId, status, userEmail, title }),
    })
    setLoading(null)
    if (res.ok) {
      setDone(status)
      router.refresh()
    } else {
      const { error } = await res.json()
      alert(`Error: ${error}`)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
      {ACTIONS.filter(a => a.status !== currentStatus).map(a => {
        const isLoading = loading === a.status
        const isDone = done === a.status
        return (
          <button
            key={a.status}
            onClick={() => handleAction(a.status)}
            disabled={!!loading}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.35rem',
              background: isDone ? a.bg : 'var(--bg-elevated)',
              color: isDone ? a.color : 'var(--text-secondary)',
              border: `1px solid ${isDone ? a.border : 'var(--border-subtle)'}`,
              borderRadius: 5, padding: '0.3rem 0.75rem',
              fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 150ms', opacity: loading && !isLoading ? 0.5 : 1,
            }}
          >
            {isLoading && <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />}
            {a.label}
          </button>
        )
      })}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
