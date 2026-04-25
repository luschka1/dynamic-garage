'use client'

import { useState, useRef, useCallback } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Copy, Check, QrCode, X, Printer, Wrench, ClipboardList } from 'lucide-react'
import { toPng } from 'html-to-image'

interface Props {
  shareUrl: string
  nickname: string
  year: number
  model: string
  trim?: string | null
  color?: string | null
  photoUrl?: string | null
  modCount: number
  svcCount: number
}

export default function QRShareCard({ shareUrl, nickname, year, model, trim, color, photoUrl, modCount, svcCount }: Props) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  async function copyLink() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const downloadCard = useCallback(async () => {
    if (!cardRef.current) return
    setDownloading(true)
    try {
      // Run twice - first pass loads fonts/images, second is clean
      await toPng(cardRef.current, { pixelRatio: 2 })
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        style: { borderRadius: '0' }, // crisp edges in PNG
      })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `${nickname.replace(/\s+/g, '-').toLowerCase()}-show-card.png`
      a.click()
    } catch (err) {
      console.error('Card download failed:', err)
    } finally {
      setDownloading(false)
    }
  }, [nickname])

  function printCard() {
    if (!cardRef.current) return
    const html = cardRef.current.outerHTML
    const win = window.open('', '_blank', 'width=700,height=500')
    if (!win) return
    win.document.write(`
      <!DOCTYPE html><html><head>
        <meta charset="utf-8">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;900&family=Roboto:wght@900&display=swap" rel="stylesheet">
        <title>${nickname} - Dynamic Garage Show Card</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { background: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 2rem; }
          @media print {
            body { padding: 0; }
            @page { margin: 0.5in; size: 5in 3in landscape; }
          }
        </style>
      </head><body>${html}</body></html>
    `)
    win.document.close()
    setTimeout(() => { win.print() }, 800)
  }

  const subtitle = [year, model, trim].filter(Boolean).join(' · ')

  return (
    <>
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
        <QrCode size={16} /> Show Card
      </button>

      {open && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1.5rem', overflowY: 'auto',
          }}
        >
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 16,
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 24px 80px rgba(0,0,0,0.35)',
            padding: '2rem',
            width: '100%',
            maxWidth: 560,
            position: 'relative',
          }}>
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4, display: 'flex', borderRadius: 4 }}
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Modal header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.3rem' }}>
                QR Show Card
              </p>
              <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.5rem', fontWeight: 900, letterSpacing: '0.03em', color: 'var(--text-primary)', lineHeight: 1 }}>
                {nickname.toUpperCase()}
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                Print or save - hand out at shows, include in listings, post online.
              </p>
            </div>

            {/* ─── THE CARD ─────────────────────────────── */}
            <div style={{ overflowX: 'auto', marginBottom: '1.5rem' }}>
              <div
                ref={cardRef}
                style={{
                  width: 500,
                  height: 288,
                  borderRadius: 12,
                  background: '#0a0a0b',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  flexShrink: 0,
                  fontFamily: "'Barlow Condensed', sans-serif",
                }}
              >
                {/* Top accent bar */}
                <div style={{ height: 3, background: 'linear-gradient(90deg, #e03535 0%, #e0353500 65%)', flexShrink: 0 }} />

                {/* Photo strip - fills most of the card, fades into content on left */}
                {photoUrl && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0, bottom: 0,
                    width: '68%',
                    backgroundImage: `url(${photoUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,10,11,0.72) 0%, rgba(10,10,11,0.35) 42%, rgba(10,10,11,0.04) 100%)' }} />
                  </div>
                )}

                {/* Main content */}
                <div style={{ flex: 1, display: 'flex', padding: '18px 20px 14px', gap: '16px', position: 'relative', zIndex: 1 }}>

                  {/* Left: vehicle info */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minWidth: 0 }}>
                    {/* Brand wordmark */}
                    <div style={{ fontFamily: "'Roboto', sans-serif", fontSize: '9px', fontWeight: 900, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '10px' }}>
                      <span style={{ color: '#888' }}>Dynamic</span>
                      <span style={{ color: '#e03535' }}> Garage</span>
                    </div>

                    {/* Vehicle name */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: '38px',
                        fontWeight: 900,
                        color: '#f5f5f3',
                        letterSpacing: '0.02em',
                        lineHeight: 0.95,
                        textTransform: 'uppercase',
                        marginBottom: '8px',
                        wordBreak: 'break-word',
                      }}>
                        {nickname}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(245,245,243,0.65)', letterSpacing: '0.04em', marginBottom: '4px' }}>
                        {subtitle}
                      </div>
                      {color && (
                        <div style={{ fontSize: '11px', color: 'rgba(245,245,243,0.38)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                          {color}
                        </div>
                      )}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '14px', marginTop: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(224,53,53,0.12)', border: '1px solid rgba(224,53,53,0.2)', borderRadius: '5px', padding: '4px 9px' }}>
                        <span style={{ fontSize: '11px', color: '#e03535' }}>⚙</span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#e03535', letterSpacing: '0.06em' }}>{modCount} MOD{modCount !== 1 ? 'S' : ''}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(74,142,245,0.1)', border: '1px solid rgba(74,142,245,0.2)', borderRadius: '5px', padding: '4px 9px' }}>
                        <span style={{ fontSize: '11px', color: '#4a8ef5' }}>✓</span>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#4a8ef5', letterSpacing: '0.06em' }}>{svcCount} SERVICE</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: QR code */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', flexShrink: 0 }}>
                    <div style={{
                      background: '#ffffff',
                      borderRadius: 8,
                      padding: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <QRCodeSVG
                        value={shareUrl}
                        size={112}
                        fgColor="#0a0a0b"
                        bgColor="#ffffff"
                        level="M"
                      />
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,243,0.35)', textAlign: 'center' }}>
                      SCAN TO EXPLORE
                    </div>
                  </div>
                </div>

                {/* Bottom bar */}
                <div style={{
                  height: 32,
                  background: 'rgba(255,255,255,0.03)',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 20px',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1,
                }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#e03535', letterSpacing: '0.08em', fontFamily: "'Barlow Condensed', sans-serif" }}>
                    dynamicgarage.app
                  </span>
                  <span style={{ fontSize: '9px', color: 'rgba(245,245,243,0.25)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: "'Barlow Condensed', sans-serif" }}>
                    Full build · Photos · Service history
                  </span>
                </div>
              </div>
            </div>
            {/* ─────────────────────────────────────────── */}

            {/* Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.6rem' }}>
              <button
                onClick={copyLink}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', minHeight: 42, padding: '0.55rem 0.75rem', gap: '0.4rem', justifyContent: 'center' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={printCard}
                className="btn-secondary"
                style={{ fontSize: '0.82rem', minHeight: 42, padding: '0.55rem 0.75rem', gap: '0.4rem', justifyContent: 'center' }}
              >
                <Printer size={14} /> Print
              </button>
              <button
                onClick={downloadCard}
                disabled={downloading}
                className="btn-primary"
                style={{ fontSize: '0.82rem', minHeight: 42, padding: '0.55rem 0.75rem', gap: '0.4rem', justifyContent: 'center' }}
              >
                <Download size={14} /> {downloading ? 'Saving…' : 'Save PNG'}
              </button>
            </div>

            <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
              Perfect for car shows, forums, Craigslist listings, and window stickers.
            </p>
          </div>
        </div>
      )}

      <style>{`
        .qr-trigger:hover { border-color: var(--border-strong) !important; color: var(--text-primary) !important; }
      `}</style>
    </>
  )
}
