'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Mail, ArrowLeft, ChevronRight } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSent(true)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--red) 0%, transparent 60%)' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <Link href="/" style={{ marginBottom: '2.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{ width: 32, height: 32, background: 'var(--red)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 900, fontSize: '1rem', color: 'white' }}>DG</span>
          </div>
          <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <span style={{ color: 'var(--red)' }}>Dynamic</span><span style={{ color: 'var(--text-muted)' }}> Garage</span>
          </span>
        </Link>

        <div style={{ width: '100%', maxWidth: 420 }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: 64, height: 64, background: 'var(--red-dim)', border: '1px solid var(--red-glow)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '1.75rem' }}>
                <Mail size={28} color="var(--red)" />
              </div>
              <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>CHECK YOUR EMAIL</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '2rem' }}>
                We sent a reset link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.
                Check your inbox and spam folder.
              </p>
              <Link href="/login" className="btn-secondary" style={{ display: 'inline-flex' }}>
                <ArrowLeft size={16} /> Back to Sign In
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.02em', marginBottom: '0.35rem' }}>RESET PASSWORD</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Enter your email and we&apos;ll send a reset link.
              </p>

              {error && (
                <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', borderRadius: 6, padding: '0.85rem 1rem', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                <div>
                  <label className="label">Email Address</label>
                  <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
                  <Mail size={18} /> {loading ? 'Sending…' : 'Send Reset Link'} <ChevronRight size={18} />
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <Link href="/login" style={{ color: 'var(--red-bright)', fontWeight: 700 }}>
                  <ArrowLeft size={14} style={{ display: 'inline', verticalAlign: 'middle' }} /> Back to Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
