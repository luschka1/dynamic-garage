import { createAdminClient } from '@/lib/supabase/admin'
import { DeletePhotoButton, DeleteDocumentButton } from './MediaAdminActions'

export default async function AdminMediaPage() {
  const admin = createAdminClient()

  const [
    { data: photos },
    { data: documents },
    { data: corvettes },
  ] = await Promise.all([
    admin.from('vehicle_photos').select('*').order('created_at', { ascending: false }),
    admin.from('documents').select('*').order('created_at', { ascending: false }),
    admin.from('corvettes').select('id, nickname, user_id'),
  ])

  // Build nickname lookup
  const nicknameMap: Record<string, string> = {}
  for (const c of corvettes ?? []) {
    nicknameMap[c.id] = c.nickname
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
          color: 'var(--text-primary)',
          marginBottom: '0.25rem',
        }}>
          Media Management
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Manage vehicle photos and documents
        </p>
      </div>

      {/* Photos section */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: '1.25rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          Photos
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            padding: '0.2rem 0.5rem',
            borderRadius: 4,
          }}>
            {photos?.length ?? 0}
          </span>
        </h2>

        {photos && photos.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {photos.map(photo => (
              <div key={photo.id} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 10,
                overflow: 'hidden',
              }}>
                {/* Thumbnail */}
                <div style={{ width: '100%', aspectRatio: '4/3', background: 'var(--bg-elevated)', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.public_url}
                    alt={photo.caption ?? 'Vehicle photo'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>

                {/* Info */}
                <div style={{ padding: '0.75rem' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {nicknameMap[photo.corvette_id] ?? 'Unknown Vehicle'}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {photo.user_id.slice(0, 16)}…
                  </div>
                  {photo.caption && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {photo.caption}
                    </div>
                  )}
                  <DeletePhotoButton photoId={photo.id} storagePath={photo.storage_path} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10,
            padding: '2rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.88rem',
          }}>
            No photos yet
          </div>
        )}
      </section>

      {/* Documents section */}
      <section>
        <h2 style={{
          fontFamily: "'Barlow Condensed', sans-serif",
          fontWeight: 900,
          fontSize: '1.25rem',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--text-primary)',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          Documents
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-muted)',
            padding: '0.2rem 0.5rem',
            borderRadius: 4,
          }}>
            {documents?.length ?? 0}
          </span>
        </h2>

        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          overflow: 'hidden',
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                {['Name', 'Type', 'Vehicle', 'Created', 'Actions'].map(h => (
                  <th key={h} style={{
                    padding: '0.75rem 1rem',
                    textAlign: 'left',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(documents ?? []).map((doc, i) => (
                <tr
                  key={doc.id}
                  style={{
                    borderBottom: i < (documents?.length ?? 0) - 1 ? '1px solid var(--border-subtle)' : 'none',
                    background: i % 2 === 1 ? 'var(--bg-base)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '0.65rem 1rem' }}>
                    <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.name}
                    </div>
                  </td>
                  <td style={{ padding: '0.65rem 1rem' }}>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.45rem',
                      borderRadius: 4,
                      background: 'var(--bg-elevated)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}>
                      {doc.file_type ?? 'file'}
                    </span>
                  </td>
                  <td style={{ padding: '0.65rem 1rem', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {nicknameMap[doc.corvette_id] ?? '—'}
                  </td>
                  <td style={{ padding: '0.65rem 1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {new Date(doc.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td style={{ padding: '0.65rem 1rem' }}>
                    <DeleteDocumentButton docId={doc.id} />
                  </td>
                </tr>
              ))}
              {(!documents || documents.length === 0) && (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                    No documents yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
