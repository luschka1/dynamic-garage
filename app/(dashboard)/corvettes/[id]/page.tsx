import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wrench, ClipboardList, FileText, Share2, ExternalLink, Download, Camera, Check } from 'lucide-react'
import EditCorvetteForm from './EditCorvetteForm'
import QRShareCard from './QRShareCard'
import MileageDisplay from '@/components/MileageDisplay'
import MileageToggle from '@/components/MileageToggle'
import PhotoGalleryManager from './PhotoGalleryManager'
import EmailUploadAddress from './EmailUploadAddress'
import RecallTracker from '@/components/RecallTracker'
import InsuranceScore from '@/components/InsuranceScore'
import GettingStartedChecklist from '@/components/ui/GettingStartedChecklist'
import { calcInsuranceSummary } from '@/lib/insurance'
import type { Corvette, Mod, VehiclePhoto } from '@/lib/types'

export default async function CorvettePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: car } = await supabase.from('corvettes').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!car) notFound()

  const [
    { data: modsData, count: modCount },
    { count: svcCount },
    { count: docCount },
    { data: photos },
  ] = await Promise.all([
    supabase.from('mods').select('*', { count: 'exact' }).eq('corvette_id', id),
    supabase.from('service_records').select('*', { count: 'exact', head: true }).eq('corvette_id', id),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('corvette_id', id),
    supabase.from('vehicle_photos').select('*').eq('corvette_id', id).order('sort_order').order('created_at'),
  ])

  const modList = (modsData ?? []) as Mod[]
  const modIds = modList.map(m => m.id)
  const { data: receiptDocs } = modIds.length > 0
    ? await supabase.from('documents').select('mod_id').in('mod_id', modIds)
    : { data: [] }
  const receiptSet = new Set<string>(
    (receiptDocs ?? []).map((d: { mod_id: string }) => d.mod_id).filter(Boolean)
  )
  const insuranceSummary = calcInsuranceSummary(modList, receiptSet)

  const c = car as Corvette

  return (
    <div>
      <Link href="/dashboard" className="back-link">
        <ArrowLeft size={14} /> My Garage
      </Link>

      {/* Car hero */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, overflow: 'hidden', marginBottom: '1.5rem' }}>
        {/* Photo strip */}
        <div style={{ height: 220, background: 'linear-gradient(135deg, #111 0%, #1c1c1c 100%)', position: 'relative', overflow: 'hidden' }}>
          {c.photo_url ? (
            <img src={c.photo_url} alt={c.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={56} color="var(--text-muted)" strokeWidth={1} />
            </div>
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 55%)' }} />
          <div className="hero-overlay">
            <div>
              <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1, color: 'white' }}>
                {c.nickname.toUpperCase()}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                <span>{c.year} {c.model}{c.trim ? ` · ${c.trim}` : ''}{c.color ? ` · ${c.color}` : ''}</span>
                {c.mileage && (
                  <>
                    <span style={{ opacity: 0.4 }}>·</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                      <MileageDisplay value={c.mileage} />
                      <MileageToggle />
                    </span>
                  </>
                )}
              </p>
            </div>
            {c.is_public && (
              <Link href={`/share/${user.id}/${id}`} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(22,163,74,0.8)', backdropFilter: 'blur(4px)', color: '#86efac', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.45rem 0.8rem', borderRadius: 4, textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
                <Share2 size={13} /> Public Page <ExternalLink size={11} />
              </Link>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--border-subtle)' }}>
          {[
            { label: 'Mods', count: modCount ?? 0, href: `/corvettes/${id}/mods`, color: 'var(--red)', icon: <Wrench size={16} /> },
            { label: 'Service', count: svcCount ?? 0, href: `/corvettes/${id}/service`, color: '#2563eb', icon: <ClipboardList size={16} /> },
            { label: 'Documents', count: docCount ?? 0, href: `/corvettes/${id}/documents`, color: '#16a34a', icon: <FileText size={16} /> },
          ].map((s, i) => (
            <Link key={s.label} href={s.href} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '1.25rem 1rem', gap: '0.25rem', textDecoration: 'none',
              borderRight: i < 2 ? '1px solid var(--border-subtle)' : 'none',
              transition: 'background 150ms',
            }}
              className="stat-link"
            >
              <div style={{ color: s.color, marginBottom: '0.1rem' }}>{s.icon}</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '2rem', fontWeight: 900, lineHeight: 1, color: 'var(--text-primary)' }}>{s.count}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>{s.label}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Getting Started checklist */}
      <GettingStartedChecklist
        carId={id}
        hasPhoto={(photos ?? []).length > 0 || !!c.photo_url}
        hasMods={(modCount ?? 0) > 0}
        hasService={(svcCount ?? 0) > 0}
        hasDocs={(docCount ?? 0) > 0}
        isPublic={c.is_public}
        inGallery={c.in_gallery ?? false}
      />

      {/* Quick nav */}
      <div className="quick-nav" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Mods', href: `/corvettes/${id}/mods` },
          { label: 'Service', href: `/corvettes/${id}/service` },
          { label: 'Documents', href: `/corvettes/${id}/documents` },
          { label: 'Insurance', href: `/corvettes/${id}/insurance` },
          { label: 'Shows', href: `/corvettes/${id}/shows` },
          { label: 'Timeline', href: `/corvettes/${id}/timeline` },
        ].map(l => (
          <Link key={l.label} href={l.href} className="btn-secondary" style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '0.7rem', minHeight: 44, borderColor: 'var(--border-default)' }}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Insurance Score */}
      <InsuranceScore summary={insuranceSummary} corvetteId={id} currency={c.currency} />

      {/* Share / Export row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {c.is_public && (
          <Link
            href={`/share/${user.id}/${id}`}
            target="_blank"
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.1rem', minHeight: 42, gap: '0.5rem', borderColor: 'var(--border-default)' }}
          >
            <ExternalLink size={15} /> View Public Page
          </Link>
        )}
        {c.is_public && (
          <QRShareCard
            shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/share/${user.id}/${id}`}
            nickname={c.nickname}
            year={c.year}
            model={c.model}
            trim={c.trim}
            color={c.color}
            photoUrl={c.photo_url}
            modCount={modCount ?? 0}
            svcCount={svcCount ?? 0}
          />
        )}
        <Link
          href={`/corvettes/${id}/print`}
          target="_blank"
          className="btn-secondary"
          style={{ fontSize: '0.85rem', padding: '0.6rem 1.1rem', minHeight: 42, gap: '0.5rem', borderColor: 'var(--border-default)' }}
        >
          <Download size={15} /> Export to PDF
        </Link>
        {c.is_public && (
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            This build is publicly visible
          </span>
        )}
      </div>

      {/* Photo gallery manager */}
      <div id="photos" style={{ scrollMarginTop: '1rem' }} />
      <PhotoGalleryManager
        corvetteId={id}
        userId={user.id}
        initialPhotos={(photos ?? []) as VehiclePhoto[]}
        coverUrl={c.photo_url}
      />

      {/* Email upload */}
      {c.email_token && (
        <EmailUploadAddress
          emailAddress={`${c.email_token}@${process.env.NEXT_PUBLIC_UPLOAD_EMAIL_DOMAIN ?? 'uploads.dynamicgarage.app'}`}
          vehicleName={`${c.year} ${c.nickname}`}
        />
      )}

      {/* NHTSA Recall Tracker - only shown when a VIN is on file */}
      {c.vin && (() => {
        // model field stores "Make Model" e.g. "Chevrolet Corvette"
        const MAKES = ['Acura','Alfa Romeo','Aston Martin','Audi','Bentley','BMW','Buick','Cadillac','Chevrolet','Chrysler','Dodge','Ferrari','Fiat','Ford','Genesis','GMC','Honda','Hyundai','Infiniti','Jaguar','Jeep','Kia','Lamborghini','Land Rover','Lexus','Lincoln','Lotus','Maserati','Mazda','McLaren','Mercedes-Benz','MINI','Mitsubishi','Nissan','Pontiac','Porsche','RAM','Rolls-Royce','Subaru','Tesla','Toyota','Volkswagen','Volvo','Other']
        const combined = c.model ?? ''
        const detectedMake = MAKES.find(m => combined.startsWith(m)) ?? combined.split(' ')[0] ?? ''
        const detectedModel = detectedMake ? combined.slice(detectedMake.length).trim() : combined
        return (
          <RecallTracker
            corvetteId={id}
            vin={c.vin}
            make={detectedMake}
            model={detectedModel}
            year={c.year}
            initialAlerts={c.recall_alerts}
            initialLastCheck={c.last_recall_check ?? null}
            initialKnownIds={c.known_recall_ids ?? []}
          />
        )
      })()}

      {/* Edit form */}
      <EditCorvetteForm car={c} />

      <style>{`
        .stat-link:hover { background: rgba(0,0,0,0.03); }
        .hero-overlay {
          position: absolute; bottom: 0; left: 0; right: 0;
          padding: 1.5rem 2rem;
          display: flex; align-items: flex-end; justify-content: space-between;
        }
        .quick-nav { grid-template-columns: repeat(6, 1fr) !important; }
        @media (max-width: 640px) {
          .hero-overlay { padding: 1rem 1rem; }
          .quick-nav { grid-template-columns: repeat(3, 1fr) !important; gap: 0.5rem !important; }
        }
      `}</style>
    </div>
  )
}
