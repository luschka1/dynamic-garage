'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, X } from 'lucide-react'

interface Props {
  vehicleId: string
  userId: string
  isPublic: boolean
  nickname: string
}

export default function VehicleAdminActions({ vehicleId, userId, isPublic, nickname }: Props) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('corvettes').delete().eq('id', vehicleId)
    router.refresh()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {isPublic && (
        <a
          href={`/share/${userId}/${vehicleId}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.35rem 0.7rem',
            borderRadius: 6,
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: 'rgba(74,142,245,0.12)',
            color: '#4a8ef5',
            border: '1px solid rgba(74,142,245,0.25)',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          View Public
        </a>
      )}

      {confirming ? (
        <div style={{ display: 'flex', gap: '0.3rem' }}>
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              background: '#dc2626',
              border: 'none',
              borderRadius: 6,
              padding: '0.35rem 0.75rem',
              cursor: deleting ? 'not-allowed' : 'pointer',
              color: '#fff',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              opacity: deleting ? 0.7 : 1,
            }}
          >
            {deleting ? '…' : 'Confirm'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            disabled={deleting}
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 6,
              padding: '0.35rem 0.5rem',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          title={`Delete ${nickname}`}
          style={{
            background: 'rgba(220,38,38,0.08)',
            border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: 6,
            padding: '0.35rem 0.5rem',
            cursor: 'pointer',
            color: '#f87171',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  )
}
