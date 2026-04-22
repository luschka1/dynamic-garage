'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trash2, X } from 'lucide-react'

/* ── Delete Photo Button ── */
export function DeletePhotoButton({ photoId, storagePath }: { photoId: string; storagePath: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('vehicle_photos').delete().eq('id', photoId)
    router.refresh()
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            flex: 1,
            background: '#dc2626',
            border: 'none',
            borderRadius: 6,
            padding: '0.35rem 0.6rem',
            cursor: deleting ? 'not-allowed' : 'pointer',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
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
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title="Delete photo"
      style={{
        width: '100%',
        marginTop: '0.5rem',
        background: 'rgba(220,38,38,0.08)',
        border: '1px solid rgba(220,38,38,0.2)',
        borderRadius: 6,
        padding: '0.35rem',
        cursor: 'pointer',
        color: '#f87171',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.35rem',
        fontSize: '0.7rem',
        fontWeight: 700,
      }}
    >
      <Trash2 size={12} /> Delete
    </button>
  )
}

/* ── Delete Document Button ── */
export function DeleteDocumentButton({ docId }: { docId: string }) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('documents').delete().eq('id', docId)
    router.refresh()
  }

  if (confirming) {
    return (
      <div style={{ display: 'flex', gap: '0.3rem' }}>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            background: '#dc2626',
            border: 'none',
            borderRadius: 6,
            padding: '0.3rem 0.65rem',
            cursor: deleting ? 'not-allowed' : 'pointer',
            color: '#fff',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
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
            padding: '0.3rem 0.5rem',
            cursor: 'pointer',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <X size={12} />
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      title="Delete document"
      style={{
        background: 'rgba(220,38,38,0.08)',
        border: '1px solid rgba(220,38,38,0.2)',
        borderRadius: 6,
        padding: '0.3rem 0.5rem',
        cursor: 'pointer',
        color: '#f87171',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Trash2 size={13} />
    </button>
  )
}
