'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, KeyRound, Loader2 } from 'lucide-react'

interface Props {
  userId: string
  email: string
}

export default function UserActions({ userId, email }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [loadingDelete, setLoadingDelete] = useState(false)
  const [loadingReset, setLoadingReset] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleDelete() {
    setLoadingDelete(true)
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if (res.ok) {
      router.refresh()
    } else {
      const { error } = await res.json()
      alert(`Failed to delete: ${error}`)
      setLoadingDelete(false)
      setConfirming(false)
    }
  }

  async function handleReset() {
    setLoadingReset(true)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setLoadingReset(false)
    if (res.ok) {
      setResetSent(true)
      setTimeout(() => setResetSent(false), 3000)
    } else {
      const { error } = await res.json()
      alert(`Failed to send reset: ${error}`)
    }
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Sure?</span>
        <button
          onClick={handleDelete}
          disabled={loadingDelete}
          style={{
            background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4,
            padding: '0.25rem 0.6rem', fontSize: '0.72rem', fontWeight: 700,
            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem',
          }}
        >
          {loadingDelete ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} /> : null}
          Delete
        </button>
        <button
          onClick={() => setConfirming(false)}
          style={{
            background: 'var(--bg-elevated)', color: 'var(--text-muted)',
            border: '1px solid var(--border-subtle)', borderRadius: 4,
            padding: '0.25rem 0.6rem', fontSize: '0.72rem', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
      {/* Password reset */}
      <button
        onClick={handleReset}
        disabled={loadingReset || resetSent}
        title="Send password reset email"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          background: resetSent ? 'rgba(22,163,74,0.12)' : 'var(--bg-elevated)',
          color: resetSent ? '#16a34a' : 'var(--text-secondary)',
          border: `1px solid ${resetSent ? 'rgba(22,163,74,0.3)' : 'var(--border-subtle)'}`,
          borderRadius: 4, padding: '0.3rem 0.6rem',
          fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
          whiteSpace: 'nowrap', transition: 'all 150ms',
        }}
      >
        {loadingReset
          ? <Loader2 size={11} style={{ animation: 'spin 1s linear infinite' }} />
          : <KeyRound size={11} />
        }
        {resetSent ? 'Sent!' : 'Reset PW'}
      </button>

      {/* Delete */}
      <button
        onClick={() => setConfirming(true)}
        title="Delete user and all their data"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.3rem',
          background: 'rgba(220,38,38,0.08)',
          color: '#dc2626',
          border: '1px solid rgba(220,38,38,0.2)',
          borderRadius: 4, padding: '0.3rem 0.6rem',
          fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
          transition: 'all 150ms',
        }}
      >
        <Trash2 size={11} /> Delete
      </button>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
