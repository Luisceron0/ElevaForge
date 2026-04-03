/**
 * Shared API security guard — enforces common defences for public POST routes.
 *
 * OWASP coverage:
 *  A01 — CSRF origin check, deny-by-default method enforcement
 *  A02 — Content-Type validation, no info leakage
 *  A05 — Payload size cap to prevent oversized bodies
 *  A06 — Rate limiting per IP
 *  A09 — Structured security logging of every rejection
 *  A10 — Fail-closed on any guard failure
 *
 * Usage:
 *   const guard = await runApiGuard(request, { maxBodyBytes: 4096 })
 *   if (guard.blocked) return guard.response
 *   // proceed with guard.ip available for logging
 */

import { NextRequest, NextResponse } from 'next/server'
import { validateOrigin } from '@/lib/security/csrf'
import { checkRateLimit } from '@/lib/security/rate-limit'
import { logSecurityEvent } from '@/lib/security/logger'

export interface GuardOptions {
  /** Maximum body size in bytes (default 8 KB). */
  maxBodyBytes?: number
  /** Rate-limit: max requests per window (default 5). */
  rateLimitMax?: number
  /** Rate-limit: window in ms (default 60 000 = 1 min). */
  rateLimitWindowMs?: number
}

export interface GuardResult {
  blocked: boolean
  response: NextResponse
  ip: string
}

const JSON_TYPE = 'application/json'

function shouldValidateJsonContentType(request: NextRequest): boolean {
  const method = request.method.toUpperCase()
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    return true
  }

  if (method === 'DELETE') {
    const contentLengthRaw = request.headers.get('content-length')
    const contentLength = Number(contentLengthRaw ?? '0')
    const hasChunkedBody = !!request.headers.get('transfer-encoding')
    return (Number.isFinite(contentLength) && contentLength > 0) || hasChunkedBody
  }

  return false
}

/**
 * Extract client IP from standard headers.
 * Vercel / Cloudflare / Nginx all populate one of these.
 */
function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function runApiGuard(
  request: NextRequest,
  options: GuardOptions = {},
): Promise<GuardResult> {
  const {
    maxBodyBytes = 8_192,
    rateLimitMax = 5,
    rateLimitWindowMs = 60_000,
  } = options

  const ip = getClientIp(request)
  const path = request.nextUrl.pathname

  // ── 1. Content-Type check (A02, A10) ───────────────────────────────
  const ct = request.headers.get('content-type') ?? ''
  if (shouldValidateJsonContentType(request) && !ct.includes(JSON_TYPE)) {
    logSecurityEvent({ type: 'INVALID_CONTENT_TYPE', ip, path, method: request.method, details: ct })
    return {
      blocked: true,
      response: NextResponse.json(
        { error: 'Content-Type debe ser application/json' },
        { status: 415 },
      ),
      ip,
    }
  }

  // ── 2. Payload size check (A05, A10) ───────────────────────────────
  const contentLengthRaw = request.headers.get('content-length')
  const contentLength = Number(contentLengthRaw ?? '0')
  if (Number.isFinite(contentLength) && contentLength > maxBodyBytes) {
    logSecurityEvent({ type: 'OVERSIZED_PAYLOAD', ip, path, method: request.method, details: `${contentLength} bytes` })
    return {
      blocked: true,
      response: NextResponse.json(
        { error: 'Payload demasiado grande' },
        { status: 413 },
      ),
      ip,
    }
  }

  // Fallback for chunked requests or missing/invalid Content-Length.
  if (!contentLengthRaw || !Number.isFinite(contentLength) || contentLength <= 0) {
    try {
      const preview = await request.clone().text()
      const bytes = new TextEncoder().encode(preview).length
      if (bytes > maxBodyBytes) {
        logSecurityEvent({ type: 'OVERSIZED_PAYLOAD', ip, path, method: request.method, details: `${bytes} bytes (measured)` })
        return {
          blocked: true,
          response: NextResponse.json(
            { error: 'Payload demasiado grande' },
            { status: 413 },
          ),
          ip,
        }
      }
    } catch {
      logSecurityEvent({ type: 'MALFORMED_BODY', ip, path, method: request.method, details: 'Body preview failed in guard' })
      return {
        blocked: true,
        response: NextResponse.json(
          { error: 'Cuerpo de solicitud inválido' },
          { status: 400 },
        ),
        ip,
      }
    }
  }

  // ── 3. CSRF / Origin validation (A01: CWE-352) ────────────────────
  const origin = validateOrigin(request)
  if (!origin.valid) {
    logSecurityEvent({ type: 'CSRF_VIOLATION', ip, path, method: request.method, details: origin.reason })
    return {
      blocked: true,
      response: NextResponse.json(
        { error: 'Solicitud no autorizada' },
        { status: 403 },
      ),
      ip,
    }
  }

  // ── 4. Rate limiting (A01, A06, A07) ───────────────────────────────
  const rl = checkRateLimit(`${ip}:${path}`, {
    maxRequests: rateLimitMax,
    windowMs: rateLimitWindowMs,
  })
  if (!rl.allowed) {
    logSecurityEvent({ type: 'RATE_LIMIT_EXCEEDED', ip, path, method: request.method, details: `retry after ${rl.resetMs}ms` })
    return {
      blocked: true,
      response: NextResponse.json(
        { error: 'Demasiados intentos, intenta más tarde' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil(rl.resetMs / 1000)),
          },
        },
      ),
      ip,
    }
  }

  // ── All checks passed ─────────────────────────────────────────────
  return {
    blocked: false,
    response: NextResponse.next(),
    ip,
  }
}
