import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 })
    }

    const res = await fetch('https://api.zeptomail.ca/v1.1/email', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ZEPTOMAIL_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { address: 'info@dynamicgarage.app', name: 'Dynamic Garage' },
        to: [{ email_address: { address: '3339764@gmail.com', name: 'Admin' } }],
        reply_to: [{ address: email.trim(), name: name.trim() }],
        subject: subject?.trim() ? `Contact: ${subject.trim()}` : `New message from ${name.trim()}`,
        htmlbody: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
            <div style="background: #111; padding: 24px 32px; border-radius: 8px 8px 0 0;">
              <span style="font-family: sans-serif; font-weight: 900; font-size: 1.1rem; letter-spacing: 0.04em; text-transform: uppercase;">
                <span style="color: #a8a8a8;">Dynamic</span><span style="color: #cc1f1f;"> Garage</span>
              </span>
            </div>
            <div style="background: #fff; border: 1px solid #e8e8e8; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
              <h2 style="margin: 0 0 24px; font-size: 1.3rem; color: #111;">New Contact Message</h2>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr><td style="padding: 8px 0; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; width: 80px;">Name</td><td style="padding: 8px 0; font-size: 0.95rem; color: #111;">${name}</td></tr>
                <tr><td style="padding: 8px 0; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999;">Email</td><td style="padding: 8px 0; font-size: 0.95rem; color: #111;"><a href="mailto:${email}" style="color: #cc1f1f;">${email}</a></td></tr>
                ${subject ? `<tr><td style="padding: 8px 0; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999;">Subject</td><td style="padding: 8px 0; font-size: 0.95rem; color: #111;">${subject}</td></tr>` : ''}
              </table>
              <div style="background: #f8f8f8; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; margin-bottom: 10px;">Message</div>
                <p style="margin: 0; font-size: 0.95rem; color: #333; line-height: 1.7; white-space: pre-wrap;">${message}</p>
              </div>
              <a href="mailto:${email}" style="display: inline-block; background: #cc1f1f; color: #fff; padding: 10px 22px; border-radius: 6px; font-size: 0.875rem; font-weight: 700; text-decoration: none; letter-spacing: 0.04em;">Reply to ${name}</a>
            </div>
            <p style="text-align: center; font-size: 0.75rem; color: #aaa; margin-top: 16px;">Sent via dynamicgarage.app contact form</p>
          </div>
        `,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('ZeptoMail error:', JSON.stringify(data))
      return NextResponse.json({ error: JSON.stringify(data) }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Contact API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
