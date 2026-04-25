import type { Metadata } from 'next'
import { createAdminClient } from '@/lib/supabase/admin'
import FRActions from './FRActions'

export const metadata: Metadata = { title: 'Feature Requests — Admin' }

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Nice to have', 2: 'Would use it', 3: 'Really want it',
  4: 'Need it badly', 5: "Can't live without it",
}

const STATUS_STYLES: Record<string, { label: string; bg: string; color: string }> = {
  open:     { label: 'Open',      bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
  will_do:  { label: 'Will Do',   bg: 'rgba(22,163,74,0.12)',   color: '#16a34a' },
  maybe:    { label: 'Maybe',     bg: 'rgba(234,179,8,0.12)',   color: '#ca8a04' },
  no:       { label: 'No',        bg: 'rgba(107,114,128,0.12)', color: '#6b7280' },
  done:     { label: 'Shipped!',  bg: 'rgba(139,92,246,0.12)',  color: '#8b5cf6' },
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function AdminFeedbackPage() {
  const admin = createAdminClient()
  const { data: requests } = await admin
    .from('feature_requests')
    .select('*')
    .order('created_at', { ascending: false })

  const items = requests ?? []
  const open = items.filter(r => r.status === 'open').length

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900,
          fontSize: '2rem', letterSpacing: '0.04em', textTransform: 'uppercase',
          color: 'var(--text-primary)', marginBottom: '0.25rem',
        }}>
          Feature Requests
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {items.length} total · {open} open
        </p>
      </div>

      {items.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', padding: '2rem 0' }}>No feature requests yet.</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {items.map(item => {
            const s = STATUS_STYLES[item.status] ?? STATUS_STYLES.open
            return (
              <div key={item.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10, padding: '1.25rem 1.5rem',
              }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.75rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{item.title}</span>
                      {item.category && (
                        <span style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.05em', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '0.1rem 0.45rem', color: 'var(--text-muted)' }}>
                          {item.category}
                        </span>
                      )}
                      <span style={{ fontSize: '0.72rem', fontWeight: 700, background: s.bg, color: s.color, borderRadius: 5, padding: '0.15rem 0.55rem' }}>
                        {s.label}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      <span>{item.user_email ?? 'Unknown user'}</span>
                      <span>{fmtDate(item.created_at)}</span>
                      {item.priority && (
                        <span>{'⭐'.repeat(item.priority)} {PRIORITY_LABELS[item.priority]}</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: '0 0 1rem', whiteSpace: 'pre-wrap' }}>
                  {item.description}
                </p>

                {/* Action buttons */}
                <FRActions
                  requestId={item.id}
                  currentStatus={item.status}
                  userEmail={item.user_email ?? ''}
                  title={item.title}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
