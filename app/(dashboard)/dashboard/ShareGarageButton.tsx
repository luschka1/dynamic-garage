'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

export default function ShareGarageButton({ userId }: { userId: string }) {
  const [copied, setCopied] = useState(false)

  const url = `${window.location.origin}/garage/${userId}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        background: copied ? 'rgba(34,197,94,0.1)' : 'var(--bg-card)',
        border: `1px solid ${copied ? 'rgba(34,197,94,0.3)' : 'var(--border-default)'}`,
        borderRadius: 8,
        padding: '0.55rem 1rem',
        fontSize: '0.82rem',
        fontWeight: 600,
        color: copied ? 'var(--green)' : 'var(--text-secondary)',
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
      }}
    >
      {copied ? <Check size={14} /> : <Link2 size={14} />}
      {copied ? 'Copied!' : 'Copy Garage Link'}
    </button>
  )
}
