import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendEmail, emailLayout, emailButton, emailBadge, emailQuote } from '@/lib/email'

const STATUS_COPY: Record<string, { badge: string; badgeColor: string; headline: string; body: string }> = {
  will_do: {
    badge: 'On the Roadmap',
    badgeColor: '#16a34a',
    headline: "Good news — it's happening.",
    body: "Your feature request has been reviewed and added to the roadmap. We'll build it in an upcoming release.",
  },
  maybe: {
    badge: 'Under Consideration',
    badgeColor: '#ca8a04',
    headline: "We're thinking about it.",
    body: "Your feature request has been reviewed and is under consideration. It's not on the roadmap yet, but it's on our radar.",
  },
  no: {
    badge: 'Not Planned',
    badgeColor: '#6b7280',
    headline: "We won't be building this one.",
    body: "After reviewing your request, we've decided not to pursue this one right now. It doesn't quite fit the current direction of Dynamic Garage, but we appreciate you taking the time to share it.",
  },
  done: {
    badge: 'Shipped!',
    badgeColor: '#8b5cf6',
    headline: "It's live!",
    body: "Great news — the feature you requested has been built and is now live in Dynamic Garage. Go check it out!",
  },
}

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.email === process.env.ADMIN_EMAIL
}

export async function PATCH(req: NextRequest) {
  if (!await verifyAdmin()) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { requestId, status, userEmail, title } = await req.json()
  if (!requestId || !status) return NextResponse.json({ error: 'requestId and status required' }, { status: 400 })

  // Update in DB
  const admin = createAdminClient()
  const { error: dbErr } = await admin.from('feature_requests').update({ status }).eq('id', requestId)
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

  // Email the user if we have their email and there's copy for this status
  const copy = STATUS_COPY[status]
  if (userEmail && copy) {
    await sendEmail({
      to: userEmail,
      subject: copy.badge === 'Shipped!' ? `🚀 Your feature request shipped!` : `Update on your feature request`,
      htmlbody: emailLayout(`
        ${emailBadge('Feature Request Update', copy.badgeColor)}
        <h2 style="margin:0 0 12px;font-size:1.3rem;color:#111;font-weight:800;">${copy.headline}</h2>
        <p style="margin:0 0 20px;font-size:0.95rem;color:#555;line-height:1.7;">${copy.body}</p>
        ${emailQuote('Your Request', title, copy.badgeColor)}
        ${emailButton('View Your Requests', 'https://dynamicgarage.app/feedback')}
      `),
    })
  }

  return NextResponse.json({ ok: true })
}
