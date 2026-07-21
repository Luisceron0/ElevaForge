import { describe, expect, it } from 'vitest'
import { checkRateLimit } from './rate-limit'

// No UPSTASH_REDIS_REST_URL/TOKEN are set in the test environment, so these
// exercise the in-memory fallback path deterministically.

describe('checkRateLimit (in-memory fallback)', () => {
  it('allows requests up to the configured max', async () => {
    const key = `test-key-${Math.random()}`
    for (let i = 0; i < 3; i++) {
      const result = await checkRateLimit(key, { maxRequests: 3, windowMs: 60_000 })
      expect(result.allowed).toBe(true)
    }
  })

  it('blocks the request once the max is exceeded within the window', async () => {
    const key = `test-key-${Math.random()}`
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(key, { maxRequests: 5, windowMs: 60_000 })
    }
    const result = await checkRateLimit(key, { maxRequests: 5, windowMs: 60_000 })
    expect(result.allowed).toBe(false)
    expect(result.remaining).toBe(0)
  })

  it('tracks distinct keys independently', async () => {
    const keyA = `a-${Math.random()}`
    const keyB = `b-${Math.random()}`
    for (let i = 0; i < 5; i++) {
      await checkRateLimit(keyA, { maxRequests: 5, windowMs: 60_000 })
    }
    const blockedA = await checkRateLimit(keyA, { maxRequests: 5, windowMs: 60_000 })
    const allowedB = await checkRateLimit(keyB, { maxRequests: 5, windowMs: 60_000 })
    expect(blockedA.allowed).toBe(false)
    expect(allowedB.allowed).toBe(true)
  })
})
