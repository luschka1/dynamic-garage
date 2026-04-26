import { createAdminClient } from '@/lib/supabase/admin'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import CreatePartnerForm from './CreatePartnerForm'
import PartnerRow from './PartnerRow'

export default async function PartnersAdminPage() {
  const admin = createAdminClient()

  const { data: partners } = await admin
    .from('partner_codes')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: signups } = await admin
    .from('partner_signups')
    .select('partner_code_id, payout_status, payout_rate:partner_codes(payout_rate)')

  // Build stats per partner
  const stats: Record<string, { total: number; qualified: number; paid: number; pending: number; expired: number; suspended: number; pendingPayout: number }> = {}
  ;(partners ?? []).forEach(p => {
    stats[p.id] = { total: 0, qualified: 0, paid: 0, pending: 0, expired: 0, suspended: 0, pendingPayout: 0 }
  })
  ;(signups ?? []).forEach((s: any) => {
    if (!stats[s.partner_code_id]) return
    stats[s.partner_code_id].total++
    stats[s.partner_code_id][s.payout_status as string] = (stats[s.partner_code_id][s.payout_status as string] ?? 0) + 1
    if (s.payout_status === 'qualified') {
      stats[s.partner_code_id].pendingPayout += Number(s.payout_rate?.payout_rate ?? 0)
    }
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="page-eyebrow">Partner Program</p>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: '2.5rem', fontWeight: 900, lineHeight: 1 }}>PARTNERS</h1>
        </div>
      </div>

      {/* Create form */}
      <CreatePartnerForm />

      {/* Partner list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        {(!partners || partners.length === 0) && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No partners yet. Create your first one above.
          </div>
        )}
        {(partners ?? []).map(p => (
          <PartnerRow key={p.id} partner={p} stats={stats[p.id]} />
        ))}
      </div>
    </div>
  )
}
