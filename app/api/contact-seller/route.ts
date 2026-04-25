import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isRateLimited, isValidEmail } from '@/lib/rateLimit'
import { sendEmail, emailLayout, emailBadge, emailMeta } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    const { corvetteId, senderName, senderEmail, message } = await req.json()

    if (!corvetteId || !senderName?.trim() || !senderEmail?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (!isValidEmail(senderEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long (max 5000 characters).' }, { status: 400 })
    }

    const admin = createAdminClient()
    const { data: car } = await admin
      .from('corvettes')
      .select('id, nickname, year, model, user_id, for_sale, is_public')
      .eq('id', corvetteId)
      .single()

    if (!car || !car.is_public || !car.for_sale) {
      return NextResponse.json({ error: 'Vehicle not found or not for sale.' }, { status: 404 })
    }

    const { data: userData } = await admin.auth.admin.getUserById(car.user_id)
    const ownerEmail = userData?.user?.email
    if (!ownerEmail) return NextResponse.json({ error: 'Could not reach the seller.' }, { status: 500 })

    const vehicleLabel = `${car.year} ${car.model} "${car.nickname}"`

    await sendEmail({
      to: ownerEmail,
      subject: `Enquiry about your ${vehicleLabel}`,
      replyTo: senderEmail.trim(),
      htmlbody: emailLayout(`
        ${emailBadge('For Sale Enquiry', '#16a34a')}
        <h2 style="margin:0 0 6px;font-size:1.3rem;color:#111;font-weight:800;">Someone is interested in your ${vehicleLabel}</h2>
        <p style="margin:0 0 20px;font-size:0.88rem;color:#888;">Hit reply to respond directly to ${senderName.trim()}.</p>
        ${emailMeta([
          { label: 'From', value: senderName.trim() },
          { label: 'Email', value: `<a href="mailto:${senderEmail}" style="color:#cc1f1f;">${senderEmail}</a>` },
        ])}
        <div style="background:#f8f8f8;border-radius:6px;padding:18px 20px;margin-bottom:24px;">
          <div style="font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#999;margin-bottom:8px;">Message</div>
          <p style="margin:0;font-size:0.92rem;color:#333;line-height:1.7;white-space:pre-wrap;">${message}</p>
        </div>
        <div style="text-align:center;margin-top:8px;">
          <a href="mailto:${senderEmail}" style="display:inline-block;background:#cc1f1f;color:#fff;padding:12px 28px;border-radius:8px;font-size:0.875rem;font-weight:800;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">
            Reply to ${senderName.trim()}
          </a>
        </div>
      `, "Sent via dynamicgarage.app — the buyer's email is only visible to you"),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Contact seller error:', message)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
