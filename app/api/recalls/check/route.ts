import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { fetchRecallsByVIN } from '@/lib/nhtsa'

// POST /api/recalls/check  { corvetteId: string }
// Checks NHTSA for the vehicle's VIN, updates the DB, returns recall list.
export async function POST(req: NextRequest) {
  try {
    const { corvetteId } = await req.json()
    if (!corvetteId) {
      return NextResponse.json({ error: 'corvetteId required' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Fetch the vehicle — make sure it belongs to this user
    const { data: car } = await supabase
      .from('corvettes')
      .select('id, vin, known_recall_ids')
      .eq('id', corvetteId)
      .eq('user_id', user.id)
      .single()

    if (!car) return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
    if (!car.vin) return NextResponse.json({ error: 'No VIN on file' }, { status: 400 })

    const recalls = await fetchRecallsByVIN(car.vin)
    const ids = recalls.map(r => r.NHTSACampaignNumber)

    await supabase
      .from('corvettes')
      .update({
        last_recall_check: new Date().toISOString(),
        known_recall_ids: ids,
      })
      .eq('id', corvetteId)

    return NextResponse.json({ recalls, count: recalls.length })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Recall check error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
