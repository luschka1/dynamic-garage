import Link from 'next/link'

const LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms',   href: '#'        },
  { label: 'Contact', href: '/contact' },
]

export default function PublicFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-subtle)',
      padding: '1.5rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem',
      background: 'var(--bg-elevated)',
    }}>
      <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 900, fontSize: '1rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
        <span style={{ color: '#a8a8a8' }}>Dynamic</span>
        <span style={{ color: 'var(--red)' }}> Garage</span>
      </span>

      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
        &copy; {new Date().getFullYear()} &nbsp;DynamicGarage.app &mdash; Built for enthusiasts.
      </span>

      <div style={{ display: 'flex', gap: '1.25rem' }}>
        {LINKS.map(l => (
          <Link
            key={l.label}
            href={l.href}
            className="pub-footer-link"
            style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textDecoration: 'none', transition: 'color 150ms' }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <style>{`.pub-footer-link:hover { color: var(--text-secondary) !important; }`}</style>
    </footer>
  )
}
