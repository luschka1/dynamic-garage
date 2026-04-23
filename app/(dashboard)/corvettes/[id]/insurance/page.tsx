import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import type { Corvette, Mod } from '@/lib/types'
import { calcInsuranceSummary } from '@/lib/insurance'
import InsuranceReview from './InsuranceReview'

export default async function InsurancePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: car } = await supabase
    .from('corvettes').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!car) notFound()

  const { data: mods } = await supabase
    .from('mods').select('*').eq('corvette_id', id).order('install_date', { ascending: false })

  const modList = (mods ?? []) as Mod[]
  const modIds = modList.map(m => m.id)

  // Find which mods have at least one receipt document
  const { data: receiptDocs } = modIds.length > 0
    ? await supabase.from('documents').select('mod_id').in('mod_id', modIds)
    : { data: [] }

  const receiptSet = new Set<string>(
    (receiptDocs ?? []).map((d: { mod_id: string }) => d.mod_id).filter(Boolean)
  )

  const summary = calcInsuranceSummary(modList, receiptSet)
  const c = car as Corvette

  return (
    <div>
      <Link href={`/corvettes/${id}`} className="back-link">
        <ArrowLeft size={14} /> {c.nickname}
      </Link>

      <InsuranceReview
        car={c}
        summary={summary}
        corvetteId={id}
        vehicleValue={c.vehicle_value}
      />
    </div>
  )
}
