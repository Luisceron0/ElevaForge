import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  collectAssetPathsForContent,
  deleteStorageAssets,
  normalizeContentAssets,
  resolveSiteContentAssets,
} from '@/lib/storage-assets'
import { normalizeAssetRef } from '@/lib/asset-refs'

export interface PackagePlan {
  id: string
  title: string
  priceUsd: number
  priceCop: number
  bullets: string[]
}

export interface ProjectItem {
  id: string
  title: string
  sector: string
  summary: string
  results: string[]
  imageUrl?: string
  externalUrl?: string
  status: 'entregado' | 'en-curso'
  lighthouse?: {
    performance?: LighthouseMetric
    accessibility?: LighthouseMetric
    bestPractices?: LighthouseMetric
    seo?: LighthouseMetric
  }
}

export interface AboutPhase {
  title: string
  description: string
}

export interface AboutItem {
  title: string
  description: string
}

export interface TeamCapability {
  area: string
  owner: string
  description: string
  imageUrl?: string
}

export interface LighthouseMetric {
  score: number
  description: string
}

export interface LighthouseScores {
  performance: LighthouseMetric
  accessibility: LighthouseMetric
  bestPractices: LighthouseMetric
  seo: LighthouseMetric
  auditedProject: string
}

export interface AboutContent {
  intro: string
  phases: AboutPhase[]
  pillars: AboutItem[]
  differentiators: AboutItem[]
  team: TeamCapability[]
  experience: {
    title: string
    description: string
    items: string[]
    imageUrl?: string
  }
  lighthouse: LighthouseScores
  projectsInProgress: string[]
  supportItems: string[]
}

export interface SiteContent {
  about: AboutContent
  projects: ProjectItem[]
  packages: PackagePlan[]
}

export const DEFAULT_PACKAGES: PackagePlan[] = [
  {
    id: 'web',
    title: 'Sitio Web / Landing',
    priceUsd: 125,
    priceCop: 125 * 3800,
    bullets: [
      'Landing + gestor de contenido (CMS) y panel de administración',
      'Diseño responsivo y optimización',
      'SEO técnico y rendimiento',
      'Entrega en 2 a 4 semanas',
    ],
  },
  {
    id: 'pos',
    title: 'PoS + Gestor de Inventario',
    priceUsd: 80,
    priceCop: 80 * 3800,
    bullets: [
      'Punto de venta funcional',
      'Gestión de inventario',
      'Capacitación incluida',
      'Entrega en 1 a 3 semanas',
    ],
  },
  {
    id: 'custom',
    title: 'Software Personalizado',
    priceUsd: 80,
    priceCop: 80 * 3800,
    bullets: [
      'Soluciones a medida para operaciones y ventas',
      'Arquitectura escalable',
      'Soporte y roadmap definido',
      'Entrega según alcance acordado',
    ],
  },
]

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'avc',
    title: 'AVC Inmobiliaria y Constructora',
    sector: 'Finca raíz',
    summary:
      'Sitio institucional para el sector inmobiliario en Colombia, diseñado para posicionamiento orgánico y tiempos de carga mínimos.',
    results: [
      'Puntuaciones destacadas en Google PageSpeed Insights',
      'Arquitectura SEO técnica lista para indexación',
      'Experiencia responsive optimizada para móviles',
    ],
    imageUrl: '/ElevaIcon.png',
    status: 'entregado',
  },
  {
    id: 'pipeline',
    title: 'Cartera de proyectos en curso',
    sector: 'Multisector',
    summary:
      'Actualmente desarrollamos proyectos en distintos sectores, trasladando aprendizajes técnicos entre implementaciones para acelerar la calidad de nuevas entregas.',
    results: [
      'Desarrollo activo en múltiples verticales',
      'Práctica continua del equipo técnico',
      'Mejora incremental entre proyectos',
    ],
    imageUrl: '/LogoEleva.svg',
    status: 'en-curso',
  },
]

export const DEFAULT_ABOUT: AboutContent = {
  intro:
    'ElevaForge trabaja bajo un proceso estructurado con visibilidad y control en cada etapa. Cada fase tiene entregables definidos, tiempos acordados y validación del cliente antes de avanzar.',
  phases: [
    {
      title: 'Fase 1 - Exploración y Levantamiento de Requisitos',
      description:
        'Realizamos una sesión de análisis del negocio, productos, clientes y objetivos. De allí construimos requisitos funcionales y no funcionales, que se validan y firman antes de iniciar.',
    },
    {
      title: 'Fase 2 - Diseño y Arquitectura',
      description:
        'Diseñamos la arquitectura del sistema y prototipos visuales. El cliente aprueba el diseño antes de escribir código para evitar retrabajos costosos.',
    },
    {
      title: 'Fase 3 - Desarrollo Iterativo',
      description:
        'Trabajamos en ciclos cortos con entregas parciales y revisiones periódicas. El cliente monitorea avances y retroalimenta en tiempo real.',
    },
    {
      title: 'Fase 4 - Pruebas y Optimización',
      description:
        'Ejecutamos pruebas funcionales, de rendimiento, seguridad y compatibilidad. Miguel revisa optimización y cuellos de botella; también configuramos SEO técnico.',
    },
    {
      title: 'Fase 5 - Lanzamiento y Transferencia',
      description:
        'Lanzamos de forma controlada y transferimos propiedad total al cliente: hosting, dominio y código. Además entregamos manual PDF y videotutoriales para operación autónoma.',
    },
  ],
  pillars: [
    {
      title: 'Rendimiento 100/100',
      description:
        'Construimos plataformas optimizadas para tiempos de carga mínimos y validamos rendimiento con Google PageSpeed Insights antes de producción.',
    },
    {
      title: 'Seguridad desde el diseño',
      description:
        'La seguridad se define desde arquitectura y configuración, no como parche final.',
    },
    {
      title: 'Visibilidad en Google',
      description:
        'Aplicamos SEO técnico con estructura semántica, metadatos, velocidad, compatibilidad móvil y URLs amigables.',
    },
  ],
  differentiators: [
    {
      title: 'Transparencia total de costos',
      description:
        'Costos desglosados desde el inicio y recalculo claro ante cambios de alcance.',
    },
    {
      title: 'Propiedad 100% del cliente',
      description:
        'El cliente conserva código, dominio, hosting y accesos administrativos al finalizar.',
    },
    {
      title: 'Autonomía operativa garantizada',
      description:
        'Entregamos manual PDF y videotutoriales específicos para operar sin dependencia técnica.',
    },
    {
      title: '6 meses de mantenimiento sin costo',
      description:
        'Incluye correcciones, seguridad y ajustes menores posteriores al lanzamiento.',
    },
    {
      title: 'Soporte directo y sin intermediarios',
      description:
        'Atención por WhatsApp con contacto directo al equipo de desarrollo.',
    },
    {
      title: 'Factor humano como eje',
      description:
        'Acompañamiento continuo desde análisis hasta post-lanzamiento, especialmente para primeros proyectos digitales.',
    },
  ],
  team: [
    {
      area: 'Arquitectura y Seguridad',
      owner: 'Luis',
      description:
        'Diseño de sistemas, requisitos, documentación, pruebas de calidad y seguridad de aplicaciones.',
      imageUrl: '',
    },
    {
      area: 'Backend, Bases de Datos y Nube',
      owner: 'Jhonatan',
      description:
        'Desarrollo backend, modelado de datos e infraestructura cloud alineada al negocio.',
      imageUrl: '',
    },
    {
      area: 'Optimización y Rendimiento',
      owner: 'Miguel',
      description:
        'Detección y eliminación de cuellos de botella para asegurar tiempos de respuesta óptimos.',
      imageUrl: '',
    },
    {
      area: 'Frontend y Pruebas',
      owner: 'Santiago',
      description:
        'Construcción de interfaces, pruebas funcionales y optimización de recursos del cliente.',
      imageUrl: '',
    },
  ],
  experience: {
    title: 'AVC Inmobiliaria y Constructora',
    description:
      'Caso de referencia con puntuaciones sobresalientes en rendimiento, accesibilidad, buenas prácticas y SEO, validando el Estándar Forge en producción.',
    items: [
      'Puntuación destacada en rendimiento y SEO en Lighthouse',
      'Arquitectura técnica preparada para escalar',
    ],
    imageUrl: '',
  },
  lighthouse: {
    performance: {
      score: 99,
      description: 'El sitio carga en menos de 2 segundos. Imágenes optimizadas, CSS minimizado y JavaScript lazy-loaded.',
    },
    accessibility: {
      score: 97,
      description: 'Interfaz completamente navegable con teclado, legible para desórdenes visuales. WCAG AA cumplido.',
    },
    bestPractices: {
      score: 100,
      description: 'Código moderno, sin librerías deprecadas. HTTPS, CSP headers y manejo seguro de datos aplicado.',
    },
    seo: {
      score: 100,
      description: 'Metaetiquetas, estructura semántica y Robot.txt optimizados. Indexable en Google desde el primer día.',
    },
    auditedProject: 'AVC Inmobiliaria y Constructora',
  },
  projectsInProgress: [
    'Actualmente tenemos varios proyectos en desarrollo en distintos sectores.',
    'El trabajo continuo mantiene al equipo en práctica constante.',
    'Los aprendizajes entre proyectos aceleran la mejora técnica.',
  ],
  supportItems: [
    'Corrección de errores funcionales durante los primeros 6 meses',
    'Actualizaciones de seguridad y parches ante vulnerabilidades',
    'Ajustes menores de contenido o configuración sin desarrollo nuevo',
    'Soporte por WhatsApp con tiempo de respuesta máximo de 24 horas hábiles',
  ],
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  about: DEFAULT_ABOUT,
  projects: DEFAULT_PROJECTS,
  packages: DEFAULT_PACKAGES,
}

type ContentKey = keyof SiteContent

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function safeMerge<T>(value: unknown, fallback: T): T {
  if (Array.isArray(fallback)) {
    return Array.isArray(value) ? (value as T) : fallback
  }
  if (isRecord(fallback) && isRecord(value)) {
    return { ...fallback, ...value } as T
  }
  return fallback
}

function normalizeTextList(value: unknown, fallback: string[]): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item ?? '').trim())
      .filter(Boolean)
      .slice(0, 20)
  }

  if (typeof value === 'string') {
    const single = value.trim()
    return single ? [single] : fallback
  }

  return fallback
}

function dedupeTextList(items: string[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []

  for (const item of items) {
    const value = item.trim()
    if (!value) continue
    const key = value.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    result.push(value)
  }

  return result
}

function mergeAboutItems(primary: AboutItem[], secondary: AboutItem[]): AboutItem[] {
  const seen = new Set<string>()
  const result: AboutItem[] = []

  for (const item of [...primary, ...secondary]) {
    const title = String(item?.title ?? '').trim()
    const description = String(item?.description ?? '').trim()
    if (!title || !description) continue

    const key = `${title.toLowerCase()}::${description.toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    result.push({ title, description })
  }

  return result
}

function normalizeScore(value: unknown, fallback: number): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return fallback
  const bounded = Math.max(0, Math.min(100, Math.round(parsed)))
  return bounded
}

function normalizeLighthouseMetric(
  value: unknown,
  fallbackScore: number,
  fallbackDescription: string,
): LighthouseMetric {
  if (isRecord(value)) {
    const score = normalizeScore(value.score, fallbackScore)
    const description = String(value.description ?? fallbackDescription).trim().slice(0, 300)
    return { score, description: description || fallbackDescription }
  }
  return {
    score: fallbackScore,
    description: fallbackDescription,
  }
}

function normalizeAboutContent(value: unknown, fallback: AboutContent): AboutContent {
  const merged = safeMerge(value, fallback)

  const experienceRecord =
    merged.experience && typeof merged.experience === 'object' && !Array.isArray(merged.experience)
      ? merged.experience
      : fallback.experience

  const normalizedExperience = {
    ...fallback.experience,
    ...experienceRecord,
    items: dedupeTextList(
      normalizeTextList((experienceRecord as Record<string, unknown>).items, fallback.experience.items),
    ),
  }

  const normalizedPillars = Array.isArray(merged.pillars)
    ? merged.pillars.filter(isRecord).map((item) => ({
      title: String(item.title ?? ''),
      description: String(item.description ?? ''),
    }))
    : fallback.pillars

  const normalizedDifferentiators = Array.isArray(merged.differentiators)
    ? merged.differentiators.filter(isRecord).map((item) => ({
      title: String(item.title ?? ''),
      description: String(item.description ?? ''),
    }))
    : fallback.differentiators

  const mergedDifferentiationItems = mergeAboutItems(normalizedPillars, normalizedDifferentiators)
  const normalizedTeam = Array.isArray(merged.team)
    ? merged.team.filter(isRecord).map((member) => ({
      area: String(member.area ?? ''),
      owner: String(member.owner ?? ''),
      description: String(member.description ?? ''),
      imageUrl: normalizeAssetRef(String(member.imageUrl ?? '')) || undefined,
    }))
    : fallback.team

  const lighthouseRecord = isRecord(merged.lighthouse) ? merged.lighthouse : fallback.lighthouse

  return {
    ...fallback,
    ...merged,
    team: normalizedTeam,
    pillars: mergedDifferentiationItems,
    differentiators: [],
    experience: {
      ...normalizedExperience,
      imageUrl: normalizeAssetRef(String(normalizedExperience.imageUrl ?? '')) || undefined,
    },
    lighthouse: {
      performance: normalizeLighthouseMetric(
        lighthouseRecord.performance,
        fallback.lighthouse.performance.score,
        fallback.lighthouse.performance.description,
      ),
      accessibility: normalizeLighthouseMetric(
        lighthouseRecord.accessibility,
        fallback.lighthouse.accessibility.score,
        fallback.lighthouse.accessibility.description,
      ),
      bestPractices: normalizeLighthouseMetric(
        lighthouseRecord.bestPractices,
        fallback.lighthouse.bestPractices.score,
        fallback.lighthouse.bestPractices.description,
      ),
      seo: normalizeLighthouseMetric(
        lighthouseRecord.seo,
        fallback.lighthouse.seo.score,
        fallback.lighthouse.seo.description,
      ),
      auditedProject:
        String(lighthouseRecord.auditedProject ?? '').trim() || fallback.lighthouse.auditedProject,
    },
    projectsInProgress: dedupeTextList(
      normalizeTextList(merged.projectsInProgress, fallback.projectsInProgress),
    ),
    supportItems: dedupeTextList(normalizeTextList(merged.supportItems, fallback.supportItems)),
  }
}

function normalizeProjectsContent(value: unknown, fallback: ProjectItem[]): ProjectItem[] {
  const merged = safeMerge(value, fallback)
  if (!Array.isArray(merged)) return fallback

  return merged.map((project, index) => {
    const fallbackProject = fallback[index] ?? fallback[0]
    const projectRecord = isRecord(project) ? project : {}
    const lighthouseData = isRecord(projectRecord.lighthouse) ? projectRecord.lighthouse : fallbackProject?.lighthouse
    
    const normalizedLighthouse = lighthouseData
      ? {
          performance: isRecord((lighthouseData as any).performance)
            ? {
                score: normalizeScore((lighthouseData as any).performance.score, 0),
                description: String((lighthouseData as any).performance.description ?? '').slice(0, 300)
              }
            : undefined,
          accessibility: isRecord((lighthouseData as any).accessibility)
            ? {
                score: normalizeScore((lighthouseData as any).accessibility.score, 0),
                description: String((lighthouseData as any).accessibility.description ?? '').slice(0, 300)
              }
            : undefined,
          bestPractices: isRecord((lighthouseData as any).bestPractices)
            ? {
                score: normalizeScore((lighthouseData as any).bestPractices.score, 0),
                description: String((lighthouseData as any).bestPractices.description ?? '').slice(0, 300)
              }
            : undefined,
          seo: isRecord((lighthouseData as any).seo)
            ? {
                score: normalizeScore((lighthouseData as any).seo.score, 0),
                description: String((lighthouseData as any).seo.description ?? '').slice(0, 300)
              }
            : undefined,
        }
      : undefined
    return {
      ...fallbackProject,
      ...projectRecord,
      imageUrl: normalizeAssetRef(String((isRecord(project) ? project.imageUrl : '') ?? '')) || undefined,
      externalUrl: String((isRecord(project) ? project.externalUrl : '') ?? '').trim() || undefined,
      results: Array.isArray(isRecord(project) ? project.results : undefined)
        ? (project.results as unknown[]).map((item) => String(item ?? '').trim()).filter(Boolean)
        : fallbackProject?.results ?? [],
      title: String((isRecord(project) ? project.title : '') ?? ''),
      sector: String((isRecord(project) ? project.sector : '') ?? ''),
      summary: String((isRecord(project) ? project.summary : '') ?? ''),
      id: String((isRecord(project) ? project.id : '') ?? fallbackProject?.id ?? `project-${index + 1}`),
      status: (String((isRecord(project) ? project.status : '') ?? fallbackProject?.status ?? 'entregado') === 'en-curso'
        ? 'en-curso'
        : 'entregado'),
      lighthouse: normalizedLighthouse,
    }
  })
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('site_content')
      .select('key,value')
      .in('key', ['about', 'projects', 'packages'])

    if (error || !data) {
      return DEFAULT_SITE_CONTENT
    }

    const byKey = new Map<string, unknown>()
    for (const row of data) {
      byKey.set(String(row.key), row.value)
    }

    return {
      about: normalizeAboutContent(byKey.get('about'), DEFAULT_SITE_CONTENT.about),
      projects: normalizeProjectsContent(byKey.get('projects'), DEFAULT_SITE_CONTENT.projects),
      packages: safeMerge(byKey.get('packages'), DEFAULT_SITE_CONTENT.packages),
    }
  } catch {
    return DEFAULT_SITE_CONTENT
  }
}

export async function getResolvedSiteContent(): Promise<SiteContent> {
  const content = await getSiteContent()
  return resolveSiteContentAssets(content)
}

export async function saveSiteContent<K extends ContentKey>(
  key: K,
  value: SiteContent[K],
): Promise<void> {
  const normalizedValue = normalizeContentAssets(key, value)
  const supabase = createServerSupabaseClient()
  const { data: existingRow } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', key)
    .maybeSingle()

  const previousValue = (existingRow?.value ?? DEFAULT_SITE_CONTENT[key]) as SiteContent[K]
  const previousPaths = collectAssetPathsForContent(key, previousValue)
  const nextPaths = collectAssetPathsForContent(key, normalizedValue)

  const { error } = await supabase
    .from('site_content')
    .upsert(
      [{ key, value: normalizedValue, updated_at: new Date().toISOString() }],
      { onConflict: 'key' },
    )

  if (error) {
    throw new Error(error.message || 'No se pudo guardar contenido')
  }

  const nextPathSet = new Set(nextPaths)
  const removedPaths = previousPaths.filter((path) => !nextPathSet.has(path))
  const currentContent = await getSiteContent()
  const globalReferencedPaths = new Set<string>([
    ...collectAssetPathsForContent('about', currentContent.about),
    ...collectAssetPathsForContent('projects', currentContent.projects),
  ])

  await deleteStorageAssets(removedPaths.filter((path) => !globalReferencedPaths.has(path)))
}
