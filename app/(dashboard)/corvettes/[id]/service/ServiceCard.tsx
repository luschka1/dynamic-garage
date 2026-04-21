'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Paperclip, Pencil, Trash2, X, Check } from 'lucide-react'
import { SERVICE_CATEGORIES, type ServiceRecord } from '@/lib/types'

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{value}</div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.55rem 0.75rem', fontSize: '0.9rem',
  border: '1px solid var(--border-default)', borderRadius: 6,
  background: 'var(--bg-input)', color: 'var(--text-primary)', outline: 'none',
  boxSizing: 'border-box',
}
const labelStyle: React.CSSProperties = {
  fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
  textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem',
}

export default function ServiceCard({ rec, corvetteId }: { rec: ServiceRecord; corvetteId: string }) {
  const router = useRouter()
  const [mode, setMode] = useState<'view' | 'edit' | 'deleting'>('view')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: rec.title,
    category: rec.category ?? '',
    shop: rec.shop ?? '',
    cost: rec.cost != null ? String(rec.cost) : '',
    service_date: rec.service_date ?? '',
    mileage: rec.mileage != null ? String(rec.mileage) : '',
    notes: rec.notes ?? '',
  })

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required.'); return }
    setSaving(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.from('service_records').update({
      title: form.title.trim(),
      category: form.category || null,
      shop: form.shop || null,
      cost: form.cost ? parseFloat(form.cost) : null,
      service_date: form.service_date || null,
      mileage: form.mileage ? parseInt(form.mileage) : null,
      notes: form.notes || null,
    }).eq('id', rec.id)
    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false)
    setMode('view')
    router.refresh()
  }

  async function handleDelete() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('service_records').delete().eq('id', rec.id)
    router.refresh()
  }

  /* ── EDIT MODE ── */
  if (mode === 'edit') {
    return (
      <div className="record-row blue" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--blue)' }}>Editing Record</span>
          <button onClick={() => { setMode('view'); setError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {error && <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171', borderRadius: 6, padding: '0.6rem 0.85rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Service Title *</label>
            <input style={inputStyle} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Oil Change" />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">— Select —</option>
              {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Shop / Technician</label>
            <input style={inputStyle} value={form.shop} onChange={e => set('shop', e.target.value)} placeholder="e.g. Jiffy Lube" />
          </div>
          <div>
            <label style={labelStyle}>Cost ($)</label>
            <input style={inputStyle} type="number" min="0" step="0.01" value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label style={labelStyle}>Service Date</label>
            <input style={inputStyle} type="date" value={form.service_date} onChange={e => set('service_date', e.target.value)} />
          </div>
          <div>
            <label style={labelStyle}>Mileage at Service</label>
            <input style={inputStyle} type="number" min="0" step="1" value={form.mileage} onChange={e => set('mileage', e.target.value)} placeholder="e.g. 42000" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 } as React.CSSProperties} rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Any additional details…" />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
          <button onClick={() => { setMode('view'); setError('') }} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', minHeight: 36 }}>
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1.1rem', minHeight: 36, gap: '0.4rem' }}>
            <Check size={14} /> {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>
    )
  }

  /* ── VIEW MODE ── */
  return (
    <div className="record-row blue" style={{ padding: '1.25rem 1.5rem' }}>

      {/* Row 1: title + cost + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.9rem' }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {rec.title}
          </div>
          {rec.category && (
            <div style={{ marginTop: '0.35rem' }}>
              <span className="badge badge-blue">{rec.category}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', flexShrink: 0 }}>
          {rec.cost != null && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Cost</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                ${rec.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          )}
          {/* Edit / Delete buttons */}
          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.1rem' }}>
            <button
              onClick={() => setMode('edit')}
              title="Edit record"
              style={{ background: 'var(--bg-base)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '0.4rem 0.6rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'all 150ms' }}
              className="action-btn-edit"
            >
              <Pencil size={13} />
            </button>
            {mode === 'deleting' ? (
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  style={{ background: '#dc2626', border: 'none', borderRadius: 6, padding: '0.4rem 0.75rem', cursor: 'pointer', color: '#fff', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  {saving ? '…' : 'Confirm'}
                </button>
                <button
                  onClick={() => setMode('view')}
                  style={{ background: 'var(--bg-base)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '0.4rem 0.6rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center' }}
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setMode('deleting')}
                title="Delete record"
                style={{ background: 'var(--bg-base)', border: '1px solid var(--border-default)', borderRadius: 6, padding: '0.4rem 0.6rem', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', transition: 'all 150ms' }}
                className="action-btn-delete"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Meta fields */}
      {(rec.shop || rec.service_date || rec.mileage) && (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', marginBottom: rec.notes ? '0.75rem' : '0' }}>
          {rec.shop && <Field label="Shop / Technician" value={rec.shop} />}
          {rec.service_date && (
            <Field label="Service Date" value={new Date(rec.service_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
          )}
          {rec.mileage && <Field label="Mileage at Service" value={`${rec.mileage.toLocaleString()} mi`} />}
        </div>
      )}

      {/* Notes */}
      {rec.notes && (
        <div style={{ paddingTop: '0.75rem', borderTop: rec.shop || rec.service_date || rec.mileage ? 'none' : '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Notes</div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{rec.notes}</p>
        </div>
      )}

      {/* Footer: receipt link */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', marginTop: '0.25rem', borderTop: '1px solid var(--border-subtle)' }}>
        <Link
          href={`/corvettes/${corvetteId}/documents?service=${rec.id}`}
          className="attach-link"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', transition: 'color 150ms', textDecoration: 'none' }}
        >
          <Paperclip size={11} /> Attach / View Receipt
        </Link>
      </div>

      <style>{`
        .action-btn-edit:hover { border-color: var(--border-strong) !important; color: var(--text-primary) !important; }
        .action-btn-delete:hover { background: rgba(220,38,38,0.08) !important; border-color: rgba(220,38,38,0.3) !important; color: #dc2626 !important; }
        .attach-link:hover { color: var(--text-secondary) !important; }
      `}</style>
    </div>
  )
}
