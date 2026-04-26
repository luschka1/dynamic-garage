import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, emailLayout, emailButton } from '@/lib/email'

// Runs daily at 09:00 UTC
// Qualifies pending partner signups and handles 60/90-day inactivity

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const now = new Date()

  // ── 1. Qualify pending signups ──────────────────────────────────────────────
  const { data: pending } = await admin
    .from('partner_signups')
    .select('id, user_id, signed_up_at, partner_code_id')
    .eq('payout_status', 'pending')

  let qualified = 0
  let expired = 0

  for (const signup of pending ?? []) {
    const signedUp = new Date(signup.signed_up_at)
    const daysSince = (now.getTime() - signedUp.getTime()) / 86400000

    // Expired — 30 days passed without qualifying
    if (daysSince > 30) {
      await admin.from('partner_signups').update({ payout_status: 'expired' }).eq('id', signup.id)
      expired++
      continue
    }

    // Check qualification rules
    const [{ count: vehicleCount }, { count: activityCount }] = await Promise.all([
      admin.from('corvettes').select('id', { count: 'exact', head: true }).eq('user_id', signup.user_id),
      // At least one mod, service record, or document
      admin.from('mods').select('id', { count: 'exact', head: true }).eq('user_id', signup.user_id),
    ])

    let hasActivity = (activityCount ?? 0) > 0
    if (!hasActivity) {
      const { count: svcCount } = await admin.from('service_records').select('id', { count: 'exact', head: true }).eq('user_id', signup.user_id)
      hasActivity = (svcCount ?? 0) > 0
    }
    if (!hasActivity) {
      const { count: docCount } = await admin.from('documents').select('id', { count: 'exact', head: true }).eq('user_id', signup.user_id)
      hasActivity = (docCount ?? 0) > 0
    }

    if ((vehicleCount ?? 0) >= 1 && hasActivity) {
      await admin.from('partner_signups').update({
        payout_status: 'qualified',
        qualified_at: now.toISOString(),
      }).eq('id', signup.id)
      qualified++
    }
  }

  // ── 2. Inactivity checks on lifetime accounts ───────────────────────────────
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const lifetimeUsers = authUsers?.filter(u => u.user_metadata?.is_lifetime) ?? []

  let warned = 0
  let suspended = 0

  for (const user of lifetimeUsers) {
    const lastSignIn = user.last_sign_in_at ? new Date(user.last_sign_in_at) : new Date(user.created_at)
    const daysSinceLogin = (now.getTime() - lastSignIn.getTime()) / 86400000

    if (daysSinceLogin >= 90) {
      // Suspend — update partner signup record
      await admin.from('partner_signups')
        .update({ payout_status: 'suspended' })
        .eq('user_id', user.id)
        .eq('payout_status', 'qualified')
      suspended++
    } else if (daysSinceLogin >= 60 && daysSinceLogin < 61 && user.email) {
      // Warning email — only fires once around the 60-day mark
      await sendEmail({
        to: user.email,
        subject: '⚠️ Your Dynamic Garage Lifetime Membership — Action Required',
        htmlbody: emailLayout(`
          <h2 style="margin:0 0 12px;font-size:1.25rem;color:#111;font-weight:800;">Your lifetime membership needs attention</h2>
          <p style="margin:0 0 16px;color:#555;font-size:0.95rem;line-height:1.6;">
            We haven't seen you in a while. To keep your <strong>Lifetime Membership</strong> active,
            you need to log in at least once every 30 days and maintain at least one vehicle in your garage.
          </p>
          <p style="margin:0 0 20px;color:#555;font-size:0.95rem;line-height:1.6;">
            <strong style="color:#dc2626;">Your account will be suspended in approximately 30 days</strong> if you don't log back in.
          </p>
          ${emailButton('Log In & Keep My Membership', 'https://dynamicgarage.app/login')}
        `, 'You are receiving this because you hold a Lifetime Membership with Dynamic Garage.')
      })
      warned++
    }
  }

  console.log(`Partner qualify cron: qualified=${qualified}, expired=${expired}, warned=${warned}, suspended=${suspended}`)
  return NextResponse.json({ qualified, expired, warned, suspended })
}
