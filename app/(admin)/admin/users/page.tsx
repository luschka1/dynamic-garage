import { createAdminClient } from '@/lib/supabase/admin'

export default async function AdminUsersPage() {
  const admin = createAdminClient()

  const [
    { data: usersData },
    { data: corvettes },
  ] = await Promise.all([
    admin.auth.admin.listUsers(),
    admin.from('corvettes').select('user_id'),
  ])

  const users = usersData?.users ?? []

  // Count vehicles per user
  const vehicleCountMap: Record<string, number> = {}
  for (const c of corvettes ?? []) {
    vehicleCountMap[c.user_id] = (vehicleCountMap[c.user_id] ?? 0) + 1
  }

  // Sort users by created_at desc
  const sortedUsers = [...users].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

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
          color: 'var(--text-primary)',
          marginBottom: '0.25rem',
        }}>
          Users
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          {sortedUsers.length} registered user{sortedUsers.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
        overflow: 'hidden',
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              {['Email', 'User ID', 'Vehicles', 'Joined', 'Last Sign In'].map(h => (
                <th key={h} style={{
                  padding: '0.75rem 1rem',
                  textAlign: 'left',
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user, i) => (
              <tr
                key={user.id}
                style={{
                  borderBottom: i < sortedUsers.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                  background: i % 2 === 1 ? 'var(--bg-base)' : 'transparent',
                }}
              >
                {/* Email */}
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                    {user.email ?? ' - '}
                  </div>
                  {user.user_metadata?.full_name && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
                      {user.user_metadata.full_name}
                    </div>
                  )}
                </td>

                {/* User ID */}
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {user.id.slice(0, 18)}…
                  </div>
                </td>

                {/* Vehicle count */}
                <td style={{ padding: '0.75rem 1rem' }}>
                  <span style={{
                    display: 'inline-block',
                    minWidth: 24,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 4,
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    background: vehicleCountMap[user.id] ? 'rgba(224,53,53,0.12)' : 'var(--bg-elevated)',
                    color: vehicleCountMap[user.id] ? 'var(--red)' : 'var(--text-muted)',
                  }}>
                    {vehicleCountMap[user.id] ?? 0}
                  </span>
                </td>

                {/* Created at */}
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                  {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>

                {/* Last sign in */}
                <td style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : ' - '
                  }
                </td>
              </tr>
            ))}
            {sortedUsers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  No users yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
