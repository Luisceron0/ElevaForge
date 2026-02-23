import { z } from 'zod'

export const leadSchema = z.object({
  nombre: z.string().min(2, 'Nombre requerido').max(100),
  email: z.string().email('Email inválido'),
  empresa: z.string().max(100).optional(),
  mensaje: z.string().max(500).optional(),
})

export type LeadInput = z.infer<typeof leadSchema>
