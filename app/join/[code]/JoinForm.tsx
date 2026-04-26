'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ChevronRight, Eye, EyeOff, CheckCircle, Shield } from 'lucide-react'
import type { PartnerCode } from '@/lib/types'

const FINE_PRINT = `Lifetime membership is granted through a promotional partnership with ${'{partner}'}  and remains active provided you: (1) maintain at least one vehicle in your garage, and (2) log in at least once every 30 days. Accounts that do not meet these conditions for 90 consecutive days may be suspended. Dynamic Garage reserves the right to modify these terms with 30 days' notice to the email address on your account.`

export default function JoinForm({ partner }: { partner: PartnerCode }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: signupErr } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          is_lifetime: true,
          partner_code: partner.code,
        },
        emailRedirectTo: `${window.location.origin}/api/partner-confirm?code=${partner.code}`,
      },
    })

    if (signupErr) {
      setError(signupErr.message)
      setLoading(false)
      return
    }

    // Fire Meta Pixel
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration', { content_name: partner.code })
    }

    setDone(true)
  }

  if (done) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 460, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <CheckCircle size={30} color="#16a34a" />
          </div>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>CHECK YOUR EMAIL</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
            We sent a confirmation link to
          </p>
          <p style={{ fontWeight: 700, color: 'var(--text-primary)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '0.6rem 1rem', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
            {email}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6 }}>
            Click the link to activate your <strong>Lifetime Membership</strong> — courtesy of {partner.partner_name}.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      {/* Top accent */}
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--red) 0%, transparent 60%)' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem' }}>
        <div style={{ width: '100%', maxWidth: 480 }}>

          {/* Co-brand header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {partner.logo_url && (
              <>
                <img
                  src={partner.logo_url}
                  alt={partner.partner_name}
                  style={{ height: 40, objectFit: 'contain', maxWidth: 140 }}
                />
                <div style={{ width: 1, height: 32, background: 'var(--border-default)' }} />
              </>
            )}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontFamily: "'Roboto', sans-serif", fontWeight: 900, fontSize: '1.2rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Dynamic</span>
                <span style={{ color: 'var(--red)' }}> Garage</span>
              </span>
            </Link>
          </div>

          {/* Offer headline */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(22,163,74,0.1)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: 20, padding: '0.3rem 0.9rem', marginBottom: '0.9rem' }}>
              <Shield size={13} color="#16a34a" />
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#16a34a', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Exclusive Partner Offer</span>
            </div>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 900, letterSpacing: '0.02em', lineHeight: 1.05, marginBottom: '0.6rem' }}>
              {partner.headline.toUpperCase()}
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              {partner.subheadline}
            </p>
          </div>

          {/* What you get */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 12, padding: '1.1rem 1.25rem', marginBottom: '1.75rem' }}>
            {[
              'Unlimited vehicles, mods, and service records',
              'Document vault, photo gallery & QR show cards',
              'Public build pages, for-sale listings & sharing',
              'Lifetime Member status — grandfathered forever',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.4rem 0', borderBottom: i < 3 ? '1px solid var(--border-subtle)' : 'none' }}>
                <CheckCircle size={15} color="#16a34a" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 16, padding: '1.75rem' }}>
            {error && (
              <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', borderRadius: 6, padding: '0.75rem 1rem', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Full Name</label>
                <input className="input-field" type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input className="input-field" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
              <div>
                <label className="label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input className="input-field" type={showPw ? 'text' : 'password'} placeholder="At least 8 characters" value={password} onChange={e => setPassword(e.target.value)} required autoComplete="new-password" style={{ paddingRight: '3rem' }} />
                  <button type="button" onClick={() => setShowPw(v => !v)} style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.25rem', background: '#16a34a', borderColor: '#16a34a' }}>
                {loading ? 'Creating Account…' : 'Claim Lifetime Access'} <ChevronRight size={18} />
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: 'var(--red-bright)', fontWeight: 700 }}>Sign in</Link>
            </p>
          </div>

          {/* Fine print */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 8 }}>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.7, margin: 0 }}>
              <strong style={{ color: 'var(--text-secondary)' }}>Membership Terms:</strong>{' '}
              {FINE_PRINT.replace('{partner}', partner.partner_name)}
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
