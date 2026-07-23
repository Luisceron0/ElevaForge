import { describe, expect, it, vi, afterEach } from 'vitest'
import { validateOrigin } from './csrf'

// csrf.ts reads NEXT_PUBLIC_SITE_URL into a module-level const at import
// time (falls back to https://elevaforge.com), so these tests rely on that
// default rather than stubbing the env var per-test.
const SITE_ORIGIN = 'https://elevaforge.com'

function makeRequest(headers: Record<string, string>): Request {
  return {
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
  } as unknown as Request
}

describe('validateOrigin', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('always passes in development, regardless of headers', () => {
    vi.stubEnv('NODE_ENV', 'development')
    const req = makeRequest({})
    expect(validateOrigin(req).valid).toBe(true)
  })

  it('accepts a request whose Origin matches the configured site URL', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const req = makeRequest({ origin: SITE_ORIGIN })
    expect(validateOrigin(req).valid).toBe(true)
  })

  it('accepts the www variant of the configured origin', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const req = makeRequest({ origin: 'https://www.elevaforge.com' })
    expect(validateOrigin(req).valid).toBe(true)
  })

  it('rejects a request from an attacker-controlled Origin (CSRF)', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const req = makeRequest({ origin: 'https://evil.example.com' })
    expect(validateOrigin(req).valid).toBe(false)
  })

  it('rejects a request with neither Origin nor Referer', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const req = makeRequest({})
    expect(validateOrigin(req).valid).toBe(false)
  })

  it('falls back to Referer when Origin is absent', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const req = makeRequest({ referer: `${SITE_ORIGIN}/contacto` })
    expect(validateOrigin(req).valid).toBe(true)
  })
})
