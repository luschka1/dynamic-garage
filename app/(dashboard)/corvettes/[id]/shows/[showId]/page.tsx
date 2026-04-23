import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ShowDetail from './ShowDetail'
import type { ShowEvent, ShowEventPhoto } from '@/lib/types'

export default async function ShowDetailPage({ params }: { params: Promise<{ id: string; showId: string }> }) {
  const { id, showId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: car } = await supabase.from('corvettes').select('nickname').eq('id', id).eq('user_id', user.id).single()
  if (!car) notFound()

  const { data: show } = await supabase.from('show_events').select('*').eq('id', showId).eq('corvette_id', id).single()
  if (!show) notFound()

  const { data: photos } = await supabase.from('show_event_photos').select('*').eq('show_event_id', showId).order('created_at')

  return (
    <div>
      <Link href={`/corvettes/${id}/shows`} className="back-link">
        <ArrowLeft size={14} /> Show History
      </Link>

      <ShowDetail
        show={show as ShowEvent}
        photos={(photos ?? []) as ShowEventPhoto[]}
        corvetteId={id}
        userId={user.id}
      />
    </div>
  )
}
