export interface NHTSARecall {
  NHTSACampaignNumber: string
  Component: string
  Summary: string
  Consequence: string
  Remedy: string
  ModelYear: string
  Make: string
  Model: string
  ReportReceivedDate: string
}

export async function fetchRecallsByVIN(vin: string): Promise<NHTSARecall[]> {
  const url = `https://api.nhtsa.gov/recalls/recallsByVIN/${encodeURIComponent(vin.trim())}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`NHTSA API returned ${res.status}`)
  const data = await res.json()
  return Array.isArray(data.results) ? data.results : []
}
