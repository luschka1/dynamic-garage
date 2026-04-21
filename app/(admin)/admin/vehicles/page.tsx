import { createAdminClient } from '@/lib/supabase/admin'
import VehicleAdminActions from './VehicleAdminActions'

export default async function AdminVehiclesPage() {
  const admin = createAdminClient()

  const [
    { data: vehicles },
    { data: usersData },
    { data: modCounts },
    { data: serviceCounts },
  ] = await Promise.all([
    admin.from('corvettes').select('*').order('created_at', { ascending: false }),
    admin.auth.admin.listUsers(),
    admin.from('mods').select('corvette_id'),
    admin.from('service_records').select('corvette_id'),
  ])

  const users = usersData?.users ?? []
  const emailMap: Record<string, string> = {}
  for (const u of users) {
    emailMap[u.id] = u.email ?? u.id
  }

  // Count mods and service records per vehicle
  const modCountMap: Record<string, number> = {}
  for (const m of modCounts ?? []) {
    modCountMap[m.corvette_id] = (modCountMap[m.corvette_id] ?? 0) + 1
  }
  const serviceCountMap: Record<string, number> = {}
  for (const s of serviceCounts ?? []) {
    serviceCountMap[s.corvette_id] = (serviceCountMap[s.corvette_id] ?? 0) + 1
  }

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: '2rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: '#f5f5f3',
          marginBottom: '0.25rem',
        }}>
          All Vehicles
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(245,245,243,0.4)' }}>
          {vehicles?.length ?? 0} vehicle{(vehicles?.length ?? 0) !== 1 ? 's' : ''} in the system
        </p>
      </div>

      {/* Table */}
      <div style={{
        background: '#16161a',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Photo', 'Vehicle', 'Owner', 'Mods', 'Service', 'Flags', 'Actions'].map(h => (
                <th key={h} style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(245,245,243,0.38)',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(vehicles ?? []).map((v, i) => (
              <tr
                key={v.id}
                style={{
                  borderBottom: i < (vehicles?.length ?? 0) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                  background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent',
                }}
              >
                {/* Photo */}
                <td style={{ padding: '0.65rem 1rem' }}>
                  {v.photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={v.photo_url}
                      alt={v.nickname}
                      style={{ width: 50, height: 50, borderRadius: 6, objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{
                      width: 50, height: 50, borderRadius: 6,
                      background: 'rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.65rem', color: 'rgba(245,245,243,0.2)',
                    }}>
                      No img
                    </div>
                  )}
                </td>

                {/* Vehicle info */}
                <td style={{ padding: '0.65rem 1rem' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f5f5f3' }}>{v.nickname}</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(245,245,243,0.45)', marginTop: '0.15rem' }}>
                    {v.year} {v.model}
                  </div>
                </td>

                {/* Owner */}
                <td style={{ padding: '0.65rem 1rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(245,245,243,0.6)', fontFamily: 'monospace', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {emailMap[v.user_id] ?? v.user_id.slice(0, 12) + '…'}
                  </div>
                </td>

                {/* Mods count */}
                <td style={{ padding: '0.65rem 1rem' }}>
                  <span style={{ fontSize: '0.88rem', color: '#f5f5f3', fontWeight: 600 }}>
                    {modCountMap[v.id] ?? 0}
                  </span>
                </td>

                {/* Service count */}
                <td style={{ padding: '0.65rem 1rem' }}>
                  <span style={{ fontSize: '0.88rem', color: '#f5f5f3', fontWeight: 600 }}>
                    {serviceCountMap[v.id] ?? 0}
                  </span>
                </td>

                {/* Flags */}
                <td style={{ padding: '0.65rem 1rem' }}>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {v.is_public && <Badge color="green">Public</Badge>}
                    {v.in_gallery && <Badge color="blue">Gallery</Badge>}
                    {v.for_sale && <Badge color="gold">For Sale</Badge>}
                    {!v.is_public && !v.in_gallery && !v.for_sale && (
                      <Badge color="dim">Private</Badge>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td style={{ padding: '0.65rem 1rem' }}>
                  <VehicleAdminActions
                    vehicleId={v.id}
                    userId={v.user_id}
                    isPublic={v.is_public}
                    nickname={v.nickname}
                  />
                </td>
              </tr>
            ))}
            {(!vehicles || vehicles.length === 0) && (
              <tr>
                <td colSpan={7} style={{ padding: '2rem 1rem', textAlign: 'center', color: 'rgba(245,245,243,0.3)', fontSize: '0.88rem' }}>
                  No vehicles yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Badge({ color, children }: { color: 'green' | 'blue' | 'gold' | 'dim'; children: React.ReactNode }) {
  const colorMap = {
    green: { bg: 'rgba(34,197,94,0.12)', text: '#22c55e' },
    blue:  { bg: 'rgba(74,142,245,0.12)', text: '#4a8ef5' },
    gold:  { bg: 'rgba(212,164,26,0.12)', text: '#d4a41a' },
    dim:   { bg: 'rgba(255,255,255,0.06)', text: 'rgba(245,245,243,0.35)' },
  }
  const { bg, text } = colorMap[color]
  return (
    <span style={{
      display: 'inline-block',
      padding: '0.15rem 0.45rem',
      borderRadius: 4,
      fontSize: '0.65rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
      background: bg,
      color: text,
      whiteSpace: 'nowrap',
    }}>
      {children}
    </span>
  )
}
