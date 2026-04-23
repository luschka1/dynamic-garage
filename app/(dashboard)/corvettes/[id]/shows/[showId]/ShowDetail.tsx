'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Trophy, Trash2, Upload, X, Loader2, MapPin, Calendar, Flag, Pencil } from 'lucide-react'
import type { ShowEvent, ShowEventPhoto, } from '@/lib/types'
import { PLACEMENT_OPTIONS } from '@/lib/types'

function placementColor(placement?: string) {
  if (!placement) return { bg: 'var(--bg-elevated)', color: 'var(--text-muted)', border: 'var(--border-subtle)' }
  const p = placement.toLowerCase()
  if (p.includes('1st') || p.includes('best in show')) return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' }
  if (p.includes('2nd')) return { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af', border: 'rgba(156,163,175,0.3)' }
  if (p.includes('3rd')) return { bg: 'rgba(180,83,9,0.12)', color: '#b45309', border: 'rgba(180,83,9,0.3)' }
  if (p.includes('people') || p.includes('choice')) return { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', border: 'rgba(99,102,241,0.3)' }
  if (p.includes('best')) return { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.3)' }
  return { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'var(--border-subtle)' }
}

export default function ShowDetail({
  show: initialShow,
  photos: initialPhotos,
  corvetteId,
  userId,
}: {
  show: ShowEvent
  photos: ShowEventPhoto[]
  corvetteId: string
  userId: string
}) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [show, setShow] = useState(initialShow)
  const [photos, setPhotos] = useState(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [editForm, setEditForm] = useState({
    name: show.name,
    event_date: show.event_date,
    location: show.location ?? '',
    class: show.class ?? '',
    placement: show.placement ?? '',
    trophy: show.trophy,
    notes: show.notes ?? '',
  })

  function setField(field: string, value: string | boolean) {
    setEditForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    if (!editForm.name || !editForm.event_date) { setError('Name and date are required.'); return }
    setSaving(true)
    const { data, error: err } = await supabase
      .from('show_events')
      .update({
        name: editForm.name,
        event_date: editForm.event_date,
        location: editForm.location || null,
        class: editForm.class || null,
        placement: editForm.placement || null,
        trophy: editForm.trophy,
        notes: editForm.notes || null,
      })
      .eq('id', show.id)
      .select()
      .single()
    setSaving(false)
    if (err) { setError(err.message); return }
    setShow(data as ShowEvent)
    setEditMode(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this show entry and all its photos? This cannot be undone.')) return
    setDeleting(true)
    // Delete photos from storage
    for (const p of photos) {
      await supabase.storage.from('corvette-photos').remove([p.storage_path])
    }
    await supabase.from('show_events').delete().eq('id', show.id)
    router.push(`/corvettes/${corvetteId}/shows`)
  }

  async function handlePhotoUpload(files: FileList) {
    setUploading(true)
    const added: ShowEventPhoto[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > 10 * 1024 * 1024) continue
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `${userId}/${corvetteId}/shows/${show.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: upErr } = await supabase.storage.from('corvette-photos').upload(path, file, { cacheControl: '3600', upsert: false })
      if (upErr) continue
      const { data: { publicUrl } } = supabase.storage.from('corvette-photos').getPublicUrl(path)
      const { data: row } = await supabase.from('show_event_photos').insert({
        show_event_id: show.id,
        corvette_id: corvetteId,
        user_id: userId,
        storage_path: path,
        public_url: publicUrl,
      }).select().single()
      if (row) added.push(row as ShowEventPhoto)
    }
    setPhotos(prev => [...prev, ...added])
    setUploading(false)
  }

  async function handleDeletePhoto(photo: ShowEventPhoto) {
    await supabase.storage.from('corvette-photos').remove([photo.storage_path])
    await supabase.from('show_event_photos').delete().eq('id', photo.id)
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }

  const pc = placementColor(show.placement ?? undefined)
  const date = new Date(show.event_date + 'T12:00:00')

  return (
    <div>
      {/* Show header card */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem',
      }}>
        {!editMode ? (
          <>
            {/* View mode */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                  {show.trophy && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 100, padding: '0.2rem 0.6rem' }}>
                      <Trophy size={13} color="#f59e0b" />
                      <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#f59e0b' }}>Trophy</span>
                    </div>
                  )}
                  {show.placement && (
                    <div style={{ background: pc.bg, border: `1px solid ${pc.border}`, borderRadius: 100, padding: '0.2rem 0.7rem', fontSize: '0.72rem', fontWeight: 700, color: pc.color }}>
                      {show.placement}
                    </div>
                  )}
                </div>
                <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '0.6rem' }}>
                  {show.name}
                </h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={13} color="var(--text-muted)" />
                    {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  {show.location && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <MapPin size={13} color="var(--text-muted)" /> {show.location}
                    </span>
                  )}
                  {show.class && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      <Flag size={13} color="var(--text-muted)" /> {show.class}
                    </span>
                  )}
                </div>
                {show.notes && (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
                    {show.notes}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                <button onClick={() => setEditMode(true)} style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  borderRadius: 6, padding: '0.45rem 0.7rem', cursor: 'pointer',
                  fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)',
                }}>
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={handleDelete} disabled={deleting} style={{
                  display: 'flex', alignItems: 'center',
                  background: 'transparent', border: '1px solid var(--border-subtle)',
                  borderRadius: 6, padding: '0.45rem 0.6rem', cursor: 'pointer',
                  color: 'var(--text-muted)',
                }} className="delete-btn">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Edit mode */
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Edit Show</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label className="label">Show Name *</label>
                <input className="input" value={editForm.name} onChange={e => setField('name', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="form-2col">
                <div>
                  <label className="label">Date *</label>
                  <input className="input" type="date" value={editForm.event_date} onChange={e => setField('event_date', e.target.value)} />
                </div>
                <div>
                  <label className="label">Location</label>
                  <input className="input" value={editForm.location} onChange={e => setField('location', e.target.value)} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }} className="form-2col">
                <div>
                  <label className="label">Class</label>
                  <input className="input" value={editForm.class} onChange={e => setField('class', e.target.value)} />
                </div>
                <div>
                  <label className="label">Placement</label>
                  <select className="input" value={editForm.placement} onChange={e => setField('placement', e.target.value)}>
                    <option value="">— None —</option>
                    {PLACEMENT_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <button type="button" onClick={() => setField('trophy', !editForm.trophy)} style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', width: 'fit-content',
                background: editForm.trophy ? 'rgba(245,158,11,0.12)' : 'var(--bg-elevated)',
                border: `1px solid ${editForm.trophy ? 'rgba(245,158,11,0.4)' : 'var(--border-default)'}`,
                borderRadius: 8, padding: '0.45rem 0.9rem', cursor: 'pointer',
                color: editForm.trophy ? '#f59e0b' : 'var(--text-secondary)',
                fontSize: '0.82rem', fontWeight: 600,
              }}>
                <Trophy size={14} /> {editForm.trophy ? 'Trophy Won' : 'Mark as Trophy Win'}
              </button>
              <div>
                <label className="label">Notes</label>
                <textarea className="input" rows={5} value={editForm.notes} onChange={e => setField('notes', e.target.value)} style={{ resize: 'vertical', minHeight: 100 }} />
              </div>
              {error && <div style={{ fontSize: '0.82rem', color: 'var(--red)' }}>{error}</div>}
              <div style={{ display: 'flex', gap: '0.6rem' }}>
                <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ fontSize: '0.82rem', padding: '0.5rem 1.2rem' }}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button onClick={() => { setEditMode(false); setError('') }} className="btn-secondary" style={{ fontSize: '0.82rem', padding: '0.5rem 0.9rem' }}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Photos section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Show Photos {photos.length > 0 && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>({photos.length})</span>}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="btn-secondary"
            style={{ fontSize: '0.78rem', padding: '0.45rem 0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            {uploading ? <Loader2 size={13} className="spin" /> : <Upload size={13} />}
            {uploading ? 'Uploading...' : 'Upload Photos'}
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }}
            onChange={e => e.target.files && handlePhotoUpload(e.target.files)} />
        </div>

        {photos.length === 0 ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: '2px dashed var(--border-default)', borderRadius: 12,
              padding: '2.5rem', textAlign: 'center', cursor: 'pointer',
              color: 'var(--text-muted)', fontSize: '0.85rem', transition: 'border-color 0.15s',
            }}
            className="upload-zone"
          >
            <Upload size={28} style={{ marginBottom: '0.5rem', opacity: 0.4 }} />
            <div>Click to upload photos from this show</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.75rem' }}>
            {photos.map(photo => (
              <div key={photo.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', aspectRatio: '4/3', background: 'var(--bg-elevated)' }}>
                <a href={photo.public_url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                  <img src={photo.public_url} alt="Show photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </a>
                <button
                  onClick={() => handleDeletePhoto(photo)}
                  style={{
                    position: 'absolute', top: 6, right: 6,
                    background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%',
                    width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: '#fff',
                  }}
                  className="photo-delete"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .delete-btn:hover { color: #f87171 !important; background: rgba(220,38,38,0.1) !important; border-color: rgba(220,38,38,0.3) !important; }
        .upload-zone:hover { border-color: var(--border-medium) !important; }
        .photo-delete:hover { background: rgba(220,38,38,0.8) !important; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) { .form-2col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
