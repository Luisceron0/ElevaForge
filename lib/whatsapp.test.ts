import { describe, expect, it } from 'vitest'
import { formatWhatsAppDisplay } from './whatsapp'

describe('formatWhatsAppDisplay — RF-004 (single source of truth for the visible number)', () => {
  it('formats the default Colombian number as "+57 XXX XXX XXXX"', () => {
    expect(formatWhatsAppDisplay('573150812166')).toBe('+57 315 081 2166')
  })

  it('derives the grouping from the digits passed in, not a hardcoded literal', () => {
    expect(formatWhatsAppDisplay('573001234567')).toBe('+57 300 123 4567')
  })

  it('falls back to a plain "+digits" format for non-CO numbers instead of guessing a grouping', () => {
    expect(formatWhatsAppDisplay('14155552671')).toBe('+14155552671')
  })
})
