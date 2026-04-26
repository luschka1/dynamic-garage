'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, ChevronDown, ChevronUp } from 'lucide-react'

export default function CreatePartnerForm() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    code: '', partner_name: '', logo_url: '',
    headline: 'Get Lifetime Access — Free',
    subheadline: 'Sign up through this exclusive offer and never pay for Dynamic Garage.',
    payout_rate: '',
  })

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/partners', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, payout_rate: parseFloat(form.payout_rate) || 0 }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    setOpen(false)
    setForm({ code: '', partner_name: '', logo_url: '', headline: 'Get Lifetime Access — Free', subheadline: 'Sign up through this exclusive offer and never pay for Dynamic Garage.', payout_rate: '' })
    router.refresh()
    setSaving(false)
  }

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: "'Barlow Condensed'", fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          <Plus size={18} color="var(--red)" /> Create New Partner Code
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <form onSubmit={handleSubmit} style={{ padding: '0 1.5rem 1.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {error && <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', borderRadius: 6, padding: '0.75rem 1rem', fontSize: '0.88rem' }}>{error}</div>}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="label">Partner Code <span style={{ color: 'var(--red)' }}>*</span></label>
              <input className="input-field" placeholder="MOTORTREND2025" value={form.code} onChange={e => set('code', e.target.value.toUpperCase().replace(/\s+/g, ''))} required style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }} />
            </div>
            <div>
              <label className="label">Partner Name <span style={{ color: 'var(--red)' }}>*</span></label>
              <input className="input-field" placeholder="Motor Trend" value={form.partner_name} onChange={e => set('partner_name', e.target.value)} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'end' }}>
            <div>
              <label className="label">Partner Logo URL</label>
              <input className="input-field" placeholder="https://partner.com/logo.png" value={form.logo_url} onChange={e => set('logo_url', e.target.value)} />
            </div>
            <div>
              <label className="label">Payout per Signup ($)</label>
              <input className="input-field" type="number" min="0" step="0.01" placeholder="5.00" value={form.payout_rate} onChange={e => set('payout_rate', e.target.value)} style={{ width: 120 }} />
            </div>
          </div>

          <div>
            <label className="label">Signup Page Headline</label>
            <input className="input-field" value={form.headline} onChange={e => set('headline', e.target.value)} />
          </div>

          <div>
            <label className="label">Signup Page Subheadline</label>
            <input className="input-field" value={form.subheadline} onChange={e => set('subheadline', e.target.value)} />
          </div>

          {form.code && (
            <div style={{ background: 'var(--bg-base)', borderRadius: 6, padding: '0.6rem 0.9rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Signup URL: <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>dynamicgarage.app/join/{form.code}</strong>
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={saving} style={{ alignSelf: 'flex-start' }}>
            {saving ? 'Creating…' : 'Create Partner'}
          </button>
        </form>
      )}
    </div>
  )
}
