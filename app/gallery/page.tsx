import { createClient } from '@/lib/supabase/server'
import { LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'
import type { Corvette } from '@/lib/types'
import GalleryClient from './GalleryClient'

export type GalleryCar = Corvette & { modCount: number; serviceCount: number }

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: cars } = await supabase
    .from('corvettes')
    .select('*')
    .eq('in_gallery', true)
    .eq('is_public', true)
    .order('created_at', { ascending: false })

  const galleryList = cars || []

  const modCounts: Record<string, number> = {}
  const svcCounts: Record<string, number> = {}

  if (galleryList.length > 0) {
    const ids = galleryList.map(c => c.id)
    const [{ data: mods }, { data: svcs }] = await Promise.all([
      supabase.from('mods').select('corvette_id').in('corvette_id', ids),
      supabase.from('service_records').select('corvette_id').in('corvette_id', ids),
    ])
    mods?.forEach(m => { modCounts[m.corvette_id] = (modCounts[m.corvette_id] || 0) + 1 })
    svcs?.forEach(s => { svcCounts[s.corvette_id] = (svcCounts[s.corvette_id] || 0) + 1 })
  }

  const enriched: GalleryCar[] = galleryList.map(c => ({
    ...(c as Corvette),
    modCount: modCounts[c.id] || 0,
    serviceCount: svcCounts[c.id] || 0,
  }))

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ── NAV ── */}
      <nav style={{
        background: 'var(--bg-elevated)',
        borderBottom: '1px solid var(--border-subtle)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, background: 'var(--red)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: '0.9rem', color: '#fff' }}>DG</span>
            </div>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              <span style={{ color: 'var(--red)' }}>Dynamic</span><span style={{ color: 'var(--text-muted)' }}> Garage</span>
            </span>
          </Link>
          <span style={{ width: 1, height: 20, background: 'var(--border-default)', display: 'inline-block' }} />
          <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <LayoutGrid size={14} /> Gallery
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Link href="/login" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', padding: '0.4rem 0.75rem', borderRadius: 6, textDecoration: 'none', transition: 'color 150ms' }}
            className="v3-nav-link">
            Sign In
          </Link>
          <ThemeToggle />
          <Link href="/register" className="btn-primary" style={{ fontSize: '0.875rem', padding: '0.5rem 1.25rem', minHeight: 36, letterSpacing: '0.04em' }}>
            Get Started
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 1.5rem' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '2rem' }}>
          <p className="page-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <LayoutGrid size={12} /> Community Builds
          </p>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2.2rem, 5vw, 3.5rem)', fontWeight: 900, lineHeight: 1, marginBottom: '0.5rem' }}>
            BUILD GALLERY
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            {enriched.length > 0
              ? `${enriched.length} build${enriched.length !== 1 ? 's' : ''} from the Dynamic Garage community`
              : 'Builds shared by the Dynamic Garage community — be the first to add yours.'}
          </p>
        </div>

        <GalleryClient cars={enriched} />
      </div>

      {/* ── Footer CTA ── */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: "'Barlow Condensed'", fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.6rem' }}>
          Join the Gallery
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto 1.5rem' }}>
          Track your build and share it with the community — free during early access.
        </p>
        <Link href="/register" className="btn-primary" style={{ display: 'inline-flex' }}>
          Start My Build
        </Link>
      </div>

      <style>{`.v3-nav-link:hover { color: var(--text-primary) !important; }`}</style>
    </div>
  )
}
