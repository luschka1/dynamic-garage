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

// Extract the UUID token from the To address.
// Handles plain "token@domain" and display-name "Name <token@domain>" formats.
// Also scans all recipients in case the token address is in CC or a secondary To.
function extractToken(toRaw: string): string | null {
  // Strip display name: "My Car <token@domain>" → "token@domain"
  const angleMatch = toRaw.match(/<([^>]+)>/)
  const email = angleMatch ? angleMatch[1] : toRaw
  const local = email.split('@')[0]?.trim().toLowerCase() ?? ''
  if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(local)) {
    return local
  }
  return null
}

function extractTokenFromAny(candidates: string[]): string | null {
  for (const c of candidates) {
    const token = extractToken(c)
    if (token) return token
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

  // ── 3. Resolve the vehicle token from the To/CC addresses ─────────────────
  // Build a list of all candidate addresses to scan for the UUID token.
  // Postmark: ToFull/CcFull are [{Email, Name}]; To/Cc are raw header strings.
  const toFull   = (body.ToFull as Array<{ Email: string }> | undefined) ?? []
  const ccFull   = (body.CcFull as Array<{ Email: string }> | undefined) ?? []
  const toRaw    = (body.To as string) ?? ''
  const ccRaw    = (body.Cc as string) ?? ''

  const candidates = [
    ...toFull.map(r => r.Email),
    ...ccFull.map(r => r.Email),
    toRaw,
    ccRaw,
  ].filter(Boolean)

  const token = extractTokenFromAny(candidates)
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
    // Strip MIME parameters e.g. "application/pdf; name=file.pdf" → "application/pdf"
    const mimeType   = (att.ContentType ?? att.contentType ?? 'application/octet-stream').split(';')[0].trim().toLowerCase()
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
