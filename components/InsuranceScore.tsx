'use client'

import Link from 'next/link'
import { ShieldCheck, ShieldAlert } from 'lucide-react'
import type { InsuranceSummary } from '@/lib/insurance'
import { fmtC } from '@/lib/currency'

interface Props {
  summary: InsuranceSummary
  corvetteId: string
  currency?: string
}

export default function InsuranceScore({ summary, corvetteId, currency = 'USD' }: Props) {
  if (summary.totalMods === 0) return null

  const isReady = summary.percentage === 100
  const Icon = isReady ? ShieldCheck : ShieldAlert

  return (
    <Link
      href={`/corvettes/${corvetteId}/insurance`}
      style={{ textDecoration: 'none' }}
    >
      <div style={{
        background: 'var(--bg-card)',
        border: `1px solid ${summary.percentage >= 80 ? 'rgba(22,163,74,0.25)' : summary.percentage >= 50 ? 'rgba(217,119,6,0.25)' : 'rgba(220,38,38,0.25)'}`,
        borderRadius: 12,
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        cursor: 'pointer',
        transition: 'opacity 150ms',
      }}
        className="insurance-score-card"
      >
        {/* Icon */}
        <div style={{
          width: 40, height: 40, borderRadius: 10, flexShrink: 0,
          background: summary.bgColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} color={summary.color} />
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
              Insurance Documentation
            </span>
            <span style={{
              fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.06em',
              textTransform: 'uppercase', color: summary.color,
              background: summary.bgColor, borderRadius: 4, padding: '0.15rem 0.5rem',
            }}>
              {summary.label}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{ height: 5, borderRadius: 3, background: 'var(--border-subtle)', overflow: 'hidden', marginBottom: '0.35rem' }}>
            <div style={{
              height: '100%',
              width: `${summary.percentage}%`,
              background: summary.color,
              borderRadius: 3,
              transition: 'width 600ms ease',
            }} />
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {summary.readyCount} of {summary.totalMods} mods insurance-ready
            {summary.totalDeclaredValue > 0 && (
              <span style={{ marginLeft: '0.75rem', color: summary.color, fontWeight: 600 }}>
                {fmtC(summary.totalDeclaredValue, currency)} declared value
              </span>
            )}
          </div>
        </div>

        {/* Arrow */}
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: summary.color, flexShrink: 0, letterSpacing: '0.04em' }}>
          {isReady ? 'View Package →' : 'Complete Records →'}
        </div>
      </div>
      <style>{`.insurance-score-card:hover { opacity: 0.85; }`}</style>
    </Link>
  )
}
