'use client'

import { useState } from 'react'
import { Mail, X, ChevronDown } from 'lucide-react'

export default function ContactSellerForm({ corvetteId, vehicleLabel }: { corvetteId: string; vehicleLabel: string }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ senderName: '', senderEmail: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMsg('')

    try {
      const res = await fetch('/api/contact-seller', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ corvetteId, ...form }),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
      } else {
        setStatus('success')
      }
    } catch {
      setErrorMsg('Could not send message. Please try again.')
      setStatus('error')
    }
  }

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Toggle button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#16a34a',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            padding: '0.75rem 1.5rem',
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'opacity 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
        >
          <Mail size={15} /> Contact Seller
        </button>
      )}

      {/* Expanded form */}
      {open && (
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 12,
          padding: '1.5rem',
          boxShadow: 'var(--shadow-card)',
        }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Contact Seller</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                Your message will be sent privately — your email is only shared with the seller.
              </div>
            </div>
            <button
              onClick={() => { setOpen(false); setStatus('idle'); setErrorMsg('') }}
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '0.25rem', borderRadius: 4 }}
            >
              <X size={16} />
            </button>
          </div>

          {status === 'success' ? (
            <div style={{
              background: 'var(--green-dim)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 8,
              padding: '1.25rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✓</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--green)', marginBottom: '0.35rem' }}>Message Sent!</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0 }}>
                The seller will be in touch at your email address.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={labelStyle}>Your Name *</label>
                  <input
                    name="senderName"
                    value={form.senderName}
                    onChange={handleChange}
                    required
                    placeholder="John Smith"
                    style={inputStyle}
                    className="contact-seller-input"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Your Email *</label>
                  <input
                    name="senderEmail"
                    type="email"
                    value={form.senderEmail}
                    onChange={handleChange}
                    required
                    placeholder="you@email.com"
                    style={inputStyle}
                    className="contact-seller-input"
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Message *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder={`Hi, I'm interested in your ${vehicleLabel}...`}
                  rows={4}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: 100 }}
                  className="contact-seller-input"
                />
              </div>

              {status === 'error' && (
                <div style={{
                  background: 'var(--red-dim)',
                  border: '1px solid var(--red-glow)',
                  borderRadius: 6,
                  padding: '0.65rem 0.9rem',
                  fontSize: '0.82rem',
                  color: 'var(--red-bright)',
                }}>
                  {errorMsg}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  style={{
                    background: '#16a34a',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0.7rem 1.5rem',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    cursor: status === 'sending' ? 'not-allowed' : 'pointer',
                    opacity: status === 'sending' ? 0.6 : 1,
                    fontFamily: 'inherit',
                    transition: 'opacity 0.15s',
                  }}
                >
                  {status === 'sending' ? 'Sending…' : 'Send Message'}
                </button>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  The seller&apos;s email is never shared with you.
                </span>
              </div>
            </form>
          )}

          <style>{`
            .contact-seller-input {
              border-color: var(--border-default) !important;
            }
            .contact-seller-input:focus {
              outline: none;
              border-color: #16a34a !important;
            }
          `}</style>
        </div>
      )}
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.7rem',
  fontWeight: 700,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'var(--text-muted)',
  marginBottom: '0.35rem',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'var(--bg-input)',
  border: '1px solid var(--border-default)',
  borderRadius: 7,
  color: 'var(--text-primary)',
  fontSize: '0.88rem',
  padding: '0.6rem 0.8rem',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s',
}
