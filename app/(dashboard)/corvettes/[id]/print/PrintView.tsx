'use client'

import { useEffect } from 'react'
import type { Corvette, Mod, ServiceRecord, Document } from '@/lib/types'

function fmt(n?: number | null) {
  if (n == null) return '—'
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function fmtDate(d?: string | null) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
function fmtMiles(n?: number | null) {
  if (n == null) return '—'
  return n.toLocaleString('en-US') + ' mi'
}

interface Props {
  car: Corvette
  mods: Mod[]
  service: ServiceRecord[]
  docs: Document[]
}

export default function PrintView({ car, mods, service, docs }: Props) {
  useEffect(() => {
    document.title = `${car.year} ${car.nickname} — Dynamic Garage`
    setTimeout(() => window.print(), 600)
  }, [car])

  const totalModCost = mods.reduce((s, m) => s + (m.cost ?? 0), 0)
  const totalSvcCost = service.reduce((s, r) => s + (r.cost ?? 0), 0)
  const printDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; color: #111; font-family: 'Inter', -apple-system, sans-serif; font-size: 11pt; }

        .page { max-width: 800px; margin: 0 auto; padding: 2rem 2.5rem; }

        /* ── Header ── */
        .pdf-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 1rem; border-bottom: 3px solid #cc1f1f; margin-bottom: 1.5rem; }
        .pdf-brand { display: flex; align-items: center; gap: 0.6rem; }
        .pdf-brand img { width: 48px; height: 48px; border-radius: 8px; object-fit: cover; }
        .pdf-brand-text { font-family: 'Exo 2', sans-serif; font-weight: 800; font-style: italic; font-size: 1.2rem; letter-spacing: 0.04em; text-transform: uppercase; }
        .pdf-brand-text .red { color: #cc1f1f; }
        .pdf-brand-text .gray { color: #888; }
        .pdf-meta { text-align: right; font-size: 9pt; color: #888; }

        /* ── Car title ── */
        .car-title { margin-bottom: 1.5rem; }
        .car-title h1 { font-family: 'Barlow Condensed', sans-serif; font-size: 2.2rem; font-weight: 900; line-height: 1; letter-spacing: 0.02em; text-transform: uppercase; color: #111; }
        .car-title .sub { font-size: 1rem; color: #555; margin-top: 0.3rem; }

        /* ── Specs grid ── */
        .specs-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; margin-bottom: 1.75rem; }
        .spec-cell { padding: 0.7rem 1rem; border-right: 1px solid #e0e0e0; }
        .spec-cell:last-child { border-right: none; }
        .spec-label { font-size: 8pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-bottom: 0.2rem; }
        .spec-value { font-size: 11pt; font-weight: 600; color: #111; }

        /* ── Summary row ── */
        .summary-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; margin-bottom: 1.75rem; }
        .summary-card { background: #f8f8f8; border: 1px solid #e8e8e8; border-radius: 6px; padding: 0.75rem 1rem; }
        .summary-card .s-label { font-size: 8pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-bottom: 0.25rem; }
        .summary-card .s-val { font-family: 'Barlow Condensed', sans-serif; font-size: 1.6rem; font-weight: 900; line-height: 1; }
        .summary-card .s-sub { font-size: 9pt; color: #555; margin-top: 0.15rem; }
        .red-val { color: #cc1f1f; }
        .blue-val { color: #1d4ed8; }
        .green-val { color: #15803d; }

        /* ── Section ── */
        .section { margin-bottom: 1.75rem; }
        .section-title { font-family: 'Barlow Condensed', sans-serif; font-size: 1rem; font-weight: 900; letter-spacing: 0.12em; text-transform: uppercase; color: #cc1f1f; border-bottom: 1.5px solid #e8e8e8; padding-bottom: 0.35rem; margin-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between; }
        .section-title .total-badge { font-size: 9pt; font-weight: 700; color: #555; letter-spacing: 0; text-transform: none; }

        /* ── Table ── */
        table { width: 100%; border-collapse: collapse; font-size: 9.5pt; }
        thead tr { background: #f4f4f2; }
        th { text-align: left; font-size: 8pt; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #888; padding: 0.45rem 0.65rem; border-bottom: 1px solid #e0e0e0; }
        td { padding: 0.5rem 0.65rem; border-bottom: 1px solid #f0f0f0; color: #222; vertical-align: top; }
        tr:last-child td { border-bottom: none; }
        tr:nth-child(even) td { background: #fafafa; }
        .td-name { font-weight: 600; color: #111; }
        .td-muted { color: #888; font-size: 8.5pt; }
        .td-cost { font-weight: 700; color: #111; text-align: right; white-space: nowrap; }
        .td-cat { display: inline-block; background: #f0f0f0; border-radius: 3px; padding: 0.1rem 0.45rem; font-size: 8pt; font-weight: 600; color: #555; }
        .no-records { padding: 0.75rem 0.65rem; color: #aaa; font-style: italic; font-size: 9pt; }

        /* ── Docs ── */
        .docs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
        .doc-row { display: flex; align-items: center; gap: 0.5rem; padding: 0.4rem 0.6rem; background: #f8f8f8; border-radius: 4px; font-size: 9pt; }
        .doc-icon { font-size: 11pt; flex-shrink: 0; }
        .doc-name { font-weight: 600; color: #111; }
        .doc-type { color: #888; font-size: 8pt; }

        /* ── Footer ── */
        .pdf-footer { margin-top: 2rem; padding-top: 0.75rem; border-top: 1px solid #e0e0e0; display: flex; justify-content: space-between; align-items: center; font-size: 8pt; color: #bbb; }

        /* ── Print overrides ── */
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page { padding: 1.25rem 1.5rem; max-width: 100%; }
          .section { page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
        @media screen {
          body { background: #e8e8e8; }
          .page { background: white; box-shadow: 0 4px 32px rgba(0,0,0,0.15); margin: 2rem auto; border-radius: 4px; }
        }
      `}</style>

      {/* Print / Close bar — screen only */}
      <div className="no-print" style={{ background: '#111', color: '#fff', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontSize: '0.875rem', fontWeight: 500, color: '#ccc' }}>
          PDF Preview — <span style={{ color: '#fff' }}>{car.year} {car.nickname}</span>
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => window.print()}
            style={{ background: '#cc1f1f', color: '#fff', border: 'none', borderRadius: 6, padding: '0.45rem 1.1rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', letterSpacing: '0.04em' }}
          >
            ⬇ Save as PDF
          </button>
          <button
            onClick={() => window.close()}
            style={{ background: 'rgba(255,255,255,0.1)', color: '#ccc', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '0.45rem 0.9rem', fontSize: '0.875rem', cursor: 'pointer' }}
          >
            Close
          </button>
        </div>
      </div>

      <div className="page">

        {/* ── Header ── */}
        <div className="pdf-header">
          <div className="pdf-brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Dynamic Garage" />
            <div className="pdf-brand-text">
              <span className="red">Dynamic</span><span className="gray"> Garage</span>
            </div>
          </div>
          <div className="pdf-meta">
            <div style={{ fontWeight: 700, color: '#555', marginBottom: '0.15rem' }}>Vehicle Report</div>
            <div>Generated {printDate}</div>
          </div>
        </div>

        {/* ── Car Title ── */}
        <div className="car-title">
          <h1>{car.nickname}</h1>
          <div className="sub">
            {car.year} {car.model}{car.trim ? ` · ${car.trim}` : ''}{car.color ? ` · ${car.color}` : ''}
          </div>
        </div>

        {/* ── Specs ── */}
        <div className="specs-grid">
          {[
            { label: 'Year', value: car.year },
            { label: 'VIN', value: car.vin || '—' },
            { label: 'Color', value: car.color || '—' },
            { label: 'Mileage', value: car.mileage ? fmtMiles(car.mileage) : '—' },
          ].map(s => (
            <div key={s.label} className="spec-cell">
              <div className="spec-label">{s.label}</div>
              <div className="spec-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Summary ── */}
        <div className="summary-row">
          <div className="summary-card">
            <div className="s-label">Total Mods</div>
            <div className="s-val red-val">{mods.length}</div>
            <div className="s-sub">Mod investment: {fmt(totalModCost)}</div>
          </div>
          <div className="summary-card">
            <div className="s-label">Service Records</div>
            <div className="s-val blue-val">{service.length}</div>
            <div className="s-sub">Total service cost: {fmt(totalSvcCost)}</div>
          </div>
          <div className="summary-card">
            <div className="s-label">Documents</div>
            <div className="s-val green-val">{docs.length}</div>
            <div className="s-sub">Receipts, titles & more</div>
          </div>
        </div>

        {/* ── Mods ── */}
        <div className="section">
          <div className="section-title">
            Modifications
            {totalModCost > 0 && <span className="total-badge">Total invested: {fmt(totalModCost)}</span>}
          </div>
          {mods.length === 0 ? (
            <div className="no-records">No modifications recorded.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: '32%' }}>Modification</th>
                  <th style={{ width: '16%' }}>Category</th>
                  <th style={{ width: '18%' }}>Vendor</th>
                  <th style={{ width: '16%' }}>Date</th>
                  <th style={{ width: '14%', textAlign: 'right' }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {mods.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="td-name">{m.name}</div>
                      {m.notes && <div className="td-muted" style={{ marginTop: '0.2rem' }}>{m.notes}</div>}
                    </td>
                    <td>{m.category ? <span className="td-cat">{m.category}</span> : <span className="td-muted">—</span>}</td>
                    <td className="td-muted">{m.vendor || '—'}</td>
                    <td className="td-muted">{fmtDate(m.install_date)}</td>
                    <td className="td-cost">{fmt(m.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Service Records ── */}
        <div className="section">
          <div className="section-title">
            Service History
            {totalSvcCost > 0 && <span className="total-badge">Total cost: {fmt(totalSvcCost)}</span>}
          </div>
          {service.length === 0 ? (
            <div className="no-records">No service records found.</div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: '32%' }}>Service</th>
                  <th style={{ width: '16%' }}>Category</th>
                  <th style={{ width: '18%' }}>Shop</th>
                  <th style={{ width: '10%' }}>Mileage</th>
                  <th style={{ width: '12%' }}>Date</th>
                  <th style={{ width: '12%', textAlign: 'right' }}>Cost</th>
                </tr>
              </thead>
              <tbody>
                {service.map(r => (
                  <tr key={r.id}>
                    <td>
                      <div className="td-name">{r.title}</div>
                      {r.notes && <div className="td-muted" style={{ marginTop: '0.2rem' }}>{r.notes}</div>}
                    </td>
                    <td>{r.category ? <span className="td-cat">{r.category}</span> : <span className="td-muted">—</span>}</td>
                    <td className="td-muted">{r.shop || '—'}</td>
                    <td className="td-muted">{fmtMiles(r.mileage)}</td>
                    <td className="td-muted">{fmtDate(r.service_date)}</td>
                    <td className="td-cost">{fmt(r.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Documents ── */}
        {docs.length > 0 && (
          <div className="section">
            <div className="section-title">Documents & Files</div>
            <div className="docs-grid">
              {docs.map(d => {
                const icon = d.file_type === 'image' ? '🖼' : d.file_type === 'pdf' ? '📄' : '📎'
                return (
                  <div key={d.id} className="doc-row">
                    <span className="doc-icon">{icon}</span>
                    <div>
                      <div className="doc-name">{d.name}</div>
                      {d.file_type && <div className="doc-type">{d.file_type.toUpperCase()}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Footer ── */}
        <div className="pdf-footer">
          <span>dynamicgarage.app — Vehicle History Report</span>
          <span>{car.year} {car.nickname.toUpperCase()}</span>
          <span>Generated {printDate}</span>
        </div>

      </div>
    </>
  )
}
