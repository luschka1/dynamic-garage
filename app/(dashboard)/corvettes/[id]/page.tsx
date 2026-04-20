import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Wrench, ClipboardList, FileText, Share2, ExternalLink } from 'lucide-react'
import EditCorvetteForm from './EditCorvetteForm'
import QRShareCard from './QRShareCard'
import PhotoGalleryManager from './PhotoGalleryManager'
import EmailUploadAddress from './EmailUploadAddress'
import type { Corvette, VehiclePhoto } from '@/lib/types'

export default async function CorvettePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: car } = await supabase.from('corvettes').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!car) notFound()

  const [
    { count: modCount },
    { count: svcCount },
    { count: docCount },
    { data: photos },
  ] = await Promise.all([
    supabase.from('mods').select('*', { count: 'exact', head: true }).eq('corvette_id', id),
    supabase.from('service_records').select('*', { count: 'exact', head: true }).eq('corvette_id', id),
    supabase.from('documents').select('*', { count: 'exact', head: true }).eq('corvette_id', id),
    supabase.from('vehicle_photos').select('*').eq('corvette_id', id).order('sort_order').order('created_at'),
  ])

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
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', marginTop: '0.2rem' }}>
                {c.year} {c.model}{c.trim ? ` · ${c.trim}` : ''}
                {c.color ? ` · ${c.color}` : ''}
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

      {/* Quick nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: c.is_public ? '1rem' : '2rem' }}>
        {[
          { label: 'View All Mods', href: `/corvettes/${id}/mods` },
          { label: 'Service History', href: `/corvettes/${id}/service` },
          { label: 'Documents', href: `/corvettes/${id}/documents` },
        ].map(l => (
          <Link key={l.label} href={l.href} className="btn-secondary" style={{ justifyContent: 'center', fontSize: '0.85rem', padding: '0.7rem', minHeight: 44, borderColor: 'var(--border-default)' }}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Share row — only when public */}
      {c.is_public && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <Link
            href={`/share/${user.id}/${id}`}
            target="_blank"
            className="btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.6rem 1.1rem', minHeight: 42, gap: '0.5rem', borderColor: 'var(--border-default)' }}
          >
            <ExternalLink size={15} /> View Public Page
          </Link>
          <QRShareCard
            shareUrl={`${process.env.NEXT_PUBLIC_SITE_URL || ''}/share/${user.id}/${id}`}
            nickname={c.nickname}
          />
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
            This build is publicly visible
          </span>
        </div>
      )}

      {/* Photo gallery manager */}
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

      {/* Edit form */}
      <EditCorvetteForm car={c} />

      <style>{`.stat-link:hover { background: rgba(0,0,0,0.03); }`}</style>
    </div>
  )
}
