import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(req: NextRequest) {
  try {
    const { corvetteId, senderName, senderEmail, message } = await req.json()

    if (!corvetteId || !senderName?.trim() || !senderEmail?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }

    const admin = createAdminClient()

    // Get the corvette and verify it's for sale and public
    const { data: car } = await admin
      .from('corvettes')
      .select('id, nickname, year, model, user_id, for_sale, is_public')
      .eq('id', corvetteId)
      .single()

    if (!car || !car.is_public || !car.for_sale) {
      return NextResponse.json({ error: 'Vehicle not found or not for sale.' }, { status: 404 })
    }

    // Look up the owner's email — never exposed to the sender
    const { data: userData } = await admin.auth.admin.getUserById(car.user_id)
    const ownerEmail = userData?.user?.email

    if (!ownerEmail) {
      return NextResponse.json({ error: 'Could not reach the seller.' }, { status: 500 })
    }

    const vehicleLabel = `${car.year} ${car.model} "${car.nickname}"`

    const res = await fetch('https://api.zeptomail.ca/v1.1/email', {
      method: 'POST',
      headers: {
        'Authorization': process.env.ZEPTOMAIL_API_KEY!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: { address: 'info@dynamicgarage.app', name: 'Dynamic Garage' },
        to: [{ email_address: { address: ownerEmail, name: 'Seller' } }],
        reply_to: [{ address: senderEmail.trim(), name: senderName.trim() }],
        subject: `Enquiry about your ${vehicleLabel}`,
        htmlbody: `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
            <div style="background: #111; padding: 24px 32px; border-radius: 8px 8px 0 0;">
              <span style="font-family: sans-serif; font-weight: 900; font-size: 1.1rem; letter-spacing: 0.04em; text-transform: uppercase;">
                <span style="color: #a8a8a8;">Dynamic</span><span style="color: #cc1f1f;"> Garage</span>
              </span>
            </div>
            <div style="background: #fff; border: 1px solid #e8e8e8; border-top: none; padding: 32px; border-radius: 0 0 8px 8px;">
              <div style="display: inline-block; background: rgba(22,163,74,0.1); color: #16a34a; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 0.3rem 0.75rem; border-radius: 4px; margin-bottom: 1.25rem;">For Sale Enquiry</div>
              <h2 style="margin: 0 0 6px; font-size: 1.3rem; color: #111;">Someone is interested in your ${vehicleLabel}</h2>
              <p style="margin: 0 0 24px; font-size: 0.9rem; color: #888;">Hit reply to respond directly to ${senderName.trim()}.</p>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr><td style="padding: 8px 0; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; width: 80px;">From</td><td style="padding: 8px 0; font-size: 0.95rem; color: #111;">${senderName}</td></tr>
                <tr><td style="padding: 8px 0; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999;">Email</td><td style="padding: 8px 0; font-size: 0.95rem; color: #111;"><a href="mailto:${senderEmail}" style="color: #cc1f1f;">${senderEmail}</a></td></tr>
              </table>
              <div style="background: #f8f8f8; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                <div style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: #999; margin-bottom: 10px;">Message</div>
                <p style="margin: 0; font-size: 0.95rem; color: #333; line-height: 1.7; white-space: pre-wrap;">${message}</p>
              </div>
              <a href="mailto:${senderEmail}" style="display: inline-block; background: #cc1f1f; color: #fff; padding: 10px 22px; border-radius: 6px; font-size: 0.875rem; font-weight: 700; text-decoration: none; letter-spacing: 0.04em;">Reply to ${senderName}</a>
            </div>
            <p style="text-align: center; font-size: 0.75rem; color: #aaa; margin-top: 16px;">Sent via dynamicgarage.app — the buyer's email is only visible to you</p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      console.error('ZeptoMail error:', JSON.stringify(data))
      return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Contact seller error:', message)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
