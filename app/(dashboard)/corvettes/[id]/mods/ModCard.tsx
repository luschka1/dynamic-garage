'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Paperclip, Pencil, Trash2, X, Check } from 'lucide-react'
import { MOD_CATEGORIES, type Mod } from '@/lib/types'

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

export default function ModCard({ mod, corvetteId }: { mod: Mod; corvetteId: string }) {
  const router = useRouter()
  const [mode, setMode] = useState<'view' | 'edit' | 'deleting'>('view')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    name: mod.name,
    category: mod.category ?? '',
    vendor: mod.vendor ?? '',
    cost: mod.cost != null ? String(mod.cost) : '',
    install_date: mod.install_date ?? '',
    purchase_url: mod.purchase_url ?? '',
    notes: mod.notes ?? '',
  })

  function set(key: string, val: string) { setForm(f => ({ ...f, [key]: val })) }

  async function handleSave() {
    if (!form.name.trim()) { setError('Name is required.'); return }
    setSaving(true); setError('')
    const supabase = createClient()
    const { error: err } = await supabase.from('mods').update({
      name: form.name.trim(),
      category: form.category || null,
      vendor: form.vendor || null,
      cost: form.cost ? parseFloat(form.cost) : null,
      install_date: form.install_date || null,
      purchase_url: form.purchase_url || null,
      notes: form.notes || null,
    }).eq('id', mod.id)
    if (err) { setError(err.message); setSaving(false); return }
    setSaving(false)
    setMode('view')
    router.refresh()
  }

  async function handleDelete() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('mods').delete().eq('id', mod.id)
    router.refresh()
  }

  /* ── EDIT MODE ── */
  if (mode === 'edit') {
    return (
      <div className="record-row red" style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--red)' }}>Editing Mod</span>
          <button onClick={() => { setMode('view'); setError('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem', display: 'flex' }}>
            <X size={18} />
          </button>
        </div>

        {error && <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.25)', color: '#f87171', borderRadius: 6, padding: '0.6rem 0.85rem', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Mod Name *</label>
            <input style={inputStyle} value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Corsa Sport Exhaust" />
          </div>
          <div>
            <label style={labelStyle}>Category</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.category} onChange={e => set('category', e.target.value)}>
              <option value="">— Select —</option>
              {MOD_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Vendor / Shop</label>
            <input style={inputStyle} value={form.vendor} onChange={e => set('vendor', e.target.value)} placeholder="e.g. Corsa Performance" />
          </div>
          <div>
            <label style={labelStyle}>Cost ($)</label>
            <input style={inputStyle} type="number" min="0" step="0.01" value={form.cost} onChange={e => set('cost', e.target.value)} placeholder="0.00" />
          </div>
          <div>
            <label style={labelStyle}>Install Date</label>
            <input style={inputStyle} type="date" value={form.install_date} onChange={e => set('install_date', e.target.value)} />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Purchase URL</label>
            <input style={inputStyle} type="url" value={form.purchase_url} onChange={e => set('purchase_url', e.target.value)} placeholder="https://…" />
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 } as React.CSSProperties} rows={3} value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Part numbers, impressions…" />
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
    <div className="record-row red" style={{ padding: '1.25rem 1.5rem' }}>

      {/* Row 1: name + cost + actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.9rem' }}>
        <div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
            {mod.name}
          </div>
          {mod.category && (
            <div style={{ marginTop: '0.35rem' }}>
              <span className="badge badge-red">{mod.category}</span>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', flexShrink: 0 }}>
          {mod.cost != null && (
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Cost</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                ${mod.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </div>
            </div>
          )}
          {/* Edit / Delete buttons */}
          <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.1rem' }}>
            <button
              onClick={() => setMode('edit')}
              title="Edit mod"
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
                title="Delete mod"
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
      {(mod.vendor || mod.install_date) && (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', marginBottom: mod.notes ? '0.75rem' : '0' }}>
          {mod.vendor && <Field label="Vendor" value={mod.vendor} />}
          {mod.install_date && (
            <Field label="Install Date" value={new Date(mod.install_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} />
          )}
        </div>
      )}

      {/* Notes */}
      {mod.notes && (
        <div style={{ paddingTop: '0.75rem', borderTop: mod.vendor || mod.install_date ? 'none' : '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Notes</div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{mod.notes}</p>
        </div>
      )}

      {/* Purchase URL */}
      {mod.purchase_url && (
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Where to Buy</div>
          <a href={mod.purchase_url} target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '0.88rem', color: 'var(--red)', fontWeight: 600, wordBreak: 'break-all', textDecoration: 'none' }}
            className="purchase-link"
          >{mod.purchase_url}</a>
        </div>
      )}

      {/* Footer: receipt link */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', marginTop: '0.25rem', borderTop: '1px solid var(--border-subtle)' }}>
        <Link
          href={`/corvettes/${corvetteId}/documents?mod=${mod.id}`}
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
        .purchase-link:hover { text-decoration: underline !important; }
      `}</style>
    </div>
  )
}
