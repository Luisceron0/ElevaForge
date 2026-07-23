import { describe, it, expect, vi, beforeAll } from 'vitest'

// Audit finding lock-in: when Upstash is configured but its network call
// fails (outage/timeout), checkRateLimit must NOT throw — a thrown error
// here would 500 /api/contact and, via proxy.ts, break /api/admin/login
// entirely. It must degrade to the in-memory limiter instead.
//
// We force the Upstash path (mock Redis so getRedis() returns truthy) and
// make the limiter throw, then assert checkRateLimit still resolves.
vi.mock('@upstash/redis', () => ({
  Redis: class {
    // no-op client
  },
}))

vi.mock('@upstash/ratelimit', () => ({
  Ratelimit: class {
    static slidingWindow() {
      return {}
    }
    limit() {
      throw new Error('simulated upstash outage')
    }
  },
}))

describe('checkRateLimit — fail-open on Upstash outage', () => {
  beforeAll(() => {
    vi.stubEnv('UPSTASH_REDIS_REST_URL', 'https://fake.upstash.io')
    vi.stubEnv('UPSTASH_REDIS_REST_TOKEN', 'fake-token')
  })

  it('does not throw and returns a usable result when the Upstash call fails', async () => {
    const { checkRateLimit } = await import('./rate-limit')
    const key = `failopen-${Math.random()}`

    // Upstash throws internally → must fall back to the in-memory limiter,
    // which allows the first request.
    const result = await checkRateLimit(key, { maxRequests: 2, windowMs: 60_000 })
    expect(result.allowed).toBe(true)
    expect(typeof result.resetMs).toBe('number')
  })
})
