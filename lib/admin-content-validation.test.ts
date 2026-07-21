import { describe, expect, it } from 'vitest'
import { validateContentByKey } from './admin-content-validation'
import { DEFAULT_SITE_CONTENT } from './site-content'

describe('validateContentByKey', () => {
  it('accepts the default projects content as-is', () => {
    const result = validateContentByKey('projects', DEFAULT_SITE_CONTENT.projects)
    expect(result.ok).toBe(true)
  })

  it('accepts the default packages content as-is', () => {
    const result = validateContentByKey('packages', DEFAULT_SITE_CONTENT.packages)
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

  it('rejects a package with a negative price', () => {
    const bad = [
      {
        ...DEFAULT_SITE_CONTENT.packages[0],
        priceUsd: -1,
      },
    ]
    const result = validateContentByKey('packages', bad)
    expect(result.ok).toBe(false)
  })

  it('rejects an unknown content key at the type level', () => {
    // @ts-expect-error — deliberately passing an invalid key to prove the schema map is exhaustive
    expect(() => validateContentByKey('soluciones', [])).toThrow()
  })
})
