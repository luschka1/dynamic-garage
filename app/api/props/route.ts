import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

const ELIGIBILITY_DAYS = 14

async function checkEligibility(userId: string): Promise<{ eligible: boolean; reason?: string }> {
  const admin = createAdminClient()

  // Get account age
  const { data: { user } } = await admin.auth.admin.getUserById(userId)
  if (!user) return { eligible: false, reason: 'User not found' }

  const createdAt = new Date(user.created_at)
  const ageInDays = (Date.now() - createdAt.getTime()) / 86400000

  if (ageInDays < ELIGIBILITY_DAYS) {
    const daysLeft = Math.ceil(ELIGIBILITY_DAYS - ageInDays)
    return {
      eligible: false,
      reason: `Your account needs to be ${ELIGIBILITY_DAYS} days old to give Props. ${daysLeft} day${daysLeft !== 1 ? 's' : ''} to go.`,
    }
  }

  // Check for at least 1 vehicle with content
  const { data: vehicles } = await admin
    .from('corvettes')
    .select('id')
    .eq('user_id', userId)
    .limit(1)

  if (!vehicles || vehicles.length === 0) {
    return { eligible: false, reason: 'Add at least one vehicle to your garage before giving Props.' }
  }

  const vehicleId = vehicles[0].id

  // Check for any content on any vehicle
  const [{ count: modCount }, { count: svcCount }, { count: photoCount }] = await Promise.all([
    admin.from('mods').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    admin.from('service_records').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    admin.from('vehicle_photos').select('id', { count: 'exact', head: true }).eq('user_id', userId),
  ])

  const hasContent = (modCount ?? 0) + (svcCount ?? 0) + (photoCount ?? 0) > 0
  if (!hasContent) {
    return { eligible: false, reason: 'Add at least one mod, service record, or photo to give Props.' }
  }

  return { eligible: true }
}

// POST — give props
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Sign in to give Props.', requiresAuth: true }, { status: 401 })

  const { corvetteId } = await req.json()
  if (!corvetteId) return NextResponse.json({ error: 'corvetteId required' }, { status: 400 })

  // Can't prop own build
  const admin = createAdminClient()
  const { data: car } = await admin.from('corvettes').select('user_id').eq('id', corvetteId).single()
  if (car?.user_id === user.id) return NextResponse.json({ error: "You can't give Props to your own build." }, { status: 400 })

  // Check eligibility
  const { eligible, reason } = await checkEligibility(user.id)
  if (!eligible) return NextResponse.json({ error: reason, ineligible: true }, { status: 403 })

  const { error } = await admin.from('build_props').insert({ corvette_id: corvetteId, user_id: user.id })
  if (error?.code === '23505') return NextResponse.json({ error: 'Already given Props to this build.' }, { status: 409 })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Return new count
  const { data: updated } = await admin.from('corvettes').select('props_count').eq('id', corvetteId).single()
  return NextResponse.json({ ok: true, props_count: updated?.props_count ?? 0 })
}

// DELETE — remove props
export async function DELETE(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { corvetteId } = await req.json()
  if (!corvetteId) return NextResponse.json({ error: 'corvetteId required' }, { status: 400 })

  const admin = createAdminClient()
  await admin.from('build_props').delete().eq('corvette_id', corvetteId).eq('user_id', user.id)

  const { data: updated } = await admin.from('corvettes').select('props_count').eq('id', corvetteId).single()
  return NextResponse.json({ ok: true, props_count: updated?.props_count ?? 0 })
}
