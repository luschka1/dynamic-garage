'use client'

import { useState, useEffect } from 'react'

const SLIDES = [
  { src: '/screenshots/screen-qrcard.png',      alt: 'QR Show Card' },
  { src: '/screenshots/screen-dashboard.png',   alt: 'Dashboard — vehicle cards' },
  { src: '/screenshots/screen-public.png',      alt: 'Public build page' },
  { src: '/screenshots/screen-report.png',      alt: 'Vehicle report' },
]

const INTERVAL = 3800 // ms between slides

export default function HeroCarousel() {
  const [active, setActive] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)

  useEffect(() => {
    const t = setInterval(() => {
      setActive(cur => {
        const next = (cur + 1) % SLIDES.length
        setPrev(cur)
        return next
      })
    }, INTERVAL)
    return () => clearInterval(t)
  }, [])

  // Clear "prev" after fade completes
  useEffect(() => {
    if (prev === null) return
    const t = setTimeout(() => setPrev(null), 500)
    return () => clearTimeout(t)
  }, [prev])

  return (
    <div style={{
      borderRadius: 16,
      border: '1px solid var(--border-subtle)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      background: '#0d0d0d',
      userSelect: 'none',
    }}>
      {/* Slide area */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3 / 2', overflow: 'hidden', background: '#0d0d0d' }}>
        {SLIDES.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'top',
              opacity: i === active ? 1 : 0,
              transition: i === active ? 'opacity 0.5s ease' : (i === prev ? 'opacity 0.5s ease' : 'none'),
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Dot indicators */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          zIndex: 10,
        }}>
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setPrev(active); setActive(i) }}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === active ? 20 : 6,
                height: 6,
                borderRadius: 3,
                background: i === active ? 'var(--red)' : 'rgba(255,255,255,0.35)',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                transition: 'width 300ms ease, background 300ms ease',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
