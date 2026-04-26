import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === process.env.ADMIN_EMAIL
}

// GET — list all partners with stats
export async function GET() {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const admin = createAdminClient()
  const { data: partners } = await admin
    .from('partner_codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (!partners) return NextResponse.json([])

  // Attach signup stats per partner
  const { data: signups } = await admin
    .from('partner_signups')
    .select('partner_code_id, payout_status')

  const stats: Record<string, Record<string, number>> = {}
  ;(signups ?? []).forEach(s => {
    if (!stats[s.partner_code_id]) stats[s.partner_code_id] = { total: 0, pending: 0, qualified: 0, paid: 0, expired: 0, suspended: 0 }
    stats[s.partner_code_id].total++
    stats[s.partner_code_id][s.payout_status] = (stats[s.partner_code_id][s.payout_status] ?? 0) + 1
  })

  const result = partners.map(p => ({ ...p, stats: stats[p.id] ?? { total: 0, pending: 0, qualified: 0, paid: 0, expired: 0, suspended: 0 } }))
  return NextResponse.json(result)
}

// POST — create partner
export async function POST(req: NextRequest) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { code, partner_name, logo_url, headline, subheadline, payout_rate } = await req.json()
  if (!code || !partner_name) return NextResponse.json({ error: 'code and partner_name required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin.from('partner_codes').insert({
    code: code.toUpperCase().replace(/\s+/g, ''),
    partner_name,
    logo_url: logo_url || null,
    headline: headline || 'Get Lifetime Access — Free',
    subheadline: subheadline || 'Sign up through this exclusive offer and never pay for Dynamic Garage.',
    payout_rate: payout_rate ?? 0,
    active: true,
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH — update partner (toggle active, update fields, mark signups paid)
export async function PATCH(req: NextRequest) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json()
  const { id, markPaidIds, ...fields } = body

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const admin = createAdminClient()

  // Mark specific signups as paid
  if (markPaidIds?.length) {
    await admin.from('partner_signups')
      .update({ payout_status: 'paid', paid_at: new Date().toISOString() })
      .in('id', markPaidIds)
  }

  // Update partner fields
  if (Object.keys(fields).length) {
    const { error } = await admin.from('partner_codes').update(fields).eq('id', id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
