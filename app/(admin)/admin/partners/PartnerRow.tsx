'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, Download, ToggleLeft, ToggleRight, ChevronRight } from 'lucide-react'

interface Stats { total: number; qualified: number; paid: number; pending: number; expired: number; suspended: number; pendingPayout: number }

export default function PartnerRow({ partner, stats }: { partner: any; stats: Stats }) {
  const router = useRouter()
  const [toggling, setToggling] = useState(false)

  async function toggleActive() {
    setToggling(true)
    await fetch('/api/admin/partners', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: partner.id, active: !partner.active }),
    })
    router.refresh()
    setToggling(false)
  }

  const signupUrl = `https://dynamicgarage.app/join/${partner.code}`

  return (
    <div style={{ background: 'var(--bg-card)', border: `1px solid ${partner.active ? 'var(--border-subtle)' : 'var(--border-default)'}`, borderRadius: 12, padding: '1.25rem 1.5rem', opacity: partner.active ? 1 : 0.6 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>

        {/* Left: identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {partner.logo_url && (
            <img src={partner.logo_url} alt={partner.partner_name} style={{ height: 32, objectFit: 'contain', maxWidth: 80, borderRadius: 4 }} />
          )}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.2rem' }}>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.2rem', fontWeight: 900, letterSpacing: '0.04em', color: 'var(--text-primary)' }}>{partner.partner_name}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', background: 'var(--bg-base)', border: '1px solid var(--border-default)', borderRadius: 4, padding: '0.15rem 0.5rem', color: 'var(--text-muted)' }}>{partner.code}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 10, background: partner.active ? 'rgba(22,163,74,0.12)' : 'var(--bg-elevated)', color: partner.active ? '#16a34a' : 'var(--text-muted)', border: `1px solid ${partner.active ? 'rgba(22,163,74,0.25)' : 'var(--border-default)'}` }}>
                {partner.active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <a href={signupUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              {signupUrl} <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <a href={`/api/admin/partners/${partner.id}/export`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.5rem 0.85rem', border: '1px solid var(--border-default)', borderRadius: 7, background: 'var(--bg-base)' }}>
            <Download size={13} /> Export CSV
          </a>
          <Link href={`/admin/partners/${partner.id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textDecoration: 'none', padding: '0.5rem 0.85rem', border: '1px solid var(--border-default)', borderRadius: 7, background: 'var(--bg-base)' }}>
            Signups <ChevronRight size={13} />
          </Link>
          <button onClick={toggleActive} disabled={toggling} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', fontWeight: 700, color: partner.active ? '#dc2626' : '#16a34a', padding: '0.5rem 0.85rem', border: `1px solid ${partner.active ? 'rgba(220,38,38,0.3)' : 'rgba(22,163,74,0.3)'}`, borderRadius: 7, background: 'var(--bg-base)', cursor: 'pointer' }}>
            {partner.active ? <><ToggleRight size={14} /> Disable</> : <><ToggleLeft size={14} /> Enable</>}
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Signups', value: stats?.total ?? 0, color: 'var(--text-primary)' },
          { label: 'Pending', value: stats?.pending ?? 0, color: 'var(--text-secondary)' },
          { label: 'Qualified', value: stats?.qualified ?? 0, color: '#16a34a' },
          { label: 'Paid', value: stats?.paid ?? 0, color: '#6366f1' },
          { label: 'Expired', value: stats?.expired ?? 0, color: 'var(--text-muted)' },
          { label: 'Payout Due', value: `$${((stats?.pendingPayout ?? 0)).toFixed(2)}`, color: '#f59e0b' },
          { label: 'Rate / Signup', value: `$${Number(partner.payout_rate).toFixed(2)}`, color: 'var(--text-secondary)' },
        ].map(s => (
          <div key={s.label}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>{s.label}</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.4rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
