import { createServerSupabaseClient } from '@/lib/supabase/server'
import {
  collectAssetPathsForContent,
  deleteStorageAssets,
  normalizeContentAssets,
  resolveSiteContentAssets,
} from '@/lib/storage-assets'
import { normalizeAssetRef } from '@/lib/asset-refs'
import { safeExternalUrl } from '@/lib/safe-url'

export type FamiliaId = 'presencia-digital' | 'sistemas-de-gestion' | 'software-personalizado'

export interface SolucionItem {
  nombre: string
  /** Texto corto: se muestra tanto en Home como en /soluciones/[familia]. */
  descripcion: string
  /**
   * Demo público en vivo de esta solución (opcional). Solo http/https —
   * ver `lib/safe-url.ts`. Es la evidencia clicable que reemplaza al listado
   * de proyectos (decisión del cliente 2026-08-03, ADR-012).
   */
  demoUrl?: string
  /**
   * Contenido más profundo, opcional — SOLO se muestra en
   * /soluciones/[familia], nunca en Home (pedido del cliente 2026-08-03: la
   * página de familia debe aportar algo distinto de lo que ya se ve en el
   * Home, no repetir el mismo texto corto).
   */
  detalleExtendido?: string
}

export interface FamiliaDeSolucion {
  id: FamiliaId
  nombre: string
  descripcion: string
  /** Soluciones principales de esta familia (contenido, no precios). */
  soluciones: SolucionItem[]
  /** Capacidades configurables que complementan las soluciones — nunca productos independientes. */
  capacidades: string[]
}

export interface AboutPhase {
  title: string
  description: string
}

export interface AboutItem {
  title: string
  description: string
}

export interface AutonomyCard {
  badge: string
  title: string
  description: string
}

export interface HomeSectionCopy {
  eyebrow: string
  title: string
  description: string
}

export interface HomeContent {
  hero: {
    badge: string
    title: string
    highlight: string
    statement: string
    primaryCta: string
    secondaryCta: string
  }
  stats: {
    eyebrow: string
    title: string
  }
  statement: {
    eyebrow: string
    title: string
    body: string
  }
  soluciones: HomeSectionCopy & {
    ctaLabel: string
  }
  roadmap: HomeSectionCopy & {
    ctaTitle: string
    ctaButton: string
  }
  techStack: {
    eyebrow: string
    languagesLabel: string
    frameworksLabel: string
    languages: string[]
    frameworks: string[]
  }
  autonomy: HomeSectionCopy
  contact: {
    title: string
    description: string
    responseTime: string
  }
}

export interface FaqEntry {
  question: string
  answer: string
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
  heroSubtitle: string
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
  supportItems: string[]
  autonomyCards: AutonomyCard[]
  /** Copy of the /nosotros page header (the team list itself is `team`). */
  teamSection: HomeSectionCopy
  /** Q&A rendered on /preguntas-frecuentes (also feeds the FAQPage JSON-LD). */
  faq: FaqEntry[]
  homeContent: HomeContent
}

export interface SiteContent {
  about: AboutContent
  soluciones: FamiliaDeSolucion[]
}

export const DEFAULT_SOLUCIONES: FamiliaDeSolucion[] = [
  {
    id: 'presencia-digital',
    nombre: 'Presencia Digital',
    descripcion:
      'Para negocios que necesitan mostrarse online y dirigir a sus clientes hacia una acción concreta: escribir por WhatsApp, pedir una cotización, reservar o conocer tu catálogo.',
    soluciones: [
      {
        nombre: 'Landing Page',
        descripcion:
          'Una sola página con un único objetivo de conversión: dejar tus datos, escribir por WhatsApp o sumarse a una lista de espera. Ideal para lanzamientos, campañas o validar una idea rápido, sin la complejidad de un sitio completo.',
        demoUrl: 'https://koa.elevaforge.com/',
        detalleExtendido:
          'Se construye alrededor de un solo objetivo de conversión, sin secciones que distraigan de esa decisión. Es la opción indicada para lanzamientos de producto, campañas puntuales, eventos o para validar una oferta antes de invertir en un sitio completo: se publica rápido y se puede medir su efectividad desde el primer día. No incluye blog, catálogo ni áreas internas de contenido — si tu negocio necesita eso, la solución es Sitio Web.',
      },
      {
        nombre: 'Sitio Web',
        descripcion:
          'Sitio multipágina con catálogo, blog y navegación institucional completa, con soporte multilenguaje si tu negocio lo necesita. Para cuando ya tenés un catálogo de productos o servicios y necesitás presencia digital robusta y administrable.',
        demoUrl: 'https://store.koa.elevaforge.com/es',
        detalleExtendido:
          'Pensado para negocios que ya tienen (o van a tener) un catálogo de productos o servicios y necesitan una presencia digital que crezca con ellos: múltiples páginas, blog para posicionamiento en buscadores y soporte multilenguaje cuando el negocio lo requiere. A diferencia de una Landing Page, no está atado a una sola acción: organiza distintos tipos de contenido (institucional, catálogo, noticias) bajo una navegación propia, con panel administrativo para que tu equipo lo mantenga actualizado sin depender de terceros.',
      },
    ],
    capacidades: [
      'Panel administrativo y gestión de contenido',
      'Blog y catálogo digital',
      'Formularios, agenda y noticias',
      'Buscador y multilenguaje',
      'SEO técnico',
      'Integraciones con servicios externos',
      'Autenticación y gestión documental',
      'Dashboards, analítica y notificaciones',
    ],
  },
  {
    id: 'sistemas-de-gestion',
    nombre: 'Sistemas de Gestión',
    descripcion:
      'Para negocios que necesitan ordenar y automatizar su operación interna: ventas, inventario, atención al cliente o procesos administrativos, con las capacidades que tu operación realmente necesita.',
    soluciones: [
      { nombre: 'CRM', descripcion: '' },
      { nombre: 'ERP configurable', descripcion: '' },
      { nombre: 'PoS + Inventario', descripcion: '' },
      { nombre: 'Help Desk', descripcion: '' },
    ],
    capacidades: [
      'Inventario, compras, ventas y producción',
      'Recursos humanos y gestión documental',
      'Gestión de activos, calidad y proyectos',
      'Reservas, portal de clientes y de proveedores',
      'Reportes, dashboards e indicadores',
      'Automatización de procesos e integraciones (APIs)',
      'Auditoría, control de acceso y firma electrónica',
      'Trazabilidad, geolocalización e inteligencia artificial',
    ],
  },
  {
    id: 'software-personalizado',
    nombre: 'Software Personalizado',
    descripcion:
      'Para necesidades que no encajan en un molde: plataformas educativas, logísticas, colaborativas, científicas, industriales o para entidades públicas y fundaciones. Se diseña a la medida del problema, reutilizando cualquier capacidad de las otras familias cuando aporte valor.',
    soluciones: [
      { nombre: 'Plataformas educativas', descripcion: '' },
      { nombre: 'Plataformas logísticas y colaborativas', descripcion: '' },
      { nombre: 'Aplicaciones móviles', descripcion: '' },
      { nombre: 'Software científico e industrial', descripcion: '' },
      { nombre: 'Soluciones IoT y especializadas', descripcion: '' },
    ],
    capacidades: [
      'Arquitectura a medida del problema de negocio',
      'Integración con sistemas y capacidades existentes',
      'Escalabilidad y mantenibilidad como requisito de diseño',
    ],
  },
]

export const DEFAULT_ABOUT: AboutContent = {
  heroSubtitle:
    'Diseñamos, construimos y optimizamos plataformas web con métricas verificables, acompañamiento cercano y decisiones técnicas enfocadas en resultados de negocio.',
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
        'Ejecutamos pruebas funcionales, de rendimiento, seguridad y compatibilidad. Revisamos optimización y cuellos de botella; también configuramos SEO técnico.',
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
      owner: 'Luis Cerón',
      description:
        'Diseño de sistemas, requisitos, documentación, pruebas de calidad y seguridad de aplicaciones.',
      imageUrl: '',
    },
    {
      area: 'Backend, Bases de Datos y Nube',
      owner: 'Jhonatan Diaz',
      description:
        'Desarrollo backend, modelado de datos e infraestructura cloud alineada al negocio.',
      imageUrl: '',
    },
    {
      area: 'Frontend, Rendimiento y Pruebas',
      owner: 'Santiago Reyes',
      description:
        'Construcción de interfaces, pruebas funcionales, eliminación de cuellos de botella y optimización de recursos del cliente.',
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
  supportItems: [
    'El código fuente, repositorio y accesos quedan a nombre del cliente al finalizar la entrega.',
    'Entregamos manual PDF y video explicativo para que tu equipo pueda operar la plataforma sin depender de terceros.',
    'Atención directa por WhatsApp con el equipo técnico para resolver dudas operativas y ajustes puntuales.',
    'Definimos procesos para que puedas administrar contenidos y tareas comunes sin fricción técnica diaria.',
  ],
  autonomyCards: [
    {
      badge: '100% tuya',
      title: 'Propiedad del código',
      description: 'El código fuente, repositorio y accesos quedan a nombre del cliente al finalizar la entrega.',
    },
    {
      badge: 'Manual PDF + Video',
      title: 'Capacitación real',
      description:
        'Entregamos manual PDF y video explicativo para que tu equipo pueda operar la plataforma sin depender de terceros.',
    },
    {
      badge: 'Soporte directo',
      title: 'WhatsApp sin intermediarios',
      description:
        'Atención directa por WhatsApp con el equipo técnico para resolver dudas operativas y ajustes puntuales.',
    },
    {
      badge: 'Sin dependencia',
      title: 'Autonomía operativa',
      description:
        'Definimos procesos para que puedas administrar contenidos y tareas comunes sin fricción técnica diaria.',
    },
  ],
  teamSection: {
    eyebrow: 'Quiénes somos',
    title: 'Equipo de ingeniería orientado a resultados',
    description:
      'Somos un equipo de ingenieros de software colombianos enfocados en construir tecnología útil, clara y sostenible para empresas.',
  },
  // RF-019 / CRO-05: sin precios publicados (ADR-003), la pregunta sobre
  // inversión es obligatoria acá, no opcional.
  faq: [
    {
      question: '¿Qué incluye una solicitud de diagnóstico?',
      answer:
        'Una conversación inicial sin costo donde entendemos tu problema de negocio, tu contexto y tus objetivos. De ahí sale un alcance preliminar y los próximos pasos concretos, no es una llamada de ventas genérica.',
    },
    {
      question: '¿Cómo se define la inversión, si no publican precios?',
      answer:
        'Cada solución es distinta porque cada negocio lo es. El costo se define en la fase de diseño y arquitectura, después de entender el alcance real, no antes. Eso evita cobrar de más por lo que no necesitás y de menos por lo que sí. Vas a conocer el número antes de que empecemos a construir, nunca después.',
    },
    {
      question: '¿El código y los accesos son míos?',
      answer:
        'Sí. Al finalizar la entrega, el código fuente, el repositorio, el dominio, el hosting y los accesos administrativos quedan a tu nombre. No dependés de nosotros para operar tu propio sistema.',
    },
    {
      question: '¿Qué pasa después de que el proyecto se entrega?',
      answer:
        'Incluimos 6 meses de mantenimiento sin costo adicional (correcciones, seguridad y ajustes menores), además de un manual y capacitación para que tu equipo pueda operar la plataforma sin depender de terceros.',
    },
    {
      question: '¿Cuánto tiempo toma un proyecto?',
      answer:
        'Depende del alcance: lo definimos juntos en la fase de exploración y queda documentado antes de empezar a desarrollar, con entregas parciales en el camino para que puedas monitorear avances en tiempo real.',
    },
    {
      question: 'Mi negocio recién empieza a digitalizarse, ¿igual pueden ayudarme?',
      answer:
        'Sí. Trabajamos con acompañamiento cercano desde el análisis hasta después del lanzamiento, pensado específicamente para negocios que dan sus primeros pasos en digitalización, no solo para equipos técnicos.',
    },
  ],
  homeContent: {
    hero: {
      badge: 'Agencia de software · Colombia',
      title: 'Forjamos el motor digital',
      highlight: 'de tu empresa',
      statement: 'No vendemos tecnología.',
      primaryCta: 'Iniciar proyecto',
      secondaryCta: 'Ver soluciones',
    },
    stats: {
      eyebrow: 'Prueba antes que promesa',
      title: 'Puntajes Lighthouse reales, verificados en producción, no aspiracionales.',
    },
    statement: {
      eyebrow: 'Cómo pensamos',
      title: 'El software es un medio. La solución es el producto.',
      body: 'No vendemos frameworks, lenguajes ni horas de desarrollo. Empezamos por el problema de tu negocio y diseñamos la solución que lo resuelve, con ingeniería, documentación y autonomía para tu equipo.',
    },
    soluciones: {
      eyebrow: 'Familias de soluciones',
      title: 'Resolvemos problemas de negocio, no vendemos tecnología',
      description: 'Cada familia agrupa soluciones y capacidades configurables según lo que tu negocio necesita, sin paquetes rígidos.',
      ctaLabel: 'Solicitar diagnóstico',
    },
    roadmap: {
      eyebrow: 'Proceso transparente',
      title: 'De la idea a la entrega sin zonas grises',
      description: 'Cada fase está definida para que sepas qué estamos haciendo, por qué lo hacemos y qué sigue después.',
      ctaTitle: '¿Listo para el paso 01?',
      ctaButton: 'Solicitar asesoría gratuita',
    },
    techStack: {
      eyebrow: 'Construimos con herramientas modernas y probadas',
      languagesLabel: 'Lenguajes',
      frameworksLabel: 'Frameworks',
      languages: ['C', 'Java', 'Python', 'C#', 'C++', 'JavaScript', 'TypeScript', 'Dart', 'HTML5', 'CSS3'],
      frameworks: ['Spring Boot', 'Django', 'React', 'Vue.js', 'Angular', 'Astro', 'Bootstrap', 'Tailwind CSS', 'Next.js', 'Nuxt.js'],
    },
    autonomy: {
      eyebrow: 'Diferencial ElevaForge',
      title: 'Autonomía y formación desde el día uno',
      description: 'Entregamos tecnología útil, documentada y operable por tu equipo.',
    },
    contact: {
      title: 'Hablemos de tu proyecto',
      description: 'Te ayudamos a aterrizar tu idea con alcance claro, tiempos realistas y una propuesta transparente.',
      responseTime: 'Menos de 24 horas',
    },
  },
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  about: DEFAULT_ABOUT,
  soluciones: DEFAULT_SOLUCIONES,
}

export const CONTENT_KEYS = Object.keys(DEFAULT_SITE_CONTENT) as Array<keyof SiteContent>

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

function normalizeSolucionItems(value: unknown, fallback: SolucionItem[]): SolucionItem[] {
  if (!Array.isArray(value)) return fallback

  const items: SolucionItem[] = []
  const seen = new Set<string>()

  for (const raw of value) {
    let nombre = ''
    let descripcion = ''
    let demoUrl: string | undefined
    let detalleExtendido: string | undefined

    if (typeof raw === 'string') {
      // Legacy shape (pre-migration): plain string label, no description yet.
      nombre = raw.trim()
    } else if (isRecord(raw)) {
      nombre = String(raw.nombre ?? '').trim()
      descripcion = String(raw.descripcion ?? '').trim()
      // Un demoUrl con esquema no-http se descarta acá, antes de llegar a
      // ningún `href` — la validación de zod al guardar no alcanza porque la
      // fila de la DB puede escribirse por fuera del panel.
      demoUrl = safeExternalUrl(raw.demoUrl)
      detalleExtendido = String(raw.detalleExtendido ?? '').trim().slice(0, 2000) || undefined
    }

    if (!nombre) continue
    const key = nombre.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    items.push({ nombre, descripcion, demoUrl, detalleExtendido })
    if (items.length >= 20) break
  }

  return items.length > 0 ? items : fallback
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

function normalizeSupportItems(value: unknown, fallback: string[]): string[] {
  const normalized = normalizeTextList(value, fallback)
  const maxCards = 4
  const result = Array.from({ length: maxCards }, (_, index) => {
    const current = String(normalized[index] ?? '').trim()
    return current || fallback[index] || ''
  })

  return result.filter(Boolean)
}

function normalizeAutonomyCards(value: unknown, fallback: AutonomyCard[]): AutonomyCard[] {
  if (!Array.isArray(value)) return fallback

  const cards = value
    .filter(isRecord)
    .slice(0, 4)
    .map((card, index) => {
      const fallbackCard = fallback[index] ?? fallback[0]
      return {
        badge: String(card.badge ?? fallbackCard?.badge ?? '').trim(),
        title: String(card.title ?? fallbackCard?.title ?? '').trim(),
        description: String(card.description ?? fallbackCard?.description ?? '').trim(),
      }
    })

  return cards.length ? cards : fallback
}

function normalizeFaq(value: unknown, fallback: FaqEntry[]): FaqEntry[] {
  if (!Array.isArray(value)) return fallback
  const entries = value
    .map((raw) => {
      const item = isRecord(raw) ? raw : {}
      return {
        question: String(item.question ?? '').trim(),
        answer: String(item.answer ?? '').trim(),
      }
    })
    .filter((item) => item.question && item.answer)
  return entries.length > 0 ? entries : fallback
}

function normalizeSection(sectionValue: unknown, sectionFallback: HomeSectionCopy): HomeSectionCopy {
  const section = isRecord(sectionValue) ? sectionValue : {}
  return {
    eyebrow: String(section.eyebrow ?? sectionFallback.eyebrow).trim() || sectionFallback.eyebrow,
    title: String(section.title ?? sectionFallback.title).trim() || sectionFallback.title,
    description: String(section.description ?? sectionFallback.description).trim() || sectionFallback.description,
  }
}

// El CTA secundario del hero apuntaba a /proyectos; esa ruta ya no existe
// (ADR-012). Si la fila guardada todavía tiene el label viejo, se remapea al
// nuevo — de lo contrario el botón diría "Ver proyectos" y llevaría a
// /soluciones, exactamente la divergencia que este cambio elimina. Cualquier
// otro label lo definió un admin a mano y se respeta.
const LEGACY_SECONDARY_CTA_LABELS = new Set(['ver proyectos', 'ver casos', 'ver proyectos entregados'])

function normalizeSecondaryCta(value: unknown, fallbackLabel: string): string {
  const label = String(value ?? '').trim()
  if (!label) return fallbackLabel
  if (LEGACY_SECONDARY_CTA_LABELS.has(label.toLowerCase())) return fallbackLabel
  return label
}

function normalizeHomeContent(value: unknown, fallback: HomeContent): HomeContent {
  const merged = isRecord(value) ? value : {}

  const hero = isRecord(merged.hero) ? merged.hero : {}
  const stats = isRecord(merged.stats) ? merged.stats : {}
  const statement = isRecord(merged.statement) ? merged.statement : {}
  const soluciones = isRecord(merged.soluciones) ? merged.soluciones : {}
  const roadmap = isRecord(merged.roadmap) ? merged.roadmap : {}
  const techStack = isRecord(merged.techStack) ? merged.techStack : {}
  const contact = isRecord(merged.contact) ? merged.contact : {}

  const normalizeList = (value: unknown, fb: string[]): string[] => {
    const list = Array.isArray(value)
      ? value.map((v) => String(v ?? '').trim()).filter(Boolean)
      : []
    return list.length > 0 ? list : fb
  }

  return {
    hero: {
      badge: String(hero.badge ?? fallback.hero.badge).trim() || fallback.hero.badge,
      title: String(hero.title ?? fallback.hero.title).trim() || fallback.hero.title,
      highlight: String(hero.highlight ?? fallback.hero.highlight).trim() || fallback.hero.highlight,
      statement: String(hero.statement ?? fallback.hero.statement).trim() || fallback.hero.statement,
      primaryCta: String(hero.primaryCta ?? fallback.hero.primaryCta).trim() || fallback.hero.primaryCta,
      secondaryCta: normalizeSecondaryCta(hero.secondaryCta, fallback.hero.secondaryCta),
    },
    stats: {
      eyebrow: String(stats.eyebrow ?? fallback.stats.eyebrow).trim() || fallback.stats.eyebrow,
      title: String(stats.title ?? fallback.stats.title).trim() || fallback.stats.title,
    },
    statement: {
      eyebrow: String(statement.eyebrow ?? fallback.statement.eyebrow).trim() || fallback.statement.eyebrow,
      title: String(statement.title ?? fallback.statement.title).trim() || fallback.statement.title,
      body: String(statement.body ?? fallback.statement.body).trim() || fallback.statement.body,
    },
    soluciones: {
      ...normalizeSection(soluciones, fallback.soluciones),
      ctaLabel: String(soluciones.ctaLabel ?? fallback.soluciones.ctaLabel).trim() || fallback.soluciones.ctaLabel,
    },
    roadmap: {
      ...normalizeSection(roadmap, fallback.roadmap),
      ctaTitle: String(roadmap.ctaTitle ?? fallback.roadmap.ctaTitle).trim() || fallback.roadmap.ctaTitle,
      ctaButton: String(roadmap.ctaButton ?? fallback.roadmap.ctaButton).trim() || fallback.roadmap.ctaButton,
    },
    techStack: {
      eyebrow: String(techStack.eyebrow ?? fallback.techStack.eyebrow).trim() || fallback.techStack.eyebrow,
      languagesLabel:
        String(techStack.languagesLabel ?? fallback.techStack.languagesLabel).trim() || fallback.techStack.languagesLabel,
      frameworksLabel:
        String(techStack.frameworksLabel ?? fallback.techStack.frameworksLabel).trim() || fallback.techStack.frameworksLabel,
      languages: normalizeList(techStack.languages, fallback.techStack.languages),
      frameworks: normalizeList(techStack.frameworks, fallback.techStack.frameworks),
    },
    autonomy: normalizeSection(merged.autonomy, fallback.autonomy),
    contact: {
      title: String(contact.title ?? fallback.contact.title).trim() || fallback.contact.title,
      description: String(contact.description ?? fallback.contact.description).trim() || fallback.contact.description,
      responseTime:
        String(contact.responseTime ?? fallback.contact.responseTime).trim() ||
        fallback.contact.responseTime,
    },
  }
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
    heroSubtitle:
      String(merged.heroSubtitle ?? '').trim() || fallback.heroSubtitle,
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
    supportItems: normalizeSupportItems(merged.supportItems, fallback.supportItems),
    autonomyCards: normalizeAutonomyCards(merged.autonomyCards, fallback.autonomyCards),
    teamSection: normalizeSection(merged.teamSection, fallback.teamSection),
    faq: normalizeFaq(merged.faq, fallback.faq),
    homeContent: normalizeHomeContent(merged.homeContent, fallback.homeContent),
  }
}

function normalizeSolucionesContent(value: unknown, fallback: FamiliaDeSolucion[]): FamiliaDeSolucion[] {
  if (!Array.isArray(value)) return fallback

  const byId = new Map<string, Record<string, unknown>>()
  for (const entry of value) {
    if (isRecord(entry) && typeof entry.id === 'string') byId.set(entry.id, entry)
  }

  // Always exactly the 3 fixed families (§15) — an admin can edit their copy,
  // never add/remove/reorder them.
  return fallback.map((familia) => {
    const stored = byId.get(familia.id)
    if (!stored) return familia

    return {
      id: familia.id,
      nombre: String(stored.nombre ?? familia.nombre).trim() || familia.nombre,
      descripcion: String(stored.descripcion ?? familia.descripcion).trim() || familia.descripcion,
      soluciones: normalizeSolucionItems(stored.soluciones, familia.soluciones),
      capacidades: dedupeTextList(normalizeTextList(stored.capacidades, familia.capacidades)),
    }
  })
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('site_content')
      .select('key,value')
      .in('key', CONTENT_KEYS)

    if (error || !data) {
      return DEFAULT_SITE_CONTENT
    }

    const byKey = new Map<string, unknown>()
    for (const row of data) {
      byKey.set(String(row.key), row.value)
    }

    return {
      about: normalizeAboutContent(byKey.get('about'), DEFAULT_SITE_CONTENT.about),
      soluciones: normalizeSolucionesContent(byKey.get('soluciones'), DEFAULT_SITE_CONTENT.soluciones),
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
  const globalReferencedPaths = new Set<string>(
    CONTENT_KEYS.flatMap((contentKey) =>
      collectAssetPathsForContent(contentKey, currentContent[contentKey]),
    ),
  )

  await deleteStorageAssets(removedPaths.filter((path) => !globalReferencedPaths.has(path)))
}
