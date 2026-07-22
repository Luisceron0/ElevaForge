/**
 * Sliding-window rate limiter with a shared-store backend (RNF-SEC-01 / F-01).
 *
 * OWASP A01:2025 — Broken Access Control (automated attacks)
 * OWASP A06:2025 — Insecure Design (bot protection)
 * OWASP A07:2025 — Authentication Failures (brute force)
 *
 * Backed by Upstash Redis (REST-based, works in both Edge and Node runtimes)
 * when `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` are configured,
 * so limits are enforced across all serverless instances — not just the one
 * that happened to handle a given request.
 *
 * Falls back to the previous in-memory, per-instance limiter when Upstash is
 * not configured (e.g. local development) so nothing breaks without it, but
 * logs a loud one-time warning in production since that fallback is
 * decorative under multi-instance load.
 */

import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

interface RateLimiterOptions {
  /** Maximum number of requests allowed in the window. */
  maxRequests: number
  /** Window size in milliseconds. */
  windowMs: number
}

const DEFAULT_OPTIONS: RateLimiterOptions = {
  maxRequests: 5,
  windowMs: 60_000, // 1 minute
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetMs: number
}

// ── Shared backend (Upstash Redis) ───────────────────────────────────────

function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

const redis = getRedis()
const limiters = new Map<string, Ratelimit>()

function getLimiter(options: RateLimiterOptions): Ratelimit {
  const cacheKey = `${options.maxRequests}:${options.windowMs}`
  let limiter = limiters.get(cacheKey)
  if (!limiter) {
    limiter = new Ratelimit({
      redis: redis as Redis,
      limiter: Ratelimit.slidingWindow(options.maxRequests, `${options.windowMs} ms`),
      analytics: false,
      prefix: 'ef-ratelimit',
    })
    limiters.set(cacheKey, limiter)
  }
  return limiter
}

let warnedNoSharedStore = false
function warnNoSharedStoreOnce(): void {
  if (warnedNoSharedStore) return
  warnedNoSharedStore = true
  if (process.env.NODE_ENV === 'production') {
    console.warn(
      JSON.stringify({
        level: 'SECURITY',
        ts: new Date().toISOString(),
        type: 'RATE_LIMIT_NOT_SHARED',
        details:
          'UPSTASH_REDIS_REST_URL/UPSTASH_REDIS_REST_TOKEN not configured — falling back to per-instance in-memory rate limiting in production',
      }),
    )
  }
}

let warnedUpstashFailure = false
function warnUpstashFailureOnce(err: unknown): void {
  if (warnedUpstashFailure) return
  warnedUpstashFailure = true
  console.warn(
    JSON.stringify({
      level: 'SECURITY',
      ts: new Date().toISOString(),
      type: 'RATE_LIMIT_STORE_UNAVAILABLE',
      details: `Upstash rate-limit call failed; degrading to in-memory limiter. ${err instanceof Error ? err.message : 'unknown'}`,
    }),
  )
}

// ── Fallback backend (in-memory, per-instance) ───────────────────────────

interface RateLimitEntry {
  timestamps: number[]
}

const memoryStore = new Map<string, RateLimitEntry>()

const CLEANUP_INTERVAL = 5 * 60_000
let lastCleanup = Date.now()

function cleanupMemoryStore(windowMs: number): void {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  const cutoff = now - windowMs
  for (const [key, entry] of memoryStore.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff)
    if (entry.timestamps.length === 0) memoryStore.delete(key)
  }
}

function checkRateLimitInMemory(key: string, options: RateLimiterOptions): RateLimitResult {
  const { maxRequests, windowMs } = options
  const now = Date.now()

  cleanupMemoryStore(windowMs)

  let entry = memoryStore.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    memoryStore.set(key, entry)
  }

  const cutoff = now - windowMs
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff)

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0]
    return {
      allowed: false,
      remaining: 0,
      resetMs: oldestInWindow + windowMs - now,
    }
  }

  entry.timestamps.push(now)
  return {
    allowed: true,
    remaining: maxRequests - entry.timestamps.length,
    resetMs: windowMs,
  }
}

// ── Public API ────────────────────────────────────────────────────────────

/**
 * Check and consume a rate-limit token for the given key (usually IP, or
 * `${ip}:${path}`). Returns whether the request is allowed.
 */
export async function checkRateLimit(
  key: string,
  options: Partial<RateLimiterOptions> = {},
): Promise<RateLimitResult> {
  const resolvedOptions = { ...DEFAULT_OPTIONS, ...options }

  if (redis) {
    try {
      const limiter = getLimiter(resolvedOptions)
      const result = await limiter.limit(key)
      return {
        allowed: result.success,
        remaining: result.remaining,
        resetMs: Math.max(0, result.reset - Date.now()),
      }
    } catch (err) {
      // Upstash outage/timeout must NOT take down the request (a thrown
      // error here would 500 /api/contact and, via proxy.ts, break
      // /api/admin/login entirely). Degrade to the in-memory limiter so the
      // site stays up AND retains per-instance protection.
      warnUpstashFailureOnce(err)
      return checkRateLimitInMemory(key, resolvedOptions)
    }
  }

  warnNoSharedStoreOnce()
  return checkRateLimitInMemory(key, resolvedOptions)
}
