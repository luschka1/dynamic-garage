import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wrench, Paperclip } from 'lucide-react'
import type { Corvette, Mod } from '@/lib/types'
import AddModForm from './AddModForm'

/* ── tiny reusable label/value ── */
function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
        {label}
      </div>
      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
        {value}
      </div>
    </div>
  )
}

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
              ${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
              <div key={mod.id} className="record-row red" style={{ padding: '1.25rem 1.5rem' }}>

                {/* ── Row 1: name + cost ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.9rem' }}>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.35rem', fontWeight: 900, letterSpacing: '0.02em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
                      {mod.name}
                    </div>
                    {mod.category && (
                      <div style={{ marginTop: '0.35rem' }}>
                        <span className="badge badge-red">{mod.category}</span>
                      </div>
                    )}
                  </div>

                  {mod.cost != null && (
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>
                        Cost
                      </div>
                      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
                        ${mod.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  )}
                </div>

                {/* ── Row 2: labeled meta fields ── */}
                {(mod.vendor || mod.install_date) && (
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', marginBottom: mod.notes ? '0.75rem' : '0' }}>
                    {mod.vendor && <Field label="Vendor" value={mod.vendor} />}
                    {mod.install_date && (
                      <Field
                        label="Install Date"
                        value={new Date(mod.install_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      />
                    )}
                  </div>
                )}

                {/* ── Row 3: notes ── */}
                {mod.notes && (
                  <div style={{ paddingTop: '0.75rem', borderTop: mod.vendor || mod.install_date ? 'none' : '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Notes
                    </div>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
                      {mod.notes}
                    </p>
                  </div>
                )}

                {/* ── Row 4: purchase URL ── */}
                {mod.purchase_url && (
                  <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                      Where to Buy
                    </div>
                    <a href={mod.purchase_url} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: '0.88rem', color: 'var(--red)', fontWeight: 600, wordBreak: 'break-all', textDecoration: 'none' }}
                      className="purchase-link"
                    >
                      {mod.purchase_url}
                    </a>
                  </div>
                )}

                {/* ── Row 4: receipt link ── */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '0.75rem', marginTop: '0.25rem', borderTop: '1px solid var(--border-subtle)' }}>
                  <Link
                    href={`/corvettes/${id}/documents?mod=${mod.id}`}
                    className="attach-link"
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', transition: 'color 150ms', textDecoration: 'none' }}
                  >
                    <Paperclip size={11} /> Attach / View Receipt
                  </Link>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`.attach-link:hover { color: var(--text-secondary) !important; }`}</style>
    </div>
  )
}
