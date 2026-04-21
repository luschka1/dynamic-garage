import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminOverviewPage() {
  const admin = createAdminClient()

  // Fetch all stats in parallel
  const [
    { data: usersData },
    { count: vehicleCount },
    { count: modCount },
    { count: serviceCount },
    { count: photoCount },
    { count: documentCount },
    { data: recentVehicles },
  ] = await Promise.all([
    admin.auth.admin.listUsers(),
    admin.from('corvettes').select('*', { count: 'exact', head: true }),
    admin.from('mods').select('*', { count: 'exact', head: true }),
    admin.from('service_records').select('*', { count: 'exact', head: true }),
    admin.from('vehicle_photos').select('*', { count: 'exact', head: true }),
    admin.from('documents').select('*', { count: 'exact', head: true }),
    admin.from('corvettes').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  const users = usersData?.users ?? []

  // Build email lookup from auth users
  const emailMap: Record<string, string> = {}
  for (const u of users) {
    emailMap[u.id] = u.email ?? u.id
  }

  const stats = [
    { label: 'Total Users', value: users.length },
    { label: 'Total Vehicles', value: vehicleCount ?? 0 },
    { label: 'Total Mods', value: modCount ?? 0 },
    { label: 'Service Records', value: serviceCount ?? 0 },
    { label: 'Photos', value: photoCount ?? 0 },
    { label: 'Documents', value: documentCount ?? 0 },
  ]

  return (
    <div style={{ padding: '2rem 2.5rem' }}>
      {/* Page header */}
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
          Overview
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'rgba(245,245,243,0.4)' }}>
          Platform-wide stats and recent activity
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '2.5rem',
      }}>
        {stats.map(({ label, value }) => (
          <div key={label} style={{
            background: '#16161a',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 12,
            padding: '1.25rem 1.25rem',
            boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
          }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(245,245,243,0.38)', marginBottom: '0.5rem' }}>
              {label}
            </div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.25rem', fontWeight: 900, color: '#f5f5f3', lineHeight: 1 }}>
              {value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {/* Recent vehicles */}
      <div>
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: '1.25rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: '#f5f5f3',
          marginBottom: '1rem',
        }}>
          Recent Vehicles
        </h2>

        <div style={{
          background: '#16161a',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Year', 'Nickname', 'Model', 'Owner', 'Public', 'Created'].map(h => (
                  <th key={h} style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,245,243,0.38)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentVehicles ?? []).map((v, i) => (
                <tr
                  key={v.id}
                  style={{
                    borderBottom: i < (recentVehicles?.length ?? 0) - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                    background: i % 2 === 1 ? 'rgba(255,255,255,0.015)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.88rem', color: '#f5f5f3', fontWeight: 600 }}>{v.year}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.88rem', color: '#f5f5f3' }}>{v.nickname}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.88rem', color: 'rgba(245,245,243,0.6)' }}>{v.model}</td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'rgba(245,245,243,0.5)', fontFamily: 'monospace' }}>
                    {emailMap[v.user_id] ?? v.user_id.slice(0, 12) + '…'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 4,
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      letterSpacing: '0.06em',
                      background: v.is_public ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.06)',
                      color: v.is_public ? '#22c55e' : 'rgba(245,245,243,0.35)',
                    }}>
                      {v.is_public ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'rgba(245,245,243,0.4)' }}>
                    {new Date(v.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                </tr>
              ))}
              {(!recentVehicles || recentVehicles.length === 0) && (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem 1rem', textAlign: 'center', color: 'rgba(245,245,243,0.3)', fontSize: '0.88rem' }}>
                    No vehicles yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
