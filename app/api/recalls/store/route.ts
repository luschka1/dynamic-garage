import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/recalls/store  { corvetteId, recallIds: string[] }
// Called by the client after it fetches recalls directly from NHTSA.
// Just persists the campaign IDs and last-check timestamp.
export async function POST(req: NextRequest) {
  try {
    const { corvetteId, recallIds } = await req.json()
    if (!corvetteId || !Array.isArray(recallIds)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('corvettes')
      .update({
        last_recall_check: new Date().toISOString(),
        known_recall_ids: recallIds,
      })
      .eq('id', corvetteId)
      .eq('user_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
