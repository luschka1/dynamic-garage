'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Eye, EyeOff, ChevronRight } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: name } } })
    if (error) { setError(error.message); setLoading(false) }
    else setSuccess(true)
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: 440, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: 'var(--green-dim)', border: '1px solid rgba(22,163,74,0.3)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2rem' }}>✓</div>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.75rem' }}>CHECK YOUR EMAIL</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            We sent a confirmation link to <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>.<br />Click it to activate your account.
          </p>
          <Link href="/login" className="btn-secondary">Go to Sign In</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 3, background: 'linear-gradient(90deg, var(--red) 0%, transparent 60%)' }} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem' }}>
        <Link href="/" style={{ marginBottom: '2.5rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ width: 52, height: 52, background: '#0d0d0d', borderRadius: 10, overflow: 'hidden', flexShrink: 0 }}>
            <img src="/logo.png" alt="Dynamic Garage" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <span style={{ fontFamily: "'Barlow Condensed'", fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            <span style={{ color: 'var(--red)' }}>Dynamic</span><span style={{ color: 'var(--text-muted)' }}> Garage</span>
          </span>
        </Link>

        <div style={{ width: '100%', maxWidth: 420 }}>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: '2.5rem', fontWeight: 900, letterSpacing: '0.02em', marginBottom: '0.35rem' }}>CREATE YOUR GARAGE</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>Free during early access &mdash; any make, any model</p>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', borderRadius: 6, padding: '0.85rem 1rem', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 600 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label className="label">Your Name</label>
              <input className="input-field" type="text" placeholder="John Smith" value={name} onChange={e => setName(e.target.value)} required autoComplete="name" />
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
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {password.length > 0 && password.length < 8 && (
                <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.35rem' }}>At least 8 characters required</p>
              )}
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem' }}>
              {loading ? 'Creating Account…' : 'Create Account'} <ChevronRight size={18} />
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--red-bright)', fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
