import { describe, expect, it } from 'vitest'
import { validateContentByKey } from './admin-content-validation'
import { DEFAULT_SITE_CONTENT } from './site-content'

describe('validateContentByKey', () => {
  it('accepts the default projects content as-is', () => {
    const result = validateContentByKey('projects', DEFAULT_SITE_CONTENT.projects)
    expect(result.ok).toBe(true)
  })

  it('accepts the default soluciones content as-is', () => {
    const result = validateContentByKey('soluciones', DEFAULT_SITE_CONTENT.soluciones)
    expect(result.ok).toBe(true)
  })

  it('accepts the default about content as-is', () => {
    const result = validateContentByKey('about', DEFAULT_SITE_CONTENT.about)
    expect(result.ok).toBe(true)
  })

  it('rejects a project with an invalid id (path traversal / injection-shaped)', () => {
    const bad = [
      {
        ...DEFAULT_SITE_CONTENT.projects[0],
        id: '../../etc/passwd',
      },
    ]
    const result = validateContentByKey('projects', bad)
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
