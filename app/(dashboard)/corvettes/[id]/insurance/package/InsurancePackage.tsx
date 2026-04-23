'use client'

import { useEffect } from 'react'
import type { Corvette, Mod, Document } from '@/lib/types'

function fmt(n?: number | null) {
  if (n == null) return '—'
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
function fmtDate(d?: string | null) {
  if (!d) return '—'
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

interface Props {
  car: Corvette
  mods: Mod[]
  docs: Document[]
  docUrlMap: Record<string, string>
  userEmail: string
}

export default function InsurancePackage({ car, mods, docs, docUrlMap, userEmail }: Props) {
  const printDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const printDateTime = new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })

  useEffect(() => {
    document.title = `Insurance Package — ${car.year} ${car.nickname} — Dynamic Garage`
    setTimeout(() => window.print(), 700)
  }, [car])

  // Only include mods that have a replacement_value (declared for insurance)
  const insuredMods = mods.filter(m => m.replacement_value != null && m.replacement_value > 0)
  const allMods = mods // show all mods in supplemental section

  const totalDeclaredValue = insuredMods.reduce((s, m) => s + (m.replacement_value ?? 0), 0)
  const totalPurchaseCost = insuredMods.reduce((s, m) => s + (m.cost ?? 0), 0)

  // Group docs by mod
  const docsByMod: Record<string, Document[]> = {}
  docs.forEach(d => {
    if (d.mod_id) {
      docsByMod[d.mod_id] = [...(docsByMod[d.mod_id] ?? []), d]
    }
  })

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #fff; color: #111; font-family: 'Inter', -apple-system, sans-serif; font-size: 10.5pt; line-height: 1.5; }

        .page { max-width: 820px; margin: 0 auto; padding: 2rem 2.5rem; }

        /* Header */
        .ins-header { display: flex; align-items: flex-start; justify-content: space-between; padding-bottom: 1rem; border-bottom: 3px solid #cc1f1f; margin-bottom: 1.5rem; }
        .ins-brand-text { font-family: sans-serif; font-weight: 900; font-size: 1.25rem; letter-spacing: 0.04em; text-transform: uppercase; }
        .ins-brand-text .silver { color: #a8a8a8; }
        .ins-brand-text .red { color: #cc1f1f; }
        .ins-doc-title { text-align: right; }
        .ins-doc-title h2 { font-size: 1rem; font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; color: #111; margin-bottom: 0.15rem; }
        .ins-doc-title p { font-size: 8.5pt; color: #888; }

        /* Declaration box */
        .declaration { background: #fff8f0; border: 1.5px solid #f59e0b; border-radius: 8px; padding: 1.1rem 1.4rem; margin-bottom: 1.5rem; }
        .declaration h3 { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: #d97706; margin-bottom: 0.5rem; }
        .declaration p { font-size: 9.5pt; color: #333; line-height: 1.65; }

        /* Vehicle specs */
        .vehicle-specs { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; margin-bottom: 1.5rem; }
        .spec-cell { padding: 0.65rem 0.9rem; border-right: 1px solid #e0e0e0; }
        .spec-cell:last-child { border-right: none; }
        .spec-label { font-size: 7.5pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-bottom: 0.2rem; }
        .spec-value { font-size: 10pt; font-weight: 700; color: #111; }

        /* Summary totals */
        .totals-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 0.75rem; margin-bottom: 1.5rem; }
        .total-card { border-radius: 8px; padding: 0.8rem 1rem; border: 1px solid #e0e0e0; }
        .total-card.declared { background: #fff8f0; border-color: #f59e0b; }
        .total-card .tc-label { font-size: 7.5pt; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #999; margin-bottom: 0.2rem; }
        .total-card.declared .tc-label { color: #d97706; }
        .total-card .tc-value { font-family: 'Barlow Condensed', sans-serif; font-size: 1.6rem; font-weight: 900; line-height: 1; color: #111; }
        .total-card.declared .tc-value { color: #d97706; }
        .total-card .tc-sub { font-size: 8pt; color: #888; margin-top: 0.15rem; }

        /* Section */
        .section { margin-bottom: 1.5rem; }
        .section-title { font-size: 0.75rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; color: #cc1f1f; border-bottom: 1.5px solid #f0f0f0; padding-bottom: 0.35rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center; }
        .section-title span { font-weight: 500; color: #888; letter-spacing: 0; text-transform: none; font-size: 8.5pt; }

        /* Mod table */
        table { width: 100%; border-collapse: collapse; font-size: 9pt; }
        thead tr { background: #f5f5f3; }
        th { text-align: left; font-size: 7.5pt; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #888; padding: 0.45rem 0.65rem; border-bottom: 1.5px solid #e0e0e0; }
        th.right { text-align: right; }
        td { padding: 0.55rem 0.65rem; border-bottom: 1px solid #f0f0f0; color: #222; vertical-align: top; }
        tr:last-child td { border-bottom: none; }
        tr:nth-child(even) td { background: #fafafa; }
        .td-name { font-weight: 700; color: #111; }
        .td-muted { font-size: 8pt; color: #888; margin-top: 0.15rem; }
        .td-cost { text-align: right; font-weight: 700; white-space: nowrap; }
        .td-declared { text-align: right; font-weight: 800; color: #d97706; white-space: nowrap; }
        .td-receipt { font-size: 8pt; }
        .receipt-yes { color: #16a34a; font-weight: 700; }
        .receipt-no { color: #dc2626; }
        .no-receipt-warn { color: #dc2626; font-size: 7.5pt; font-style: italic; }

        /* Signature block */
        .sig-block { margin-top: 2rem; padding-top: 1.25rem; border-top: 1.5px solid #e0e0e0; display: grid; grid-template-columns: 2fr 1fr; gap: 2rem; }
        .sig-line { border-bottom: 1px solid #111; margin-top: 2.5rem; margin-bottom: 0.3rem; }
        .sig-label { font-size: 8pt; color: #888; }

        /* Footer */
        .ins-footer { margin-top: 1.5rem; padding-top: 0.75rem; border-top: 1px solid #e8e8e8; display: flex; justify-content: space-between; font-size: 7.5pt; color: #bbb; }

        /* Print controls — screen only */
        .no-print { display: flex; }

        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .no-print { display: none !important; }
          .page { padding: 1.25rem 1.5rem; max-width: 100%; }
          .section { page-break-inside: avoid; }
          table { page-break-inside: auto; }
          tr { page-break-inside: avoid; }
        }
        @media screen {
          body { background: #e5e5e5; }
          .page { background: white; box-shadow: 0 4px 32px rgba(0,0,0,0.15); margin: 2rem auto; border-radius: 4px; }
        }
      `}</style>

      {/* Screen-only toolbar */}
      <div className="no-print" style={{ background: '#111', color: '#fff', padding: '0.75rem 1.5rem', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontSize: '0.875rem', color: '#ccc' }}>
          Insurance Package — <strong style={{ color: '#fff' }}>{car.year} {car.nickname}</strong>
          {insuredMods.length < mods.length && (
            <span style={{ marginLeft: '0.75rem', fontSize: '0.8rem', color: '#f59e0b' }}>
              ⚠ {mods.length - insuredMods.length} mod{mods.length - insuredMods.length !== 1 ? 's' : ''} excluded (no declared replacement value)
            </span>
          )}
        </span>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => window.print()} style={{ background: '#cc1f1f', color: '#fff', border: 'none', borderRadius: 6, padding: '0.45rem 1.1rem', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer' }}>
            ⬇ Save as PDF
          </button>
          <button onClick={() => window.close()} style={{ background: 'rgba(255,255,255,0.1)', color: '#ccc', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, padding: '0.45rem 0.9rem', fontSize: '0.875rem', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>

      <div className="page">

        {/* ── Header ── */}
        <div className="ins-header">
          <div>
            <div className="ins-brand-text">
              <span className="silver">Dynamic</span><span className="red"> Garage</span>
            </div>
            <div style={{ fontSize: '8.5pt', color: '#888', marginTop: '0.2rem' }}>dynamicgarage.app</div>
          </div>
          <div className="ins-doc-title">
            <h2>Vehicle Modification Insurance Documentation</h2>
            <p>Generated {printDateTime}</p>
            {car.vin && <p style={{ marginTop: '0.2rem' }}>VIN: <strong style={{ color: '#111' }}>{car.vin.toUpperCase()}</strong></p>}
          </div>
        </div>

        {/* ── Declaration ── */}
        <div className="declaration">
          <h3>Owner Declaration</h3>
          <p>
            I, the undersigned owner of the vehicle described herein, hereby declare that the modifications listed in this document
            are installed on the vehicle, were purchased and installed on the dates specified, and carry a current replacement value
            as stated. This document is provided for insurance purposes and accurately reflects the vehicle&apos;s modification history
            to the best of my knowledge.
          </p>
          {userEmail && (
            <p style={{ marginTop: '0.5rem', fontSize: '8.5pt', color: '#888' }}>Account: {userEmail}</p>
          )}
        </div>

        {/* ── Vehicle specs ── */}
        <div className="vehicle-specs">
          {[
            { label: 'Year', value: String(car.year) },
            { label: 'Vehicle', value: car.model },
            ...(car.trim ? [{ label: 'Trim', value: car.trim }] : []),
            ...(car.color ? [{ label: 'Color', value: car.color }] : []),
            ...(car.mileage ? [{ label: 'Mileage', value: car.mileage.toLocaleString() + ' mi' }] : []),
            ...(car.vin ? [{ label: 'VIN', value: car.vin.toUpperCase() }] : []),
          ].map(s => (
            <div key={s.label} className="spec-cell">
              <div className="spec-label">{s.label}</div>
              <div className="spec-value">{s.value}</div>
            </div>
          ))}
        </div>

        {/* ── Totals ── */}
        <div className="totals-row">
          <div className="total-card declared">
            <div className="tc-label">Total Declared Replacement Value</div>
            <div className="tc-value">{fmt(totalDeclaredValue)}</div>
            <div className="tc-sub">Use this figure for your stated-value rider</div>
          </div>
          <div className="total-card">
            <div className="tc-label">Total Purchase Cost</div>
            <div className="tc-value">{fmt(totalPurchaseCost)}</div>
            <div className="tc-sub">Original cost at time of purchase</div>
          </div>
          <div className="total-card">
            <div className="tc-label">Modifications Listed</div>
            <div className="tc-value">{insuredMods.length}</div>
            <div className="tc-sub">
              {mods.length > insuredMods.length
                ? `${mods.length - insuredMods.length} excluded — no declared value`
                : 'All mods included'}
            </div>
          </div>
        </div>

        {/* ── Modifications table ── */}
        <div className="section">
          <div className="section-title">
            Declared Modifications
            <span>Replacement value = cost to replace at today&apos;s prices</span>
          </div>

          {insuredMods.length === 0 ? (
            <p style={{ color: '#888', fontStyle: 'italic', fontSize: '9pt', padding: '0.5rem 0' }}>
              No mods have a declared replacement value. Add replacement values in the Insurance Review to include them here.
            </p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>Modification</th>
                  <th>Category</th>
                  <th>Vendor / Installer</th>
                  <th>Install Date</th>
                  <th className="right">Purchase Cost</th>
                  <th className="right">Replacement Value</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {insuredMods.map(mod => {
                  const modDocs = docsByMod[mod.id] ?? []
                  const hasReceipt = modDocs.length > 0
                  return (
                    <tr key={mod.id}>
                      <td>
                        <div className="td-name">{mod.name}</div>
                        {mod.notes && <div className="td-muted">{mod.notes.slice(0, 80)}{mod.notes.length > 80 ? '…' : ''}</div>}
                      </td>
                      <td>{mod.category ?? <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td>{mod.vendor ?? <span style={{ color: '#ccc' }}>—</span>}</td>
                      <td style={{ whiteSpace: 'nowrap' }}>{fmtDate(mod.install_date)}</td>
                      <td className="td-cost">{fmt(mod.cost)}</td>
                      <td className="td-declared">{fmt(mod.replacement_value)}</td>
                      <td className="td-receipt">
                        {hasReceipt
                          ? <span className="receipt-yes">✓ {modDocs.length} file{modDocs.length > 1 ? 's' : ''}</span>
                          : <span className="receipt-no">✗ None</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} style={{ fontWeight: 800, fontSize: '9pt', paddingTop: '0.75rem', color: '#111', borderTop: '2px solid #e0e0e0' }}>Totals</td>
                  <td className="td-cost" style={{ borderTop: '2px solid #e0e0e0', fontWeight: 800 }}>{fmt(totalPurchaseCost)}</td>
                  <td className="td-declared" style={{ borderTop: '2px solid #e0e0e0', fontWeight: 900, fontSize: '10pt' }}>{fmt(totalDeclaredValue)}</td>
                  <td style={{ borderTop: '2px solid #e0e0e0' }}></td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* ── Undeclared mods (supplemental) ── */}
        {mods.length > insuredMods.length && (
          <div className="section">
            <div className="section-title">
              Supplemental — Modifications Without Declared Value
              <span>Not included in declared total — add replacement values to include</span>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Modification</th>
                  <th>Category</th>
                  <th>Vendor</th>
                  <th>Install Date</th>
                  <th className="right">Purchase Cost</th>
                </tr>
              </thead>
              <tbody>
                {mods.filter(m => !m.replacement_value).map(mod => (
                  <tr key={mod.id}>
                    <td className="td-name">{mod.name}</td>
                    <td>{mod.category ?? '—'}</td>
                    <td>{mod.vendor ?? <span className="no-receipt-warn">missing</span>}</td>
                    <td>{fmtDate(mod.install_date)}</td>
                    <td className="td-cost">{fmt(mod.cost)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Signature block ── */}
        <div className="sig-block">
          <div>
            <div style={{ fontSize: '8.5pt', color: '#888', marginBottom: '0.5rem' }}>
              By signing below, I declare the above information to be accurate and complete to the best of my knowledge.
            </div>
            <div className="sig-line" />
            <div className="sig-label">Owner Signature &amp; Date</div>
          </div>
          <div>
            <div style={{ fontSize: '8.5pt', color: '#888', marginBottom: '0.5rem' }}>
              Document date
            </div>
            <div style={{ fontSize: '10pt', fontWeight: 700, color: '#111', marginTop: '0.5rem' }}>{printDate}</div>
            <div className="sig-label" style={{ marginTop: '0.3rem' }}>Generated by Dynamic Garage</div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="ins-footer">
          <span>Dynamic Garage — dynamicgarage.app — Vehicle Modification Insurance Documentation</span>
          <span>Generated {printDate}</span>
        </div>

      </div>
    </>
  )
}
