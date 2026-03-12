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
    .pipe(z.string().email('Email inválido').max(254, 'El email es demasiado largo')),
  telefono: z
    .string()
    .transform((v) => stripControlChars(v).trim())
    .max(32, 'El teléfono no puede exceder 32 caracteres')
    .optional()
    .or(z.literal('')),
  empresa: z
    .string()
    .transform((v) => stripControlChars(v).trim())
    .max(100, 'El nombre de empresa no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  mensaje: z
    .string()
    .transform((v) => stripControlChars(v).trim())
    .max(500, 'El mensaje no puede exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
  contacto_pref: z.enum(['email', 'telefono']).default('email'),
  presupuesto: z
    .string()
    .transform((v) => stripControlChars(v).trim())
    .max(64, 'El presupuesto no puede exceder 64 caracteres')
    .optional()
    .or(z.literal('')),
  servicio: z
    .string()
    .transform((v) => stripControlChars(v).trim())
    .max(64, 'El servicio no puede exceder 64 caracteres')
    .optional()
    .or(z.literal('')),
  consent: z.boolean().default(false),
  origen: z
    .string()
    .transform((v) => stripControlChars(v).trim())
    .max(64, 'El origen no puede exceder 64 caracteres')
    .optional()
    .or(z.literal('')),
})

export type LeadInput = z.infer<typeof leadSchema>
