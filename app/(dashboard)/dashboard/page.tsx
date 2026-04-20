import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Car, Wrench, ClipboardList, FileText, Share2, ChevronRight } from 'lucide-react'
import type { Corvette } from '@/lib/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: cars } = await supabase
    .from('corvettes')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  const name = user?.user_metadata?.full_name?.split(' ')[0] || 'Driver'

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '2.5rem' }}>
        <div>
          <p className="page-eyebrow">Welcome back</p>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '0.01em' }}>
            {name.toUpperCase()}&apos;S GARAGE
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.4rem' }}>
            {cars && cars.length > 0
              ? `${cars.length} vehicle${cars.length > 1 ? 's' : ''} in your garage`
              : 'Your garage is empty — add your first car'}
          </p>
        </div>
        <Link href="/corvettes/new" className="btn-primary">
          <Plus size={18} /> Add Vehicle
        </Link>
      </div>

      {/* Empty state */}
      {(!cars || cars.length === 0) && (
        <div style={{
          border: '1px dashed var(--border-default)',
          borderRadius: 12,
          padding: '5rem 2rem',
          textAlign: 'center',
        }}>
          <div style={{ width: 64, height: 64, background: 'var(--bg-card)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Car size={32} color="var(--text-muted)" />
          </div>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.75rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            No Vehicles Yet
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1rem' }}>
            Add your first car to start tracking mods, photos and service history.
          </p>
          <Link href="/corvettes/new" className="btn-primary">
            <Plus size={18} /> Add My First Car
          </Link>
        </div>
      )}

      {/* Car grid */}
      {cars && cars.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {(cars as Corvette[]).map(car => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  )
}

function CarCard({ car }: { car: Corvette }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 12,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      transition: 'border-color 150ms ease, transform 150ms ease',
    }}
      className="car-card"
    >
      {/* Photo area */}
      <div style={{ position: 'relative', height: 200, background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)', overflow: 'hidden' }}>
        {car.photo_url ? (
          <img src={car.photo_url} alt={car.nickname} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Car size={64} color="var(--text-muted)" strokeWidth={1} />
          </div>
        )}
        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />

        {/* Car name overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem' }}>
          <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.6rem', fontWeight: 900, letterSpacing: '0.02em', lineHeight: 1, color: 'white' }}>
            {car.nickname.toUpperCase()}
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.65)', fontWeight: 500, marginTop: '0.15rem' }}>
            {car.year} {car.model}{car.trim ? ` · ${car.trim}` : ''}
          </p>
        </div>

        {car.is_public && (
          <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(22,163,74,0.85)', backdropFilter: 'blur(4px)', color: '#86efac', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.2rem 0.6rem', borderRadius: 3, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <Share2 size={10} /> Public
          </div>
        )}
      </div>

      {/* Specs strip */}
      <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '1.5rem' }}>
        {car.color && (
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Color</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{car.color}</div>
          </div>
        )}
        {car.mileage && (
          <div>
            <div style={{ fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.1rem' }}>Mileage</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{car.mileage.toLocaleString()} mi</div>
          </div>
        )}
      </div>

      {/* Action tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', flex: 1 }}>
        {[
          { label: 'Mods', href: `/corvettes/${car.id}/mods`, icon: <Wrench size={18} />, color: 'var(--red)' },
          { label: 'Service', href: `/corvettes/${car.id}/service`, icon: <ClipboardList size={18} />, color: '#2563eb' },
          { label: 'Docs', href: `/corvettes/${car.id}/documents`, icon: <FileText size={18} />, color: '#16a34a' },
        ].map((action, i) => (
          <Link
            key={action.label}
            href={action.href}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
              padding: '1rem 0.5rem',
              borderRight: i < 2 ? '1px solid var(--border-subtle)' : 'none',
              color: action.color,
              textDecoration: 'none',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              transition: 'background 150ms',
            }}
            className="action-tile"
          >
            {action.icon}
            {action.label}
          </Link>
        ))}
      </div>

      {/* Details link */}
      <Link href={`/corvettes/${car.id}`} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.4rem',
        padding: '0.75rem',
        borderTop: '1px solid var(--border-subtle)',
        color: 'var(--text-secondary)',
        fontSize: '0.8rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        transition: 'color 150ms, background 150ms',
        textDecoration: 'none',
      }}
        className="details-link"
      >
        View & Edit Details <ChevronRight size={14} />
      </Link>

      <style>{`
        .car-card:hover { border-color: var(--border-default) !important; transform: translateY(-2px); }
        .action-tile:hover { background: rgba(0,0,0,0.03); }
        .details-link:hover { color: var(--text-primary) !important; background: rgba(0,0,0,0.02); }
      `}</style>
    </div>
  )
}
