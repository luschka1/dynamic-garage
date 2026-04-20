'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from './ThemeProvider'

export default function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 34,
        height: 34,
        borderRadius: 6,
        border: '1px solid rgba(255,255,255,0.12)',
        background: 'transparent',
        color: 'var(--nav-muted)',
        cursor: 'pointer',
        transition: 'color 150ms ease, border-color 150ms ease, background 150ms ease',
        flexShrink: 0,
      }}
      className="theme-toggle"
    >
      {isDark
        ? <Sun  size={15} strokeWidth={2} />
        : <Moon size={15} strokeWidth={2} />
      }
      <style>{`
        .theme-toggle:hover {
          color: var(--nav-text) !important;
          border-color: rgba(255,255,255,0.28) !important;
          background: rgba(255,255,255,0.06) !important;
        }
      `}</style>
    </button>
  )
}
