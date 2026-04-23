import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Dynamic Garage - Track Your Mods & Service'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d0d',
          position: 'relative',
        }}
      >
        {/* Background grid pattern */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
          backgroundSize: '40px 40px',
          display: 'flex',
        }} />

        {/* Red accent line top */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 6,
          background: 'linear-gradient(90deg, #cc1f1f, #e53e3e)',
          display: 'flex',
        }} />

        {/* Logo + brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginBottom: 40 }}>
          <div style={{
            width: 120, height: 120,
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
            display: 'flex',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`}
              alt="logo"
              width={120}
              height={120}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{
              fontSize: 72,
              fontWeight: 900,
              letterSpacing: '-0.01em',
              lineHeight: 1,
              display: 'flex',
            }}>
              <span style={{ color: '#a8a8a8' }}>DYNAMIC</span>
              <span style={{ color: '#cc1f1f', marginLeft: 16 }}>GARAGE</span>
            </div>
            <div style={{
              fontSize: 24,
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: 8,
              display: 'flex',
            }}>
              Track Every Mod · Every Mile · Every Memory
            </div>
          </div>
        </div>

        {/* Feature pills */}
        <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
          {['Modifications', 'Service Records', 'Documents', 'Public Share Page'].map(label => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 100,
              padding: '10px 24px',
              fontSize: 18,
              color: 'rgba(255,255,255,0.65)',
              display: 'flex',
            }}>
              {label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute',
          bottom: 36,
          fontSize: 20,
          color: 'rgba(255,255,255,0.25)',
          letterSpacing: '0.08em',
          display: 'flex',
        }}>
          dynamicgarage.app
        </div>
      </div>
    ),
    { ...size }
  )
}
