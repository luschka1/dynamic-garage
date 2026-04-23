import type { Mod } from './types'

export interface ModReadiness {
  modId: string
  name: string
  cost: number | null
  replacementValue: number | null
  vendor: string | null
  installDate: string | null
  hasReceipt: boolean
  // criteria checks
  hasCost: boolean
  hasReplacementValue: boolean
  hasVendor: boolean
  hasInstallDate: boolean
  // 0–5
  points: number
  isReady: boolean
}

export interface InsuranceSummary {
  totalMods: number
  percentage: number
  readyCount: number
  totalDeclaredValue: number
  totalPurchaseCost: number
  label: string
  color: string
  bgColor: string
  details: ModReadiness[]
}

const CRITERIA = 5 // cost, replacementValue, vendor, installDate, hasReceipt

export function calcInsuranceSummary(
  mods: Mod[],
  receiptModIds: Set<string>,
): InsuranceSummary {
  if (mods.length === 0) {
    return {
      totalMods: 0,
      percentage: 0,
      readyCount: 0,
      totalDeclaredValue: 0,
      totalPurchaseCost: 0,
      label: 'No Mods',
      color: '#888',
      bgColor: 'rgba(128,128,128,0.1)',
      details: [],
    }
  }

  const details: ModReadiness[] = mods.map(m => {
    const hasCost = m.cost != null && m.cost > 0
    const hasReplacementValue = m.replacement_value != null && m.replacement_value > 0
    const hasVendor = !!(m.vendor?.trim())
    const hasInstallDate = !!(m.install_date)
    const hasReceipt = receiptModIds.has(m.id)

    const points = [hasCost, hasReplacementValue, hasVendor, hasInstallDate, hasReceipt]
      .filter(Boolean).length

    return {
      modId: m.id,
      name: m.name,
      cost: m.cost ?? null,
      replacementValue: m.replacement_value ?? null,
      vendor: m.vendor ?? null,
      installDate: m.install_date ?? null,
      hasReceipt,
      hasCost,
      hasReplacementValue,
      hasVendor,
      hasInstallDate,
      points,
      isReady: points === CRITERIA,
    }
  })

  const totalPoints = details.reduce((s, d) => s + d.points, 0)
  const maxPoints = mods.length * CRITERIA
  const percentage = Math.round((totalPoints / maxPoints) * 100)
  const readyCount = details.filter(d => d.isReady).length
  const totalDeclaredValue = details.reduce((s, d) => s + (d.replacementValue ?? 0), 0)
  const totalPurchaseCost = details.reduce((s, d) => s + (d.cost ?? 0), 0)

  let label: string
  let color: string
  let bgColor: string

  if (percentage === 100) {
    label = 'Insurance Ready'; color = '#16a34a'; bgColor = 'rgba(22,163,74,0.1)'
  } else if (percentage >= 80) {
    label = 'Almost Ready'; color = '#2563eb'; bgColor = 'rgba(37,99,235,0.1)'
  } else if (percentage >= 50) {
    label = 'Getting There'; color = '#d97706'; bgColor = 'rgba(217,119,6,0.1)'
  } else if (percentage > 0) {
    label = 'Needs Work'; color = '#dc2626'; bgColor = 'rgba(220,38,38,0.1)'
  } else {
    label = 'Not Started'; color = '#888'; bgColor = 'rgba(128,128,128,0.1)'
  }

  return { totalMods: mods.length, percentage, readyCount, totalDeclaredValue, totalPurchaseCost, label, color, bgColor, details }
}
