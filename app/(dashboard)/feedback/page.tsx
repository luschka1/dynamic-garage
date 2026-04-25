import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Lightbulb, ChevronRight } from 'lucide-react'
import { FEATURE_CATEGORIES } from '@/lib/types'
import FeedbackForm from './FeedbackForm'
import FeedbackHistory from './FeedbackHistory'

export const metadata: Metadata = { title: 'Feature Requests' }

export default async function FeedbackPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch this user's past submissions
  const { data: past } = await supabase
    .from('feature_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div style={{ maxWidth: 680, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(234,179,8,0.12)',
            border: '1px solid rgba(234,179,8,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#ca8a04', flexShrink: 0,
          }}>
            <Lightbulb size={18} />
          </div>
          <h1 style={{
            fontFamily: "'Barlow Condensed'",
            fontSize: '2rem', fontWeight: 900,
            letterSpacing: '0.02em', color: 'var(--text-primary)',
            lineHeight: 1,
          }}>
            FEATURE REQUESTS
          </h1>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginLeft: '2.75rem' }}>
          Got an idea to make Dynamic Garage better? I read every single one.
        </p>
      </div>

      {/* Form */}
      <FeedbackForm categories={FEATURE_CATEGORIES} userId={user.id} userEmail={user.email ?? ''} />

      {/* Past submissions */}
      {past && past.length > 0 && (
        <FeedbackHistory items={past} />
      )}
    </div>
  )
}
