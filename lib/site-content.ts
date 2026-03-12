import { createServerSupabaseClient } from '@/lib/supabase/server'

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
  imageUrl: string
  externalUrl?: string
  status: 'entregado' | 'en-curso'
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
  }
  projectsInProgress: string
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
    },
    {
      area: 'Backend, Bases de Datos y Nube',
      owner: 'Jhonatan',
      description:
        'Desarrollo backend, modelado de datos e infraestructura cloud alineada al negocio.',
    },
    {
      area: 'Optimización y Rendimiento',
      owner: 'Miguel',
      description:
        'Detección y eliminación de cuellos de botella para asegurar tiempos de respuesta óptimos.',
    },
    {
      area: 'Frontend y Pruebas',
      owner: 'Santiago',
      description:
        'Construcción de interfaces, pruebas funcionales y optimización de recursos del cliente.',
    },
  ],
  experience: {
    title: 'AVC Inmobiliaria y Constructora',
    description:
      'Caso de referencia con puntuaciones sobresalientes en rendimiento, accesibilidad, buenas prácticas y SEO, validando el Estándar Forge en producción.',
  },
  projectsInProgress:
    'Actualmente tenemos varios proyectos en desarrollo en distintos sectores, lo que mantiene al equipo en práctica continua y acelera la mejora técnica.',
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
      about: safeMerge(byKey.get('about'), DEFAULT_SITE_CONTENT.about),
      projects: safeMerge(byKey.get('projects'), DEFAULT_SITE_CONTENT.projects),
      packages: safeMerge(byKey.get('packages'), DEFAULT_SITE_CONTENT.packages),
    }
  } catch {
    return DEFAULT_SITE_CONTENT
  }
}

export async function saveSiteContent<K extends ContentKey>(
  key: K,
  value: SiteContent[K],
): Promise<void> {
  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('site_content')
    .upsert(
      [{ key, value, updated_at: new Date().toISOString() }],
      { onConflict: 'key' },
    )

  if (error) {
    throw new Error(error.message || 'No se pudo guardar contenido')
  }
}
