import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, FileText } from 'lucide-react'
import type { Corvette, Document } from '@/lib/types'
import UploadDocumentForm from './UploadDocumentForm'
import DocumentGrid from './DocumentGrid'

export default async function DocumentsPage({ params, searchParams }: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ mod?: string; service?: string }>
}) {
  const { id } = await params
  const sp = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: car } = await supabase.from('corvettes').select('*').eq('id', id).eq('user_id', user.id).single()
  if (!car) notFound()

  const { data: docs } = await supabase
    .from('documents')
    .select('*')
    .eq('corvette_id', id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <Link href={`/corvettes/${id}`} className="back-link">
        <ArrowLeft size={14} /> {(car as Corvette).nickname}
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ background: 'var(--green)', borderRadius: 8, padding: '0.65rem', flexShrink: 0 }}>
          <FileText size={28} color="white" />
        </div>
        <div>
          <p className="page-eyebrow" style={{ color: 'var(--green)' }}>Document Vault</p>
          <h1 style={{ fontFamily: "'Barlow Condensed'", fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 900, lineHeight: 1 }}>
            {(car as Corvette).nickname.toUpperCase()}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '0.2rem' }}>
            {(car as Corvette).year} {(car as Corvette).model}
          </p>
        </div>
      </div>

      <UploadDocumentForm corvetteId={id} preselectedModId={sp.mod} preselectedServiceId={sp.service} />

      {(!docs || docs.length === 0) ? (
        <div className="empty-state" style={{ marginTop: '2rem' }}>
          <FileText size={40} color="var(--text-muted)" strokeWidth={1.5} style={{ margin: '0 auto 1rem' }} />
          <h3>No Documents Yet</h3>
          <p>Upload receipts, photos, or manuals above.</p>
        </div>
      ) : (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 className="section-title" style={{ margin: 0 }}>
              {docs.length} Document{docs.length > 1 ? 's' : ''}
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Toggle the eye icon to show a document on your public build page
            </span>
          </div>
          <DocumentGrid docs={docs as Document[]} />
        </div>
      )}
    </div>
  )
}
