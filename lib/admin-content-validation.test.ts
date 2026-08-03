import { describe, expect, it } from 'vitest'
import { validateContentByKey } from './admin-content-validation'
import { DEFAULT_SITE_CONTENT } from './site-content'

describe('validateContentByKey', () => {
  it('accepts the default soluciones content as-is', () => {
    const result = validateContentByKey('soluciones', DEFAULT_SITE_CONTENT.soluciones)
    expect(result.ok).toBe(true)
  })

  it('accepts the default about content as-is', () => {
    const result = validateContentByKey('about', DEFAULT_SITE_CONTENT.about)
    expect(result.ok).toBe(true)
  })

  it('no longer accepts the removed `projects` key (ADR-012)', () => {
    // @ts-expect-error — la clave `projects` se eliminó del modelo de contenido
    expect(() => validateContentByKey('projects', [])).toThrow()
  })

  it('accepts a solución with an https demo url', () => {
    const withDemo = structuredClone(DEFAULT_SITE_CONTENT.soluciones)
    withDemo[0].soluciones[0].demoUrl = 'https://koa.elevaforge.com/'
    expect(validateContentByKey('soluciones', withDemo).ok).toBe(true)
  })

  it('accepts a solución with no demo url at all', () => {
    const withoutDemo = structuredClone(DEFAULT_SITE_CONTENT.soluciones)
    delete withoutDemo[0].soluciones[0].demoUrl
    expect(validateContentByKey('soluciones', withoutDemo).ok).toBe(true)
  })

  it('accepts a solución with detalleExtendido set', () => {
    const withDetalle = structuredClone(DEFAULT_SITE_CONTENT.soluciones)
    withDetalle[0].soluciones[0].detalleExtendido = 'Contenido más profundo, solo visible en /soluciones/[familia].'
    expect(validateContentByKey('soluciones', withDetalle).ok).toBe(true)
  })

  it('accepts a solución with no detalleExtendido at all', () => {
    const withoutDetalle = structuredClone(DEFAULT_SITE_CONTENT.soluciones)
    delete withoutDetalle[0].soluciones[0].detalleExtendido
    expect(validateContentByKey('soluciones', withoutDetalle).ok).toBe(true)
  })

  it('rejects a detalleExtendido over 2000 characters', () => {
    const tooLong = structuredClone(DEFAULT_SITE_CONTENT.soluciones)
    tooLong[0].soluciones[0].detalleExtendido = 'x'.repeat(2001)
    expect(validateContentByKey('soluciones', tooLong).ok).toBe(false)
  })

  // El demoUrl termina en un href público: un esquema ejecutable acá es XSS
  // almacenado, no un dato feo. Ver lib/safe-url.ts.
  it.each([
    'javascript:alert(1)',
    'JaVaScRiPt:alert(1)',
    '\tjavascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    '//evil.example.com',
    'koa.elevaforge.com',
  ])('rejects a demo url with a non-http(s) scheme: %s', (demoUrl) => {
    const bad = structuredClone(DEFAULT_SITE_CONTENT.soluciones)
    bad[0].soluciones[0].demoUrl = demoUrl
    const result = validateContentByKey('soluciones', bad)
    expect(result.ok).toBe(false)
  })

  it('rejects soluciones with fewer than the 3 fixed families (§15)', () => {
    const bad = DEFAULT_SITE_CONTENT.soluciones.slice(0, 2)
    const result = validateContentByKey('soluciones', bad)
    expect(result.ok).toBe(false)
  })

  it('rejects a familia with an id outside the fixed 3 (no prices, no rigid packages)', () => {
    const bad = [
      { ...DEFAULT_SITE_CONTENT.soluciones[0], id: 'paquete-premium' },
      DEFAULT_SITE_CONTENT.soluciones[1],
      DEFAULT_SITE_CONTENT.soluciones[2],
    ]
    const result = validateContentByKey('soluciones', bad)
    expect(result.ok).toBe(false)
  })

  it('rejects an unknown content key at the type level', () => {
    // @ts-expect-error — deliberately passing an invalid key to prove the schema map is exhaustive
    expect(() => validateContentByKey('packages', [])).toThrow()
  })
})
