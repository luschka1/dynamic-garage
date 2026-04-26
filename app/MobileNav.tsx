'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, LayoutGrid, Phone, LogIn, HelpCircle } from 'lucide-react'

interface Props {
  isLoggedIn: boolean
}

export default function MobileNav({ isLoggedIn }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on route change / scroll
  useEffect(() => {
    if (open) {
      const close = () => setOpen(false)
      window.addEventListener('scroll', close, { passive: true })
      return () => window.removeEventListener('scroll', close)
    }
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 38,
          height: 38,
          borderRadius: 8,
          border: '1px solid var(--border-default)',
          background: open ? 'var(--bg-elevated)' : 'transparent',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          transition: 'background 150ms, color 150ms',
        }}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          right: 0,
          minWidth: 200,
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          overflow: 'hidden',
          zIndex: 100,
        }}>
          <Link
            href="/gallery"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.85rem 1.1rem',
              fontSize: '0.92rem', fontWeight: 600,
              color: 'var(--text-secondary)', textDecoration: 'none',
              borderBottom: '1px solid var(--border-subtle)',
              transition: 'background 150ms',
            }}
            className="mobile-nav-item"
          >
            <LayoutGrid size={15} color="var(--text-muted)" /> Gallery
          </Link>
          <Link
            href="/help"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.85rem 1.1rem',
              fontSize: '0.92rem', fontWeight: 600,
              color: 'var(--text-secondary)', textDecoration: 'none',
              borderBottom: '1px solid var(--border-subtle)',
              transition: 'background 150ms',
            }}
            className="mobile-nav-item"
          >
            <HelpCircle size={15} color="var(--text-muted)" /> Help &amp; FAQ
          </Link>
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.85rem 1.1rem',
              fontSize: '0.92rem', fontWeight: 600,
              color: 'var(--text-secondary)', textDecoration: 'none',
              borderBottom: isLoggedIn ? 'none' : '1px solid var(--border-subtle)',
              transition: 'background 150ms',
            }}
            className="mobile-nav-item"
          >
            <Phone size={15} color="var(--text-muted)" /> Contact
          </Link>
          {!isLoggedIn && (
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.85rem 1.1rem',
                fontSize: '0.92rem', fontWeight: 600,
                color: 'var(--text-secondary)', textDecoration: 'none',
                transition: 'background 150ms',
              }}
              className="mobile-nav-item"
            >
              <LogIn size={15} color="var(--text-muted)" /> Sign In
            </Link>
          )}
        </div>
      )}

      <style>{`
        .mobile-nav-item:hover {
          background: rgba(127,127,127,0.07) !important;
          color: var(--text-primary) !important;
        }
      `}</style>
    </div>
  )
}
