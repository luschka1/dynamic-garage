'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { FileText, Image, File, Trash2, ExternalLink, Eye, EyeOff } from 'lucide-react'
import type { Document } from '@/lib/types'

function FileIcon({ type }: { type?: string }) {
  if (type === 'image') return <Image size={28} color="var(--text-muted)" strokeWidth={1.5} />
  if (type === 'pdf') return <FileText size={28} color="var(--text-muted)" strokeWidth={1.5} />
  return <File size={28} color="var(--text-muted)" strokeWidth={1.5} />
}

function formatBytes(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

function isStoragePath(url: string) { return !url.startsWith('http') }

function useSignedUrl(path: string) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!isStoragePath(path)) { setUrl(path); return }
    const supabase = createClient()
    supabase.storage.from('corvette-files').createSignedUrl(path, 3600)
      .then(({ data }) => { if (data) setUrl(data.signedUrl) })
  }, [path])
  return url
}

function typeLabel(type?: string) {
  if (type === 'image') return 'Image'
  if (type === 'pdf') return 'PDF'
  return 'File'
}

function DocField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
        {value}
      </div>
    </div>
  )
}

function DocCard({ doc, onDelete, onToggleShare, deleting }: {
  doc: Document
  onDelete: (doc: Document) => void
  onToggleShare: (doc: Document) => void
  deleting: boolean
}) {
  const signedUrl = useSignedUrl(doc.file_url)

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 8,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 150ms',
    }}
      className="doc-card"
    >
      {/* Preview */}
      {doc.file_type === 'image' && signedUrl ? (
        <a href={signedUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', height: 140, overflow: 'hidden', position: 'relative' }}>
          <img src={signedUrl} alt={doc.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 200ms' }} className="doc-img" />
          {doc.is_shared && (
            <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(22,163,74,0.85)', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={12} />
            </div>
          )}
        </a>
      ) : (
        <div style={{ height: 110, background: 'var(--bg-elevated)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', borderBottom: '1px solid var(--border-subtle)', position: 'relative' }}>
          <FileIcon type={doc.file_type} />
          <span style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            {typeLabel(doc.file_type)}
          </span>
          {doc.is_shared && (
            <div style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(22,163,74,0.85)', color: 'white', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Eye size={12} />
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div style={{ padding: '0.9rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

        {/* File name */}
        <div>
          <div style={{ fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
            File Name
          </div>
          <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.35, wordBreak: 'break-word', margin: 0 }}>
            {doc.name}
          </p>
        </div>

        {/* Meta row */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', paddingTop: '0.6rem', borderTop: '1px solid var(--border-subtle)' }}>
          <DocField
            label="Uploaded"
            value={new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          />
          {doc.file_size && (
            <DocField label="Size" value={formatBytes(doc.file_size)} />
          )}
          {doc.file_type && (
            <DocField label="Type" value={typeLabel(doc.file_type)} />
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
          <a
            href={signedUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
              background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontWeight: 700,
              borderRadius: 4, padding: '0.5rem', fontSize: '0.75rem', textDecoration: 'none',
              border: '1px solid var(--border-subtle)', opacity: signedUrl ? 1 : 0.4,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              transition: 'color 150ms, background 150ms',
            }}
            className="open-link"
          >
            <ExternalLink size={13} /> Open
          </a>
          {/* Share toggle */}
          <button
            onClick={() => onToggleShare(doc)}
            title={doc.is_shared ? 'Remove from public page' : 'Show on public page'}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: doc.is_shared ? 'rgba(22,163,74,0.1)' : 'transparent',
              color: doc.is_shared ? '#16a34a' : 'var(--text-muted)',
              border: `1px solid ${doc.is_shared ? 'rgba(22,163,74,0.3)' : 'var(--border-subtle)'}`,
              borderRadius: 4, padding: '0.5rem 0.6rem', cursor: 'pointer', minWidth: 36,
              transition: 'all 150ms',
            }}
            aria-label={doc.is_shared ? 'Hide from public' : 'Share on public page'}
          >
            {doc.is_shared ? <Eye size={14} /> : <EyeOff size={14} />}
          </button>
          <button
            onClick={() => onDelete(doc)}
            disabled={deleting}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)',
              borderRadius: 4, padding: '0.5rem 0.6rem', cursor: 'pointer', minWidth: 36,
              transition: 'color 150ms, background 150ms',
            }}
            className="delete-btn"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <style>{`
        .doc-card:hover { border-color: var(--border-default) !important; }
        .doc-img:hover { transform: scale(1.03); }
        .open-link:hover { color: var(--text-primary) !important; background: var(--bg-card-hover) !important; }
        .delete-btn:hover { color: #f87171 !important; background: rgba(220,38,38,0.1) !important; border-color: rgba(220,38,38,0.3) !important; }
      `}</style>
    </div>
  )
}

export default function DocumentGrid({ docs: initialDocs }: { docs: Document[] }) {
  const router = useRouter()
  const [docs, setDocs] = useState<Document[]>(initialDocs)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(doc: Document) {
    setDeleting(doc.id)
    const supabase = createClient()
    if (isStoragePath(doc.file_url)) {
      await supabase.storage.from('corvette-files').remove([doc.file_url])
    }
    await supabase.from('documents').delete().eq('id', doc.id)
    setDocs(prev => prev.filter(d => d.id !== doc.id))
    setDeleting(null)
    router.refresh()
  }

  async function handleToggleShare(doc: Document) {
    const next = !doc.is_shared
    const supabase = createClient()
    const { error } = await supabase
      .from('documents')
      .update({ is_shared: next })
      .eq('id', doc.id)
    if (!error) {
      setDocs(prev => prev.map(d => d.id === doc.id ? { ...d, is_shared: next } : d))
    }
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
      {docs.map(doc => (
        <DocCard key={doc.id} doc={doc} onDelete={handleDelete} onToggleShare={handleToggleShare} deleting={deleting === doc.id} />
      ))}
    </div>
  )
}
