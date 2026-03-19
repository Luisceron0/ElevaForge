/**
 * In-memory sliding-window rate limiter.
 *
 * OWASP A01:2025 — Broken Access Control (automated attacks)
 * OWASP A06:2025 — Insecure Design (bot protection)
 * OWASP A07:2025 — Authentication Failures (brute force)
 *
 * NOTE: This is per-instance (per Lambda / serverless cold-start).
 * It mitigates bursts from a single instance; for global rate limiting
 * across multiple instances use an external store (Redis, Upstash, etc.).
 *
 * The implementation is intentionally simple — Map-based with automatic
 * cleanup to avoid memory leaks in long-lived processes.
 */

interface RateLimitEntry {
  /** Timestamps of requests within the current window. */
  timestamps: number[]
}

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

const store = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes to prevent memory leaks (A10)
const CLEANUP_INTERVAL = 5 * 60_000
let lastCleanup = Date.now()

function cleanup(windowMs: number): void {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL) return
  lastCleanup = now
  const cutoff = now - windowMs
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff)
    if (entry.timestamps.length === 0) store.delete(key)
  }
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetMs: number
}

/**
 * Check and consume a rate-limit token for the given key (usually IP).
 * Returns whether the request is allowed.
 */
export function checkRateLimit(
  key: string,
  options: Partial<RateLimiterOptions> = {},
): RateLimitResult {
  const { maxRequests, windowMs } = { ...DEFAULT_OPTIONS, ...options }
  const now = Date.now()

  cleanup(windowMs)

  let entry = store.get(key)
  if (!entry) {
    entry = { timestamps: [] }
    store.set(key, entry)
  }

  // Remove timestamps outside of current window
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
