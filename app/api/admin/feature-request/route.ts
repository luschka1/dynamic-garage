import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const STATUS_COPY: Record<string, { subject: string; headline: string; body: string; color: string }> = {
  will_do: {
    subject: '✅ Your feature request is on the roadmap!',
    headline: "Good news — it's happening.",
    body: "Your feature request has been reviewed and added to the roadmap. We'll build it in an upcoming release.",
    color: '#16a34a',
  },
  maybe: {
    subject: '🤔 Your feature request is under consideration',
    headline: "We're thinking about it.",
    body: "Your feature request has been reviewed and is under consideration. It's not on the roadmap yet, but it's on our radar.",
    color: '#ca8a04',
  },
  no: {
    subject: 'Your feature request — an update',
    headline: "We won't be building this one.",
    body: "After reviewing your request, we've decided not to pursue this one right now. It doesn't quite fit the current direction of Dynamic Garage, but we appreciate you taking the time to share it.",
    color: '#6b7280',
  },
  done: {
    subject: "🚀 Your feature request has shipped!",
    headline: "It's live!",
    body: "Great news — the feature you requested has been built and is now live in Dynamic Garage. Go check it out!",
    color: '#8b5cf6',
  },
}

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === process.env.ADMIN_EMAIL
}

// PATCH — update status + notify user
export async function PATCH(req: NextRequest) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { requestId, status, userEmail, title } = await req.json()
  if (!requestId || !status) return NextResponse.json({ error: 'requestId and status required' }, { status: 400 })

  // Update in DB
  const admin = createAdminClient()
  const { error: dbErr } = await admin
    .from('feature_requests')
    .update({ status })
    .eq('id', requestId)
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

  // Email the user if we have their email and there's copy for this status
  const copy = STATUS_COPY[status]
  if (userEmail && copy) {
    await fetch('https://api.zeptomail.ca/v1.1/email', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ZEPTOMAIL_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { address: 'info@dynamicgarage.app', name: 'Dynamic Garage' },
        to: [{ email_address: { address: userEmail } }],
        subject: copy.subject,
        htmlbody: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
            <div style="background: #111; padding: 24px 32px; border-radius: 8px 8px 0 0;">
              <span style="font-family: sans-serif; font-weight: 900; font-size: 1.1rem; letter-spacing: 0.04em; text-transform: uppercase;">
                <span style="color: #a8a8a8;">Dynamic</span><span style="color: #cc1f1f;"> Garage</span>
              </span>
            </div>
            <div style="background: #fff; border: 1px solid #e8e8e8; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
              <div style="display: inline-block; background: ${copy.color}18; border: 1px solid ${copy.color}40; color: ${copy.color}; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; border-radius: 5px; padding: 0.25rem 0.6rem; margin-bottom: 16px;">Feature Request Update</div>
              <h2 style="margin: 0 0 8px; font-size: 1.4rem; color: #111;">${copy.headline}</h2>
              <p style="margin: 0 0 24px; font-size: 0.95rem; color: #555; line-height: 1.7;">${copy.body}</p>
              <div style="background: #f8f8f8; border-radius: 6px; padding: 16px 20px; margin-bottom: 28px; border-left: 3px solid ${copy.color};">
                <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; margin-bottom: 6px;">Your request</div>
                <p style="margin: 0; font-size: 0.95rem; color: #333; font-weight: 600;">${title}</p>
              </div>
              <a href="https://dynamicgarage.app/feedback" style="display: inline-block; background: #111; color: #fff; padding: 10px 22px; border-radius: 6px; font-size: 0.875rem; font-weight: 700; text-decoration: none; letter-spacing: 0.04em;">View your requests →</a>
            </div>
            <p style="text-align: center; font-size: 0.75rem; color: #aaa; margin-top: 16px;">Dynamic Garage · dynamicgarage.app</p>
          </div>
        `,
      }),
    })
  }

  return NextResponse.json({ ok: true })
}
