import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import type { Corvette, Mod, Document } from '@/lib/types'
import InsurancePackage from './InsurancePackage'

export default async function InsurancePackagePage({ params }: { params: Promise<{ id: string }> }) {
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

  const { data: docs } = modIds.length > 0
    ? await supabase.from('documents').select('*').in('mod_id', modIds)
    : { data: [] }

  // Resolve signed URLs for private storage paths
  const docList = (docs ?? []) as Document[]
  const urlMap: Record<string, string> = {}
  const privateDocs = docList.filter(d => !d.file_url.startsWith('http'))
  if (privateDocs.length > 0) {
    const { data: signed } = await supabase.storage
      .from('corvette-files')
      .createSignedUrls(privateDocs.map(d => d.file_url), 3600)
    signed?.forEach(({ path, signedUrl }) => { if (path && signedUrl) urlMap[path] = signedUrl })
  }
  docList.forEach(d => {
    urlMap[d.id] = d.file_url.startsWith('http') ? d.file_url : (urlMap[d.file_url] || '')
  })

  // Get user email for declaration
  const { data: { user: fullUser } } = await supabase.auth.getUser()
  const userEmail = fullUser?.email ?? ''

  return (
    <InsurancePackage
      car={car as Corvette}
      mods={modList}
      docs={docList}
      docUrlMap={urlMap}
      userEmail={userEmail}
    />
  )
}
