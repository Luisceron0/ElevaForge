import { z } from 'zod'
import type { SiteContent } from '@/lib/site-content'
import { isAssetRef } from '@/lib/asset-refs'

const text = (max: number) => z.string().trim().min(1).max(max)
const optionalText = (max: number) => z.string().trim().max(max)
const optionalUrl = z.string().trim().max(300).optional().or(z.literal(''))
const optionalAssetRef = (message: string) =>
  optionalText(300).refine((value) => !value || isAssetRef(value), message).optional()

const aboutItemSchema = z.object({
  title: text(140),
  description: text(1000),
})

const teamCapabilitySchema = z.object({
  area: text(120),
  owner: text(80),
  description: text(400),
  imageUrl: optionalAssetRef('team.imageUrl debe ser ruta relativa, storage ref o URL http(s)'),
})

const aboutSchema = z.object({
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
  projectsInProgress: z.array(text(220)).max(20),
  supportItems: z.array(text(220)).max(20),
})

const projectSchema = z.object({
  id: z.string().trim().min(1).max(60).regex(/^[a-z0-9-]+$/i, 'ID inválido'),
  title: optionalText(140),
  sector: optionalText(100),
  summary: optionalText(1200),
  results: z.array(optionalText(220)).max(12),
  imageUrl: optionalAssetRef('imageUrl debe ser ruta relativa, storage ref o URL http(s)'),
  externalUrl: optionalUrl,
  status: z.enum(['entregado', 'en-curso']),
})

const packageSchema = z.object({
  id: z.string().trim().min(1).max(60).regex(/^[a-z0-9-]+$/i, 'ID inválido'),
  title: text(120),
  priceUsd: z.number().int().nonnegative(),
  priceCop: z.number().int().nonnegative(),
  bullets: z.array(text(220)).min(1).max(12),
})

const byKeySchema = {
  about: aboutSchema,
  projects: z.array(projectSchema).max(30),
  packages: z.array(packageSchema).max(20),
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
