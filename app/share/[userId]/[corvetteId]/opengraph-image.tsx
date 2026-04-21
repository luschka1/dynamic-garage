import { ImageResponse } from 'next/og'
import { createAdminClient } from '@/lib/supabase/admin'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OGImage({ params }: { params: Promise<{ userId: string; corvetteId: string }> }) {
  const { corvetteId, userId } = await params
  const admin = createAdminClient()

  const { data: car } = await admin
    .from('corvettes')
    .select('nickname, year, model, trim, color, photo_url, for_sale, mileage')
    .eq('id', corvetteId)
    .eq('user_id', userId)
    .eq('is_public', true)
    .single()

  const nickname = car?.nickname ?? 'Vehicle'
  const subtitle = [car?.year, car?.model, car?.trim].filter(Boolean).join(' ')
  const photoUrl = car?.photo_url ?? null
  const forSale = car?.for_sale ?? false

  return new ImageResponse(
    (
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#0d0d0d',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Car photo as background */}
        {photoUrl && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photoUrl}
              alt={nickname}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.35,
              }}
            />
          </>
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.3) 100%)',
          display: 'flex',
        }} />

        {/* Red top bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: 6,
          background: '#cc1f1f',
          display: 'flex',
        }} />

        {/* Top: DG brand */}
        <div style={{
          position: 'absolute',
          top: 36, left: 48,
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 48, height: 48,
            borderRadius: 10,
            overflow: 'hidden',
            display: 'flex',
          }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`${process.env.NEXT_PUBLIC_SITE_URL}/logo.png`} alt="logo" width={48} height={48} style={{ objectFit: 'cover' }} />
          </div>
          <div style={{
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.06em',
            display: 'flex',
          }}>
            <span style={{ color: '#a8a8a8' }}>DYNAMIC</span>
            <span style={{ color: '#cc1f1f', marginLeft: 8 }}>GARAGE</span>
          </div>
        </div>

        {/* For Sale badge */}
        {forSale && (
          <div style={{
            position: 'absolute',
            top: 36, right: 48,
            background: '#16a34a',
            color: 'white',
            fontSize: 20,
            fontWeight: 900,
            letterSpacing: '0.1em',
            padding: '10px 24px',
            borderRadius: 8,
            display: 'flex',
          }}>
            FOR SALE
          </div>
        )}

        {/* Bottom: car info */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <div style={{
            fontSize: 96,
            fontWeight: 900,
            color: 'white',
            lineHeight: 0.9,
            letterSpacing: '-0.01em',
            display: 'flex',
          }}>
            {nickname.toUpperCase()}
          </div>
          <div style={{
            fontSize: 32,
            color: 'rgba(255,255,255,0.55)',
            marginTop: 16,
            display: 'flex',
            gap: 16,
            alignItems: 'center',
          }}>
            {subtitle}
            {car?.color && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.25)', display: 'flex' }}>·</span>
                <span style={{ display: 'flex' }}>{car.color}</span>
              </>
            )}
          </div>
          <div style={{
            fontSize: 18,
            color: 'rgba(255,255,255,0.3)',
            marginTop: 12,
            letterSpacing: '0.06em',
            display: 'flex',
          }}>
            dynamicgarage.app
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
