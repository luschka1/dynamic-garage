import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { calcInsuranceSummary } from '@/lib/insurance'
import { sendEmail, emailLayout } from '@/lib/email'
import type { Mod } from '@/lib/types'

// Runs daily at 08:00 UTC (3am EST / 4am EDT)
// Finds vehicles whose insurance_expiry_date is exactly 7 days from today
// Vercel sends Authorization: Bearer $CRON_SECRET

async function sendReminderEmail(
  toAddress: string,
  vehicles: Array<{
    nickname: string
    year: number
    model: string
    percentage: number
    readyCount: number
    totalMods: number
    incompleteCount: number
    corvetteId: string
    expiryDate: string
  }>
) {
  // Format the expiry date for display — all vehicles in one email share the same expiry date
  const expiryFormatted = new Date(vehicles[0].expiryDate + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const vehicleRows = vehicles.map(v => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
        <div style="font-weight:700;color:#111;margin-bottom:2px;">${v.year} ${v.model} — ${v.nickname}</div>
        <div style="font-size:0.82rem;color:#555;">
          ${v.readyCount} of ${v.totalMods} mods insurance-ready
          ${v.incompleteCount > 0
            ? `<span style="color:#dc2626;font-weight:600;"> · ${v.incompleteCount} mod${v.incompleteCount !== 1 ? 's' : ''} need attention</span>`
            : '<span style="color:#16a34a;font-weight:600;"> · Fully documented</span>'}
        </div>
      </td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;white-space:nowrap;">
        <span style="font-size:1.1rem;font-weight:900;color:${v.percentage === 100 ? '#16a34a' : v.percentage >= 50 ? '#d97706' : '#dc2626'};">
          ${v.percentage}%
        </span>
      </td>
      <td style="padding:10px 0 10px 12px;border-bottom:1px solid #f0f0f0;white-space:nowrap;">
        <a href="https://dynamicgarage.app/corvettes/${v.corvetteId}/insurance" style="display:inline-block;background:${v.percentage < 100 ? '#cc1f1f' : '#f5f5f3'};color:${v.percentage < 100 ? '#fff' : '#111'};padding:5px 14px;border-radius:5px;font-size:0.8rem;font-weight:700;text-decoration:none;">
          ${v.percentage < 100 ? 'Complete →' : 'View Package'}
        </a>
      </td>
    </tr>`).join('')

  const htmlbody = emailLayout(`
    <h2 style="margin:0 0 8px;font-size:1.25rem;color:#111;font-weight:800;">🛡️ Your insurance renews in 7 days</h2>
    <p style="margin:0 0 4px;color:#555;font-size:0.95rem;line-height:1.6;">
      <strong style="color:#111;">Renewal date: ${expiryFormatted}</strong>
    </p>
    <p style="margin:0 0 20px;color:#555;font-size:0.95rem;line-height:1.6;">
      Make sure your modifications are fully documented before you renew.
      Mods without a declared replacement value and receipt typically <strong>aren't covered</strong> on a claim.
    </p>
    <table style="width:100%;border-collapse:collapse;">
      <thead>
        <tr style="background:#f8f8f8;">
          <th style="text-align:left;padding:8px 0;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#999;border-bottom:2px solid #e8e8e8;">Vehicle</th>
          <th style="text-align:right;padding:8px 0;font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:#999;border-bottom:2px solid #e8e8e8;">Ready</th>
          <th style="padding:8px 0 8px 12px;border-bottom:2px solid #e8e8e8;"></th>
        </tr>
      </thead>
      <tbody>${vehicleRows}</tbody>
    </table>
    <div style="margin-top:24px;padding:16px;background:#fff8f0;border:1px solid #f59e0b;border-radius:8px;font-size:0.85rem;color:#92400e;line-height:1.6;">
      <strong>Why this matters:</strong> A documented modification with a declared replacement value and receipt is covered by your insurer. One without documentation usually isn't — and you absorb the loss on a claim.
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="https://dynamicgarage.app/dashboard" style="display:inline-block;background:#cc1f1f;color:#fff;padding:12px 28px;border-radius:8px;font-size:0.875rem;font-weight:800;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">
        Review My Documentation
      </a>
    </div>
  `, "You're receiving this because your insurance renewal date is saved on your vehicle. To stop these reminders, remove the expiry date from your vehicle settings.")

  await sendEmail({
    to: toAddress,
    subject: `🛡️ Insurance renews in 7 days — are your mods documented?`,
    htmlbody,
  })
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Target date = exactly 7 days from today
  const target = new Date()
  target.setDate(target.getDate() + 7)
  const targetDate = target.toISOString().split('T')[0] // YYYY-MM-DD

  // Find all corvettes with insurance expiring on the target date
  const { data: cars } = await supabase
    .from('corvettes')
    .select('id, user_id, nickname, year, model, insurance_expiry_date')
    .eq('insurance_expiry_date', targetDate)
    .order('user_id')

  if (!cars || cars.length === 0) {
    console.log(`Insurance reminder cron: no vehicles expiring on ${targetDate}`)
    return NextResponse.json({ sent: 0, targetDate })
  }

  // Get user emails
  const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const emailByUserId: Record<string, string> = {}
  authUsers?.forEach(u => { if (u.email) emailByUserId[u.id] = u.email })

  // Get all mods for matching cars
  const carIds = cars.map(c => c.id)
  const { data: allMods } = await supabase.from('mods').select('*').in('corvette_id', carIds)
  const modsByCar: Record<string, Mod[]> = {}
  ;(allMods ?? []).forEach(m => {
    modsByCar[m.corvette_id] = [...(modsByCar[m.corvette_id] ?? []), m as Mod]
  })

  // Get receipt docs
  const allModIds = (allMods ?? []).map(m => m.id)
  const { data: allDocs } = allModIds.length > 0
    ? await supabase.from('documents').select('mod_id').in('mod_id', allModIds)
    : { data: [] }
  const receiptModIds = new Set<string>(
    (allDocs ?? []).map((d: { mod_id: string }) => d.mod_id).filter(Boolean)
  )

  // Group by user
  const userVehicles: Record<string, typeof cars> = {}
  cars.forEach(c => {
    if (!userVehicles[c.user_id]) userVehicles[c.user_id] = []
    userVehicles[c.user_id].push(c)
  })

  let sent = 0

  for (const [userId, vehicles] of Object.entries(userVehicles)) {
    const email = emailByUserId[userId]
    if (!email) continue

    const vehicleSummaries = vehicles.map(v => {
      const mods = modsByCar[v.id] ?? []
      const summary = calcInsuranceSummary(mods, receiptModIds)
      return {
        nickname: v.nickname,
        year: v.year,
        model: v.model,
        corvetteId: v.id,
        expiryDate: v.insurance_expiry_date as string,
        percentage: summary.percentage,
        readyCount: summary.readyCount,
        totalMods: summary.totalMods,
        incompleteCount: summary.totalMods - summary.readyCount,
      }
    })

    try {
      await sendReminderEmail(email, vehicleSummaries)
      sent++
      await new Promise(r => setTimeout(r, 200))
    } catch (err) {
      console.error(`Insurance reminder failed for ${userId}:`, err)
    }
  }

  console.log(`Insurance reminder cron: sent=${sent}, targetDate=${targetDate}`)
  return NextResponse.json({ sent, targetDate })
}
