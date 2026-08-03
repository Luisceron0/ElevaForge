import { z } from 'zod'
import type { SiteContent } from '@/lib/site-content'
import { isAssetRef } from '@/lib/asset-refs'
import { isSafeExternalUrl } from '@/lib/safe-url'

const text = (max: number) => z.string().trim().min(1).max(max)
const optionalText = (max: number) => z.string().trim().max(max)
const optionalAssetRef = (message: string) =>
  optionalText(300).refine((value) => !value || isAssetRef(value), message).optional()

const aboutItemSchema = z.object({
  title: text(140),
  description: text(1000),
})

const autonomyCardSchema = z.object({
  badge: text(80),
  title: text(120),
  description: text(300),
})

const homeSectionSchema = z.object({
  eyebrow: text(120),
  title: text(180),
  description: text(420),
})

const teamCapabilitySchema = z.object({
  area: text(120),
  owner: text(80),
  description: text(400),
  imageUrl: optionalAssetRef('team.imageUrl debe ser ruta relativa, storage ref o URL http(s)'),
})

const scoreNumber = z.number().int().min(0).max(100)

const lighthouseMetricSchema = z.object({
  score: scoreNumber,
  description: text(300),
})

const aboutSchema = z.object({
  heroSubtitle: text(320),
  intro: text(2200),
  phases: z.array(aboutItemSchema).max(12),
  pillars: z.array(aboutItemSchema).max(12),
  differentiators: z.array(aboutItemSchema).max(20),
  team: z.array(teamCapabilitySchema).max(20),
  experience: z.object({
    title: text(180),
    description: text(1200),
    items: z.array(text(220)).max(20),
    imageUrl: optionalAssetRef('experience.imageUrl debe ser ruta relativa, storage ref o URL http(s)'),
  }),
  lighthouse: z.object({
    performance: lighthouseMetricSchema,
    accessibility: lighthouseMetricSchema,
    bestPractices: lighthouseMetricSchema,
    seo: lighthouseMetricSchema,
    auditedProject: text(180),
  }),
  supportItems: z.array(text(220)).max(20),
  autonomyCards: z.array(autonomyCardSchema).max(4),
  teamSection: homeSectionSchema,
  faq: z
    .array(
      z.object({
        question: text(300),
        answer: text(1500),
      }),
    )
    .max(24),
  homeContent: z.object({
    hero: z.object({
      badge: text(120),
      title: text(160),
      highlight: text(120),
      statement: text(160),
      primaryCta: text(60),
      secondaryCta: text(60),
    }),
    stats: z.object({
      eyebrow: text(120),
      title: text(240),
    }),
    statement: z.object({
      eyebrow: text(120),
      title: text(240),
      body: text(700),
    }),
    soluciones: homeSectionSchema.extend({
      ctaLabel: text(80),
    }),
    roadmap: homeSectionSchema.extend({
      ctaTitle: text(140),
      ctaButton: text(80),
    }),
    techStack: z.object({
      eyebrow: text(160),
      languagesLabel: text(60),
      frameworksLabel: text(60),
      languages: z.array(text(40)).max(40),
      frameworks: z.array(text(60)).max(40),
    }),
    autonomy: homeSectionSchema,
    contact: z.object({
      title: text(140),
      description: text(280),
      responseTime: text(80),
    }),
  }),
})

const solucionItemSchema = z.object({
  nombre: text(120),
  descripcion: optionalText(400),
  // El demo termina en un href público: solo http/https, validado por el
  // parser de URL del runtime (no por regex — ver lib/safe-url.ts).
  demoUrl: optionalText(300)
    .refine((value) => !value || isSafeExternalUrl(value), 'El demo debe ser una URL http(s) completa')
    .optional(),
  // Solo se muestra en /soluciones/[familia], nunca en Home — ver comentario
  // en lib/site-content.ts.
  detalleExtendido: optionalText(2000).optional(),
})

const familiaSchema = z.object({
  id: z.enum(['presencia-digital', 'sistemas-de-gestion', 'software-personalizado']),
  nombre: text(120),
  descripcion: text(600),
  soluciones: z.array(solucionItemSchema).min(1).max(12),
  capacidades: z.array(text(120)).max(20),
})

const byKeySchema = {
  about: aboutSchema,
  // Exactamente 3 familias fijas (§15 del SRS) — nunca más ni menos.
  soluciones: z.array(familiaSchema).length(3),
} as const

type ValidContentKey = keyof SiteContent

export function validateContentByKey<K extends ValidContentKey>(
  key: K,
  value: unknown,
): { ok: true; data: SiteContent[K] } | { ok: false; error: string } {
  const parsed = byKeySchema[key].safeParse(value)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    const path = issue?.path?.length ? issue.path.join('.') : 'value'
    return {
      ok: false,
      error: `Contenido inválido en ${path}: ${issue?.message || 'dato no válido'}`,
    }
  }

  return { ok: true, data: parsed.data as SiteContent[K] }
}
