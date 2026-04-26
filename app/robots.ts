import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/gallery', '/help', '/contact', '/privacy', '/terms', '/share/', '/garage/'],
        disallow: ['/dashboard', '/corvettes/', '/admin/', '/api/', '/login', '/register', '/forgot-password', '/update-password'],
      },
    ],
    sitemap: 'https://dynamicgarage.app/sitemap.xml',
  }
}
