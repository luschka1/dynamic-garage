import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

const BASE = 'https://dynamicgarage.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE,               lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/gallery`,  lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/contact`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/privacy`,  lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE}/terms`,    lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ]

  try {
    const supabase = await createClient()

    // All public vehicles → /share/[userId]/[vehicleId]
    const { data: vehicles } = await supabase
      .from('corvettes')
      .select('id, user_id, updated_at')
      .eq('is_public', true)
      .order('updated_at', { ascending: false })

    const vehiclePages: MetadataRoute.Sitemap = (vehicles ?? []).map(v => ({
      url: `${BASE}/share/${v.user_id}/${v.id}`,
      lastModified: v.updated_at ? new Date(v.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Unique public garage pages → /garage/[userId]
    const uniqueUserIds = [...new Set((vehicles ?? []).map(v => v.user_id))]
    const garagePages: MetadataRoute.Sitemap = uniqueUserIds.map(userId => ({
      url: `${BASE}/garage/${userId}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticPages, ...vehiclePages, ...garagePages]
  } catch {
    // Fall back to static pages only if DB is unavailable
    return staticPages
  }
}
