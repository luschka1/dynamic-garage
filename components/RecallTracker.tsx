'use client'

import { useState } from 'react'
import { Bell, BellOff, AlertTriangle, CheckCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

interface Recall {
  NHTSACampaignNumber: string
  Component: string
  Summary: string
  Consequence: string
  Remedy: string
  ModelYear: string
  Make: string
  Model: string
}

interface Props {
  corvetteId: string
  vin: string
  initialAlerts: boolean
  initialLastCheck: string | null
  initialKnownIds: string[]
}

function formatDate(iso: string | null) {
  if (!iso) return null
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

async function fetchNHTSA(vin: string): Promise<Recall[]> {
  // Called directly from the browser — NHTSA has CORS open, server-side is blocked
  const res = await fetch(
    `https://api.nhtsa.gov/recalls/recallsByVIN/${encodeURIComponent(vin.trim())}`,
    { headers: { Accept: 'application/json' } }
  )
  if (!res.ok) throw new Error(`NHTSA returned ${res.status}`)
  const data = await res.json()
  return Array.isArray(data.results) ? data.results : []
}

export default function RecallTracker({ corvetteId, vin, initialAlerts, initialLastCheck, initialKnownIds }: Props) {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [lastCheck, setLastCheck] = useState<string | null>(initialLastCheck)
  const [recalls, setRecalls] = useState<Recall[] | null>(null)
  const [knownCount] = useState(initialKnownIds.length)
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [expanded, setExpanded] = useState(false)

  async function handleToggle() {
    setToggling(true)
    setError(null)
    const next = !alerts
    try {
      const res = await fetch('/api/recalls/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ corvetteId, enabled: next }),
      })
      if (!res.ok) throw new Error('Failed to save preference')
      setAlerts(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setToggling(false)
    }
  }

  async function handleCheck() {
    setLoading(true)
    setError(null)
    try {
      // Fetch directly from NHTSA in the browser (avoids server-side IP blocks)
      const fetched = await fetchNHTSA(vin)
      const ids = fetched.map(r => r.NHTSACampaignNumber)

      // Persist results to our DB
      await fetch('/api/recalls/store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ corvetteId, recallIds: ids }),
      })

      setRecalls(fetched)
      setLastCheck(new Date().toISOString())
      if (fetched.length > 0) setExpanded(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const displayCount = recalls !== null ? recalls.length : knownCount
  const hasRecalls = displayCount > 0
  const checked = lastCheck !== null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${hasRecalls && checked ? 'rgba(220,38,38,0.35)' : 'var(--border-subtle)'}`,
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: '1.5rem',
    }}>
      {/* Header row */}
      <div style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: hasRecalls && checked ? 'rgba(220,38,38,0.1)' : 'var(--bg-elevated)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {hasRecalls && checked
              ? <AlertTriangle size={18} color="var(--red)" />
              : <CheckCircle size={18} color="var(--green, #16a34a)" />}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              NHTSA Recall Alerts
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              {!checked
                ? 'Never checked — click Check Now to see open recalls'
                : hasRecalls
                  ? `${displayCount} open recall${displayCount !== 1 ? 's' : ''} · last checked ${formatDate(lastCheck)}`
                  : `No open recalls · last checked ${formatDate(lastCheck)}`}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
          {/* Check Now */}
          <button
            onClick={handleCheck}
            disabled={loading}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)', borderRadius: 6, padding: '0.4rem 0.75rem',
              fontSize: '0.78rem', fontWeight: 600, cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            <RefreshCw size={12} style={{ animation: loading ? 'spin 1s linear infinite' : 'none' }} />
            {loading ? 'Checking…' : 'Check Now'}
          </button>

          {/* Alert toggle */}
          <button
            onClick={handleToggle}
            disabled={toggling}
            title={alerts ? 'Disable weekly recall alerts' : 'Enable weekly recall alerts'}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
              background: alerts ? 'rgba(220,38,38,0.1)' : 'var(--bg-elevated)',
              border: `1px solid ${alerts ? 'rgba(220,38,38,0.3)' : 'var(--border-subtle)'}`,
              color: alerts ? 'var(--red)' : 'var(--text-muted)',
              borderRadius: 6, padding: '0.4rem 0.75rem',
              fontSize: '0.78rem', fontWeight: 600,
              cursor: toggling ? 'wait' : 'pointer',
              opacity: toggling ? 0.6 : 1,
            }}
          >
            {alerts ? <Bell size={12} /> : <BellOff size={12} />}
            {alerts ? 'Alerts On' : 'Alerts Off'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ margin: '0 1.5rem 1rem', padding: '0.6rem 0.9rem', background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)', borderRadius: 6, fontSize: '0.8rem', color: 'var(--red)' }}>
          {error}
        </div>
      )}

      {/* Recall list */}
      {recalls !== null && recalls.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              width: '100%', padding: '0.75rem 1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(220,38,38,0.04)', border: 'none', cursor: 'pointer',
              fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--red)',
            }}
          >
            <span>{recalls.length} Open Recall{recalls.length !== 1 ? 's' : ''}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <div style={{ padding: '0 1.5rem 1.25rem' }}>
              {recalls.map((r, i) => (
                <div key={r.NHTSACampaignNumber} style={{
                  paddingTop: '1rem', paddingBottom: '1rem',
                  borderTop: i > 0 ? '1px solid var(--border-subtle)' : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <AlertTriangle size={13} color="var(--red)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                        Campaign #{r.NHTSACampaignNumber}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                        · {r.Component}
                      </span>
                    </div>
                  </div>
                  {r.Summary && (
                    <p style={{ margin: '0 0 0.4rem 1.3rem', fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {r.Summary}
                    </p>
                  )}
                  {r.Remedy && (
                    <p style={{ margin: '0 0 0 1.3rem', fontSize: '0.82rem', color: '#16a34a', lineHeight: 1.5 }}>
                      <strong>Remedy:</strong> {r.Remedy}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* No recalls found after check */}
      {recalls !== null && recalls.length === 0 && (
        <div style={{ padding: '0 1.5rem 1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#16a34a', fontSize: '0.85rem', fontWeight: 600 }}>
            <CheckCircle size={14} />
            No open recalls found for this VIN.
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
