import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import JoinForm from './JoinForm'

export async function generateMetadata({ params }: { params: Promise<{ code: string }> }): Promise<Metadata> {
  const { code } = await params
  const supabase = await createClient()
  const { data: partner } = await supabase
    .from('partner_codes')
    .select('partner_name, headline')
    .eq('code', code.toUpperCase())
    .eq('active', true)
    .single()

  if (!partner) return {}
  return {
    title: `${partner.headline} | Dynamic Garage`,
    description: `Exclusive offer from ${partner.partner_name}. Get lifetime access to Dynamic Garage free.`,
  }
}

export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const supabase = await createClient()

  const { data: partner } = await supabase
    .from('partner_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('active', true)
    .single()

  if (!partner) notFound()

  return <JoinForm partner={partner} />
}
