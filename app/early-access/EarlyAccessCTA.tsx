'use client'

import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

export default function EarlyAccessCTA({ size = 'large' }: { size?: 'large' | 'small' }) {
  const [href, setHref] = useState('/register')
  const [label, setLabel] = useState(size === 'small' ? 'Get Started Free' : 'Claim Your Free Garage')

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setHref('/dashboard')
        setLabel(size === 'small' ? 'My Garage' : 'Go to My Garage')
      }
    })
  }, [size])

  if (size === 'small') {
    return (
      <Link href={href} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.45rem 1rem', minHeight: 34 }}>
        {label}
      </Link>
    )
  }

  return (
    <Link href={href} className="btn-primary" style={{
      fontSize: '1.05rem', padding: '0.85rem 2.25rem',
      minHeight: 52, display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
      boxShadow: '0 4px 20px rgba(204,32,32,0.35)',
    }}>
      {label} <ChevronRight size={18} />
    </Link>
  )
}
