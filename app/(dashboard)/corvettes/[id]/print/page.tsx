import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import type { Corvette, Mod, ServiceRecord, Document } from '@/lib/types'
import PrintView from './PrintView'

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: car } = await supabase
    .from('corvettes').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!car) notFound()

  const [{ data: mods }, { data: service }, { data: docs }] = await Promise.all([
    supabase.from('mods').select('*').eq('corvette_id', id).order('install_date', { ascending: false }),
    supabase.from('service_records').select('*').eq('corvette_id', id).order('service_date', { ascending: false }),
    supabase.from('documents').select('*').eq('corvette_id', id).order('created_at', { ascending: false }),
  ])

  return (
    <PrintView
      car={car as Corvette}
      mods={(mods ?? []) as Mod[]}
      service={(service ?? []) as ServiceRecord[]}
      docs={(docs ?? []) as Document[]}
    />
  )
}
