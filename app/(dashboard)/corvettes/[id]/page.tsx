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
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem 2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, lineHeight: 1, color: 'white' }}>
                {c.nickname.toUpperCase()}
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
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
              <Link href={`/share/${user.id}/${id}`} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(22,163,74,0.8)', backdropFilter: 'blur(4px)', color: '#86efac', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '0.5rem 0.9rem', borderRadius: 4, textDecoration: 'none' }}>
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

      {/* Getting Started checklist — shown until all 3 steps are complete */}
      {(() => {
        const hasPhoto = (photos ?? []).length > 0 || !!c.photo_url
        const hasMods = (modCount ?? 0) > 0
        const hasService = (svcCount ?? 0) > 0
        const allDone = hasPhoto && hasMods && hasService
        if (allDone) return null

        const steps = [
          {
            done: hasPhoto,
            icon: <Camera size={15} />,
            label: 'Add a cover photo',
            desc: 'Put a face to your build',
            href: `#photos`,
            cta: 'Upload photo',
          },
          {
            done: hasMods,
            icon: <Wrench size={15} />,
            label: 'Log your first mod',
            desc: 'Parts, tunes, upgrades',
            href: `/corvettes/${id}/mods`,
            cta: 'Add mod',
          },
          {
            done: hasService,
            icon: <ClipboardList size={15} />,
            label: 'Add a service record',
            desc: 'Oil changes, repairs, inspections',
            href: `/corvettes/${id}/service`,
            cta: 'Log service',
          },
        ]
        const doneCount = steps.filter(s => s.done).length

        return (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 12,
            padding: '1.25rem 1.5rem',
            marginBottom: '1rem',
            boxShadow: 'var(--shadow-card)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.2rem' }}>
                  Getting Started
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {doneCount === 0 ? 'Complete these steps to build out your page' : `${doneCount} of 3 steps done — keep going!`}
                </div>
              </div>
              {/* Progress pills */}
              <div style={{ display: 'flex', gap: '0.3rem', flexShrink: 0 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ width: 28, height: 6, borderRadius: 3, background: s.done ? 'var(--red)' : 'var(--border-default)', transition: 'background 300ms' }} />
                ))}
              </div>
            </div>

            {/* Steps */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {steps.map(step => (
                <div key={step.label} style={{
                  display: 'flex', alignItems: 'center', gap: '0.85rem',
                  padding: '0.7rem 0.85rem',
                  borderRadius: 8,
                  background: step.done ? 'var(--bg-base)' : 'var(--bg-elevated)',
                  border: `1px solid ${step.done ? 'var(--border-subtle)' : 'var(--border-default)'}`,
                  opacity: step.done ? 0.65 : 1,
                  transition: 'all 200ms',
                }}>
                  {/* Check / icon */}
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: step.done ? 'rgba(22,163,74,0.12)' : 'var(--red-dim)',
                    color: step.done ? '#16a34a' : 'var(--red)',
                    border: `1px solid ${step.done ? 'rgba(22,163,74,0.2)' : 'var(--red-glow)'}`,
                  }}>
                    {step.done ? <Check size={14} strokeWidth={2.5} /> : step.icon}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: step.done ? 'var(--text-secondary)' : 'var(--text-primary)', textDecoration: step.done ? 'line-through' : 'none' }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.05rem' }}>
                      {step.desc}
                    </div>
                  </div>

                  {/* CTA */}
                  {!step.done && (
                    <Link href={step.href} style={{
                      flexShrink: 0,
                      fontSize: '0.75rem', fontWeight: 700,
                      color: 'var(--red)',
                      textDecoration: 'none',
                      padding: '0.3rem 0.7rem',
                      borderRadius: 5,
                      border: '1px solid var(--red-glow)',
                      background: 'var(--red-dim)',
                      whiteSpace: 'nowrap',
                      letterSpacing: '0.04em',
                    }}>
                      {step.cta} →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })()}

      {/* Quick nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
        {[
          { label: 'Mods', href: `/corvettes/${id}/mods` },
          { label: 'Service', href: `/corvettes/${id}/service` },
          { label: 'Documents', href: `/corvettes/${id}/documents` },
          { label: 'Insurance', href: `/corvettes/${id}/insurance` },
        ].map(l => (
          <Link key={l.label} href={l.href} className="btn-secondary" style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '0.7rem', minHeight: 44, borderColor: 'var(--border-default)' }}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Insurance Score */}
      <InsuranceScore summary={insuranceSummary} corvetteId={id} />

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

      {/* NHTSA Recall Tracker — only shown when a VIN is on file */}
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

      <style>{`.stat-link:hover { background: rgba(0,0,0,0.03); }`}</style>
    </div>
  )
}
