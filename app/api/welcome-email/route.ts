import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/postmark'

export async function POST(req: NextRequest) {
  try {
    const { name, email } = await req.json()
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 })

    const firstName = name?.split(' ')[0] ?? 'there'
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dynamicgarage.app'

    const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to Dynamic Garage</title></head>
<body style="margin:0;padding:0;background:#f3f3f3;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f3f3;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:580px;" cellpadding="0" cellspacing="0">

        <!-- Header -->
        <tr>
          <td style="background:#0d0d0d;border-radius:12px 12px 0 0;padding:28px 36px;">
            <p style="margin:0;font-family:Arial,sans-serif;font-weight:900;font-size:15px;letter-spacing:0.08em;text-transform:uppercase;">
              <span style="color:#a0a0a0;">Dynamic</span><span style="color:#cc2020;"> Garage</span>
            </p>
          </td>
        </tr>

        <!-- Red accent line -->
        <tr><td style="height:3px;background:linear-gradient(90deg,#cc2020 0%,#111 100%);"></td></tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:40px 36px;border-radius:0 0 12px 12px;border:1px solid #e0e0e0;border-top:none;">

            <h1 style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:28px;font-weight:900;letter-spacing:0.01em;color:#111;">
              Welcome, ${firstName}.
            </h1>
            <p style="margin:0 0 28px;font-size:15px;color:#555;line-height:1.6;">
              Your garage is ready. Everything you need to document, prove, and share your build is waiting for you.
            </p>

            <!-- Feature list -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
              ${[
                ['🔧', 'Mod Log', 'Track every part, every dollar. Build the receipts that prove it\'s worth it.'],
                ['📋', 'Service History', 'Oil changes to engine rebuilds - every record in one place.'],
                ['📁', 'Document Vault', 'Receipts, titles, window stickers - stored forever, always accessible.'],
                ['🏆', 'Show & Event History', 'Log your placements, trophies, and car show wins.'],
                ['📅', 'Build Timeline', 'Your entire build, from day one, in one chronological story.'],
                ['🔗', 'Public Build Page', 'One link that shows everything about your car.'],
              ].map(([icon, title, desc]) => `
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #f0f0f0;vertical-align:top;">
                  <table cellpadding="0" cellspacing="0"><tr>
                    <td style="font-size:18px;padding-right:14px;vertical-align:top;padding-top:1px;">${icon}</td>
                    <td>
                      <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#111;">${title}</p>
                      <p style="margin:0;font-size:13px;color:#777;line-height:1.5;">${desc}</p>
                    </td>
                  </tr></table>
                </td>
              </tr>`).join('')}
            </table>

            <!-- CTA -->
            <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
              Start by adding your first vehicle. It takes about 60 seconds.
            </p>
            <a href="${siteUrl}/dashboard"
               style="display:inline-block;background:#cc2020;color:#ffffff;text-decoration:none;
                      font-size:15px;font-weight:700;letter-spacing:0.04em;padding:14px 32px;
                      border-radius:8px;">
              Open My Garage →
            </a>

            <!-- Divider -->
            <hr style="border:none;border-top:1px solid #f0f0f0;margin:36px 0 24px;">

            <p style="margin:0;font-size:12px;color:#aaa;line-height:1.7;">
              Questions? Just reply to this email.<br>
              You're getting this because you created an account at
              <a href="${siteUrl}" style="color:#cc2020;text-decoration:none;">dynamicgarage.app</a>.
            </p>

          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 0;text-align:center;">
            <p style="margin:0;font-size:12px;color:#aaa;">
              &copy; ${new Date().getFullYear()} Dynamic Garage &mdash; Track every mod. Share your build.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    const result = await sendEmail({
      to: email,
      toName: name ?? undefined,
      subject: `Welcome to Dynamic Garage, ${firstName}`,
      html,
      tag: 'welcome',
    })

    if (!result.ok) {
      console.error('Welcome email failed:', result.error)
      // Don't block signup if email fails
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Welcome email route error:', err)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
