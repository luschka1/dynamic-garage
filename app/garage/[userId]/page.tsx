import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Tag, Wrench, ClipboardList, Share2 } from 'lucide-react'
import type { Corvette } from '@/lib/types'
import GarageSocialShare from './SocialShare'
import PublicNav from '@/components/layout/PublicNav'

export async function generateMetadata({ params }: { params: Promise<{ userId: string }> }): Promise<Metadata> {
  const { userId } = await params
  const admin = createAdminClient()
  const { data: ownerData } = await admin.auth.admin.getUserById(userId)
  const name = ownerData?.user?.user_metadata?.full_name?.split(' ')[0]
    || ownerData?.user?.email?.split('@')[0]
    || 'A'
  const title = `${name}'s Garage — Dynamic Garage`
  return {
    title,
    description: `Browse ${name}'s car collection on Dynamic Garage.`,
    openGraph: { title, type: 'website' },
    twitter: { card: 'summary_large_image', title },
  }
}

export default async function PublicGaragePage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  const supabase = await createClient()

  const { data: cars } = await supabase
    .from('corvettes')
    .select('*')
    .eq('user_id', userId)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  if (!cars || cars.length === 0) notFound()

  // Get owner's name
  const admin = createAdminClient()
  const { data: ownerData } = await admin.auth.admin.getUserById(userId)
  const ownerName = ownerData?.user?.user_metadata?.full_name?.split(' ')[0]
    || ownerData?.user?.email?.split('@')[0]
    || 'This'

  // Get mod/service counts
  const ids = cars.map(c => c.id)
  const [{ data: modCounts }, { data: svcCounts }] = await Promise.all([
    supabase.from('mods').select('corvette_id').in('corvette_id', ids),
    supabase.from('service_records').select('corvette_id').in('corvette_id', ids),
  ])

  const modMap: Record<string, number> = {}
  const svcMap: Record<string, number> = {}
  for (const m of modCounts ?? []) modMap[m.corvette_id] = (modMap[m.corvette_id] ?? 0) + 1
  for (const s of svcCounts ?? []) svcMap[s.corvette_id] = (svcMap[s.corvette_id] ?? 0) + 1

  const forSaleCount = cars.filter(c => c.for_sale).length

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* Nav */}
      <PublicNav badge={<><Share2 size={12} /> Public Garage</>} />

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            lineHeight: 1,
            marginBottom: '0.5rem',
          }}>
            {ownerName}&apos;s Garage
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {cars.length} vehicle{cars.length !== 1 ? 's' : ''}
            </span>
            {forSaleCount > 0 && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.35rem',
                background: 'rgba(22,163,74,0.1)', color: '#16a34a',
                fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.08em',
                textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: 4,
              }}>
                <Tag size={10} /> {forSaleCount} for sale
              </span>
            )}
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '1.25rem',
        }}>
          {cars.map(car => {
            const c = car as Corvette
            return (
              <Link
                key={c.id}
                href={`/share/${userId}/${c.id}`}
                style={{ textDecoration: 'none', display: 'block' }}
              >
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 12,
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-card)',
                  transition: 'box-shadow 0.15s, transform 0.15s',
                }}
                  className="garage-card"
                >
                  {/* Photo */}
                  <div style={{ position: 'relative', height: 200, background: 'linear-gradient(135deg, #111 0%, #1c1c1c 100%)', overflow: 'hidden' }}>
                    {c.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.photo_url}
                        alt={c.nickname}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                      />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>No photo</span>
                      </div>
                    )}
                    {c.for_sale && (
                      <div style={{
                        position: 'absolute', top: '0.75rem', right: '0.75rem',
                        background: '#16a34a', color: 'white',
                        padding: '0.25rem 0.65rem', borderRadius: 4,
                        fontSize: '0.7rem', fontWeight: 800,
                        letterSpacing: '0.1em', textTransform: 'uppercase',
                        display: 'flex', alignItems: 'center', gap: '0.3rem',
                      }}>
                        <Tag size={10} /> For Sale
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '1rem 1.25rem' }}>
                    <h2 style={{
                      fontFamily: "'Barlow Condensed', sans-serif",
                      fontWeight: 900,
                      fontSize: '1.5rem',
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                      color: 'var(--text-primary)',
                      lineHeight: 1,
                      marginBottom: '0.25rem',
                    }}>
                      {c.nickname}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                      {c.year} {c.model}{c.trim ? ` · ${c.trim}` : ''}{c.color ? ` · ${c.color}` : ''}
                    </p>
                    <div style={{ display: 'flex', gap: '1.25rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <Wrench size={12} color="var(--red)" />
                        {modMap[c.id] ?? 0} mod{(modMap[c.id] ?? 0) !== 1 ? 's' : ''}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <ClipboardList size={12} color="var(--blue)" />
                        {svcMap[c.id] ?? 0} service record{(svcMap[c.id] ?? 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Social share */}
        <GarageSocialShare
          url={`https://dynamicgarage.app/garage/${userId}`}
          ownerName={ownerName}
        />

        {/* Footer CTA */}
        <div style={{ textAlign: 'center', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
          <p style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.6rem' }}>
            Build Your Own
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Track mods, photos, service history, and documents for any vehicle — free during early access.
          </p>
          <Link href="/register" className="btn-primary" style={{ display: 'inline-flex' }}>
            Create My Free Garage
          </Link>
        </div>
      </div>

      <style>{`
        .garage-card:hover {
          box-shadow: var(--shadow-hover) !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  )
}
