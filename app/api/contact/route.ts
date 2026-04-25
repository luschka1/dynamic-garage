import { NextRequest, NextResponse } from 'next/server'
import { isRateLimited, isValidEmail } from '@/lib/rateLimit'
import { sendEmail, emailLayout, emailBadge, emailMeta } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
    if (isRateLimited(ip, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute.' }, { status: 429 })
    }

    const { name, email, subject, message } = await req.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }
    if (!isValidEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (message.length > 5000) {
      return NextResponse.json({ error: 'Message is too long (max 5000 characters).' }, { status: 400 })
    }
    if (name.length > 100) {
      return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
    }

    const metaRows = [
      { label: 'Name', value: name.trim() },
      { label: 'Email', value: `<a href="mailto:${email}" style="color:#cc1f1f;">${email}</a>` },
      ...(subject?.trim() ? [{ label: 'Subject', value: subject.trim() }] : []),
    ]

    await sendEmail({
      to: 'info@dynamicgarage.app',
      subject: subject?.trim() ? `Contact: ${subject.trim()}` : `New message from ${name.trim()}`,
      replyTo: email.trim(),
      htmlbody: emailLayout(`
        ${emailBadge('Contact Form', '#3b82f6')}
        <h2 style="margin:0 0 20px;font-size:1.3rem;color:#111;font-weight:800;">New message from ${name.trim()}</h2>
        ${emailMeta(metaRows)}
        <div style="background:#f8f8f8;border-radius:6px;padding:18px 20px;margin-bottom:24px;">
          <div style="font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#999;margin-bottom:8px;">Message</div>
          <p style="margin:0;font-size:0.92rem;color:#333;line-height:1.7;white-space:pre-wrap;">${message}</p>
        </div>
        <div style="text-align:center;margin-top:8px;">
          <a href="mailto:${email}" style="display:inline-block;background:#cc1f1f;color:#fff;padding:12px 28px;border-radius:8px;font-size:0.875rem;font-weight:800;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">
            Reply to ${name.trim()}
          </a>
        </div>
      `, 'Sent via dynamicgarage.app contact form'),
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Contact API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
