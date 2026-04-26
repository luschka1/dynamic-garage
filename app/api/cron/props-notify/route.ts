import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, emailLayout, emailButton, emailBadge } from '@/lib/email'

// Runs every Monday 08:30 UTC via Vercel Cron
// Notifies vehicle owners who received 3+ new Props in the past 7 days
// Only sends once per vehicle per week (tracked via props_notified_at)

const PROPS_THRESHOLD = 3
const WINDOW_DAYS = 7

export async function GET(req: NextRequest) {
  // Verify Vercel cron secret
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const windowStart = new Date(Date.now() - WINDOW_DAYS * 86400000).toISOString()

  // Find vehicles that have received props in the last 7 days
  // grouped by corvette_id, only where count >= threshold
  const { data: propGroups, error: pgErr } = await admin
    .from('build_props')
    .select('corvette_id')
    .gte('created_at', windowStart)

  if (pgErr) {
    console.error('props-notify: fetch error', pgErr)
    return NextResponse.json({ error: pgErr.message }, { status: 500 })
  }

  if (!propGroups || propGroups.length === 0) {
    return NextResponse.json({ ok: true, notified: 0, message: 'No recent props' })
  }

  // Aggregate counts per corvette
  const countMap: Record<string, number> = {}
  for (const row of propGroups) {
    countMap[row.corvette_id] = (countMap[row.corvette_id] ?? 0) + 1
  }

  // Filter to vehicles meeting threshold
  const eligibleIds = Object.entries(countMap)
    .filter(([, count]) => count >= PROPS_THRESHOLD)
    .map(([id]) => id)

  if (eligibleIds.length === 0) {
    return NextResponse.json({ ok: true, notified: 0, message: `No vehicles reached ${PROPS_THRESHOLD} props threshold` })
  }

  // Fetch those vehicles — skip any notified within the last 7 days
  const { data: vehicles, error: vErr } = await admin
    .from('corvettes')
    .select('id, user_id, nickname, year, model, props_count, props_notified_at')
    .in('id', eligibleIds)
    .or(`props_notified_at.is.null,props_notified_at.lt.${windowStart}`)

  if (vErr) {
    console.error('props-notify: vehicle fetch error', vErr)
    return NextResponse.json({ error: vErr.message }, { status: 500 })
  }

  if (!vehicles || vehicles.length === 0) {
    return NextResponse.json({ ok: true, notified: 0, message: 'All eligible vehicles already notified this week' })
  }

  // Gather user emails via admin auth
  const userIds = [...new Set(vehicles.map(v => v.user_id))]
  const emailMap: Record<string, string> = {}

  await Promise.all(
    userIds.map(async uid => {
      try {
        const { data: { user } } = await admin.auth.admin.getUserById(uid)
        if (user?.email) emailMap[uid] = user.email
      } catch {
        // skip
      }
    })
  )

  let notified = 0
  const errors: string[] = []
  const now = new Date().toISOString()

  for (const vehicle of vehicles) {
    const email = emailMap[vehicle.user_id]
    if (!email) continue

    const newProps = countMap[vehicle.id] ?? 0
    const shareUrl = `https://dynamicgarage.app/share/${vehicle.user_id}/${vehicle.id}`

    const html = emailLayout(
      `
      ${emailBadge('Community Props', '#f97316')}

      <h2 style="margin:0 0 8px;font-size:1.35rem;font-weight:900;color:#111;letter-spacing:-0.01em;">
        🔥 Your build is getting noticed!
      </h2>
      <p style="margin:0 0 24px;color:#555;font-size:0.95rem;line-height:1.6;">
        <strong>${vehicle.year} ${vehicle.nickname}</strong> received
        <strong style="color:#f97316;">${newProps} Props</strong> from the community this week.
        You now have a total of <strong>${vehicle.props_count ?? newProps} Props</strong> on this build.
      </p>

      <div style="background:#fff8f0;border:1px solid #fed7aa;border-radius:10px;padding:20px 24px;margin:0 0 24px;text-align:center;">
        <div style="font-size:2.5rem;margin-bottom:6px;">🔥</div>
        <div style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:2rem;font-weight:900;color:#f97316;letter-spacing:-0.02em;">
          ${vehicle.props_count ?? newProps} Props
        </div>
        <div style="font-size:0.8rem;color:#9a5c1a;margin-top:4px;font-weight:600;letter-spacing:0.04em;text-transform:uppercase;">
          All-time community votes
        </div>
      </div>

      <p style="margin:0 0 8px;color:#555;font-size:0.88rem;line-height:1.6;">
        Props are votes from verified community members who want to recognize outstanding builds.
        Keep adding mods, photos, and service records to climb the leaderboard.
      </p>

      ${emailButton('View My Build', shareUrl)}
      `,
      'You\'re receiving this because members gave Props to your build. Manage notifications in your account settings.'
    )

    try {
      await sendEmail({
        to: email,
        subject: `🔥 Your build got ${newProps} Props this week`,
        htmlbody: html,
      })

      // Mark notified
      await admin
        .from('corvettes')
        .update({ props_notified_at: now })
        .eq('id', vehicle.id)

      notified++
    } catch (err) {
      console.error(`props-notify: failed for vehicle ${vehicle.id}:`, err)
      errors.push(vehicle.id)
    }
  }

  return NextResponse.json({
    ok: true,
    notified,
    skipped: vehicles.length - notified,
    errors: errors.length ? errors : undefined,
  })
}
