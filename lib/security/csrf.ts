/**
 * CSRF Protection via Origin/Referer header validation.
 *
 * OWASP A01:2025 — Broken Access Control (CWE-352: CSRF)
 *
 * Modern browsers always send the Origin header on cross-origin POST requests
 * and on same-origin fetch() POST requests. Verifying that header matches
 * our known site URL is a lightweight, stateless CSRF mitigation.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elevaforge.com'

export interface OriginCheckResult {
  valid: boolean
  reason?: string
}

export function validateOrigin(request: Request): OriginCheckResult {
  // Skip in development for local testing convenience
  if (process.env.NODE_ENV === 'development') {
    return { valid: true }
  }

  let allowedOrigin: string
  try {
    allowedOrigin = new URL(SITE_URL).origin
  } catch {
    // If SITE_URL is misconfigured, fail closed (A10)
    return { valid: false, reason: 'Server misconfiguration: invalid SITE_URL' }
  }

  // 1. Check Origin header (most reliable — sent by all modern browsers)
  const origin = request.headers.get('origin')
  if (origin) {
    if (origin === allowedOrigin) return { valid: true }
    return { valid: false, reason: `Rejected origin: ${origin}` }
  }

  // 2. Fallback to Referer header (older browsers or privacy-stripping proxies)
  const referer = request.headers.get('referer')
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin
      if (refererOrigin === allowedOrigin) return { valid: true }
      return { valid: false, reason: `Rejected referer origin: ${refererOrigin}` }
    } catch {
      return { valid: false, reason: 'Malformed referer header' }
    }
  }

  // 3. Neither header present — reject (legitimate browsers always send at least one)
  return { valid: false, reason: 'Missing Origin and Referer headers' }
}
