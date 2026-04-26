'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function MarkPaidButton({ partnerId, signupIds }: { partnerId: string; signupIds: string[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function markPaid() {
    setLoading(true)
    await fetch('/api/admin/partners', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: partnerId, markPaidIds: signupIds }),
    })
    setDone(true)
    setLoading(false)
    router.refresh()
  }

  if (done) return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#16a34a', fontWeight: 700, fontSize: '0.85rem' }}>
      <CheckCircle size={15} /> Marked as paid
    </div>
  )

  return (
    <button onClick={markPaid} disabled={loading} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.55rem 1.1rem' }}>
      {loading ? 'Updating…' : `Mark All Paid ($${signupIds.length} signups)`}
    </button>
  )
}
