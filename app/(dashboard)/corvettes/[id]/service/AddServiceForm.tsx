'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Plus, ChevronDown, ChevronUp, Paperclip, X } from 'lucide-react'
import { SERVICE_CATEGORIES } from '@/lib/types'

const MAX_MB = 20

function getFileType(file: File) {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type === 'application/pdf') return 'pdf'
  return 'other'
}

export default function AddServiceForm({ corvetteId }: { corvetteId: string }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)

  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', category: '', shop: '', mileage: '', cost: '', service_date: '', notes: '',
  })

  // Document attachment state
  const [docFile, setDocFile] = useState<File | null>(null)
  const [docName, setDocName] = useState('')
  const [docShared, setDocShared] = useState(false)

  function set(key: string, value: string) { setForm(f => ({ ...f, [key]: value })) }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_MB * 1024 * 1024) { setError(`File too large. Max ${MAX_MB} MB.`); return }
    setDocFile(file)
    setDocName(file.name.replace(/\.[^.]+$/, ''))
    setError('')
  }

  function clearFile() {
    setDocFile(null)
    setDocName('')
    setDocShared(false)
    if (fileRef.current) fileRef.current.value = ''
  }

  function reset() {
    setForm({ title: '', category: '', shop: '', mileage: '', cost: '', service_date: '', notes: '' })
    clearFile()
    setOpen(false)
    setError('')
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    // 1. Insert service record — get ID back
    const { data: rec, error: recErr } = await supabase
      .from('service_records')
      .insert({
        corvette_id: corvetteId, user_id: user.id,
        title: form.title,
        category: form.category || null,
        shop: form.shop || null,
        mileage: form.mileage ? Number(form.mileage) : null,
        cost: form.cost ? Number(form.cost) : null,
        service_date: form.service_date || null,
        notes: form.notes || null,
      })
      .select()
      .single()

    if (recErr || !rec) {
      setError('Could not save record. Please try again.')
      setSaving(false)
      return
    }

    // 2. Upload document if one was attached
    if (docFile) {
      const ext = docFile.name.split('.').pop()
      const path = `${user.id}/${corvetteId}/${Date.now()}.${ext}`

      const { error: upErr } = await supabase.storage
        .from('corvette-files')
        .upload(path, docFile)

      if (!upErr) {
        await supabase.from('documents').insert({
          corvette_id: corvetteId,
          user_id: user.id,
          service_id: rec.id,
          name: docName || docFile.name,
          file_url: path,
          file_type: getFileType(docFile),
          file_size: docFile.size,
          is_shared: docShared,
        })
      }
    }

    setSaving(false)
    reset()
    router.refresh()
  }

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
      {/* Toggle header */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '1.1rem 1.5rem', color: 'var(--text-primary)' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: "'Barlow Condensed'", fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--blue)' }}>
          <Plus size={20} /> Log a Service Record
        </span>
        {open ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.5rem' }}>
          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.95rem' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

            {/* Service description */}
            <div>
              <label className="label">Service Description *</label>
              <input className="input-field" type="text" placeholder="e.g. Oil & Filter Change, Front Brake Pads, Annual Inspection" value={form.title} onChange={e => set('title', e.target.value)} required />
            </div>

            {/* Category + Cost */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Category</label>
                <select className="input-field" value={form.category} onChange={e => set('category', e.target.value)}>
                  <option value="">Select…</option>
                  {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Cost ($)</label>
                <input className="input-field" type="number" min={0} step="0.01" placeholder="0.00" value={form.cost} onChange={e => set('cost', e.target.value)} />
              </div>
            </div>

            {/* Shop + Mileage */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="label">Shop / Dealer</label>
                <input className="input-field" type="text" placeholder="e.g. Dealer, Jiffy Lube" value={form.shop} onChange={e => set('shop', e.target.value)} />
              </div>
              <div>
                <label className="label">Mileage at Service</label>
                <input className="input-field" type="number" min={0} placeholder="e.g. 15000" value={form.mileage} onChange={e => set('mileage', e.target.value)} />
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="label">Service Date</label>
              <input className="input-field" type="date" value={form.service_date} onChange={e => set('service_date', e.target.value)} />
            </div>

            {/* Notes */}
            <div>
              <label className="label">Notes</label>
              <textarea className="input-field" rows={3} placeholder="What was found, what's next, any warranty info…" value={form.notes} onChange={e => set('notes', e.target.value)} style={{ resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.5 }} />
            </div>

            {/* ── Attach Receipt ── */}
            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                Attach Receipt <span style={{ fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>— optional</span>
              </p>

              {!docFile ? (
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{ border: '2px dashed var(--border-default)', borderRadius: 6, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', transition: 'border-color 150ms, background 150ms' }}
                  className="doc-drop-zone"
                >
                  <Paperclip size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Click to attach a receipt, photo, or PDF</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Max {MAX_MB} MB</span>
                </div>
              ) : (
                <div style={{ border: '1px solid var(--border-default)', borderRadius: 6, padding: '0.85rem 1rem', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* File info row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.4rem' }}>
                      {docFile.type.startsWith('image/') ? '🖼️' : docFile.type === 'application/pdf' ? '📄' : '📎'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <input
                        className="input-field"
                        type="text"
                        value={docName}
                        onChange={e => setDocName(e.target.value)}
                        placeholder="Document name"
                        style={{ marginBottom: 0 }}
                      />
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        {(docFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button type="button" onClick={clearFile} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', flexShrink: 0 }}>
                      <X size={16} />
                    </button>
                  </div>

                  {/* Share checkbox */}
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', userSelect: 'none', padding: '0.6rem 0.75rem', borderRadius: 5, background: docShared ? 'rgba(22,163,74,0.08)' : 'transparent', border: `1px solid ${docShared ? 'rgba(22,163,74,0.25)' : 'var(--border-subtle)'}`, transition: 'all 150ms' }}>
                    <input
                      type="checkbox"
                      checked={docShared}
                      onChange={e => setDocShared(e.target.checked)}
                      style={{ width: 15, height: 15, accentColor: '#16a34a', cursor: 'pointer' }}
                    />
                    <div>
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: docShared ? '#16a34a' : 'var(--text-primary)' }}>
                        Show receipt on public build page
                      </span>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>
                        Anyone with the public link can view this document
                      </p>
                    </div>
                  </label>
                </div>
              )}

              <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileChange} />
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.25rem' }}>
              <button type="submit" className="btn-primary" disabled={saving} style={{ flex: 1, background: 'var(--blue)' }}>
                <Plus size={18} /> {saving ? 'Saving…' : 'Add Record'}
              </button>
              <button type="button" className="btn-secondary" onClick={reset}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <style>{`.doc-drop-zone:hover { border-color: var(--border-default) !important; background: rgba(0,0,0,0.02); }`}</style>
    </div>
  )
}
