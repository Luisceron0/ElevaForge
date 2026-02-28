import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { leadSchema } from '@/lib/validations'
import { runApiGuard } from '@/lib/security/api-guard'
import { logSecurityEvent } from '@/lib/security/logger'

/**
 * Insert lead as 'pending' in Supabase outbox table (leads) and return quickly.
 * A separate worker will process pending leads and notify Discord.
 *
 * OWASP defences applied:
 *  A01 — CSRF origin check (via api-guard), deny-by-default (only POST)
 *  A02 — Content-Type enforcement, no internal details in responses
 *  A05 — Zod schema validation (parameterised Supabase SDK prevents SQLi)
 *  A06 — Rate limiting, honeypot anti-bot
 *  A09 — Structured security event logging on every rejection
 *  A10 — Fail-closed try/catch, safe error messages, malformed-body guard
 */
export async function POST(request: NextRequest) {
  // ── Security guard: CSRF + rate-limit + content-type + size ────────
  const guard = await runApiGuard(request, {
    maxBodyBytes: 4_096,
    rateLimitMax: 5,
    rateLimitWindowMs: 60_000,
  })
  if (guard.blocked) return guard.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    // Malformed JSON — fail closed (A10)
    logSecurityEvent({
      type: 'MALFORMED_BODY',
      ip: guard.ip,
      path: '/api/contact',
      method: 'POST',
    })
    return NextResponse.json(
      { error: 'Cuerpo de solicitud inválido' },
      { status: 400 },
    )
  }

  try {
    const record = body as Record<string, unknown>

    // A06: Honeypot — bots auto-fill hidden field; silently accept to not reveal the trap
    if (record._hp && String(record._hp).length > 0) {
      logSecurityEvent({
        type: 'HONEYPOT_TRIGGERED',
        ip: guard.ip,
        path: '/api/contact',
        method: 'POST',
      })
      return NextResponse.json({ success: true, message: 'Mensaje recibido' })
    }

    // A05: Validate & sanitise with Zod schema (injection prevention)
    const parsed = leadSchema.safeParse({
      nombre: record.nombre,
      email: record.email,
      empresa: record.empresa,
      mensaje: record.mensaje,
    })

    if (!parsed.success) {
      logSecurityEvent({
        type: 'VALIDATION_FAILURE',
        ip: guard.ip,
        path: '/api/contact',
        method: 'POST',
        details: parsed.error.issues.map((i) => i.message).join('; '),
      })
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' },
        { status: 400 },
      )
    }

    // Extra fields validated manually (not part of the base lead schema)
    const contacto_pref = ['email', 'telefono'].includes(String(record.contacto_pref ?? ''))
      ? String(record.contacto_pref)
      : 'email'
    const presupuesto = String(record.presupuesto ?? '').slice(0, 64).replace(/[\u0000-\u001F\u007F]/g, '').trim()

    const supabase = createServerSupabaseClient()

    const insertData = {
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      contacto_pref,
      presupuesto,
      consent: record.consent === true,
      origen: 'web-contact-form',
      status: 'pending',
      attempts: 0,
    }

    const { data, error } = await supabase.from('leads').insert([insertData]).select('id').single()
    if (error) {
      // Log internally but NEVER expose DB error details to user (A02, A10)
      console.error('Supabase insert error (contact outbox):', error)
      return NextResponse.json({ error: 'Error al guardar el lead' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, message: 'Lead recibido', id: data?.id },
      { status: 202 },
    )
  } catch (err) {
    // Global catch — fail closed, generic message (A10)
    logSecurityEvent({
      type: 'UNHANDLED_ERROR',
      ip: guard.ip,
      path: '/api/contact',
      method: 'POST',
      details: err instanceof Error ? err.message : 'unknown',
    })
    console.error('Contact API error:', err)
    return NextResponse.json(
      { error: 'Error interno al procesar solicitud' },
      { status: 500 },
    )
  }
}

/** A01: Deny by default — only POST is allowed */
export async function GET() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405, headers: { Allow: 'POST' } },
  )
}
export async function PUT() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405, headers: { Allow: 'POST' } },
  )
}
export async function DELETE() {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405, headers: { Allow: 'POST' } },
  )
}
