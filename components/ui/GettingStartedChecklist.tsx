import Link from 'next/link'
import { CheckCircle2, Circle, ChevronRight } from 'lucide-react'

interface Step {
  label: string
  description: string
  done: boolean
  href?: string
  cta: string
}

interface Props {
  carId: string
  hasPhoto: boolean
  hasMods: boolean
  hasService: boolean
  hasDocs: boolean
  isPublic: boolean
  inGallery: boolean
}

export default function GettingStartedChecklist({
  carId, hasPhoto, hasMods, hasService, hasDocs, isPublic, inGallery
}: Props) {
  const steps: Step[] = [
    {
      label: 'Add a cover photo',
      description: 'A great photo makes your build stand out in the gallery and on your share page.',
      done: hasPhoto,
      href: `/corvettes/${carId}`,
      cta: 'Add Photo',
    },
    {
      label: 'Log your first mod',
      description: 'Record any part, upgrade, or tune — with cost, date, and vendor.',
      done: hasMods,
      href: `/corvettes/${carId}/mods`,
      cta: 'Add Mod',
    },
    {
      label: 'Add a service record',
      description: 'Oil change, inspection, repair — build a complete maintenance history.',
      done: hasService,
      href: `/corvettes/${carId}/service`,
      cta: 'Add Service',
    },
    {
      label: 'Upload a document',
      description: 'Store receipts, manuals, or inspection reports in your Document Vault.',
      done: hasDocs,
      href: `/corvettes/${carId}/documents`,
      cta: 'Add Document',
    },
    {
      label: 'Make your build public',
      description: 'Turn on your shareable build page so others can view your mods and history.',
      done: isPublic,
      href: `/corvettes/${carId}`,
      cta: 'Edit Settings',
    },
    {
      label: 'Add to the Community Gallery',
      description: 'Feature your build in the public gallery to get Props from the community.',
      done: inGallery,
      href: `/corvettes/${carId}`,
      cta: 'Edit Settings',
    },
  ]

  const doneCount = steps.filter(s => s.done).length
  const allDone = doneCount === steps.length
  const pct = Math.round((doneCount / steps.length) * 100)

  if (allDone) return null

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 12,
      overflow: 'hidden',
      marginBottom: '1.5rem',
      boxShadow: 'var(--shadow-card)',
    }}>
      {/* Header */}
      <div style={{
        padding: '1.1rem 1.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div>
          <div style={{
            fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.12em',
            textTransform: 'uppercase', color: 'var(--red)', marginBottom: '0.2rem',
          }}>
            Build Setup
          </div>
          <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>
            Getting Started — {doneCount} of {steps.length} complete
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: 120, height: 6, background: 'var(--bg-base)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              background: pct === 100 ? '#16a34a' : 'var(--red)',
              borderRadius: 99,
              transition: 'width 300ms ease',
            }} />
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {steps.map((step, i) => (
          <div
            key={step.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.9rem 1.5rem',
              borderBottom: i < steps.length - 1 ? '1px solid var(--border-subtle)' : 'none',
              opacity: step.done ? 0.5 : 1,
              transition: 'opacity 150ms',
            }}
          >
            {/* Check icon */}
            <div style={{ flexShrink: 0 }}>
              {step.done
                ? <CheckCircle2 size={20} color="#16a34a" fill="rgba(22,163,74,0.12)" />
                : <Circle size={20} color="var(--border-strong)" />
              }
            </div>

            {/* Text */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.88rem',
                fontWeight: 700,
                color: step.done ? 'var(--text-muted)' : 'var(--text-primary)',
                textDecoration: step.done ? 'line-through' : 'none',
                marginBottom: '0.15rem',
              }}>
                {step.label}
              </div>
              {!step.done && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {step.description}
                </div>
              )}
            </div>

            {/* CTA */}
            {!step.done && step.href && (
              <Link
                href={step.href}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--red)',
                  textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
                  padding: '0.4rem 0.75rem',
                  border: '1px solid var(--red-glow)',
                  borderRadius: 6,
                  background: 'var(--red-dim)',
                  transition: 'opacity 150ms',
                }}
              >
                {step.cta} <ChevronRight size={12} />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
