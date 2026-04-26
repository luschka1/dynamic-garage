'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Car, Wrench, ClipboardList, ArrowRight, X, Tag, Flame } from 'lucide-react'
import type { GalleryCar } from './page'

type SortKey = 'newest' | 'oldest' | 'most_mods' | 'top_props' | 'year_desc' | 'year_asc' | 'for_sale'

export default function GalleryClient({ cars }: { cars: GalleryCar[] }) {
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState<SortKey>('newest')
  const [filterMake, setFilterMake] = useState('')

  // Unique makes present in the gallery
  const makes = useMemo(() => {
    const seen = new Set<string>()
    cars.forEach(c => {
      // model is stored as "Make Model", grab first word(s) matching a known make pattern
      const first = c.model.split(' ')[0]
      if (first) seen.add(first)
    })
    return Array.from(seen).sort()
  }, [cars])

  const filtered = useMemo(() => {
    let result = [...cars]

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(c =>
        c.nickname.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        String(c.year).includes(q) ||
        (c.color?.toLowerCase().includes(q) ?? false) ||
        (c.trim?.toLowerCase().includes(q) ?? false)
      )
    }

    if (filterMake) {
      result = result.filter(c => c.model.startsWith(filterMake))
    }

    if (sortBy === 'for_sale') {
      return result.filter(c => c.for_sale)
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      case 'oldest':
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        break
      case 'most_mods':
        result.sort((a, b) => b.modCount - a.modCount || b.serviceCount - a.serviceCount)
        break
      case 'top_props':
        result.sort((a, b) => (b.props_count ?? 0) - (a.props_count ?? 0))
        break
      case 'year_desc':
        result.sort((a, b) => b.year - a.year)
        break
      case 'year_asc':
        result.sort((a, b) => a.year - b.year)
        break
    }

    return result
  }, [cars, search, sortBy, filterMake])

  const hasFilters = !!(search || filterMake)

  const selectStyle: React.CSSProperties = {
    padding: '0.6rem 0.9rem',
    fontSize: '0.875rem',
    border: '1px solid var(--border-default)',
    borderRadius: 6,
    background: 'var(--bg-elevated)',
    color: 'var(--text-primary)',
    cursor: 'pointer',
    outline: 'none',
  }

  return (
    <div>
      {/* ── Controls ── */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.75rem', alignItems: 'center' }}>

        {/* Search */}
        <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by nickname, make, year, color…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.3rem',
              paddingRight: search ? '2.3rem' : '0.85rem',
              paddingTop: '0.6rem',
              paddingBottom: '0.6rem',
              fontSize: '0.875rem',
              border: '1px solid var(--border-default)',
              borderRadius: 6,
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ position: 'absolute', right: '0.6rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.2rem', display: 'flex', alignItems: 'center' }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Make filter */}
        {makes.length > 1 && (
          <select value={filterMake} onChange={e => setFilterMake(e.target.value)} style={{ ...selectStyle, minWidth: 140, color: filterMake ? 'var(--text-primary)' : 'var(--text-muted)' }}>
            <option value="">All Makes</option>
            {makes.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        )}

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)} style={{ ...selectStyle, minWidth: 170 }}>
          <option value="newest">Newest Added</option>
          <option value="oldest">Oldest Added</option>
          <option value="top_props">🔥 Top Props</option>
          <option value="most_mods">Most Mods</option>
          <option value="year_desc">Car Year: Newest</option>
          <option value="year_asc">Car Year: Oldest</option>
          <option value="for_sale">For Sale</option>
        </select>

        {/* Result count */}
        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{filtered.length}</span>{' '}
          {filtered.length === 1 ? 'build' : 'builds'}{hasFilters ? ' found' : ''}
        </div>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="empty-state">
          <Car size={40} color="var(--text-muted)" strokeWidth={1.5} style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {hasFilters ? 'No Builds Match' : 'Gallery is Empty'}
          </h3>
          <p>
            {hasFilters
              ? 'Try a different search or clear the filters.'
              : 'Be the first to add your build to the community gallery!'}
          </p>
          {!hasFilters && (
            <Link href="/register" className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
              Get Started
            </Link>
          )}
          {hasFilters && (
            <button
              onClick={() => { setSearch(''); setFilterMake('') }}
              className="btn-secondary"
              style={{ display: 'inline-flex', marginTop: '1rem', fontSize: '0.9rem' }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* ── Grid ── */}
      {filtered.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: '1.25rem' }}>
          {filtered.map(car => (
            <Link
              key={car.id}
              href={`/share/${car.user_id}/${car.id}`}
              style={{ textDecoration: 'none', display: 'block', borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)', transition: 'transform 150ms, box-shadow 150ms' }}
              className="gallery-card"
            >
              {/* Photo */}
              <div style={{ position: 'relative', height: 210, background: 'linear-gradient(135deg, #111 0%, #1c1c1c 100%)', overflow: 'hidden' }}>
                {car.photo_url ? (
                  <Image src={car.photo_url} alt={car.nickname} fill style={{ objectFit: 'cover' }} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Car size={52} color="#444" strokeWidth={1} />
                  </div>
                )}
                {/* Gradient overlay */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.82) 0%, transparent 55%)' }} />

                {/* For Sale badge */}
                {car.for_sale && (
                  <div style={{
                    position: 'absolute', top: '0.75rem', right: '0.75rem', zIndex: 10,
                    background: '#16a34a', color: 'white',
                    padding: '0.3rem 0.75rem', borderRadius: 5,
                    display: 'flex', alignItems: 'center', gap: '0.35rem',
                    fontFamily: "'Barlow Condensed'", fontSize: '0.95rem', fontWeight: 900,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                  }}>
                    <Tag size={12} strokeWidth={2.5} /> For Sale
                  </div>
                )}
                {/* Title overlay */}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1rem 1.25rem' }}>
                  <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.55rem', fontWeight: 900, color: 'white', lineHeight: 1, letterSpacing: '0.01em' }}>
                    {car.year} {car.nickname.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem', fontWeight: 500 }}>
                    {car.model}{car.trim ? ` · ${car.trim}` : ''}{car.color ? ` · ${car.color}` : ''}
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div style={{ padding: '0.9rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  {(car.props_count ?? 0) > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#f97316', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 4, padding: '0.2rem 0.5rem' }}>
                      <Flame size={10} fill="#f97316" strokeWidth={1.5} /> {car.props_count}
                    </span>
                  )}
                  {car.modCount > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--red)', background: 'var(--red-dim)', border: '1px solid var(--red-glow)', borderRadius: 4, padding: '0.2rem 0.5rem' }}>
                      <Wrench size={10} /> {car.modCount} {car.modCount === 1 ? 'mod' : 'mods'}
                    </span>
                  )}
                  {car.serviceCount > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--blue)', background: 'rgba(29,78,216,0.06)', border: '1px solid rgba(29,78,216,0.15)', borderRadius: 4, padding: '0.2rem 0.5rem' }}>
                      <ClipboardList size={10} /> {car.serviceCount} service
                    </span>
                  )}
                  {car.modCount === 0 && car.serviceCount === 0 && (car.props_count ?? 0) === 0 && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>No records yet</span>
                  )}
                </div>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--red)', flexShrink: 0, opacity: 0.85 }}>
                  View <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .gallery-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-hover) !important; }
        .gallery-card:hover .gallery-card-cta { opacity: 1 !important; }
      `}</style>
    </div>
  )
}
