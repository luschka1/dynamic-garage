'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { VehiclePhoto } from '@/lib/types'

interface Props {
  photos: VehiclePhoto[]
}

export default function PublicGallery({ photos }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const prev = useCallback(() => {
    setLightbox(i => i !== null ? (i - 1 + photos.length) % photos.length : null)
  }, [photos.length])

  const next = useCallback(() => {
    setLightbox(i => i !== null ? (i + 1) % photos.length : null)
  }, [photos.length])

  // Keyboard navigation
  useEffect(() => {
    if (lightbox === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, prev, next])

  if (photos.length === 0) return null

  // ── Grid layout variants ──────────────────────────────────────────────────
  const gridContent = (() => {
    if (photos.length === 1) {
      return (
        <div
          onClick={() => setLightbox(0)}
          style={{ cursor: 'zoom-in', borderRadius: 12, overflow: 'hidden', height: 420, position: 'relative' }}
        >
          <Image
            src={photos[0].public_url}
            alt={photos[0].caption || ''}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 900px) 100vw, 900px"
            priority
          />
        </div>
      )
    }

    if (photos.length === 2) {
      return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, borderRadius: 12, overflow: 'hidden', height: 360 }}>
          {photos.map((p, i) => (
            <div key={p.id} style={{ position: 'relative', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox(i)}>
              <Image
                src={p.public_url}
                alt={p.caption || ''}
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 900px) 50vw, 450px"
              />
            </div>
          ))}
        </div>
      )
    }

    // 3+ photos: big left, two right
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: 4, borderRadius: 12, overflow: 'hidden', height: 400 }}>
        {/* Main */}
        <div style={{ gridRow: '1 / 3', position: 'relative', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox(0)}>
          <Image
            src={photos[0].public_url}
            alt={photos[0].caption || ''}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 900px) 66vw, 600px"
            priority
          />
        </div>
        {/* Top-right */}
        <div style={{ position: 'relative', overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox(1)}>
          <Image
            src={photos[1].public_url}
            alt={photos[1].caption || ''}
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 900px) 33vw, 300px"
          />
        </div>
        {/* Bottom-right - overlay "+N more" if needed */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            src={photos[2].public_url}
            alt={photos[2].caption || ''}
            fill
            style={{ objectFit: 'cover', cursor: 'zoom-in' }}
            sizes="(max-width: 900px) 33vw, 300px"
            onClick={() => setLightbox(2)}
          />
          {photos.length > 3 && (
            <div
              onClick={() => setLightbox(2)}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.55)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'zoom-in',
              }}
            >
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.01em' }}>
                +{photos.length - 3}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  })()

  return (
    <>
      {/* ── Gallery grid ── */}
      <section style={{ marginBottom: '1.5rem' }}>
        {gridContent}
        {/* Thumbnail strip when 4+ */}
        {photos.length >= 4 && (
          <div style={{ display: 'flex', gap: 4, marginTop: 4, overflowX: 'auto', paddingBottom: 2 }}>
            {photos.slice(3).map((p, i) => (
              <div key={p.id} style={{ position: 'relative', width: 72, height: 52, flexShrink: 0, borderRadius: 4, overflow: 'hidden', cursor: 'zoom-in' }} onClick={() => setLightbox(i + 3)}>
                <Image
                  src={p.public_url}
                  alt={p.caption || ''}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="72px"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Lightbox ── */}
      {lightbox !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.96)',
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          {/* Close */}
          <button
            onClick={() => setLightbox(null)}
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 16,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              color: 'white', cursor: 'pointer', borderRadius: '50%',
              width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 150ms',
            }}
          >
            <X size={18} />
          </button>

          {/* Counter */}
          <div style={{
            position: 'absolute', top: 22, left: '50%', transform: 'translateX(-50%)',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', fontWeight: 600,
            letterSpacing: '0.06em', userSelect: 'none',
          }}>
            {lightbox + 1} / {photos.length}
          </div>

          {/* Prev */}
          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); prev() }}
              aria-label="Previous photo"
              style={{
                position: 'absolute', left: 12,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'white', cursor: 'pointer', borderRadius: '50%',
                width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 150ms',
              }}
            >
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Image */}
          <img
            src={photos[lightbox].public_url}
            alt={photos[lightbox].caption || ''}
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '88vw', maxHeight: '84vh', objectFit: 'contain', borderRadius: 6, display: 'block' }}
          />

          {/* Caption */}
          {photos[lightbox].caption && (
            <div style={{
              position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
              color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', textAlign: 'center',
              maxWidth: '80vw', lineHeight: 1.5,
            }}>
              {photos[lightbox].caption}
            </div>
          )}

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={e => { e.stopPropagation(); next() }}
              aria-label="Next photo"
              style={{
                position: 'absolute', right: 12,
                background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'white', cursor: 'pointer', borderRadius: '50%',
                width: 46, height: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 150ms',
              }}
            >
              <ChevronRight size={22} />
            </button>
          )}
        </div>
      )}
    </>
  )
}
