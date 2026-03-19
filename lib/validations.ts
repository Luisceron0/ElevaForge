import { z } from 'zod'

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
  telefono: z
    .string()
    .max(32, 'El teléfono no puede exceder 32 caracteres')
    .transform((v) => stripControlChars(v).trim())
    .optional()
    .or(z.literal('')),
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
  servicio: z
    .string()
    .max(64, 'El servicio no puede exceder 64 caracteres')
    .transform((v) => stripControlChars(v).trim())
    .optional()
    .or(z.literal('')),
  presupuesto: z
    .string()
    .max(64, 'El presupuesto no puede exceder 64 caracteres')
    .transform((v) => stripControlChars(v).trim())
    .optional()
    .or(z.literal('')),
  contacto_pref: z
    .string()
    .max(16, 'La preferencia no puede exceder 16 caracteres')
    .transform((v) => stripControlChars(v).trim())
    .optional()
    .or(z.literal('')),
  consent: z.boolean().optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
