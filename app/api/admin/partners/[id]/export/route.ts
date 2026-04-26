import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === process.env.ADMIN_EMAIL
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const admin = createAdminClient()

  const { data: partner } = await admin.from('partner_codes').select('code, partner_name, payout_rate').eq('id', id).single()
  if (!partner) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { data: signups } = await admin
    .from('partner_signups')
    .select('id, user_id, signed_up_at, qualified_at, payout_status, paid_at')
    .eq('partner_code_id', id)
    .order('signed_up_at', { ascending: false })

  // Fetch user emails
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const emailById: Record<string, string> = {}
  authUsers?.forEach(u => { if (u.email) emailById[u.id] = u.email })

  const rows = (signups ?? []).map(s => ({
    email: emailById[s.user_id] ?? s.user_id,
    signed_up_at: s.signed_up_at ? new Date(s.signed_up_at).toLocaleDateString() : '',
    qualified_at: s.qualified_at ? new Date(s.qualified_at).toLocaleDateString() : '',
    payout_status: s.payout_status,
    payout_amount: s.payout_status === 'qualified' || s.payout_status === 'paid' ? partner.payout_rate : 0,
    paid_at: s.paid_at ? new Date(s.paid_at).toLocaleDateString() : '',
    signup_id: s.id,
  }))

  const headers = ['Email', 'Signed Up', 'Qualified', 'Status', 'Payout $', 'Paid Date', 'Signup ID']
  const csvRows = [
    headers.join(','),
    ...rows.map(r => [
      `"${r.email}"`, r.signed_up_at, r.qualified_at,
      r.payout_status, r.payout_amount, r.paid_at, r.signup_id,
    ].join(',')),
  ]

  const csv = csvRows.join('\n')
  const filename = `${partner.code}-signups-${new Date().toISOString().split('T')[0]}.csv`

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
