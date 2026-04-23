'use client'

import { useState } from 'react'
import { Mail, Copy, Check, ExternalLink } from 'lucide-react'

interface Props {
  emailAddress: string
  vehicleName: string
}

export default function EmailUploadAddress({ emailAddress, vehicleName }: Props) {
  const [copied, setCopied] = useState(false)

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(emailAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea')
      el.value = emailAddress
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const mailtoHref = `mailto:${emailAddress}?subject=Files for ${encodeURIComponent(vehicleName)}`

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 12,
      padding: '1.5rem',
      marginBottom: '1.5rem',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
        <div style={{
          width: 34, height: 34, borderRadius: 8,
          background: 'var(--blue-dim)',
          border: '1px solid rgba(29,78,216,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Mail size={16} color="var(--blue)" />
        </div>
        <div>
          <h3 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: '1.1rem', fontWeight: 800,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            color: 'var(--text-primary)', margin: 0,
          }}>
            Email Upload
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
            Send photos &amp; documents directly to this vehicle&apos;s vault
          </p>
        </div>
      </div>

      {/* Email address row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        background: 'var(--bg-base)',
        border: '1px solid var(--border-default)',
        borderRadius: 7,
        padding: '0.6rem 0.75rem',
        marginBottom: '0.9rem',
      }}>
        <span style={{
          flex: 1, fontFamily: 'monospace',
          fontSize: '0.82rem', color: 'var(--text-primary)',
          letterSpacing: '0.02em',
          wordBreak: 'break-all',
          userSelect: 'all',
        }}>
          {emailAddress}
        </span>

        <button
          onClick={copyAddress}
          title="Copy email address"
          style={{
            display: 'flex', alignItems: 'center', gap: '0.3rem',
            background: copied ? 'rgba(22,163,74,0.1)' : 'var(--bg-card)',
            border: `1px solid ${copied ? 'rgba(22,163,74,0.3)' : 'var(--border-default)'}`,
            color: copied ? '#16a34a' : 'var(--text-secondary)',
            borderRadius: 5, padding: '0.35rem 0.7rem',
            cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
            letterSpacing: '0.04em', textTransform: 'uppercase',
            transition: 'all 150ms', flexShrink: 0, whiteSpace: 'nowrap',
          }}
        >
          {copied
            ? <><Check size={12} /> Copied!</>
            : <><Copy size={12} /> Copy</>
          }
        </button>

        <a
          href={mailtoHref}
          title="Open in mail app"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-default)',
            color: 'var(--text-muted)',
            borderRadius: 5, padding: '0.35rem 0.55rem',
            transition: 'color 150ms, border-color 150ms',
            flexShrink: 0,
          }}
          className="email-open-btn"
        >
          <ExternalLink size={13} />
        </a>
      </div>

      {/* How-to bullets */}
      <div style={{
        display: 'flex', flexDirection: 'column', gap: '0.35rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-subtle)',
      }}>
        {[
          'Email any photos, PDFs, or receipts to this address from any device',
          'Attachments are automatically saved to your Document Vault',
          'Works from your phone - great for snapping a receipt right at the shop',
        ].map((tip, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
            <span style={{
              width: 16, height: 16, borderRadius: '50%',
              background: 'var(--blue-dim)',
              color: 'var(--blue)',
              fontSize: '0.6rem', fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '0.1rem',
            }}>
              {i + 1}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {tip}
            </span>
          </div>
        ))}
      </div>

      <style>{`
        .email-open-btn:hover { color: var(--text-primary) !important; border-color: var(--border-strong) !important; }
      `}</style>
    </div>
  )
}
