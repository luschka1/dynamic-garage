import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// ─── Allowed file types ───────────────────────────────────────────────────────
const ALLOWED_TYPES = new Set([
  'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic', 'image/heif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])

const MAX_BYTES = 20 * 1024 * 1024 // 20 MB

function getFileType(contentType: string): string {
  if (contentType.startsWith('image/')) return 'image'
  if (contentType === 'application/pdf') return 'pdf'
  return 'other'
}

// Extract the UUID token from the local part of the To address
// e.g. "a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx@uploads.domain.com" → token
function extractToken(toRaw: string): string | null {
  const local = toRaw.split('@')[0]?.trim().toLowerCase() ?? ''
  // Basic UUID v4 pattern check
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(local)) {
    return local
  }
  return null
}

function safeName(raw: string): string {
  return raw.replace(/[^a-zA-Z0-9._\-]/g, '_').slice(0, 120)
}

export async function POST(req: NextRequest) {
  // ── 1. Authenticate the webhook ───────────────────────────────────────────
  const key = req.nextUrl.searchParams.get('key')
  if (!process.env.INBOUND_EMAIL_SECRET || key !== process.env.INBOUND_EMAIL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── 2. Parse body ─────────────────────────────────────────────────────────
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  // ── 3. Resolve the vehicle token from the To address ──────────────────────
  // Postmark sends { To: "token@domain" } or { ToFull: [{Email:"..."}] }
  const toRaw: string =
    (body.To as string) ||
    ((body.ToFull as Array<{ Email: string }>)?.[0]?.Email) ||
    ''

  const token = extractToken(toRaw)
  if (!token) {
    // Not addressed to a valid vehicle — silently accept so Postmark doesn't retry
    return NextResponse.json({ ok: true, skipped: 'no valid token' })
  }

  // ── 4. Look up the vehicle (service-role bypasses RLS) ────────────────────
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: car } = await supabase
    .from('corvettes')
    .select('id, user_id, nickname')
    .eq('email_token', token)
    .single()

  if (!car) {
    return NextResponse.json({ ok: true, skipped: 'vehicle not found' })
  }

  // ── 5. Process attachments ────────────────────────────────────────────────
  const attachments = (body.Attachments ?? body.attachments ?? []) as Array<{
    Name?: string
    name?: string
    ContentType?: string
    contentType?: string
    Content?: string
    content?: string
    ContentLength?: number
    contentLength?: number
  }>

  if (!attachments.length) {
    return NextResponse.json({ ok: true, skipped: 'no attachments' })
  }

  let uploaded = 0
  const errors: string[] = []

  for (const att of attachments) {
    const rawName    = att.Name       ?? att.name       ?? 'attachment'
    const mimeType   = (att.ContentType ?? att.contentType ?? 'application/octet-stream').toLowerCase()
    const b64content = att.Content    ?? att.content    ?? ''
    const byteLength = att.ContentLength ?? att.contentLength ?? 0

    // Validate
    if (!ALLOWED_TYPES.has(mimeType))      { errors.push(`${rawName}: unsupported type ${mimeType}`); continue }
    if (byteLength > MAX_BYTES)            { errors.push(`${rawName}: too large`); continue }
    if (!b64content)                       { errors.push(`${rawName}: empty content`); continue }

    // Decode
    const buffer = Buffer.from(b64content, 'base64')
    if (buffer.length > MAX_BYTES)         { errors.push(`${rawName}: decoded size too large`); continue }

    // Upload path mirrors what UploadDocumentForm uses
    const ext         = rawName.includes('.') ? rawName.split('.').pop() : 'bin'
    const storagePath = `${car.user_id}/${car.id}/${Date.now()}-${safeName(rawName)}`

    const { error: upErr } = await supabase.storage
      .from('corvette-files')
      .upload(storagePath, buffer, { contentType: mimeType, cacheControl: '3600', upsert: false })

    if (upErr) { errors.push(`${rawName}: upload error — ${upErr.message}`); continue }

    // Create document record
    const displayName = rawName.replace(/\.[^.]+$/, '') // strip extension for display
    const { error: dbErr } = await supabase.from('documents').insert({
      corvette_id: car.id,
      user_id:     car.user_id,
      name:        displayName || rawName,
      file_url:    storagePath,
      file_type:   getFileType(mimeType),
      file_size:   buffer.length,
      is_shared:   false,
    })

    if (dbErr) { errors.push(`${rawName}: db error — ${dbErr.message}`); continue }

    uploaded++
  }

  return NextResponse.json({ ok: true, uploaded, errors })
}
