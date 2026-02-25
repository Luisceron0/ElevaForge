import type { MetadataRoute } from 'next'

// Force static generation - sitemap doesn't need to be dynamic
export const dynamic = 'force-static'
export const revalidate = 86400 // Revalidate once per day max

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elevaforge.com'

// Use fixed date to make this fully static (no serverless invocation per request)
const LAST_MODIFIED = '2026-02-25'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacidad`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terminos`,
      lastModified: LAST_MODIFIED,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]
}
