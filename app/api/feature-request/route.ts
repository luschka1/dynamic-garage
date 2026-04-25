import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Nice to have',
  2: 'Would use it',
  3: 'Really want it',
  4: 'Need it badly',
  5: "Can't live without it",
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, description, category, priority } = await req.json()
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 })
    }

    // Insert into Supabase
    const { error: dbErr } = await supabase.from('feature_requests').insert({
      user_id: user.id,
      user_email: user.email,
      title: title.trim(),
      description: description.trim(),
      category: category || null,
      priority: priority || null,
    })
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

    // Send notification email via ZeptoMail
    const adminEmail = process.env.NOTIFICATION_EMAIL ?? 'info@dynamicgarage.app'
    const priorityLabel = priority ? `${priority}/5 — ${PRIORITY_LABELS[priority]}` : 'Not rated'

    await fetch('https://api.zeptomail.ca/v1.1/email', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ZEPTOMAIL_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { address: 'info@dynamicgarage.app', name: 'Dynamic Garage' },
        to: [{ email_address: { address: adminEmail, name: 'Dynamic Garage Admin' } }],
        reply_to: user.email ? [{ address: user.email }] : undefined,
        subject: `💡 New Feature Request: ${title.trim()}`,
        htmlbody: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
            <div style="background: #111; padding: 24px 32px; border-radius: 8px 8px 0 0;">
              <span style="font-family: sans-serif; font-weight: 900; font-size: 1.1rem; letter-spacing: 0.04em; text-transform: uppercase;">
                <span style="color: #a8a8a8;">Dynamic</span><span style="color: #cc1f1f;"> Garage</span>
              </span>
              <div style="margin-top: 6px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #ca8a04;">💡 Feature Request</div>
            </div>
            <div style="background: #fff; border: 1px solid #e8e8e8; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
              <h2 style="margin: 0 0 8px; font-size: 1.4rem; color: #111;">${title.trim()}</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px; margin-top: 16px;">
                <tr><td style="padding: 7px 0; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; width: 90px; vertical-align: top;">From</td><td style="padding: 7px 0; font-size: 0.92rem; color: #111;">${user.email ?? 'Unknown'}</td></tr>
                ${category ? `<tr><td style="padding: 7px 0; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; vertical-align: top;">Category</td><td style="padding: 7px 0; font-size: 0.92rem; color: #111;">${category}</td></tr>` : ''}
                <tr><td style="padding: 7px 0; font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; vertical-align: top;">Priority</td><td style="padding: 7px 0; font-size: 0.92rem; color: #111;">${priorityLabel}</td></tr>
              </table>
              <div style="background: #f8f8f8; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; margin-bottom: 10px;">Description</div>
                <p style="margin: 0; font-size: 0.95rem; color: #333; line-height: 1.7; white-space: pre-wrap;">${description.trim()}</p>
              </div>
              <a href="https://supabase.com/dashboard/project/_/editor" style="display: inline-block; background: #111; color: #fff; padding: 10px 22px; border-radius: 6px; font-size: 0.875rem; font-weight: 700; text-decoration: none; letter-spacing: 0.04em;">View in Supabase →</a>
            </div>
            <p style="text-align: center; font-size: 0.75rem; color: #aaa; margin-top: 16px;">Sent via dynamicgarage.app feature request form</p>
          </div>
        `,
      }),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Feature request API error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
