'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { LogOut, LayoutDashboard, Menu, X, Plus, LayoutGrid } from 'lucide-react'
import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import ThemeToggle from '@/components/ThemeToggle'

export default function NavBar({ user }: { user: User }) {
  const router = useRouter()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const name = user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Driver'

  return (
    <nav style={{
      background: 'var(--bg-elevated)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Red accent line */}
      <div style={{ height: 2, background: 'linear-gradient(90deg, var(--red) 0%, transparent 60%)', position: 'absolute', top: 0, left: 0, right: 0 }} />

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>

        {/* Brand */}
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 900, fontSize: '1.25rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            <span style={{ color: '#a8a8a8' }}>Dynamic</span><span style={{ color: 'var(--red)' }}> Garage</span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <Link
            href="/dashboard"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 4,
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: pathname === '/dashboard' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: pathname === '/dashboard' ? 'rgba(0,0,0,0.05)' : 'transparent',
              transition: 'all var(--transition)',
              textDecoration: 'none',
            }}
          >
            <LayoutDashboard size={15} /> My Garage
          </Link>

          <Link
            href="/corvettes/new"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 4,
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'var(--text-secondary)',
              background: 'transparent',
              transition: 'all var(--transition)',
              textDecoration: 'none',
            }}
          >
            <Plus size={15} /> Add Car
          </Link>

          <Link
            href="/gallery"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: 4,
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: pathname === '/gallery' ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: pathname === '/gallery' ? 'rgba(0,0,0,0.05)' : 'transparent',
              transition: 'all var(--transition)',
              textDecoration: 'none',
            }}
          >
            <LayoutGrid size={15} /> Gallery
          </Link>

          <div style={{ width: 1, height: 20, background: 'var(--border-default)', margin: '0 0.5rem' }} />

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', padding: '0 0.5rem', fontWeight: 500 }}>
            {name}
          </div>

          <ThemeToggle />

          <button
            onClick={signOut}
            className="btn-ghost"
            style={{ fontSize: '0.8rem', gap: '0.3rem', padding: '0.4rem 0.75rem' }}
          >
            <LogOut size={14} /> Sign Out
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(v => !v)}
          className="mobile-menu-btn"
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', display: 'none', padding: '0.5rem' }}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'var(--bg-elevated)' }}>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '1rem', padding: '0.75rem', borderRadius: 4 }}>
            My Garage
          </Link>
          <Link href="/corvettes/new" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1rem', padding: '0.75rem', borderRadius: 4 }}>
            Add Car
          </Link>
          <Link href="/gallery" onClick={() => setMenuOpen(false)} style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1rem', padding: '0.75rem', borderRadius: 4, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <LayoutGrid size={16} /> Gallery
          </Link>
          <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem' }}>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Theme</span>
            <ThemeToggle />
          </div>
          <button onClick={signOut} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '1rem', padding: '0.75rem', cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </nav>
  )
}
