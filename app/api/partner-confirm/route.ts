import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Called after email confirmation via emailRedirectTo
// URL: /api/partner-confirm?code=MOTORTREND2025
export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code')?.toUpperCase()
  if (!code) return NextResponse.redirect(new URL('/dashboard', req.url))

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', req.url))

  const admin = createAdminClient()

  // Look up partner code
  const { data: partner } = await admin
    .from('partner_codes')
    .select('id')
    .eq('code', code)
    .eq('active', true)
    .single()

  if (partner) {
    // Upsert partner signup record (idempotent)
    await admin.from('partner_signups').upsert({
      partner_code_id: partner.id,
      user_id: user.id,
      signed_up_at: new Date().toISOString(),
      payout_status: 'pending',
    }, { onConflict: 'user_id', ignoreDuplicates: true })
  }

  return NextResponse.redirect(new URL('/dashboard', req.url))
}
