'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { ArrowLeft, ChevronRight } from 'lucide-react'

const MAKES = [
  'Acura','Alfa Romeo','Aston Martin','Audi','Bentley','BMW','Buick','Cadillac',
  'Chevrolet','Chrysler','Dodge','Ferrari','Fiat','Ford','Genesis','GMC','Honda',
  'Hyundai','Infiniti','Jaguar','Jeep','Kia','Lamborghini','Land Rover','Lexus',
  'Lincoln','Lotus','Maserati','Mazda','McLaren','Mercedes-Benz','MINI','Mitsubishi',
  'Nissan','Pontiac','Porsche','RAM','Rolls-Royce','Subaru','Tesla','Toyota',
  'Volkswagen','Volvo','Other'
]

export default function NewCarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ nickname: '', year: new Date().getFullYear(), make: '', model: '', trim: '', color: '', vin: '', mileage: '', is_public: false, in_gallery: false })

  function set(key: string, value: string | number | boolean) { setForm(f => ({ ...f, [key]: value })) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { data, error } = await supabase.from('corvettes').insert({
      user_id: user.id,
      nickname: form.nickname,
      year: Number(form.year),
      model: `${form.make} ${form.model}`.trim(),
      trim: form.trim || null,
      color: form.color || null,
      vin: form.vin || null,
      mileage: form.mileage ? Number(form.mileage) : null,
      is_public: form.is_public,
      in_gallery: form.in_gallery,
    }).select().single()

    if (error) { setError('Something went wrong. Please try again.'); setLoading(false) }
    else router.push(`/corvettes/${data.id}`)
  }

  return (
    <div>
      <Link href="/dashboard" className="back-link"><ArrowLeft size={14} /> My Garage</Link>

      <div style={{ marginBottom: '2rem' }}>
        <p className="page-eyebrow">New Vehicle</p>
        <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, lineHeight: 1 }}>ADD A CAR</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.35rem' }}>Enter your vehicle details below</p>
      </div>

      <div style={{ maxWidth: 620 }}>
        {error && (
          <div style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', color: '#f87171', borderRadius: 6, padding: '0.85rem 1rem', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* Section: Identity */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--red)', marginBottom: '1.25rem' }}>Identity</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Nickname *</label>
                <input className="input-field" type="text" placeholder="e.g. Red Rocket, The Beast, Daily" value={form.nickname} onChange={e => set('nickname', e.target.value)} required />
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>A name to identify this car in your garage</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Year *</label>
                  <input className="input-field" type="number" min={1900} max={new Date().getFullYear() + 1} value={form.year} onChange={e => set('year', e.target.value)} required />
                </div>
                <div>
                  <label className="label">Make *</label>
                  <select className="input-field" value={form.make} onChange={e => set('make', e.target.value)} required>
                    <option value="">Select…</option>
                    {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Model *</label>
                  <input className="input-field" type="text" placeholder="Mustang" value={form.model} onChange={e => set('model', e.target.value)} required />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Specs */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Specs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label className="label">Trim / Package</label>
                <input className="input-field" type="text" placeholder="e.g. GT500, Shelby, Competition" value={form.trim} onChange={e => set('trim', e.target.value)} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label className="label">Color</label>
                  <input className="input-field" type="text" placeholder="e.g. Oxford White" value={form.color} onChange={e => set('color', e.target.value)} />
                </div>
                <div>
                  <label className="label">Current Mileage</label>
                  <input className="input-field" type="number" min={0} placeholder="e.g. 12500" value={form.mileage} onChange={e => set('mileage', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label">VIN</label>
                <input className="input-field" type="text" placeholder="17-character vehicle identification number" value={form.vin} onChange={e => set('vin', e.target.value)} maxLength={17} style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }} />
              </div>
            </div>
          </div>

          {/* Section: Privacy & Discovery */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>Privacy &amp; Discovery</div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', marginBottom: form.is_public ? '0.85rem' : 0 }}>
              <input
                type="checkbox"
                checked={form.is_public}
                onChange={e => {
                  const checked = e.target.checked
                  setForm(f => ({ ...f, is_public: checked, in_gallery: checked ? f.in_gallery : false }))
                }}
                style={{ width: 18, height: 18, accentColor: 'var(--red)', cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
              />
              <div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Make this build public</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Anyone with the link can view your mods and service history — great for car shows, forums, or selling.
                </div>
              </div>
            </label>

            {form.is_public && (
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', cursor: 'pointer', marginLeft: '2rem', padding: '0.85rem 1rem', background: 'var(--bg-base)', borderRadius: 6, border: `1px solid ${form.in_gallery ? 'var(--red-glow)' : 'var(--border-subtle)'}`, transition: 'border-color 150ms' }}>
                <input
                  type="checkbox"
                  checked={form.in_gallery}
                  onChange={e => set('in_gallery', e.target.checked)}
                  style={{ width: 17, height: 17, accentColor: 'var(--red)', cursor: 'pointer', marginTop: '2px', flexShrink: 0 }}
                />
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: form.in_gallery ? 'var(--red)' : 'var(--text-primary)', marginBottom: '0.2rem', transition: 'color 150ms' }}>
                    Add to Community Gallery
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                    Feature this build in the Dynamic Garage public gallery — visible to anyone browsing the site.
                  </div>
                </div>
              </label>
            )}
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Saving…' : 'Save Vehicle'} <ChevronRight size={18} />
            </button>
            <Link href="/dashboard" className="btn-secondary">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
