'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Check } from 'lucide-react'

const PRIORITY_LABELS = ['', 'Nice to have', 'Would use it', 'Really want it', 'Need it badly', 'Can\'t live without it']

interface Props {
  categories: string[]
  userId: string
  userEmail: string
}

export default function FeedbackForm({ categories, userId, userEmail }: Props) {
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !description.trim()) {
      setError('Please fill in a title and description.')
      return
    }
    setLoading(true)
    setError('')
    const res = await fetch('/api/feature-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, category, priority }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? 'Something went wrong. Please try again.')
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      router.refresh()
    }
  }

  if (success) {
    return (
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid rgba(22,163,74,0.25)',
        borderRadius: 12,
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '2rem',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: 'rgba(22,163,74,0.1)',
          border: '1px solid rgba(22,163,74,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1rem', color: '#16a34a',
        }}>
          <Check size={22} strokeWidth={2.5} />
        </div>
        <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          REQUEST SUBMITTED
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Thanks — I'll review it and add it to the roadmap if it's a good fit.
        </p>
        <button
          onClick={() => { setSuccess(false); setTitle(''); setDescription(''); setCategory(''); setPriority(0) }}
          className="btn-secondary"
          style={{ fontSize: '0.875rem' }}
        >
          Submit Another
        </button>
      </div>
    )
  }

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 12,
      padding: '1.75rem',
      marginBottom: '2rem',
    }}>
      {error && (
        <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 600 }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Title */}
        <div>
          <label className="label">Feature title <span style={{ color: 'var(--red)' }}>*</span></label>
          <input
            className="input-field"
            type="text"
            placeholder="e.g. Export mods as a CSV file"
            value={title}
            onChange={e => setTitle(e.target.value)}
            maxLength={120}
            required
          />
        </div>

        {/* Category + Priority row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="fb-two-col">
          <div>
            <label className="label">Category</label>
            <select
              className="input-field"
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select a category…</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="label">
              How important? {priority > 0 && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>— {PRIORITY_LABELS[priority]}</span>}
            </label>
            <div style={{ display: 'flex', gap: '0.4rem', paddingTop: '0.35rem' }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPriority(p => p === n ? 0 : n)}
                  style={{
                    width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer',
                    fontSize: '1rem',
                    background: priority >= n ? 'rgba(234,179,8,0.2)' : 'var(--bg-elevated)',
                    outline: priority >= n ? '1px solid rgba(234,179,8,0.5)' : '1px solid var(--border-subtle)',
                    transition: 'all 150ms',
                  }}
                  title={PRIORITY_LABELS[n]}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="label">Describe the feature <span style={{ color: 'var(--red)' }}>*</span></label>
          <textarea
            className="input-field"
            rows={5}
            placeholder="What would it do? How would it work? Why would it help you?"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            style={{ resize: 'vertical', minHeight: 110, fontFamily: 'inherit' }}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: 'flex-start', minWidth: 160 }}>
          {loading ? 'Submitting…' : <><ChevronRight size={16} /> Submit Request</>}
        </button>
      </form>

      <style>{`
        @media (max-width: 540px) { .fb-two-col { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  )
}
