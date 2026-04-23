import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wrench } from 'lucide-react'
import type { Corvette, Mod } from '@/lib/types'
import { formatCurrency } from '@/lib/currency'
import AddModForm from './AddModForm'
import ModCard from './ModCard'


export default async function ModsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: car } = await supabase.from('corvettes').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!car) notFound()

  const { data: mods } = await supabase
    .from('mods')
    .select('*')
    .eq('corvette_id', id)
    .order('install_date', { ascending: false })

  const totalCost = (mods || []).reduce((s, m) => s + (m.cost || 0), 0)
  const c = car as Corvette

  return (
    <div>
      <Link href={`/corvettes/${id}`} className="back-link">
        <ArrowLeft size={14} /> {c.nickname}
      </Link>

      {/* ── Page header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <p className="page-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Wrench size={12} /> Modifications
          </p>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1 }}>
            {c.year} {c.nickname.toUpperCase()}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
            {c.model}{c.trim ? ` · ${c.trim}` : ''}
          </p>
        </div>

        {totalCost > 0 && (
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderRadius: 8, padding: '1rem 1.5rem', textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Total Invested
            </div>
            <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '2rem', fontWeight: 900, color: 'var(--red-bright)', lineHeight: 1 }}>
              {formatCurrency(totalCost, c.currency)}
            </div>
          </div>
        )}
      </div>

      {/* Count pill */}
      {mods && mods.length > 0 && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 6, padding: '0.65rem 1.25rem', display: 'flex', gap: '0.5rem', alignItems: 'baseline' }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>{mods.length}</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
              Modification{mods.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* ── Add form ── */}
      <AddModForm corvetteId={id} />

      {/* ── Empty state ── */}
      {(!mods || mods.length === 0) && (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <Wrench size={40} color="var(--text-muted)" strokeWidth={1.5} style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            No Mods Logged Yet
          </h3>
          <p>Use the form above to start logging your modifications.</p>
        </div>
      )}

      {/* ── Mod cards ── */}
      {mods && mods.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>Mod List</h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {(mods as Mod[]).map(mod => (
              <ModCard key={mod.id} mod={mod} corvetteId={id} currency={c.currency} />
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
