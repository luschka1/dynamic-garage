'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trophy, X } from 'lucide-react'
import { PLACEMENT_OPTIONS } from '@/lib/types'

export default function AddShowForm({ corvetteId }: { corvetteId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: '',
    event_date: '',
    location: '',
    class: '',
    placement: '',
    trophy: false,
    notes: '',
  })

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.event_date) { setError('Show name and date are required.'); return }
    setSaving(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: err } = await supabase.from('show_events').insert({
      corvette_id: corvetteId,
      user_id: user.id,
      name: form.name,
      event_date: form.event_date,
      location: form.location || null,
      class: form.class || null,
      placement: form.placement || null,
      trophy: form.trophy,
      notes: form.notes || null,
    })

    setSaving(false)
    if (err) { setError(err.message); return }

    setForm({ name: '', event_date: '', location: '', class: '', placement: '', trophy: false, notes: '' })
    setOpen(false)
    router.refresh()
  }

  if (!open) return (
    <div style={{ marginBottom: '1.5rem' }}>
      <button onClick={() => setOpen(true)} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}>
        + Log a Show
      </button>
    </div>
  )

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 12,
      padding: '1.5rem',
      marginBottom: '1.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Log a Show / Event</div>
        <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {/* Show name */}
        <div>
          <label className="label">Show / Event Name *</label>
          <input className="input" value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="e.g. Corvettes at Carlisle 2025" />
        </div>

        {/* Date + Location */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="form-2col">
          <div>
            <label className="label">Date *</label>
            <input className="input" type="date" value={form.event_date} onChange={e => set('event_date', e.target.value)} />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={e => set('location', e.target.value)}
              placeholder="e.g. Carlisle, PA" />
          </div>
        </div>

        {/* Class + Placement */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="form-2col">
          <div>
            <label className="label">Class Entered</label>
            <input className="input" value={form.class} onChange={e => set('class', e.target.value)}
              placeholder="e.g. C8 Modified" />
          </div>
          <div>
            <label className="label">Placement</label>
            <select className="input" value={form.placement} onChange={e => set('placement', e.target.value)}>
              <option value="">— Select —</option>
              {PLACEMENT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
        </div>

        {/* Trophy toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            type="button"
            onClick={() => set('trophy', !form.trophy)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              background: form.trophy ? 'rgba(245,158,11,0.12)' : 'var(--bg-elevated)',
              border: `1px solid ${form.trophy ? 'rgba(245,158,11,0.4)' : 'var(--border-default)'}`,
              borderRadius: 8, padding: '0.5rem 0.9rem', cursor: 'pointer',
              color: form.trophy ? '#f59e0b' : 'var(--text-secondary)',
              fontSize: '0.82rem', fontWeight: 600, transition: 'all 0.15s',
            }}
          >
            <Trophy size={15} />
            {form.trophy ? 'Trophy / Award Won' : 'Did you win a trophy?'}
          </button>
        </div>

        {/* Notes */}
        <div>
          <label className="label">Notes</label>
          <textarea className="input" rows={5} value={form.notes} onChange={e => set('notes', e.target.value)}
            placeholder="Judges' comments, weather, memorable moments..." style={{ resize: 'vertical', minHeight: 100 }} />
        </div>

        {error && <div style={{ fontSize: '0.82rem', color: 'var(--red)' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button type="submit" className="btn-primary" disabled={saving} style={{ fontSize: '0.85rem', padding: '0.6rem 1.4rem' }}>
            {saving ? 'Saving...' : 'Save Show'}
          </button>
          <button type="button" onClick={() => setOpen(false)} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1rem' }}>
            Cancel
          </button>
        </div>
      </form>

      <style>{`
        @media (max-width: 480px) { .form-2col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
