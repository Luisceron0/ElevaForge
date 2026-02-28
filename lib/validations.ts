import { z } from 'zod'

/**
 * Shared input-validation schemas.
 *
 * OWASP A05:2025 — Injection prevention via strict allowlists.
 * OWASP A10:2025 — Fail-closed on invalid input.
 *
 * Every field uses:
 *  • Type coercion + trimming to normalise input
 *  • Regex allowlists (not blocklists) where possible
 *  • Length caps to prevent oversized payloads
 */

/** Strip ASCII control characters (0x00-0x1F, 0x7F) — never legitimate in user text. */
function stripControlChars(v: string): string {
  return v.replace(/[\u0000-\u001F\u007F]/g, '')
}

export const leadSchema = z.object({
  nombre: z
    .string()
    .transform((v) => stripControlChars(v).trim())
    .pipe(
      z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres')
        .regex(/^[a-zA-ZÀ-ÿ\s.'-]+$/, 'El nombre contiene caracteres no válidos'),
    ),
  email: z
    .string()
    .transform((v) => stripControlChars(v).toLowerCase().trim())
    .pipe(
      z
        .string()
        .email('Email inválido')
        .max(254, 'El email es demasiado largo'),
    ),
  empresa: z
    .string()
    .max(100, 'El nombre de empresa no puede exceder 100 caracteres')
    .transform((v) => stripControlChars(v).trim())
    .optional()
    .or(z.literal('')),
  mensaje: z
    .string()
    .max(500, 'El mensaje no puede exceder 500 caracteres')
    .transform((v) => stripControlChars(v).trim())
    .optional()
    .or(z.literal('')),
})

export type LeadInput = z.infer<typeof leadSchema>
