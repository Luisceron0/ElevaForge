import { describe, expect, it } from 'vitest'
import { leadSchema } from './validations'

const validBase = {
  nombre: 'Ana María',
  email: 'ana@example.com',
}

describe('leadSchema', () => {
  it('accepts a minimal valid lead', () => {
    const result = leadSchema.safeParse(validBase)
    expect(result.success).toBe(true)
  })

  it('rejects a name shorter than 2 characters', () => {
    const result = leadSchema.safeParse({ ...validBase, nombre: 'A' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = leadSchema.safeParse({ ...validBase, email: 'not-an-email' })
    expect(result.success).toBe(false)
  })

  it('strips control characters from free-text fields (input sanitization at the boundary)', () => {
    const bellChar = String.fromCharCode(7)
    const result = leadSchema.safeParse({
      ...validBase,
      mensaje: `hola${bellChar}mundo`,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.mensaje).toBe('holamundo')
    }
  })

  it('lowercases and trims email', () => {
    const result = leadSchema.safeParse({ ...validBase, email: '  Ana@EXAMPLE.com  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.email).toBe('ana@example.com')
    }
  })

  it('rejects a name with disallowed characters (basic injection-shaped input)', () => {
    const result = leadSchema.safeParse({ ...validBase, nombre: '<script>alert(1)</script>' })
    expect(result.success).toBe(false)
  })

  it('rejects an email over the max length', () => {
    const longLocal = 'a'.repeat(250)
    const result = leadSchema.safeParse({ ...validBase, email: `${longLocal}@example.com` })
    expect(result.success).toBe(false)
  })
})
