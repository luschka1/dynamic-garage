/**
 * Lightweight Postmark helper — uses fetch, no npm package needed.
 */

const POSTMARK_API = 'https://api.postmarkapp.com/email'
const FROM_ADDRESS = 'hello@dynamicgarage.app'
const FROM_NAME    = 'Dynamic Garage'

export interface PostmarkMessage {
  to: string
  toName?: string
  subject: string
  html: string
  replyTo?: string
  tag?: string          // Postmark message stream tag (optional)
  messageStream?: string // default: 'outbound'
}

export async function sendEmail(msg: PostmarkMessage): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.POSTMARK_API_KEY
  if (!apiKey) {
    console.error('POSTMARK_API_KEY is not set')
    return { ok: false, error: 'Email service not configured' }
  }

  const body = {
    From: `${FROM_NAME} <${FROM_ADDRESS}>`,
    To: msg.toName ? `${msg.toName} <${msg.to}>` : msg.to,
    Subject: msg.subject,
    HtmlBody: msg.html,
    ReplyTo: msg.replyTo ?? FROM_ADDRESS,
    Tag: msg.tag,
    MessageStream: msg.messageStream ?? 'outbound',
  }

  try {
    const res = await fetch(POSTMARK_API, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Postmark-Server-Token': apiKey,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      console.error('Postmark error:', data)
      return { ok: false, error: data?.Message ?? 'Failed to send email' }
    }

    return { ok: true }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('Postmark fetch error:', message)
    return { ok: false, error: message }
  }
}
