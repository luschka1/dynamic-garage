'use client'

import { useState, useRef } from 'react'
import { HelpCircle } from 'lucide-react'

interface Props {
  content: string
  size?: number
  width?: number
  position?: 'top' | 'bottom'
}

export default function Tooltip({ content, size = 14, width = 240, position = 'top' }: Props) {
  const [visible, setVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function show() {
    if (timer.current) clearTimeout(timer.current)
    setVisible(true)
  }

  function hide() {
    timer.current = setTimeout(() => setVisible(false), 80)
  }

  const isTop = position === 'top'

  return (
    <span
      style={{ position: 'relative', display: 'inline-flex', verticalAlign: 'middle', flexShrink: 0 }}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <button
        type="button"
        aria-label="More information"
        tabIndex={0}
        style={{
          background: 'none',
          border: 'none',
          padding: 0,
          cursor: 'help',
          color: 'var(--text-muted)',
          display: 'flex',
          alignItems: 'center',
          lineHeight: 1,
        }}
      >
        <HelpCircle size={size} />
      </button>

      {visible && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            [isTop ? 'bottom' : 'top']: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            width,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderRadius: 8,
            padding: '0.65rem 0.9rem',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.55,
            zIndex: 200,
            boxShadow: '0 6px 24px rgba(0,0,0,0.35)',
            pointerEvents: 'none',
            whiteSpace: 'normal',
          }}
        >
          {content}
          {/* Arrow */}
          <span style={{
            position: 'absolute',
            [isTop ? 'bottom' : 'top']: -5,
            left: '50%',
            transform: 'translateX(-50%) rotate(45deg)',
            width: 8,
            height: 8,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-default)',
            borderTop: isTop ? 'none' : undefined,
            borderLeft: isTop ? 'none' : undefined,
            borderBottom: isTop ? undefined : 'none',
            borderRight: isTop ? undefined : 'none',
          }} />
        </div>
      )}
    </span>
  )
}
