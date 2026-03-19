/**
 * Timing-safe authorization for cron/worker endpoints.
 *
 * OWASP A07:2025 — Authentication Failures
 * Uses constant-time comparison to prevent timing side-channel attacks
 * on the CRON_SECRET bearer token.
 *
 * OWASP A09:2025 — Logs failed auth attempts.
 */

import { NextRequest } from 'next/server'
import { logSecurityEvent } from '@/lib/security/logger'

/**
 * Constant-time string comparison to prevent timing attacks (A07).
 * If lengths differ we still compare full `b` length to avoid leaking length info.
 */
function timingSafeEqual(a: string, b: string): boolean {
  const aBytes = new TextEncoder().encode(a)
  const bBytes = new TextEncoder().encode(b)

  // Always compare against the expected length to avoid timing leak on length
  const len = bBytes.length
  let mismatch = aBytes.length !== bBytes.length ? 1 : 0
  for (let i = 0; i < len; i++) {
    mismatch |= (aBytes[i] ?? 0) ^ bBytes[i]
  }
  return mismatch === 0
}

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Verify the request comes from an authorized cron/scheduler.
 * Returns true if authorized, false otherwise (and logs the event).
 */
export function isAuthorizedWorker(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET
  if (!secret) {
    // Fail closed: if secret is not configured, block all requests (A10)
    console.error('[SECURITY] CRON_SECRET not configured — blocking worker request')
    return false
  }

  const header = req.headers.get('authorization') ?? ''
  const prefix = 'Bearer '
  if (!header.startsWith(prefix)) {
    logSecurityEvent({
      type: 'CSRF_VIOLATION',
      ip: getClientIp(req),
      path: req.nextUrl.pathname,
      method: req.method,
      details: 'Missing or malformed Authorization header on worker endpoint',
    })
    return false
  }

  const token = header.slice(prefix.length)
  const valid = timingSafeEqual(token, secret)

  if (!valid) {
    logSecurityEvent({
      type: 'CSRF_VIOLATION',
      ip: getClientIp(req),
      path: req.nextUrl.pathname,
      method: req.method,
      details: 'Invalid CRON_SECRET token',
    })
  }

  return valid
}
