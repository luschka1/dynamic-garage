import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, GitBranch } from 'lucide-react'
import BuildTimeline, { type TimelineEvent, type TimelineAttachment } from './BuildTimeline'

export default async function TimelinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: car } = await supabase
    .from('corvettes').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!car) notFound()

  const [
    { data: mods },
    { data: serviceRecords },
    { data: documents },
    { data: photos },
  ] = await Promise.all([
    supabase.from('mods').select('*').eq('corvette_id', id).order('install_date', { ascending: false, nullsFirst: false }),
    supabase.from('service_records').select('*').eq('corvette_id', id).order('service_date', { ascending: false, nullsFirst: false }),
    supabase.from('documents').select('*').eq('corvette_id', id).order('created_at', { ascending: false }),
    supabase.from('vehicle_photos').select('*').eq('corvette_id', id).order('created_at', { ascending: false }),
  ])

  const currency = car.currency ?? 'USD'
  const allDocs = documents ?? []

  // Map documents by mod_id and service_id for attachment lookup
  const docsByModId = new Map<string, typeof allDocs>()
  const docsBySvcId = new Map<string, typeof allDocs>()
  for (const d of allDocs) {
    if (d.mod_id) {
      if (!docsByModId.has(d.mod_id)) docsByModId.set(d.mod_id, [])
      docsByModId.get(d.mod_id)!.push(d)
    }
    if (d.service_id) {
      if (!docsBySvcId.has(d.service_id)) docsBySvcId.set(d.service_id, [])
      docsBySvcId.get(d.service_id)!.push(d)
    }
  }

  function toAttachments(docs: typeof allDocs): TimelineAttachment[] {
    return docs.map(d => ({
      id: d.id,
      name: d.name,
      fileUrl: d.file_url,
      fileType: d.file_type ?? null,
    }))
  }

  /* ─── Build event list ────────────────────────────────────────── */
  const events: TimelineEvent[] = []

  // Mods
  for (const m of mods ?? []) {
    const date = m.install_date ?? m.created_at?.split('T')[0]
    if (!date) continue
    const linked = docsByModId.get(m.id) ?? []
    events.push({
      id: `mod-${m.id}`,
      type: 'mod',
      date,
      title: m.name,
      subtitle: m.vendor ?? undefined,
      cost: m.cost,
      category: m.category ?? undefined,
      notes: m.notes ?? undefined,
      purchaseUrl: m.purchase_url ?? undefined,
      attachments: toAttachments(linked),
      currency,
    })
  }

  // Service records
  for (const s of serviceRecords ?? []) {
    const date = s.service_date ?? s.created_at?.split('T')[0]
    if (!date) continue
    const linked = docsBySvcId.get(s.id) ?? []
    events.push({
      id: `svc-${s.id}`,
      type: 'service',
      date,
      title: s.title,
      subtitle: s.shop ?? undefined,
      cost: s.cost,
      mileage: s.mileage ?? undefined,
      category: s.category ?? undefined,
      notes: s.notes ?? undefined,
      attachments: toAttachments(linked),
      currency,
    })
  }

  // Standalone documents (not linked to a mod or service)
  for (const d of allDocs) {
    if (d.mod_id || d.service_id) continue // already shown as attachments
    const date = d.created_at?.split('T')[0]
    if (!date) continue
    events.push({
      id: `doc-${d.id}`,
      type: 'document',
      date,
      title: d.name,
      fileUrl: d.file_url,
      fileType: d.file_type ?? undefined,
      currency,
    })
  }

  // Photos
  for (const p of photos ?? []) {
    const date = p.created_at?.split('T')[0]
    if (!date) continue
    events.push({
      id: `photo-${p.id}`,
      type: 'photo',
      date,
      title: p.caption ?? 'Photo added',
      thumbnail: p.photo_url ?? undefined,
      currency,
    })
  }

  /* ─── Auto-generate milestones ────────────────────────────────── */
  const modEvents = events.filter(e => e.type === 'mod')

  if (events.length > 0) {
    const sorted = [...events].sort((a, b) => a.date.localeCompare(b.date))
    events.push({
      id: 'milestone-first-entry',
      type: 'milestone',
      date: sorted[0].date,
      title: `${car.nickname} joined Dynamic Garage`,
      subtitle: `${car.year} ${car.model}${car.trim ? ' ' + car.trim : ''}`,
      currency,
    })
  }

  for (const target of [5, 10, 25, 50]) {
    if (modEvents.length >= target) {
      const sorted = [...modEvents].sort((a, b) => a.date.localeCompare(b.date))
      const targetEvent = sorted[target - 1]
      if (targetEvent) {
        events.push({
          id: `milestone-mods-${target}`,
          type: 'milestone',
          date: targetEvent.date,
          title: `${target} mods documented`,
          subtitle: 'Build milestone',
          currency,
        })
      }
    }
  }

  let runningCost = 0
  const triggered = new Set<number>()
  for (const m of [...modEvents].sort((a, b) => a.date.localeCompare(b.date))) {
    runningCost += m.cost ?? 0
    for (const target of [1000, 5000, 10000, 25000, 50000]) {
      if (runningCost >= target && !triggered.has(target)) {
        triggered.add(target)
        const label = target >= 1000 ? `$${target / 1000}k` : `$${target}`
        events.push({
          id: `milestone-spend-${target}`,
          type: 'milestone',
          date: m.date,
          title: `${label} invested in this build`,
          subtitle: 'Spend milestone',
          currency,
        })
      }
    }
  }

  events.sort((a, b) => b.date.localeCompare(a.date))

  const totalEvents = events.filter(e => e.type !== 'milestone').length

  return (
    <div>
      <Link href={`/corvettes/${id}`} className="back-link">
        <ArrowLeft size={14} /> {car.nickname}
      </Link>

      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
          <GitBranch size={18} color="var(--red)" />
          <h1 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
            fontWeight: 900, letterSpacing: '0.02em',
            color: 'var(--text-primary)', lineHeight: 1,
          }}>
            BUILD TIMELINE
          </h1>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          {totalEvents > 0
            ? `${totalEvents} events logged across the life of this build`
            : 'Start logging mods and service records to build your timeline'}
        </p>
      </div>

      {totalEvents === 0 ? (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: '3rem 2rem', textAlign: 'center',
        }}>
          <GitBranch size={40} color="var(--text-muted)" strokeWidth={1} style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Nothing here yet</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Log your first mod or service record and it will appear here automatically.
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href={`/corvettes/${id}/mods`} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}>Add a Mod</Link>
            <Link href={`/corvettes/${id}/service`} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.2rem' }}>Log Service</Link>
          </div>
        </div>
      ) : (
        <BuildTimeline events={events} currency={currency} carNickname={car.nickname} />
      )}
    </div>
  )
}
