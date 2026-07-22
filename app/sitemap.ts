import type { MetadataRoute } from 'next'
import { getResolvedSiteContent, DEFAULT_SOLUCIONES } from '@/lib/site-content'

// SEO-12: generado desde las rutas/artículos reales en vez de una lista
// estática — antes omitía /soluciones, /proyectos, /proceso, /contacto por
// completo (no existían todavía) y cualquier página nueva requería editar
// este archivo a mano.
export const revalidate = 86400 // una vez por día como máximo

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elevaforge.com'

// Fecha fija para las páginas legales/estáticas que no cambian con el
// contenido editable — evita marcarlas como "recién modificadas" en cada
// rebuild.
const STATIC_LAST_MODIFIED = '2026-02-25'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString()
  const content = await getResolvedSiteContent()

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/soluciones`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${SITE_URL}/proyectos`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/proceso`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contacto`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.8 },
    { url: `${SITE_URL}/nosotros`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/privacidad`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/terminos`, lastModified: STATIC_LAST_MODIFIED, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const familiaPages: MetadataRoute.Sitemap = DEFAULT_SOLUCIONES.map((familia) => ({
    url: `${SITE_URL}/soluciones/${familia.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const proyectoPages: MetadataRoute.Sitemap = content.projects
    .filter((project) => project.status === 'entregado')
    .map((project) => ({
      url: `${SITE_URL}/proyectos/${project.id}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))

  return [...staticPages, ...familiaPages, ...proyectoPages]
}
