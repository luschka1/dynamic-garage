'use client'

import { useState } from 'react'
import Link from 'next/link'
import ThemeToggle from '@/components/ThemeToggle'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      let data: { error?: string; success?: boolean } = {}
      try {
        data = await res.json()
      } catch {
        const text = await res.text().catch(() => 'Unknown server error')
        console.error(`[${res.status}]`, text)
        setErrorMsg('Something went wrong. Please try again.')
        setStatus('error')
        return
      }
      if (!res.ok) {
        setErrorMsg(data.error ?? 'Something went wrong.')
        setStatus('error')
      } else {
        setStatus('success')
        setForm({ name: '', email: '', subject: '', message: '' })
      }
    } catch (err) {
      console.error('Contact form error:', err)
      setErrorMsg('Could not reach the server. Please try again.')
      setStatus('error')
    }
  }

  return (
    <>
      <style>{`
        .contact-page {
          min-height: 100vh;
          background: var(--bg-base);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 1.5rem;
        }

        .contact-back-link {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          transition: color 0.15s;
        }
        .contact-back-link:hover { color: var(--text-secondary); }

        .contact-card {
          width: 100%;
          max-width: 560px;
          background: var(--bg-card);
          border: 1px solid var(--border-subtle);
          border-radius: 16px;
          padding: 2.5rem;
          box-shadow: var(--shadow-card);
        }

        .contact-logo-box {
          width: 80px;
          height: 80px;
          background: var(--nav-bg);
          border-radius: 16px;
          overflow: hidden;
          flex-shrink: 0;
        }

        .contact-brand {
          font-family: 'Roboto', sans-serif;
          font-weight: 900;
          font-size: 1rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 0.2rem;
        }

        .contact-subtitle {
          font-size: 0.72rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .contact-heading {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 1.75rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-primary);
          margin-bottom: 0.4rem;
        }

        .contact-intro {
          font-size: 0.875rem;
          color: var(--text-muted);
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .contact-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }

        .contact-input {
          width: 100%;
          background: var(--bg-input);
          border: 1px solid var(--border-default);
          border-radius: 8px;
          color: var(--text-primary);
          font-size: 0.9rem;
          padding: 0.65rem 0.85rem;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
          font-family: inherit;
        }
        .contact-input::placeholder { color: var(--text-muted); }
        .contact-input:focus { border-color: var(--red); }

        .contact-success {
          background: var(--green-dim);
          border: 1px solid rgba(34,197,94,0.2);
          border-radius: 10px;
          padding: 1.75rem;
          text-align: center;
        }

        .contact-error {
          background: var(--red-dim);
          border: 1px solid var(--red-glow);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          font-size: 0.82rem;
          color: var(--red-bright);
        }

        .contact-submit {
          background: var(--red);
          color: #fff;
          border: none;
          border-radius: 8px;
          padding: 0.85rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: opacity 0.15s;
          margin-top: 0.25rem;
          width: 100%;
          font-family: inherit;
        }
        .contact-submit:hover:not(:disabled) { opacity: 0.88; }
        .contact-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .contact-send-another {
          margin-top: 1.25rem;
          background: transparent;
          border: 1px solid var(--border-default);
          border-radius: 8px;
          color: var(--text-muted);
          font-size: 0.82rem;
          padding: 0.5rem 1.25rem;
          cursor: pointer;
          font-family: inherit;
          transition: color 0.15s, border-color 0.15s;
        }
        .contact-send-another:hover {
          color: var(--text-secondary);
          border-color: var(--border-strong);
        }

        .contact-footer-note {
          margin-top: 1.5rem;
          font-size: 0.72rem;
          color: var(--text-muted);
          text-align: center;
          opacity: 0.6;
        }
      `}</style>

      {/* Top nav bar — matches homepage style */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: 'var(--nav-bg)',
        borderBottom: '1px solid var(--nav-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1.5rem',
        zIndex: 50,
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{
            fontFamily: "'Roboto', sans-serif",
            fontWeight: 900,
            fontSize: '1.1rem',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            <span style={{ color: '#a8a8a8' }}>Dynamic</span>
            <span style={{ color: '#cc1f1f' }}> Garage</span>
          </span>
        </Link>
        <ThemeToggle />
      </nav>

      <div className="contact-page" style={{ paddingTop: '5rem' }}>
        {/* Back link */}
        <div style={{ width: '100%', maxWidth: 560, marginBottom: '1.25rem' }}>
          <Link href="/" className="contact-back-link">
            ← Back to home
          </Link>
        </div>

        {/* Card */}
        <div className="contact-card">
          {/* Logo */}
          <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'center' }}>
            <div className="contact-logo-box">
              <img src="/logo.png" alt="Dynamic Garage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          <h1 className="contact-heading">Get in Touch</h1>
          <p className="contact-intro">
            Questions, feedback, or just want to say hi? We&apos;d love to hear from you.
          </p>

          {status === 'success' ? (
            <div className="contact-success">
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✓</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--green)', marginBottom: '0.5rem' }}>
                Message Sent!
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Thanks for reaching out. We&apos;ll get back to you as soon as possible.
              </p>
              <button className="contact-send-another" onClick={() => setStatus('idle')}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* Name + Email row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div>
                  <label className="contact-label">Name *</label>
                  <input
                    className="contact-input"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="contact-label">Email *</label>
                  <input
                    className="contact-input"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="contact-label">Subject</label>
                <input
                  className="contact-input"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What's this about? (optional)"
                />
              </div>

              {/* Message */}
              <div>
                <label className="contact-label">Message *</label>
                <textarea
                  className="contact-input"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  placeholder="Tell us what's on your mind..."
                  rows={5}
                  style={{ resize: 'vertical', minHeight: 120 }}
                />
              </div>

              {/* Error */}
              {status === 'error' && (
                <div className="contact-error">{errorMsg}</div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className="contact-submit"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Sending…' : 'Send Message'}
              </button>
            </form>
          )}
        </div>

        <p className="contact-footer-note">
          We typically respond within 1–2 business days.
        </p>
      </div>
    </>
  )
}
