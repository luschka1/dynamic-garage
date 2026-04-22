import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { fetchRecallsByVIN, NHTSARecall } from '@/lib/nhtsa'

// Runs Monday 2am EST (07:00 UTC) via Vercel Cron
// Vercel sends Authorization: Bearer $CRON_SECRET

async function sendRecallEmail(
  toAddress: string,
  nickname: string,
  year: number,
  model: string,
  newRecalls: NHTSARecall[],
) {
  const list = newRecalls
    .map(r => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
          <div style="font-weight:700;color:#111;margin-bottom:4px;">${r.NHTSACampaignNumber}</div>
          <div style="font-size:0.85rem;color:#555;margin-bottom:4px;">${r.Component}</div>
          <div style="font-size:0.85rem;color:#333;line-height:1.5;">${r.Summary || 'No summary available.'}</div>
          ${r.Remedy ? `<div style="margin-top:6px;font-size:0.8rem;color:#16a34a;"><strong>Remedy:</strong> ${r.Remedy}</div>` : ''}
        </td>
      </tr>`)
    .join('')

  const htmlbody = `
    <div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;color:#111;">
      <div style="background:#111;padding:24px 32px;border-radius:8px 8px 0 0;">
        <span style="font-family:sans-serif;font-weight:900;font-size:1.1rem;letter-spacing:0.04em;text-transform:uppercase;">
          <span style="color:#a8a8a8;">Dynamic</span><span style="color:#cc1f1f;"> Garage</span>
        </span>
      </div>
      <div style="background:#fff;border:1px solid #e8e8e8;border-top:none;padding:32px;border-radius:0 0 8px 8px;">
        <h2 style="margin:0 0 6px;font-size:1.3rem;color:#111;">
          ⚠️ ${newRecalls.length} New Recall${newRecalls.length !== 1 ? 's' : ''} Found
        </h2>
        <p style="margin:0 0 24px;color:#555;font-size:0.95rem;">
          We found new open recall${newRecalls.length !== 1 ? 's' : ''} for your <strong>${year} ${model} — ${nickname}</strong>.
        </p>
        <table style="width:100%;border-collapse:collapse;">${list}</table>
        <div style="margin-top:28px;padding:16px;background:#fff8f8;border:1px solid #fee2e2;border-radius:8px;font-size:0.85rem;color:#991b1b;line-height:1.6;">
          Contact your nearest authorized dealer to schedule the recall remedy at no charge.
        </div>
        <a href="https://dynamicgarage.app/dashboard"
           style="display:inline-block;margin-top:24px;background:#cc1f1f;color:#fff;padding:10px 22px;border-radius:6px;font-size:0.875rem;font-weight:700;text-decoration:none;letter-spacing:0.04em;">
          View in My Garage
        </a>
      </div>
      <p style="text-align:center;font-size:0.75rem;color:#aaa;margin-top:16px;">
        You're receiving this because recall alerts are enabled for this vehicle in Dynamic Garage.<br>
        You can turn them off from the vehicle settings page.
      </p>
    </div>`

  const res = await fetch('https://api.zeptomail.ca/v1.1/email', {
    method: 'POST',
    headers: {
      'Authorization': process.env.ZEPTOMAIL_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: { address: 'info@dynamicgarage.app', name: 'Dynamic Garage' },
      to: [{ email_address: { address: toAddress } }],
      subject: `⚠️ ${newRecalls.length} New Recall${newRecalls.length !== 1 ? 's' : ''} — ${year} ${model} (${nickname})`,
      htmlbody,
    }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    console.error('ZeptoMail recall email error:', JSON.stringify(body))
  }
}

export async function GET(req: NextRequest) {
  // Verify cron secret
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Fetch all vehicles with recall_alerts = true and a VIN
  const { data: cars, error } = await supabase
    .from('corvettes')
    .select('id, user_id, nickname, year, model, vin, known_recall_ids')
    .eq('recall_alerts', true)
    .not('vin', 'is', null)
    .neq('vin', '')

  if (error) {
    console.error('Recall cron: DB error fetching vehicles', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!cars || cars.length === 0) {
    return NextResponse.json({ checked: 0, emailed: 0 })
  }

  // Fetch user emails via auth admin API
  const { data: { users: authUsers } } = await supabase.auth.admin.listUsers({ perPage: 1000 })
  const emailByUserId: Record<string, string> = {}
  authUsers?.forEach(u => { if (u.email) emailByUserId[u.id] = u.email })

  let checked = 0
  let emailed = 0

  for (const car of cars) {
    try {
      const recalls = await fetchRecallsByVIN(car.vin as string)
      const currentIds = recalls.map(r => r.NHTSACampaignNumber)
      const knownIds: string[] = car.known_recall_ids ?? []

      const newIds = currentIds.filter(id => !knownIds.includes(id))
      const newRecalls = recalls.filter(r => newIds.includes(r.NHTSACampaignNumber))

      // Always update the check timestamp and known IDs
      await supabase
        .from('corvettes')
        .update({
          last_recall_check: new Date().toISOString(),
          known_recall_ids: currentIds,
        })
        .eq('id', car.id)

      checked++

      if (newRecalls.length > 0) {
        const email = emailByUserId[car.user_id]
        if (email) {
          await sendRecallEmail(email, car.nickname, car.year, car.model, newRecalls)
          emailed++
        }
      }

      // Small delay to avoid hammering NHTSA
      await new Promise(r => setTimeout(r, 300))
    } catch (err) {
      console.error(`Recall check failed for vehicle ${car.id}:`, err)
    }
  }

  console.log(`Recall cron complete: checked=${checked}, emailed=${emailed}`)
  return NextResponse.json({ checked, emailed })
}
