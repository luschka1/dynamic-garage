import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Car, Wrench, ClipboardList, DollarSign, Share2, ExternalLink, Paperclip, Gauge, FileText, File, Image as ImageIcon, Tag } from 'lucide-react'
import type { Corvette, Mod, ServiceRecord, VehiclePhoto, Document } from '@/lib/types'
import PublicGallery from './PublicGallery'
import SocialShare from './SocialShare'
import ContactSellerForm from './ContactSellerForm'

export async function generateMetadata({ params }: { params: Promise<{ userId: string; corvetteId: string }> }): Promise<Metadata> {
  const { userId, corvetteId } = await params
  const supabase = await createClient()
  const { data: car } = await supabase
    .from('corvettes')
    .select('nickname, year, model, for_sale')
    .eq('id', corvetteId)
    .eq('user_id', userId)
    .eq('is_public', true)
    .single()

  if (!car) return {}

  const title = `${car.nickname} — ${car.year} ${car.model}${car.for_sale ? ' · For Sale' : ''}`
  const description = `Check out this ${car.year} ${car.model} build on Dynamic Garage.${car.for_sale ? ' Currently for sale.' : ''}`

  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function PublicSharePage({ params }: { params: Promise<{ userId: string; corvetteId: string }> }) {
  const { userId, corvetteId } = await params
  const supabase = await createClient()

  const { data: car } = await supabase
    .from('corvettes')
    .select('*')
    .eq('id', corvetteId)
    .eq('user_id', userId)
    .eq('is_public', true)
    .single()

  if (!car) notFound()

  const [{ data: mods }, { data: service }, { data: galleryPhotos }, { data: sharedDocs }] = await Promise.all([
    supabase.from('mods').select('*').eq('corvette_id', corvetteId).order('install_date', { ascending: false }),
    supabase.from('service_records').select('*').eq('corvette_id', corvetteId).order('service_date', { ascending: false }),
    supabase.from('vehicle_photos').select('*').eq('corvette_id', corvetteId).eq('is_shared', true).order('sort_order').order('created_at'),
    supabase.from('documents').select('*').eq('corvette_id', corvetteId).eq('is_shared', true),
  ])

  // Generate signed URLs for shared private documents (24h expiry)
  const docUrlMap: Record<string, string> = {}
  if (sharedDocs && sharedDocs.length > 0) {
    const privatePaths = sharedDocs.filter(d => !d.file_url.startsWith('http')).map(d => d.file_url)
    if (privatePaths.length > 0) {
      const { data: signed } = await supabase.storage.from('corvette-files').createSignedUrls(privatePaths, 86400)
      if (signed) signed.forEach(({ path, signedUrl }) => { if (path && signedUrl) docUrlMap[path] = signedUrl })
    }
    sharedDocs.forEach(d => {
      docUrlMap[d.id] = d.file_url.startsWith('http') ? d.file_url : (docUrlMap[d.file_url] || '')
    })
  }

  // Group shared docs by mod/service id; standalone = no mod or service link
  const modDocs: Record<string, Document[]> = {}
  const svcDocs: Record<string, Document[]> = {}
  const standaloneDocs: Document[] = []
  if (sharedDocs) {
    sharedDocs.forEach(d => {
      if (d.mod_id) { modDocs[d.mod_id] = [...(modDocs[d.mod_id] || []), d as Document] }
      else if (d.service_id) { svcDocs[d.service_id] = [...(svcDocs[d.service_id] || []), d as Document] }
      else { standaloneDocs.push(d as Document) }
    })
  }

  const c = car as Corvette
  const totalModCost = (mods || []).reduce((s, m) => s + (m.cost || 0), 0)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── NAV ── */}
      <nav style={{ background: '#111', borderBottom: '1px solid #222', padding: '0 2rem', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 900, fontSize: '1.15rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span style={{ color: '#a8a8a8' }}>Dynamic</span><span style={{ color: 'var(--red)' }}> Garage</span>
          </span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#888', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Share2 size={12} /> Public Build
          </span>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* ── CAR HERO CARD ── */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', marginBottom: '1.5rem', boxShadow: 'var(--shadow-card)' }}>
          {/* Photo */}
          <div style={{ position: 'relative', height: 300, background: 'linear-gradient(135deg, #111 0%, #1c1c1c 100%)', overflow: 'hidden' }}>
            {c.photo_url ? (
              <img src={c.photo_url} alt={c.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={72} color="#444" strokeWidth={1} />
              </div>
            )}
            {/* Gradient overlay for text legibility */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 55%)' }} />

            {/* For Sale banner */}
            {c.for_sale && (
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                zIndex: 10,
                background: '#16a34a',
                color: 'white',
                padding: '0.45rem 1rem',
                borderRadius: 6,
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                fontFamily: "'Barlow Condensed'",
                fontSize: '1.1rem',
                fontWeight: 900,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                boxShadow: '0 2px 12px rgba(0,0,0,0.45)',
              }}>
                <Tag size={14} strokeWidth={2.5} /> For Sale
              </div>
            )}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 2rem' }}>
              <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 900, color: 'white', letterSpacing: '0.01em', lineHeight: 1, marginBottom: '0.3rem' }}>
                {c.nickname.toUpperCase()}
              </h1>
              <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>
                {c.year} {c.model}{c.trim ? ` · ${c.trim}` : ''}{c.color ? ` · ${c.color}` : ''}
              </p>
              {c.mileage && (
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.45)', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Gauge size={13} /> {c.mileage.toLocaleString()} miles
                </p>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display: 'grid', gridTemplateColumns: totalModCost > 0 ? '1fr 1fr 1fr' : '1fr 1fr', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.25rem 1rem', gap: '0.2rem', borderRight: '1px solid var(--border-subtle)' }}>
              <Wrench size={15} color="var(--red)" />
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '2rem', fontWeight: 900, lineHeight: 1, color: 'var(--text-primary)' }}>{mods?.length || 0}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Modifications</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.25rem 1rem', gap: '0.2rem', borderRight: totalModCost > 0 ? '1px solid var(--border-subtle)' : 'none' }}>
              <ClipboardList size={15} color="var(--blue)" />
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '2rem', fontWeight: 900, lineHeight: 1, color: 'var(--text-primary)' }}>{service?.length || 0}</div>
              <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Service Records</div>
            </div>
            {totalModCost > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.25rem 1rem', gap: '0.2rem' }}>
                <DollarSign size={15} color="var(--gold)" />
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '2rem', fontWeight: 900, lineHeight: 1, color: 'var(--text-primary)' }}>
                  ${totalModCost.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Total in Mods</div>
              </div>
            )}
          </div>
        </div>

        {/* ── CONTACT SELLER ── */}
        {c.for_sale && (
          <ContactSellerForm
            corvetteId={c.id}
            vehicleLabel={`${c.year} ${c.model} — ${c.nickname}`}
          />
        )}

        {/* ── VIN DECODER CTA ── */}
        {c.vin && c.show_vin_decoder && (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            boxShadow: 'var(--shadow-card)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Gauge size={22} color="white" strokeWidth={1.75} />
              </div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                  VIN Decoder
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                  Decode this vehicle&apos;s specs, trim, and factory options from the NHTSA database.
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0 0', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                  VIN: {c.vin}
                </p>
              </div>
            </div>
            <a
              href={`https://vpic.nhtsa.dot.gov/decoder/VinDecoder?VIN=${c.vin}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
                color: 'white',
                fontFamily: "'Barlow Condensed'",
                fontSize: '0.95rem',
                fontWeight: 800,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.65rem 1.4rem',
                borderRadius: 6,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(29,78,216,0.35)',
                transition: 'opacity 150ms, box-shadow 150ms',
                flexShrink: 0,
              }}
              className="vin-decode-btn"
            >
              Decode VIN <ExternalLink size={13} />
            </a>
          </div>
        )}

        {/* ── PHOTO GALLERY ── */}
        {galleryPhotos && galleryPhotos.length > 0 && (
          <PublicGallery photos={galleryPhotos as VehiclePhoto[]} />
        )}

        {/* ── MODIFICATIONS ── */}
        {mods && mods.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <Wrench size={16} color="var(--red)" />
              <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                Modifications
              </h2>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>({mods.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(mods as Mod[]).map(mod => (
                <div key={mod.id} className="record-row red" style={{ padding: '1.25rem 1.5rem' }}>

                  {/* Name + cost */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: (mod.vendor || mod.install_date || mod.notes || modDocs[mod.id]) ? '0.9rem' : 0 }}>
                    <div>
                      <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.02em', color: 'var(--text-primary)', lineHeight: 1.1, margin: 0 }}>{mod.name}</h3>
                      {mod.category && <div style={{ marginTop: '0.35rem' }}><span className="badge badge-red">{mod.category}</span></div>}
                    </div>
                    {mod.cost != null && (
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Cost</div>
                        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '0.05rem' }}>
                          <DollarSign size={14} />{mod.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Labeled meta fields */}
                  {(mod.vendor || mod.install_date) && (
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', marginBottom: (mod.notes || modDocs[mod.id]) ? '0.75rem' : 0 }}>
                      {mod.vendor && (
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Vendor</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{mod.vendor}</div>
                        </div>
                      )}
                      {mod.install_date && (
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Install Date</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {new Date(mod.install_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {mod.notes && (
                    <div style={{ paddingTop: mod.vendor || mod.install_date ? 0 : '0.75rem', borderTop: mod.vendor || mod.install_date ? 'none' : '1px solid var(--border-subtle)', marginBottom: (mod.purchase_url || modDocs[mod.id]) ? '0.75rem' : 0 }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Notes</div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{mod.notes}</p>
                    </div>
                  )}

                  {/* Where to Buy */}
                  {mod.purchase_url && (
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', marginBottom: modDocs[mod.id] ? '0.75rem' : 0 }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Where to Buy</div>
                      <a href={mod.purchase_url} target="_blank" rel="noopener noreferrer"
                        style={{ fontSize: '0.88rem', color: 'var(--red)', fontWeight: 600, wordBreak: 'break-all', textDecoration: 'none' }}
                        className="purchase-link"
                      >
                        {mod.purchase_url}
                      </a>
                    </div>
                  )}

                  {/* Shared receipts */}
                  {modDocs[mod.id] && modDocs[mod.id].length > 0 && (
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>Receipt/Photo/File</span>
                      {modDocs[mod.id].map(doc => (
                        <a key={doc.id} href={docUrlMap[doc.id] || '#'} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '0.3rem 0.65rem', textDecoration: 'none', transition: 'color 150ms' }}
                          className="receipt-link"
                        >
                          <Paperclip size={11} />{doc.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── SERVICE HISTORY ── */}
        {service && service.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <ClipboardList size={16} color="var(--blue)" />
              <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                Service History
              </h2>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>({service.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(service as ServiceRecord[]).map(rec => (
                <div key={rec.id} className="record-row blue" style={{ padding: '1.25rem 1.5rem' }}>

                  {/* Title + cost */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: (rec.shop || rec.service_date || rec.mileage || rec.notes || svcDocs[rec.id]) ? '0.9rem' : 0 }}>
                    <div>
                      <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.3rem', fontWeight: 900, letterSpacing: '0.02em', color: 'var(--text-primary)', lineHeight: 1.1, margin: 0 }}>{rec.title}</h3>
                      {rec.category && <div style={{ marginTop: '0.35rem' }}><span className="badge badge-blue">{rec.category}</span></div>}
                    </div>
                    {rec.cost != null && (
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Cost</div>
                        <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1, display: 'flex', alignItems: 'center', gap: '0.05rem' }}>
                          <DollarSign size={14} />{rec.cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Labeled meta fields */}
                  {(rec.shop || rec.service_date || rec.mileage) && (
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', marginBottom: (rec.notes || svcDocs[rec.id]) ? '0.75rem' : 0 }}>
                      {rec.shop && (
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Shop / Technician</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{rec.shop}</div>
                        </div>
                      )}
                      {rec.service_date && (
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Service Date</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                            {new Date(rec.service_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      )}
                      {rec.mileage && (
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Mileage</div>
                          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{rec.mileage.toLocaleString()} mi</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Notes */}
                  {rec.notes && (
                    <div style={{ paddingTop: rec.shop || rec.service_date || rec.mileage ? 0 : '0.75rem', borderTop: rec.shop || rec.service_date || rec.mileage ? 'none' : '1px solid var(--border-subtle)', marginBottom: svcDocs[rec.id] ? '0.75rem' : 0 }}>
                      <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Notes</div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{rec.notes}</p>
                    </div>
                  )}

                  {/* Shared receipts */}
                  {svcDocs[rec.id] && svcDocs[rec.id].length > 0 && (
                    <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>Receipt/Photo/File</span>
                      {svcDocs[rec.id].map(doc => (
                        <a key={doc.id} href={docUrlMap[doc.id] || '#'} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 4, padding: '0.3rem 0.65rem', textDecoration: 'none', transition: 'color 150ms' }}
                          className="receipt-link"
                        >
                          <Paperclip size={11} />{doc.name}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── DOCUMENTS ── */}
        {standaloneDocs.length > 0 && (
          <section style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <FileText size={16} color="var(--green)" />
              <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                Documents
              </h2>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginLeft: '0.25rem' }}>({standaloneDocs.length})</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {standaloneDocs.map(doc => {
                const docUrl = docUrlMap[doc.id] || ''
                const isImage = doc.file_type === 'image'
                const isPdf = doc.file_type === 'pdf'
                return (
                  <div key={doc.id} className="record-row green" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                    {/* Icon */}
                    <div style={{
                      width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {isImage
                        ? <ImageIcon size={20} color="var(--green)" strokeWidth={1.5} />
                        : isPdf
                          ? <FileText size={20} color="var(--green)" strokeWidth={1.5} />
                          : <File size={20} color="var(--green)" strokeWidth={1.5} />
                      }
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.15rem', fontWeight: 900, letterSpacing: '0.02em', color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: '0.35rem' }}>
                        {doc.name}
                      </div>
                      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Type</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {isImage ? 'Image' : isPdf ? 'PDF' : 'File'}
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Added</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                            {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                        {doc.file_size && (
                          <div>
                            <div style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.15rem' }}>Size</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                              {doc.file_size < 1024 * 1024
                                ? `${(doc.file_size / 1024).toFixed(1)} KB`
                                : `${(doc.file_size / 1024 / 1024).toFixed(1)} MB`}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Open button */}
                    {docUrl && (
                      <a
                        href={docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-default)',
                          color: 'var(--text-secondary)',
                          fontFamily: "'Barlow Condensed'",
                          fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                          padding: '0.5rem 1rem', borderRadius: 6, textDecoration: 'none',
                          transition: 'color 150ms, border-color 150ms',
                          flexShrink: 0,
                        }}
                        className="doc-open-btn"
                      >
                        <ExternalLink size={13} /> Open
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ── EMPTY STATE ── */}
        {(!mods || mods.length === 0) && (!service || service.length === 0) && standaloneDocs.length === 0 && (
          <div className="empty-state">
            <Car size={40} color="var(--text-muted)" strokeWidth={1.5} style={{ margin: '0 auto 1rem' }} />
            <h3>Nothing logged yet</h3>
            <p>The owner hasn&apos;t added any mods or service records yet.</p>
          </div>
        )}

        {/* ── SOCIAL SHARE ── */}
        <SocialShare
          url={`https://dynamicgarage.app/share/${userId}/${corvetteId}`}
          title={`${c.year} ${c.nickname}`}
        />

        {/* ── FOOTER CTA ── */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-subtle)' }}>
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
        .vin-decode-btn:hover { opacity: 0.88; box-shadow: 0 4px 14px rgba(29,78,216,0.45) !important; }
        .receipt-link:hover { color: var(--text-primary) !important; border-color: var(--border-default) !important; }
        .doc-open-btn:hover { color: var(--text-primary) !important; border-color: var(--border-strong) !important; }
        .purchase-link:hover { opacity: 0.75; }
      `}</style>
    </div>
  )
}
