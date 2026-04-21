'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Upload, ChevronDown, ChevronUp, Paperclip } from 'lucide-react'

const MAX_MB = 20

function getFileType(file: File): string {
  if (file.type.startsWith('image/')) return 'image'
  if (file.type === 'application/pdf') return 'pdf'
  return 'other'
}

export default function UploadDocumentForm({ corvetteId, preselectedModId, preselectedServiceId }: {
  corvetteId: string
  preselectedModId?: string
  preselectedServiceId?: string
}) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(!!preselectedModId || !!preselectedServiceId)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [name, setName] = useState('')

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_MB * 1024 * 1024) { setError(`File too large. Max ${MAX_MB} MB.`); return }
    setSelectedFile(file)
    setName(file.name.replace(/\.[^.]+$/, ''))
    setError('')
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedFile) { setError('Please select a file.'); return }
    setUploading(true)
    setError('')

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const ext = selectedFile.name.split('.').pop()
    const path = `${user.id}/${corvetteId}/${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage.from('corvette-files').upload(path, selectedFile)
    if (uploadError) { setError('Upload failed. Please try again.'); setUploading(false); return }

    const { error: dbError } = await supabase.from('documents').insert({
      corvette_id: corvetteId, user_id: user.id,
      mod_id: preselectedModId || null, service_id: preselectedServiceId || null,
      name: name || selectedFile.name, file_url: path,
      file_type: getFileType(selectedFile), file_size: selectedFile.size,
    })

    setUploading(false)
    if (dbError) { setError('Could not record file. Please try again.'); return }
    setSelectedFile(null); setName('')
    if (fileRef.current) fileRef.current.value = ''
    setOpen(false)
    setTimeout(() => router.refresh(), 300)
  }

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, overflow: 'hidden' }}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', padding: '1.1rem 1.5rem' }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: "'Barlow Condensed'", fontSize: '1.1rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--green)' }}>
          <Upload size={20} /> Upload Document or Photo
        </span>
        {open ? <ChevronUp size={18} color="var(--text-muted)" /> : <ChevronDown size={18} color="var(--text-muted)" />}
      </button>

      {open && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '1.5rem' }}>
          {error && <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.95rem' }}>{error}</div>}

          <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Drop zone */}
            <div
              onClick={() => fileRef.current?.click()}
              style={{
                border: `2px dashed ${selectedFile ? 'rgba(21,128,61,0.4)' : 'var(--border-default)'}`,
                borderRadius: 8,
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                background: selectedFile ? 'rgba(22,163,74,0.06)' : 'transparent',
                transition: 'all 150ms',
              }}
            >
              {selectedFile ? (
                <div>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                    {selectedFile.type.startsWith('image/') ? '🖼️' : selectedFile.type === 'application/pdf' ? '📄' : '📎'}
                  </div>
                  <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--green)' }}>{selectedFile.name}</p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div>
                  <Paperclip size={32} color="var(--text-muted)" style={{ margin: '0 auto 0.75rem' }} />
                  <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-secondary)' }}>Click to choose a file</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
                    Photos, PDFs, receipts — up to {MAX_MB} MB
                  </p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*,.pdf,.doc,.docx" style={{ display: 'none' }} onChange={handleFileChange} />

            {selectedFile && (
              <div>
                <label className="label">Document Name</label>
                <input className="input-field" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Oil Change Receipt — April 2025" required />
              </div>
            )}

            {preselectedModId && (
              <div style={{ background: 'var(--red-dim)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6, padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#f87171', fontWeight: 600 }}>
                Linking to mod receipt
              </div>
            )}
            {preselectedServiceId && (
              <div style={{ background: 'var(--blue-dim)', border: '1px solid rgba(37,99,235,0.2)', borderRadius: 6, padding: '0.6rem 1rem', fontSize: '0.85rem', color: '#60a5fa', fontWeight: 600 }}>
                Linking to service receipt
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn-primary" disabled={uploading || !selectedFile} style={{ flex: 1, background: 'var(--green)' }}>
                <Upload size={18} /> {uploading ? 'Uploading…' : 'Upload File'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => { setOpen(false); setSelectedFile(null); setError('') }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
