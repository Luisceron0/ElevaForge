import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { leadSchema } from '@/lib/validations'
import { validateOrigin } from '@/lib/security/csrf'
import { logSecurityEvent } from '@/lib/security/logger'

/** Strip control characters and HTML-like chars from a string (A05 — Injection) */
function sanitize(value: string): string {
  return value.replace(/[\u0000-\u001F\u007F<>&"']/g, '').trim()
}

/** Max allowed body size in bytes (8 KB) */
const MAX_BODY_SIZE = 8192

/** Extract client IP from request headers */
function getClientIP(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req)
  const path = '/api/leads'

  try {
    // ── A01: CSRF Protection via Origin header validation ──
    const csrf = validateOrigin(req)
    if (!csrf.valid) {
      logSecurityEvent({ type: 'CSRF_VIOLATION', ip, path, method: 'POST', details: csrf.reason })
      return NextResponse.json(
        { error: 'Solicitud no autorizada' },
        { status: 403 }
      )
    }

    // ── A02: Validate Content-Type (Security Misconfiguration) ──
    const contentType = req.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      logSecurityEvent({ type: 'INVALID_CONTENT_TYPE', ip, path, method: 'POST' })
      return NextResponse.json(
        { error: 'Content-Type debe ser application/json' },
        { status: 415 }
      )
    }

    // ── A10: Validate body size to prevent resource exhaustion ──
    const contentLength = req.headers.get('content-length')
    if (contentLength && parseInt(contentLength, 10) > MAX_BODY_SIZE) {
      logSecurityEvent({ type: 'OVERSIZED_PAYLOAD', ip, path, method: 'POST' })
      return NextResponse.json(
        { error: 'El cuerpo de la solicitud es demasiado grande' },
        { status: 413 }
      )
    }

    // ── A10: Parse body safely — fail closed on malformed JSON ──
    let body: unknown
    try {
      body = await req.json()
    } catch {
      logSecurityEvent({ type: 'MALFORMED_BODY', ip, path, method: 'POST' })
      return NextResponse.json(
        { error: 'JSON inválido' },
        { status: 400 }
      )
    }

    // ── A06: Honeypot — anti-bot invisible field ──
    // If the hidden field has a value, a bot filled it. Silently accept to avoid alerting.
    const rawBody = body as Record<string, unknown>
    if (rawBody._hp) {
      logSecurityEvent({ type: 'HONEYPOT_TRIGGERED', ip, path, method: 'POST' })
      return NextResponse.json(
        { success: true, message: 'Lead registrado correctamente' },
        { status: 201 }
      )
    }

    // Remove honeypot field before Zod validation
    const { _hp: _honeypot, ...formData } = rawBody

    // ── A05: Server-side validation (Injection prevention) ──
    const parsed = leadSchema.safeParse(formData)
    if (!parsed.success) {
      logSecurityEvent({ type: 'VALIDATION_FAILURE', ip, path, method: 'POST' })
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    // ── A05: Sanitize all string fields — origen is server-controlled only ──
    const sanitizedData = {
      nombre: sanitize(parsed.data.nombre),
      email: sanitize(parsed.data.email).toLowerCase(),
      empresa: parsed.data.empresa ? sanitize(parsed.data.empresa) : undefined,
      mensaje: parsed.data.mensaje ? sanitize(parsed.data.mensaje).slice(0, 500) : undefined,
      origen: 'landing_elevaforge',
    }

    // ── A10: Fail closed — if DB insert fails, no partial state ──
    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('leads')
      .insert(sanitizedData)

    if (error) throw error

    return NextResponse.json(
      { success: true, message: 'Lead registrado correctamente' },
      { status: 201 }
    )
  } catch (err) {
    // ── A09: Log securely — never expose internals to the client ──
    logSecurityEvent({ type: 'UNHANDLED_ERROR', ip, path, method: 'POST', details: 'DB or runtime error' })
    if (process.env.NODE_ENV === 'development') {
      console.error('Error al guardar lead:', err)
    }
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/** A01: Deny by default — block all non-POST methods with 405 */
export async function GET() { return methodNotAllowed() }
export async function PUT() { return methodNotAllowed() }
export async function DELETE() { return methodNotAllowed() }
export async function PATCH() { return methodNotAllowed() }

function methodNotAllowed() {
  return new NextResponse(null, {
    status: 405,
    headers: { Allow: 'POST' },
  })
}