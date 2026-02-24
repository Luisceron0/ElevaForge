import { z } from 'zod'

export const leadSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres')
    .regex(/^[a-zA-ZÀ-ÿ\s.'-]+$/, 'El nombre contiene caracteres no válidos'),
  email: z
    .string()
    .email('Email inválido')
    .max(254, 'El email es demasiado largo')
    .transform((v) => v.toLowerCase().trim()),
  empresa: z
    .string()
    .max(100, 'El nombre de empresa no puede exceder 100 caracteres')
    .optional(),
  mensaje: z
    .string()
    .max(500, 'El mensaje no puede exceder 500 caracteres')
    .optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
