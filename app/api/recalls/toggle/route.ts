import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/recalls/toggle  { corvetteId: string, enabled: boolean }
export async function POST(req: NextRequest) {
  try {
    const { corvetteId, enabled } = await req.json()
    if (typeof corvetteId !== 'string' || typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
      .from('corvettes')
      .update({ recall_alerts: enabled })
      .eq('id', corvetteId)
      .eq('user_id', user.id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
