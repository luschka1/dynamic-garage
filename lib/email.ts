/**
 * Shared email utilities for Dynamic Garage
 * All transactional emails use this template for consistent look & feel.
 */

const BRAND_HEADER = `
  <div style="background:#0d0d0d;padding:28px 40px;text-align:center;border-radius:8px 8px 0 0;">
    <span style="font-family:'Helvetica Neue',Arial,sans-serif;font-weight:900;font-size:1.15rem;letter-spacing:0.12em;text-transform:uppercase;">
      <span style="color:#a8a8a8;">DYNAMIC</span><span style="color:#cc1f1f;"> GARAGE</span>
    </span>
  </div>
`

const BRAND_FOOTER = `
  <p style="text-align:center;font-size:0.72rem;color:#aaa;margin-top:20px;font-family:'Helvetica Neue',Arial,sans-serif;">
    Dynamic Garage &middot; <a href="https://dynamicgarage.app" style="color:#aaa;text-decoration:none;">dynamicgarage.app</a>
  </p>
`

/** Wrap any HTML content in the standard email shell */
export function emailLayout(content: string, footerNote?: string): string {
  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;color:#111;">
      ${BRAND_HEADER}
      <div style="background:#fff;border:1px solid #e4e4e4;border-top:none;padding:36px 40px;border-radius:0 0 8px 8px;">
        ${content}
      </div>
      ${footerNote ? `<p style="text-align:center;font-size:0.72rem;color:#aaa;margin-top:12px;">${footerNote}</p>` : ''}
      ${BRAND_FOOTER}
    </div>
  `
}

/** A large, centered, red CTA button matching the signup confirmation style */
export function emailButton(label: string, href: string): string {
  return `
    <div style="text-align:center;margin:28px 0 8px;">
      <a href="${href}" style="display:inline-block;background:#cc1f1f;color:#fff;padding:14px 36px;border-radius:8px;font-size:0.9rem;font-weight:800;text-decoration:none;letter-spacing:0.06em;text-transform:uppercase;">
        ${label}
      </a>
    </div>
  `
}

/** A secondary (dark) button for less prominent actions */
export function emailButtonSecondary(label: string, href: string): string {
  return `
    <div style="text-align:center;margin:20px 0 8px;">
      <a href="${href}" style="display:inline-block;background:#111;color:#fff;padding:12px 32px;border-radius:8px;font-size:0.875rem;font-weight:700;text-decoration:none;letter-spacing:0.04em;">
        ${label}
      </a>
    </div>
  `
}

/** A small pill/badge label */
export function emailBadge(label: string, color: string): string {
  return `
    <div style="margin-bottom:20px;">
      <span style="display:inline-block;background:${color}18;color:${color};border:1px solid ${color}40;font-size:0.7rem;font-weight:800;letter-spacing:0.1em;text-transform:uppercase;padding:4px 12px;border-radius:100px;">
        ${label}
      </span>
    </div>
  `
}

/** A quoted block (e.g. "Your request: ...") */
export function emailQuote(label: string, value: string, accentColor = '#cc1f1f'): string {
  return `
    <div style="background:#f8f8f8;border-left:3px solid ${accentColor};border-radius:0 6px 6px 0;padding:14px 18px;margin:20px 0;">
      <div style="font-size:0.68rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#999;margin-bottom:5px;">${label}</div>
      <div style="font-size:0.95rem;font-weight:600;color:#111;">${value}</div>
    </div>
  `
}

/** A key-value table for metadata rows */
export function emailMeta(rows: { label: string; value: string }[]): string {
  const trs = rows.map(r => `
    <tr>
      <td style="padding:7px 16px 7px 0;font-size:0.75rem;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#999;white-space:nowrap;vertical-align:top;">${r.label}</td>
      <td style="padding:7px 0;font-size:0.9rem;color:#111;">${r.value}</td>
    </tr>
  `).join('')
  return `<table style="width:100%;border-collapse:collapse;margin:16px 0 24px;">${trs}</table>`
}

/** Send an email via ZeptoMail */
export async function sendEmail({
  to,
  subject,
  htmlbody,
  replyTo,
  from = { address: 'info@dynamicgarage.app', name: 'Dynamic Garage' },
}: {
  to: string | { address: string; name?: string }
  subject: string
  htmlbody: string
  replyTo?: string
  from?: { address: string; name: string }
}) {
  const toFormatted = typeof to === 'string'
    ? { email_address: { address: to } }
    : { email_address: { address: to.address, name: to.name } }

  const body: Record<string, unknown> = {
    from,
    to: [toFormatted],
    subject,
    htmlbody,
  }
  if (replyTo) body.reply_to = [{ address: replyTo }]

  const res = await fetch('https://api.zeptomail.ca/v1.1/email', {
    method: 'POST',
    headers: {
      'Authorization': process.env.ZEPTOMAIL_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    console.error('ZeptoMail error:', JSON.stringify(data))
    throw new Error(`Email send failed: ${res.status}`)
  }

  return res
}
