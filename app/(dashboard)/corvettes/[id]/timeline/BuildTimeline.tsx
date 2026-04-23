'use client'

import { useState, useEffect } from 'react'
import { Wrench, ClipboardList, FileText, Camera, Trophy, SlidersHorizontal, ExternalLink, FileText as FileIcon, Image as ImageIcon, File } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export type TimelineAttachment = {
  id: string
  name: string
  fileUrl: string
  fileType: string | null
}

export type TimelineEvent = {
  id: string
  type: 'mod' | 'service' | 'document' | 'photo' | 'milestone'
  date: string
  title: string
  subtitle?: string
  cost?: number | null
  mileage?: number | null
  category?: string | null
  notes?: string | null
  thumbnail?: string | null   // photo URL (public)
  fileUrl?: string | null     // document storage path (private bucket)
  fileType?: string | null    // pdf / image / other
  purchaseUrl?: string | null // mod purchase link
  attachments?: TimelineAttachment[] // linked receipts/docs
  currency?: string
}

const TYPE_CONFIG = {
  mod:       { color: '#e53e3e', dimColor: 'rgba(229,62,62,0.1)',   borderColor: 'rgba(229,62,62,0.25)',   label: 'Mod',       icon: <Wrench size={13} /> },
  service:   { color: '#2563eb', dimColor: 'rgba(37,99,235,0.1)',   borderColor: 'rgba(37,99,235,0.25)',   label: 'Service',   icon: <ClipboardList size={13} /> },
  document:  { color: '#16a34a', dimColor: 'rgba(22,163,74,0.1)',   borderColor: 'rgba(22,163,74,0.25)',   label: 'Document',  icon: <FileText size={13} /> },
  photo:     { color: '#8b5cf6', dimColor: 'rgba(139,92,246,0.1)',  borderColor: 'rgba(139,92,246,0.25)',  label: 'Photo',     icon: <Camera size={13} /> },
  milestone: { color: '#f59e0b', dimColor: 'rgba(245,158,11,0.1)', borderColor: 'rgba(245,158,11,0.3)',   label: 'Milestone', icon: <Trophy size={13} /> },
}

const FILTERS = ['All', 'Mods', 'Service', 'Documents', 'Photos', 'Milestones'] as const
type Filter = typeof FILTERS[number]
const FILTER_MAP: Record<Filter, TimelineEvent['type'] | null> = {
  All: null, Mods: 'mod', Service: 'service', Documents: 'document', Photos: 'photo', Milestones: 'milestone',
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr + (dateStr.length === 10 ? 'T12:00:00' : ''))
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatCost(amount: number, currency = 'USD') {
  const f = amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
  return currency === 'CAD' ? `$${f} CAD` : `$${f}`
}

function groupByYear(events: TimelineEvent[]) {
  const groups: Record<string, TimelineEvent[]> = {}
  for (const e of events) {
    const year = new Date(e.date + (e.date.length === 10 ? 'T12:00:00' : '')).getFullYear().toString()
    if (!groups[year]) groups[year] = []
    groups[year].push(e)
  }
  return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
}

function isStoragePath(url: string) { return !url.startsWith('http') }

function useSignedUrl(path: string | null | undefined) {
  const [url, setUrl] = useState<string | null>(null)
  useEffect(() => {
    if (!path) return
    if (!isStoragePath(path)) { setUrl(path); return }
    const supabase = createClient()
    supabase.storage.from('corvette-files').createSignedUrl(path, 3600)
      .then(({ data }) => { if (data) setUrl(data.signedUrl) })
  }, [path])
  return url
}

function AttachmentRow({ att }: { att: TimelineAttachment }) {
  const signedUrl = useSignedUrl(att.fileUrl)
  const isImg = att.fileType === 'image'
  const isPdf = att.fileType === 'pdf'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      {isImg && signedUrl && (
        <a href={signedUrl} target="_blank" rel="noopener noreferrer">
          <img src={signedUrl} alt={att.name} style={{ width: '100%', maxHeight: 180, objectFit: 'cover', borderRadius: 6 }} />
        </a>
      )}
      <a
        href={signedUrl || '#'}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)',
          textDecoration: 'none', padding: '0.4rem 0.6rem',
          background: 'var(--bg-elevated)', borderRadius: 6,
          border: '1px solid var(--border-subtle)',
          opacity: signedUrl ? 1 : 0.5,
          transition: 'color 0.15s',
        }}
        className="att-link"
      >
        {isImg ? <ImageIcon size={13} /> : isPdf ? <FileIcon size={13} /> : <File size={13} />}
        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{att.name}</span>
        <ExternalLink size={11} style={{ flexShrink: 0 }} />
      </a>
    </div>
  )
}

function DocumentCard({ event }: { event: TimelineEvent }) {
  const cfg = TYPE_CONFIG.document
  const signedUrl = useSignedUrl(event.fileUrl)
  const isImg = event.fileType === 'image'

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${cfg.borderColor}`,
      borderLeft: `3px solid ${cfg.color}`,
      borderRadius: '0 10px 10px 0',
      overflow: 'hidden',
    }}>
      {/* Image preview inline */}
      {isImg && signedUrl && (
        <a href={signedUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
          <img src={signedUrl} alt={event.title} style={{ width: '100%', maxHeight: 200, objectFit: 'cover' }} />
        </a>
      )}
      <div style={{ padding: '0.9rem 1.1rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: cfg.dimColor, borderRadius: 100, padding: '0.15rem 0.55rem', marginBottom: '0.35rem' }}>
              <span style={{ color: cfg.color, display: 'flex', alignItems: 'center' }}>{cfg.icon}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: cfg.color }}>Document</span>
              {event.fileType && <span style={{ fontSize: '0.65rem', color: cfg.color, opacity: 0.7 }}>· {event.fileType}</span>}
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3, wordBreak: 'break-word' }}>
              {event.title}
            </div>
          </div>
          <a
            href={signedUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => { if (!signedUrl) e.preventDefault() }}
            style={{
              flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.72rem', fontWeight: 700, color: cfg.color,
              textDecoration: 'none', padding: '0.35rem 0.7rem',
              background: cfg.dimColor, borderRadius: 6,
              border: `1px solid ${cfg.borderColor}`,
              opacity: signedUrl ? 1 : 0.4,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}
          >
            <ExternalLink size={12} /> Open
          </a>
        </div>
      </div>
    </div>
  )
}

function PhotoCard({ event }: { event: TimelineEvent }) {
  const cfg = TYPE_CONFIG.photo
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${cfg.borderColor}`,
      borderLeft: `3px solid ${cfg.color}`,
      borderRadius: '0 10px 10px 0',
      overflow: 'hidden',
    }}>
      {event.thumbnail && (
        <a href={event.thumbnail} target="_blank" rel="noopener noreferrer" style={{ display: 'block' }}>
          <img src={event.thumbnail} alt={event.title} style={{ width: '100%', maxHeight: 220, objectFit: 'cover' }} />
        </a>
      )}
      <div style={{ padding: '0.75rem 1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: cfg.dimColor, borderRadius: 100, padding: '0.15rem 0.55rem' }}>
          <span style={{ color: cfg.color, display: 'flex', alignItems: 'center' }}>{cfg.icon}</span>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: cfg.color }}>Photo</span>
        </div>
        {event.title !== 'Photo added' && (
          <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{event.title}</span>
        )}
      </div>
    </div>
  )
}

function EventCard({ event, currency }: { event: TimelineEvent; currency: string }) {
  const cfg = TYPE_CONFIG[event.type]
  const [expanded, setExpanded] = useState(false)
  const hasExtra = event.notes || (event.attachments && event.attachments.length > 0) || event.purchaseUrl

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${cfg.borderColor}`,
      borderLeft: `3px solid ${cfg.color}`,
      borderRadius: '0 10px 10px 0',
      padding: '0.9rem 1.1rem',
      cursor: hasExtra ? 'pointer' : 'default',
      transition: 'box-shadow 0.15s',
    }}
      onClick={() => hasExtra && setExpanded(e => !e)}
      className="timeline-card"
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', background: cfg.dimColor, borderRadius: 100, padding: '0.15rem 0.55rem', marginBottom: '0.35rem' }}>
            <span style={{ color: cfg.color, display: 'flex', alignItems: 'center' }}>{cfg.icon}</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: cfg.color }}>{cfg.label}</span>
            {event.category && <span style={{ fontSize: '0.65rem', color: cfg.color, opacity: 0.7 }}>· {event.category}</span>}
          </div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
            {event.title}
          </div>
          {event.subtitle && (
            <div style={{ fontSize: '0.77rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {event.subtitle}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {event.cost != null && event.cost > 0 && (
            <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {formatCost(event.cost, currency)}
            </div>
          )}
          {event.mileage != null && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              {event.mileage.toLocaleString()} mi
            </div>
          )}
        </div>
      </div>

      {/* Expand hint */}
      {hasExtra && !expanded && (
        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
          {event.attachments?.length ? `${event.attachments.length} attachment${event.attachments.length > 1 ? 's' : ''} · ` : ''}tap to expand
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: `1px solid ${cfg.borderColor}`, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {event.notes && (
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Notes</div>
              <div style={{ fontSize: '0.79rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{event.notes}</div>
            </div>
          )}
          {event.purchaseUrl && (
            <a
              href={event.purchaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                fontSize: '0.75rem', fontWeight: 700, color: cfg.color,
                textDecoration: 'none', padding: '0.35rem 0.7rem',
                background: cfg.dimColor, borderRadius: 6,
                border: `1px solid ${cfg.borderColor}`,
                letterSpacing: '0.04em', width: 'fit-content',
              }}
            >
              <ExternalLink size={12} /> View Purchase Link
            </a>
          )}
          {event.attachments && event.attachments.length > 0 && (
            <div>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                Attachments ({event.attachments.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }} onClick={e => e.stopPropagation()}>
                {event.attachments.map(att => (
                  <AttachmentRow key={att.id} att={att} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function BuildTimeline({ events, currency, carNickname }: {
  events: TimelineEvent[]
  currency: string
  carNickname: string
}) {
  const [filter, setFilter] = useState<Filter>('All')

  const filtered = filter === 'All' ? events : events.filter(e => e.type === FILTER_MAP[filter])
  const grouped = groupByYear(filtered)
  const totalCost = events.filter(e => e.type === 'mod').reduce((s, e) => s + (e.cost ?? 0), 0)
  const modCount = events.filter(e => e.type === 'mod').length

  return (
    <div>
      {/* Summary bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
        background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
        borderRadius: 12, marginBottom: '1.5rem', overflow: 'hidden',
      }}>
        {[
          { label: 'Total Events', value: events.filter(e => e.type !== 'milestone').length.toString(), color: 'var(--text-primary)' },
          { label: 'Mods Logged',  value: modCount.toString(), color: '#e53e3e' },
          { label: 'In Mods',      value: totalCost > 0 ? formatCost(totalCost, currency) : '—', color: '#16a34a' },
        ].map((s, i) => (
          <div key={s.label} style={{ padding: '1rem', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.75rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <SlidersHorizontal size={14} color="var(--text-muted)" />
        {FILTERS.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.8rem',
            borderRadius: 100, border: filter === f ? 'none' : '1px solid var(--border-default)',
            cursor: 'pointer',
            background: filter === f ? 'var(--red)' : 'var(--bg-elevated)',
            color: filter === f ? '#fff' : 'var(--text-secondary)',
            transition: 'all 0.15s',
          }}>
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
          No {filter.toLowerCase()} events yet.
        </div>
      )}

      {/* Timeline */}
      {grouped.map(([year, yearEvents]) => (
        <div key={year} style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.04em', flexShrink: 0 }}>{year}</div>
            <div style={{ flex: 1, height: 1, background: 'var(--border-subtle)' }} />
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', flexShrink: 0 }}>
              {yearEvents.filter(e => e.type !== 'milestone').length} events
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {yearEvents.map((event, i) => (
              <div key={event.id} style={{ display: 'flex', gap: '0', alignItems: 'stretch' }}>
                {/* Gutter */}
                <div style={{ width: 48, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2, paddingTop: '0.9rem', width: '100%' }}>
                    {formatDate(event.date).split(',')[0]}
                  </div>
                  <div style={{
                    width: 10, height: 10, borderRadius: '50%', flexShrink: 0, marginTop: '0.4rem',
                    background: TYPE_CONFIG[event.type].color,
                    boxShadow: `0 0 0 3px ${TYPE_CONFIG[event.type].dimColor}`,
                    zIndex: 1,
                  }} />
                  {i < yearEvents.length - 1 && (
                    <div style={{ flex: 1, width: 1, background: 'var(--border-subtle)', marginTop: '0.3rem' }} />
                  )}
                </div>

                {/* Card */}
                <div style={{ flex: 1, paddingBottom: i < yearEvents.length - 1 ? '0.75rem' : 0, paddingTop: '0.5rem' }}>
                  {event.type === 'document' ? (
                    <DocumentCard event={event} />
                  ) : event.type === 'photo' ? (
                    <PhotoCard event={event} />
                  ) : (
                    <EventCard event={event} currency={currency} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <style>{`
        .timeline-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
        .att-link:hover { color: var(--text-primary) !important; }
      `}</style>
    </div>
  )
}
