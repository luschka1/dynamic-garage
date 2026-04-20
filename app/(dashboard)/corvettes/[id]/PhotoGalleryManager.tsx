'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Upload, Eye, EyeOff, Trash2, Star, Loader2, Images } from 'lucide-react'
import type { VehiclePhoto } from '@/lib/types'

interface Props {
  corvetteId: string
  userId: string
  initialPhotos: VehiclePhoto[]
  coverUrl?: string
}

export default function PhotoGalleryManager({ corvetteId, userId, initialPhotos, coverUrl }: Props) {
  const router = useRouter()
  const [photos, setPhotos] = useState<VehiclePhoto[]>(initialPhotos)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [cover, setCover] = useState(coverUrl || '')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  async function handleUpload(files: FileList) {
    setUploading(true)
    setError('')

    const added: VehiclePhoto[] = []

    try {
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) {
          setError('Only image files are accepted.')
          continue
        }
        if (file.size > 10 * 1024 * 1024) {
          setError('Images must be under 10 MB each.')
          continue
        }

        const ext = file.name.split('.').pop() ?? 'jpg'
        const path = `${userId}/${corvetteId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error: upErr } = await supabase.storage
          .from('corvette-photos')
          .upload(path, file, { cacheControl: '3600', upsert: false })
        if (upErr) throw upErr

        const { data: { publicUrl } } = supabase.storage.from('corvette-photos').getPublicUrl(path)

        const { data: row, error: dbErr } = await supabase
          .from('vehicle_photos')
          .insert({
            corvette_id: corvetteId,
            user_id: userId,
            storage_path: path,
            public_url: publicUrl,
            is_shared: false,
            sort_order: photos.length + added.length,
          })
          .select()
          .single()
        if (dbErr) throw dbErr

        added.push(row as VehiclePhoto)
      }

      setPhotos(prev => [...prev, ...added])
    } catch (e: unknown) {
      setError((e as Error).message || 'Upload failed.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function toggleShare(photo: VehiclePhoto) {
    const next = !photo.is_shared
    const { error: err } = await supabase
      .from('vehicle_photos')
      .update({ is_shared: next })
      .eq('id', photo.id)
    if (!err) setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, is_shared: next } : p))
  }

  async function deletePhoto(photo: VehiclePhoto) {
    if (!confirm('Delete this photo? This cannot be undone.')) return
    await supabase.storage.from('corvette-photos').remove([photo.storage_path])
    await supabase.from('vehicle_photos').delete().eq('id', photo.id)
    if (photo.public_url === cover) {
      await supabase.from('corvettes').update({ photo_url: null }).eq('id', corvetteId)
      setCover('')
      router.refresh()
    }
    setPhotos(prev => prev.filter(p => p.id !== photo.id))
  }

  async function setAsCover(photo: VehiclePhoto) {
    const { error: err } = await supabase
      .from('corvettes')
      .update({ photo_url: photo.public_url })
      .eq('id', corvetteId)
    if (!err) {
      setCover(photo.public_url)
      router.refresh()   // re-runs the server component so the hero updates immediately
    }
  }

  const sharedCount = photos.filter(p => p.is_shared).length

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 12,
      padding: '1.75rem',
      marginBottom: '1.5rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Images size={18} color="var(--red)" />
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)', margin: 0 }}>
            Photo Gallery
          </h2>
          {photos.length > 0 && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {photos.length} photo{photos.length !== 1 ? 's' : ''}
              {sharedCount > 0 ? ` · ${sharedCount} shared` : ''}
            </span>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-primary"
          style={{ fontSize: '0.82rem', padding: '0.5rem 1rem', minHeight: 36, gap: '0.4rem' }}
        >
          {uploading
            ? <><Loader2 size={13} className="pg-spin" /> Uploading…</>
            : <><Upload size={13} /> Add Photos</>
          }
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={e => e.target.files?.length && handleUpload(e.target.files)}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(204,31,31,0.25)', borderRadius: 6, padding: '0.6rem 0.9rem', marginBottom: '1rem', color: 'var(--red)', fontSize: '0.875rem' }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {photos.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="pg-upload-zone"
          style={{ border: '2px dashed var(--border-default)', borderRadius: 8, padding: '2.5rem 1rem', textAlign: 'center', cursor: 'pointer', transition: 'border-color 150ms, background 150ms' }}
        >
          <Upload size={28} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem', display: 'block' }} />
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.25rem' }}>Click to add photos</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>JPG, PNG, WEBP · up to 10 MB each</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '0.75rem' }}>
          {photos.map(photo => {
            const isCover = photo.public_url === cover
            return (
              <div
                key={photo.id}
                style={{
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: `2px solid ${isCover ? 'var(--red)' : 'var(--border-subtle)'}`,
                  background: 'var(--bg-base)',
                  transition: 'border-color 150ms',
                }}
              >
                {/* Image */}
                <div style={{ position: 'relative', height: 120, overflow: 'hidden' }}>
                  <img
                    src={photo.public_url}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                  {/* Cover badge */}
                  {isCover && (
                    <div style={{ position: 'absolute', top: 5, left: 5, background: 'var(--red)', color: 'white', fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '2px 5px', borderRadius: 3 }}>
                      Cover
                    </div>
                  )}
                  {/* Shared indicator */}
                  {photo.is_shared && (
                    <div style={{ position: 'absolute', top: 5, right: 5, background: 'rgba(22,163,74,0.85)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Eye size={11} />
                    </div>
                  )}
                </div>

                {/* Actions row */}
                <div style={{ padding: '0.4rem 0.4rem', display: 'flex', gap: '0.25rem', background: 'var(--bg-card)' }}>
                  {/* Set cover */}
                  <button
                    onClick={() => setAsCover(photo)}
                    title="Set as cover photo"
                    className={`pg-action-btn${isCover ? ' pg-action-active-red' : ''}`}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: isCover ? 'var(--red-dim)' : 'transparent',
                      border: `1px solid ${isCover ? 'rgba(204,31,31,0.3)' : 'var(--border-subtle)'}`,
                      borderRadius: 4, padding: '0.3rem', cursor: 'pointer',
                      color: isCover ? 'var(--red)' : 'var(--text-muted)',
                      transition: 'all 150ms',
                    }}
                  >
                    <Star size={12} fill={isCover ? 'currentColor' : 'none'} />
                  </button>

                  {/* Toggle share */}
                  <button
                    onClick={() => toggleShare(photo)}
                    title={photo.is_shared ? 'Hide from public page' : 'Show on public page'}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: photo.is_shared ? 'rgba(22,163,74,0.1)' : 'transparent',
                      border: `1px solid ${photo.is_shared ? 'rgba(22,163,74,0.3)' : 'var(--border-subtle)'}`,
                      borderRadius: 4, padding: '0.3rem', cursor: 'pointer',
                      color: photo.is_shared ? '#16a34a' : 'var(--text-muted)',
                      transition: 'all 150ms',
                    }}
                  >
                    {photo.is_shared ? <Eye size={12} /> : <EyeOff size={12} />}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deletePhoto(photo)}
                    title="Delete photo"
                    className="pg-delete-btn"
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: 'transparent',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 4, padding: '0.3rem', cursor: 'pointer',
                      color: 'var(--text-muted)',
                      transition: 'all 150ms',
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Hint */}
      {photos.length > 0 && (
        <p style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '1rem', lineHeight: 1.6 }}>
          <Star size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
          Star = cover photo shown in the hero.&ensp;
          <Eye size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3 }} />
          Eye = visible on the public build page.
        </p>
      )}

      <style>{`
        .pg-upload-zone:hover { border-color: var(--border-default) !important; background: rgba(0,0,0,0.02); }
        .pg-delete-btn:hover { color: var(--red) !important; border-color: rgba(204,31,31,0.4) !important; background: var(--red-dim) !important; }
        @keyframes pg-spin { to { transform: rotate(360deg); } }
        .pg-spin { animation: pg-spin 0.7s linear infinite; }
      `}</style>
    </div>
  )
}
