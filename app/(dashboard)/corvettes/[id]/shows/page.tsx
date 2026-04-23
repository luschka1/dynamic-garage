import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trophy, Star, MapPin, Calendar, Flag } from 'lucide-react'
import AddShowForm from './AddShowForm'
import type { ShowEvent } from '@/lib/types'

function placementColor(placement?: string) {
  if (!placement) return { bg: 'var(--bg-elevated)', color: 'var(--text-muted)', border: 'var(--border-subtle)' }
  const p = placement.toLowerCase()
  if (p.includes('1st') || p.includes('best in show')) return { bg: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' }
  if (p.includes('2nd')) return { bg: 'rgba(156,163,175,0.12)', color: '#9ca3af', border: 'rgba(156,163,175,0.3)' }
  if (p.includes('3rd')) return { bg: 'rgba(180,83,9,0.12)', color: '#b45309', border: 'rgba(180,83,9,0.3)' }
  if (p.includes('people') || p.includes('choice')) return { bg: 'rgba(99,102,241,0.12)', color: '#6366f1', border: 'rgba(99,102,241,0.3)' }
  if (p.includes('best')) return { bg: 'rgba(16,185,129,0.12)', color: '#10b981', border: 'rgba(16,185,129,0.3)' }
  return { bg: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: 'var(--border-subtle)' }
}

export default async function ShowsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: car } = await supabase.from('corvettes').select('nickname, year, model').eq('id', id).eq('user_id', user.id).single()
  if (!car) notFound()

  const { data: shows } = await supabase
    .from('show_events')
    .select('*')
    .eq('corvette_id', id)
    .order('event_date', { ascending: false })

  const showList = (shows ?? []) as ShowEvent[]
  const trophyCount = showList.filter(s => s.trophy).length
  const placedCount = showList.filter(s => s.placement && s.placement !== 'Participant').length

  return (
    <div>
      <Link href={`/corvettes/${id}`} className="back-link">
        <ArrowLeft size={14} /> {car.nickname}
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
            <Trophy size={18} color="#f59e0b" />
            <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(1.6rem, 4vw, 2.2rem)', fontWeight: 900, letterSpacing: '0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>
              SHOW HISTORY
            </h1>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {showList.length > 0 ? `${showList.length} event${showList.length > 1 ? 's' : ''} logged` : 'No shows logged yet'}
          </p>
        </div>
      </div>

      {/* Add show form - full width below header */}
      <AddShowForm corvetteId={id} />

      {/* Stats bar */}
      {showList.length > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, marginBottom: '1.5rem', overflow: 'hidden',
        }}>
          {[
            { label: 'Shows Attended', value: showList.length, color: 'var(--text-primary)', icon: <Flag size={14} /> },
            { label: 'Placements', value: placedCount, color: '#6366f1', icon: <Star size={14} /> },
            { label: 'Trophies Won', value: trophyCount, color: '#f59e0b', icon: <Trophy size={14} /> },
          ].map((s, i) => (
            <div key={s.label} style={{ padding: '1rem', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'center', color: s.color, marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.75rem', fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {showList.length === 0 && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, padding: '3rem 2rem', textAlign: 'center',
        }}>
          <Trophy size={44} color="var(--text-muted)" strokeWidth={1} style={{ marginBottom: '1rem' }} />
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>No shows logged yet</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Log your first car show and start building your event history.
          </div>
        </div>
      )}

      {/* Show list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {showList.map(show => {
          const pc = placementColor(show.placement ?? undefined)
          const date = new Date(show.event_date + 'T12:00:00')
          return (
            <Link key={show.id} href={`/corvettes/${id}/shows/${show.id}`} style={{ textDecoration: 'none' }}>
              <div className="show-card" style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                borderRadius: 12, padding: '1.1rem 1.25rem',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                {/* Trophy indicator */}
                <div style={{
                  width: 44, height: 44, borderRadius: 10, flexShrink: 0,
                  background: show.trophy ? 'rgba(245,158,11,0.12)' : 'var(--bg-elevated)',
                  border: `1px solid ${show.trophy ? 'rgba(245,158,11,0.3)' : 'var(--border-subtle)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: show.trophy ? '#f59e0b' : 'var(--text-muted)',
                }}>
                  <Trophy size={20} />
                </div>

                {/* Main info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {show.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                      <Calendar size={11} />
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    {show.location && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        <MapPin size={11} /> {show.location}
                      </span>
                    )}
                    {show.class && (
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>· {show.class}</span>
                    )}
                  </div>
                </div>

                {/* Placement badge */}
                {show.placement && (
                  <div style={{
                    flexShrink: 0, padding: '0.3rem 0.75rem', borderRadius: 100,
                    background: pc.bg, border: `1px solid ${pc.border}`,
                    fontSize: '0.72rem', fontWeight: 700, color: pc.color,
                    whiteSpace: 'nowrap',
                  }}>
                    {show.placement}
                  </div>
                )}
              </div>
            </Link>
          )
        })}
      </div>

      <style>{`
        .show-card:hover { border-color: var(--border-default) !important; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
      `}</style>
    </div>
  )
}
