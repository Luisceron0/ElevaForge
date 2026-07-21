/**
 * Trusted client IP resolution (RNF-SEC-01 / F-01).
 *
 * OWASP A01/A06/A07 — Broken Access Control / Insecure Design / Auth Failures.
 *
 * `x-forwarded-for` is attacker-controlled: any client can send an arbitrary
 * value for the header's first hop, which defeats per-IP rate limiting and
 * pollutes security logs. On Vercel, `x-real-ip` is set by the platform's own
 * edge network and cannot be spoofed by the client — that is what
 * `ipAddress()` from `@vercel/functions` reads. `x-vercel-forwarded-for` is
 * the platform-controlled equivalent of XFF (also safe to trust) and is kept
 * as a secondary source before falling back.
 *
 * In non-production environments neither Vercel header exists (no edge in
 * front of `next dev`), so we fall back to the raw headers there purely for
 * local testing convenience — never in production.
 */

import { ipAddress } from '@vercel/functions'

interface HeaderLike {
  get(name: string): string | null
}

interface RequestLike {
  headers: HeaderLike
}

function firstForwardedIp(value: string | null): string | null {
  return value?.split(',')[0]?.trim() || null
}

export function getTrustedClientIp(request: RequestLike): string {
  const vercelIp = ipAddress(request)
  if (vercelIp) return vercelIp

  const vercelForwardedFor = firstForwardedIp(request.headers.get('x-vercel-forwarded-for'))
  if (vercelForwardedFor) return vercelForwardedFor

  if (process.env.NODE_ENV !== 'production') {
    return (
      firstForwardedIp(request.headers.get('x-forwarded-for')) ||
      request.headers.get('x-real-ip') ||
      'unknown'
    )
  }

  return 'unknown'
}
