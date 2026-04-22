import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/gallery', '/contact', '/privacy', '/terms', '/share/', '/garage/'],
        disallow: ['/dashboard', '/corvettes/', '/admin/', '/api/', '/login', '/register'],
      },
    ],
    sitemap: 'https://dynamicgarage.app/sitemap.xml',
  }
}
