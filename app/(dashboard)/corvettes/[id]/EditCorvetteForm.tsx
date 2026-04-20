'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Save, Trash2, Upload, ImageIcon } from 'lucide-react'
import type { Corvette } from '@/lib/types'

const MAKES = [
  'Acura','Alfa Romeo','Aston Martin','Audi','Bentley','BMW','Buick','Cadillac',
  'Chevrolet','Chrysler','Dodge','Ferrari','Fiat','Ford','Genesis','GMC','Honda',
  'Hyundai','Infiniti','Jaguar','Jeep','Kia','Lamborghini','Land Rover','Lexus',
  'Lincoln','Lotus','Maserati','Mazda','McLaren','Mercedes-Benz','MINI','Mitsubishi',
  'Nissan','Pontiac','Porsche','RAM','Rolls-Royce','Subaru','Tesla','Toyota',
  'Volkswagen','Volvo','Other'
]

function splitMakeModel(combined: string) {
  const parts = combined.split(' ')
  const make = MAKES.find(m => combined.startsWith(m)) || parts[0] || ''
  const model = combined.startsWith(make) ? combined.slice(make.length).trim() : parts.slice(1).join(' ')
  return { make, model }
}

export default function EditCarForm({ car }: { car: Corvette }) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const { make: initialMake, model: initialModel } = splitMakeModel(car.model || '')
  const [form, setForm] = useState({
    nickname: car.nickname,
    year: car.year,
    make: initialMake,
    model: initialModel,
    trim: car.trim || '',
    color: car.color || '',
    vin: car.vin || '',
    mileage: car.mileage?.toString() || '',
    is_public: car.is_public,
    show_carfax: car.show_carfax ?? true,
    photo_url: car.photo_url || '',
  })

  function set(key: string, value: string | number | boolean) {
    setForm(f => ({ ...f, [key]: value }))
    setSuccess(false)
  }

  async function uploadPhoto(file: File) {
    setPhotoUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const path = `${car.user_id}/${car.id}/photo.${ext}`
    const { error } = await supabase.storage.from('corvette-photos').upload(path, file, { upsert: true })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('corvette-photos').getPublicUrl(path)
      set('photo_url', publicUrl)
    }
    setPhotoUploading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    const supabase = createClient()
    const fullModel = `${form.make} ${form.model}`.trim()
    const { error } = await supabase.from('corvettes').update({
      nickname: form.nickname,
      year: Number(form.year),
      model: fullModel,
      trim: form.trim || null,
      color: form.color || null,
      vin: form.vin || null,
      mileage: form.mileage ? Number(form.mileage) : null,
      is_public: form.is_public,
      show_carfax: form.show_carfax,
      photo_url: form.photo_url || null,
      updated_at: new Date().toISOString(),
    }).eq('id', car.id)

    setSaving(false)
    if (error) setError('Save failed. Please try again.')
    else { setSuccess(true); router.refresh() }
  }

  async function handleDelete() {
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('corvettes').delete().eq('id', car.id)
    router.push('/dashboard')
  }

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', maxWidth: 600, boxShadow: 'var(--shadow-card)' }}>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Save size={14} color="var(--red)" /> Edit Details
      </div>

      {error && (
        <div style={{ background: 'var(--red-dim)', border: '1px solid var(--red-glow)', color: 'var(--red)', borderRadius: 6, padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.95rem', fontWeight: 600 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: 'var(--green-dim)', border: '1px solid rgba(21,128,61,0.3)', color: 'var(--green)', borderRadius: 6, padding: '0.85rem 1rem', marginBottom: '1.25rem', fontSize: '0.95rem', fontWeight: 600 }}>
          Changes saved!
        </div>
      )}

      {/* Photo upload */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label className="label">Car Photo</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          {form.photo_url ? (
            <img src={form.photo_url} alt="car" style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border-default)' }} />
          ) : (
            <div style={{ width: 120, height: 80, background: 'var(--bg-base)', borderRadius: 6, border: '2px dashed var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ImageIcon size={28} color="var(--text-muted)" />
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={e => e.target.files?.[0] && uploadPhoto(e.target.files[0])} />
          <button type="button" className="btn-secondary" onClick={() => fileRef.current?.click()} disabled={photoUploading} style={{ fontSize: '0.95rem', padding: '0.6rem 1.25rem', minHeight: 44 }}>
            <Upload size={16} /> {photoUploading ? 'Uploading…' : 'Upload Photo'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
        <div>
          <label className="label">Nickname</label>
          <input className="input-field" type="text" value={form.nickname} onChange={e => set('nickname', e.target.value)} required />
        </div>

        <div>
          <label className="label">Year</label>
          <input className="input-field" type="number" min={1900} max={new Date().getFullYear() + 1} value={form.year} onChange={e => set('year', e.target.value)} required />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="label">Make</label>
            <select className="input-field" value={form.make} onChange={e => set('make', e.target.value)} required>
              <option value="">Select make…</option>
              {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Model</label>
            <input className="input-field" type="text" placeholder="e.g. Mustang, 911, Camaro" value={form.model} onChange={e => set('model', e.target.value)} required />
          </div>
        </div>

        <div>
          <label className="label">Trim</label>
          <input className="input-field" type="text" value={form.trim} onChange={e => set('trim', e.target.value)} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label className="label">Color</label>
            <input className="input-field" type="text" value={form.color} onChange={e => set('color', e.target.value)} />
          </div>
          <div>
            <label className="label">Mileage</label>
            <input className="input-field" type="number" min={0} value={form.mileage} onChange={e => set('mileage', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">VIN</label>
          <input className="input-field" type="text" maxLength={17} value={form.vin} onChange={e => set('vin', e.target.value)} style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }} />
          {form.vin && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem 1rem', marginTop: '0.5rem', background: 'var(--bg-base)', borderRadius: 6, border: '1px solid var(--border-default)' }}>
              <input type="checkbox" checked={form.show_carfax} onChange={e => set('show_carfax', e.target.checked)} style={{ width: 16, height: 16, accentColor: 'var(--red)', cursor: 'pointer', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Show CARFAX Button on Public Page</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>Let visitors purchase a CARFAX report for this VIN</div>
              </div>
            </label>
          )}
        </div>

        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '1rem', background: 'var(--bg-base)', borderRadius: 6, border: '1px solid var(--border-default)' }}>
          <input type="checkbox" checked={form.is_public} onChange={e => set('is_public', e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--red)', cursor: 'pointer' }} />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Public Build Page</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>Let others view your mods and service history</div>
          </div>
        </label>

        <button type="submit" className="btn-primary" disabled={saving} style={{ width: '100%' }}>
          <Save size={18} /> {saving ? 'Saving…' : 'Save Changes'}
        </button>
      </form>

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-subtle)' }}>
        {!confirmDelete ? (
          <button className="btn-danger" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={16} /> Delete This Car
          </button>
        ) : (
          <div style={{ background: 'var(--red-dim)', border: '1px solid var(--red-glow)', borderRadius: 6, padding: '1.25rem' }}>
            <p style={{ fontWeight: 700, color: 'var(--red)', fontSize: '0.95rem', marginBottom: '1rem' }}>
              This will permanently delete all mods, service records, and documents for this car. Are you sure?
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn-danger" onClick={handleDelete} disabled={deleting}>
                {deleting ? 'Deleting…' : 'Yes, Delete Forever'}
              </button>
              <button className="btn-secondary" onClick={() => setConfirmDelete(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
