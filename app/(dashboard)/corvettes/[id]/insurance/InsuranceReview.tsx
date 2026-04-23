'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import {
  ShieldCheck, ShieldAlert, Check, X, FileText,
  Paperclip, ExternalLink, ChevronDown, ChevronUp,
} from 'lucide-react'
import type { Corvette } from '@/lib/types'
import type { InsuranceSummary, ModReadiness } from '@/lib/insurance'

interface Props {
  car: Corvette
  summary: InsuranceSummary
  corvetteId: string
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.5rem 0.75rem', fontSize: '0.875rem',
  border: '1px solid var(--border-default)', borderRadius: 6,
  background: 'var(--bg-input)', color: 'var(--text-primary)',
  outline: 'none', boxSizing: 'border-box',
}

function CriteriaCheck({ met, label }: { met: boolean; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: met ? '#16a34a' : 'var(--text-muted)' }}>
      {met
        ? <Check size={12} strokeWidth={2.5} color="#16a34a" />
        : <X size={12} strokeWidth={2.5} color="#dc2626" />}
      <span style={{ color: met ? '#16a34a' : '#dc2626', fontWeight: met ? 600 : 500 }}>{label}</span>
    </div>
  )
}

function ModRow({ detail, corvetteId, onSaved }: { detail: ModReadiness; corvetteId: string; onSaved: () => void }) {
  const [expanded, setExpanded] = useState(!detail.isReady)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    replacement_value: detail.replacementValue != null ? String(detail.replacementValue) : '',
    vendor: detail.vendor ?? '',
    install_date: detail.installDate ?? '',
  })

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('mods').update({
      replacement_value: form.replacement_value ? parseFloat(form.replacement_value) : null,
      vendor: form.vendor || null,
      install_date: form.install_date || null,
    }).eq('id', detail.modId)
    setSaving(false)
    onSaved()
  }

  const borderColor = detail.isReady
    ? 'rgba(22,163,74,0.2)'
    : detail.points >= 3
      ? 'rgba(217,119,6,0.25)'
      : 'rgba(220,38,38,0.2)'

  return (
    <div style={{ border: `1px solid ${borderColor}`, borderRadius: 10, overflow: 'hidden', background: 'var(--bg-card)' }}>
      {/* Header row */}
      <button
        onClick={() => setExpanded(e => !e)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', padding: '0.9rem 1.25rem', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0 }}>
          {detail.isReady
            ? <ShieldCheck size={15} color="#16a34a" style={{ flexShrink: 0 }} />
            : <ShieldAlert size={15} color="#dc2626" style={{ flexShrink: 0 }} />}
          <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {detail.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          {/* Points pip */}
          <div style={{ display: 'flex', gap: 3 }}>
            {[0,1,2,3,4].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i < detail.points ? (detail.isReady ? '#16a34a' : '#d97706') : 'var(--border-default)' }} />
            ))}
          </div>
          {detail.replacementValue != null && (
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706' }}>
              ${detail.replacementValue.toLocaleString()}
            </span>
          )}
          {expanded ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
        </div>
      </button>

      {expanded && (
        <div style={{ borderTop: `1px solid ${borderColor}`, padding: '1rem 1.25rem' }}>
          {/* Criteria checklist */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <CriteriaCheck met={detail.hasCost} label="Purchase cost" />
            <CriteriaCheck met={detail.hasReplacementValue} label="Replacement value" />
            <CriteriaCheck met={detail.hasVendor} label="Vendor" />
            <CriteriaCheck met={detail.hasInstallDate} label="Install date" />
            <CriteriaCheck met={detail.hasReceipt} label="Receipt attached" />
          </div>

          {/* Quick edit for missing fields */}
          {!detail.isReady && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              {!detail.hasReplacementValue && (
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#d97706', display: 'block', marginBottom: '0.3rem' }}>Replacement Value ($)</label>
                  <input style={inputStyle} type="number" min="0" step="0.01" placeholder="Today's cost to replace" value={form.replacement_value} onChange={e => setForm(f => ({ ...f, replacement_value: e.target.value }))} />
                </div>
              )}
              {!detail.hasVendor && (
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Vendor / Installer</label>
                  <input style={inputStyle} type="text" placeholder="e.g. Speed Shop" value={form.vendor} onChange={e => setForm(f => ({ ...f, vendor: e.target.value }))} />
                </div>
              )}
              {!detail.hasInstallDate && (
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.3rem' }}>Install Date</label>
                  <input style={inputStyle} type="date" value={form.install_date} onChange={e => setForm(f => ({ ...f, install_date: e.target.value }))} />
                </div>
              )}
            </div>
          )}

          {/* Receipt + save row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {!detail.isReady && (
              <button
                onClick={handleSave}
                disabled={saving}
                className="btn-primary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 1rem', minHeight: 34, gap: '0.35rem' }}
              >
                <Check size={13} /> {saving ? 'Saving…' : 'Save Changes'}
              </button>
            )}
            {!detail.hasReceipt && (
              <Link
                href={`/corvettes/${corvetteId}/documents?mod=${detail.modId}`}
                className="btn-secondary"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.9rem', minHeight: 34, gap: '0.35rem' }}
              >
                <Paperclip size={12} /> Attach Receipt
              </Link>
            )}
            {detail.isReady && (
              <span style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={13} /> Insurance ready
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function InsuranceReview({ car, summary, corvetteId }: Props) {
  const router = useRouter()
  const isReady = summary.percentage === 100

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p className="page-eyebrow" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <ShieldCheck size={12} /> Insurance Documentation
        </p>
        <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1 }}>
          {car.nickname.toUpperCase()}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
          {car.year} {car.model}{car.trim ? ` · ${car.trim}` : ''}
        </p>
      </div>

      {/* Score card */}
      <div style={{
        background: 'var(--bg-card)',
        border: `1px solid ${summary.color === '#16a34a' ? 'rgba(22,163,74,0.25)' : 'rgba(217,119,6,0.25)'}`,
        borderRadius: 12, padding: '1.5rem', marginBottom: '1.5rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              Insurance Readiness
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontFamily: "'Barlow Condensed'", fontSize: '3rem', fontWeight: 900, lineHeight: 1, color: summary.color }}>{summary.percentage}%</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: summary.color }}>{summary.label}</span>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '0.75rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Ready Mods</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.6rem', fontWeight: 900, color: '#16a34a', lineHeight: 1 }}>{summary.readyCount}<span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>/{summary.totalMods}</span></div>
            </div>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '0.75rem 1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#d97706', marginBottom: '0.2rem' }}>Declared Value</div>
              <div style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.4rem', fontWeight: 900, color: '#d97706', lineHeight: 1 }}>
                {summary.totalDeclaredValue > 0 ? `$${summary.totalDeclaredValue.toLocaleString()}` : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 8, borderRadius: 4, background: 'var(--border-subtle)', overflow: 'hidden', marginBottom: '0.75rem' }}>
          <div style={{ height: '100%', width: `${summary.percentage}%`, background: summary.color, borderRadius: 4, transition: 'width 600ms ease' }} />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link
            href={`/corvettes/${corvetteId}/insurance/package`}
            target="_blank"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              background: isReady ? '#16a34a' : 'var(--bg-elevated)',
              color: isReady ? '#fff' : 'var(--text-secondary)',
              border: `1px solid ${isReady ? '#16a34a' : 'var(--border-default)'}`,
              borderRadius: 7, padding: '0.55rem 1.1rem',
              fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none',
            }}
          >
            <FileText size={14} />
            {isReady ? 'Generate Insurance Package' : 'Preview Insurance Package'}
            <ExternalLink size={12} />
          </Link>
          {!isReady && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              Complete all mods below to lock in your declared value
            </span>
          )}
        </div>
      </div>

      {/* What counts as insurance-ready */}
      <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 10, padding: '1rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
          Each mod needs all 5 to be insurance-ready
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {['Purchase cost', 'Replacement value (today\'s price)', 'Vendor / installer', 'Install date', 'Receipt attached'].map(item => (
            <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <ShieldCheck size={12} color="#d97706" />
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Mod list */}
      {summary.totalMods === 0 ? (
        <div className="empty-state">
          <ShieldAlert size={40} color="var(--text-muted)" strokeWidth={1.5} style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontFamily: "'Barlow Condensed'", fontSize: '1.4rem', fontWeight: 800, textTransform: 'uppercase' }}>No Mods Logged Yet</h3>
          <p>Add modifications to start building your insurance documentation.</p>
          <Link href={`/corvettes/${corvetteId}/mods`} className="btn-primary" style={{ display: 'inline-flex', marginTop: '1rem' }}>
            Log a Mod
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="section-title" style={{ marginBottom: '0.75rem' }}>
            Mod Checklist
            <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>
              — incomplete mods are expanded by default
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {summary.details.map(detail => (
              <ModRow
                key={detail.modId}
                detail={detail}
                corvetteId={corvetteId}
                onSaved={() => router.refresh()}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
