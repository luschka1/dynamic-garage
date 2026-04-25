import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendEmail, emailLayout, emailButton, emailBadge, emailMeta, emailQuote } from '@/lib/email'

const PRIORITY_LABELS: Record<number, string> = {
  1: 'Nice to have', 2: 'Would use it', 3: 'Really want it',
  4: 'Need it badly', 5: "Can't live without it",
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, description, category, priority } = await req.json()
    if (!title?.trim() || !description?.trim()) {
      return NextResponse.json({ error: 'Title and description are required.' }, { status: 400 })
    }

    // Insert into Supabase
    const { error: dbErr } = await supabase.from('feature_requests').insert({
      user_id: user.id,
      user_email: user.email,
      title: title.trim(),
      description: description.trim(),
      category: category || null,
      priority: priority || null,
    })
    if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 })

    // Notify admin
    const adminEmail = process.env.NOTIFICATION_EMAIL ?? 'info@dynamicgarage.app'
    const priorityLabel = priority ? `${'⭐'.repeat(priority)} ${PRIORITY_LABELS[priority]}` : 'Not rated'

    const metaRows = [
      { label: 'From', value: user.email ?? 'Unknown' },
      ...(category ? [{ label: 'Category', value: category }] : []),
      { label: 'Priority', value: priorityLabel },
    ]

    await sendEmail({
      to: adminEmail,
      subject: `💡 Feature Request: ${title.trim()}`,
      replyTo: user.email,
      htmlbody: emailLayout(`
        ${emailBadge('New Feature Request', '#ca8a04')}
        <h2 style="margin:0 0 20px;font-size:1.3rem;color:#111;font-weight:800;">${title.trim()}</h2>
        ${emailMeta(metaRows)}
        <div style="background:#f8f8f8;border-radius:6px;padding:18px 20px;margin-bottom:8px;">
          <div style="font-size:0.7rem;font-weight:800;text-transform:uppercase;letter-spacing:0.1em;color:#999;margin-bottom:8px;">Description</div>
          <p style="margin:0;font-size:0.92rem;color:#333;line-height:1.7;white-space:pre-wrap;">${description.trim()}</p>
        </div>
      `, 'Sent via dynamicgarage.app feature request form'),
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Feature request API error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
