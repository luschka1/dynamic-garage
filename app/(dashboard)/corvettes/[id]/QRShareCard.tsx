'use client'

import { useState, useRef, useCallback } from 'react'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { Download, Copy, Check, QrCode, X } from 'lucide-react'

export default function QRShareCard({ shareUrl, nickname }: { shareUrl: string; nickname: string }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadQR() {
    // Find the canvas element rendered by QRCodeCanvas
    const canvas = canvasRef.current?.querySelector('canvas')
    if (!canvas) return
    const url = canvas.toDataURL('image/png')
    const a = document.createElement('a')
    a.href = url
    a.download = `${nickname.replace(/\s+/g, '-').toLowerCase()}-qr.png`
    a.click()
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--bg-card)', color: 'var(--text-secondary)',
          border: '1px solid var(--border-default)', borderRadius: 6,
          padding: '0.6rem 1.1rem', fontSize: '0.85rem', fontWeight: 700,
          letterSpacing: '0.05em', textTransform: 'uppercase',
          cursor: 'pointer', transition: 'border-color 150ms, color 150ms',
          fontFamily: "'Barlow Condensed', sans-serif",
        }}
        className="qr-trigger"
      >
        <QrCode size={16} /> QR Code
      </button>

      {/* Modal overlay */}
      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div style={{
            background: 'var(--bg-card)', borderRadius: 12,
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            padding: '2rem', width: '100%', maxWidth: 380, position: 'relative',
          }}>
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, borderRadius: 4, display: 'flex' }}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <p className="page-eyebrow" style={{ marginBottom: '0.25rem' }}>Share This Build</p>
            <h2 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.6rem', fontWeight: 900, letterSpacing: '0.03em', marginBottom: '1.5rem', lineHeight: 1 }}>
              {nickname.toUpperCase()}
            </h2>

            {/* QR Code */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <div style={{
                background: 'white', padding: '1.25rem', borderRadius: 8,
                border: '1px solid var(--border-subtle)',
                boxShadow: 'var(--shadow-card)',
              }}>
                {/* SVG version — displayed on screen */}
                <QRCodeSVG
                  value={shareUrl}
                  size={180}
                  fgColor="#111111"
                  bgColor="#ffffff"
                  level="M"
                  imageSettings={{
                    src: '',
                    x: undefined,
                    y: undefined,
                    height: 0,
                    width: 0,
                    excavate: false,
                  }}
                />
              </div>
            </div>

            {/* Hidden canvas for PNG download */}
            <div ref={canvasRef} style={{ display: 'none' }}>
              <QRCodeCanvas value={shareUrl} size={400} fgColor="#111111" bgColor="#ffffff" level="M" />
            </div>

            {/* URL display */}
            <div style={{
              background: 'var(--bg-base)', border: '1px solid var(--border-default)',
              borderRadius: 6, padding: '0.65rem 0.9rem', marginBottom: '1.25rem',
              fontSize: '0.78rem', color: 'var(--text-muted)', fontFamily: 'monospace',
              wordBreak: 'break-all', lineHeight: 1.5,
            }}>
              {shareUrl}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={copyLink}
                className="btn-secondary"
                style={{ flex: 1, fontSize: '0.9rem', minHeight: 42, padding: '0.55rem 1rem' }}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={downloadQR}
                className="btn-primary"
                style={{ flex: 1, fontSize: '0.9rem', minHeight: 42, padding: '0.55rem 1rem' }}
              >
                <Download size={15} /> Save QR
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`.qr-trigger:hover { border-color: var(--border-strong) !important; color: var(--text-primary) !important; }`}</style>
    </>
  )
}
