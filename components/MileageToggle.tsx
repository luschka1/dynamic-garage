'use client'

import { useState, useEffect } from 'react'

const KEY = 'mileage_unit'
const EVENT = 'mileage-unit-change'
export const MI_TO_KM = 1.60934

export type Unit = 'mi' | 'km'

function readUnit(): Unit {
  if (typeof window === 'undefined') return 'mi'
  return (localStorage.getItem(KEY) as Unit) || 'mi'
}

/** Shared hook - re-renders whenever the unit changes anywhere on the page */
export function useMileageUnit(): Unit {
  const [unit, setUnit] = useState<Unit>('mi')
  useEffect(() => {
    setUnit(readUnit())
    const sync = () => setUnit(readUnit())
    window.addEventListener(EVENT, sync)
    return () => window.removeEventListener(EVENT, sync)
  }, [])
  return unit
}

/** Small MI / KM toggle pill */
export default function MileageToggle() {
  const unit = useMileageUnit()

  function toggle() {
    const next: Unit = unit === 'mi' ? 'km' : 'mi'
    localStorage.setItem(KEY, next)
    window.dispatchEvent(new Event(EVENT))
  }

  return (
    <button
      onClick={toggle}
      title="Toggle miles / kilometres"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-default)',
        borderRadius: 5,
        padding: '2px 6px',
        cursor: 'pointer',
        fontSize: '0.68rem',
        fontWeight: 800,
        letterSpacing: '0.06em',
        lineHeight: 1,
        userSelect: 'none',
      }}
    >
      <span style={{ color: unit === 'mi' ? 'var(--red)' : 'var(--text-muted)', transition: 'color 150ms' }}>MI</span>
      <span style={{ color: 'var(--border-strong)', margin: '0 1px' }}>/</span>
      <span style={{ color: unit === 'km' ? 'var(--red)' : 'var(--text-muted)', transition: 'color 150ms' }}>KM</span>
    </button>
  )
}
