import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'
import MarkPaidButton from './MarkPaidButton'

const STATUS_COLORS: Record<string, string> = {
  pending: '#6366f1', qualified: '#16a34a', paid: '#8b5cf6', expired: '#6b7280', suspended: '#dc2626',
}

export default async function PartnerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: partner } = await admin.from('partner_codes').select('*').eq('id', id).single()
  if (!partner) notFound()

  const { data: signups } = await admin
    .from('partner_signups')
    .select('*')
    .eq('partner_code_id', id)
    .order('signed_up_at', { ascending: false })

  // Get user emails
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const emailById: Record<string, string> = {}
  authUsers?.forEach(u => { if (u.email) emailById[u.id] = u.email })

  const qualifiedUnpaid = (signups ?? []).filter(s => s.payout_status === 'qualified').map(s => s.id)
  const totalOwed = qualifiedUnpaid.length * Number(partner.payout_rate)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link href="/admin/partners" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
          <ArrowLeft size={14} /> Partners
        </Link>
        <div style={{ flex: 1 }}>
          <p className="page-eyebrow">Partner Detail</p>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: '2.2rem', fontWeight: 900, lineHeight: 1 }}>{partner.partner_name.toUpperCase()}</h1>
        </div>
        <a href={`/api/admin/partners/${id}/export`} className="btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <Download size={14} /> Export CSV
        </a>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Signups', value: signups?.length ?? 0 },
          { label: 'Qualified', value: (signups ?? []).filter(s => s.payout_status === 'qualified').length, color: '#16a34a' },
          { label: 'Paid', value: (signups ?? []).filter(s => s.payout_status === 'paid').length, color: '#8b5cf6' },
          { label: 'Pending', value: (signups ?? []).filter(s => s.payout_status === 'pending').length },
          { label: 'Rate / Signup', value: `$${Number(partner.payout_rate).toFixed(2)}` },
          { label: 'Owed Now', value: `$${totalOwed.toFixed(2)}`, color: '#f59e0b' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{c.label}</div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.8rem', fontWeight: 900, color: c.color ?? 'var(--text-primary)', lineHeight: 1 }}>{c.value}</div>
          </div>
        ))}
      </div>

      {/* Mark all qualified as paid */}
      {qualifiedUnpaid.length > 0 && (
        <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{qualifiedUnpaid.length} qualified signup{qualifiedUnpaid.length !== 1 ? 's' : ''} awaiting payment</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total owed: <strong style={{ color: '#f59e0b' }}>${totalOwed.toFixed(2)}</strong></div>
          </div>
          <MarkPaidButton partnerId={id} signupIds={qualifiedUnpaid} />
        </div>
      )}

      {/* Signups table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border-subtle)' }}>
              {['Email', 'Signed Up', 'Qualified', 'Status', 'Payout'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(signups ?? []).map((s, i) => (
              <tr key={s.id} style={{ borderBottom: i < (signups?.length ?? 0) - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-primary)', fontWeight: 500 }}>{emailById[s.user_id] ?? '—'}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{new Date(s.signed_up_at).toLocaleDateString()}</td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>{s.qualified_at ? new Date(s.qualified_at).toLocaleDateString() : '—'}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '0.2rem 0.6rem', borderRadius: 10, background: `${STATUS_COLORS[s.payout_status]}18`, color: STATUS_COLORS[s.payout_status], border: `1px solid ${STATUS_COLORS[s.payout_status]}30`, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {s.payout_status}
                  </span>
                </td>
                <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                  {s.payout_status === 'paid' ? <span style={{ color: '#8b5cf6', fontWeight: 700 }}>${Number(partner.payout_rate).toFixed(2)} paid {s.paid_at ? new Date(s.paid_at).toLocaleDateString() : ''}</span>
                    : s.payout_status === 'qualified' ? <span style={{ color: '#f59e0b', fontWeight: 700 }}>${Number(partner.payout_rate).toFixed(2)} owed</span>
                    : '—'}
                </td>
              </tr>
            ))}
            {(!signups || signups.length === 0) && (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No signups yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
