/**
 * Leads API Route — DEPRECATED
 *
 * All lead submissions now go through /api/contact (lightweight outbox pattern).
 * This route returns a 308 redirect for GET and performs the same logic inline
 * for POST, avoiding a self-fetch that would double Vercel function invocations.
 *
 * OWASP: Uses the shared api-guard (CSRF, rate-limit, content-type, size).
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { leadSchema } from '@/lib/validations'
import { runApiGuard } from '@/lib/security/api-guard'
import { logSecurityEvent } from '@/lib/security/logger'

export async function POST(request: NextRequest) {
  // Same guard as /api/contact — single invocation, no self-fetch
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
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })
  }

  try {
    const record = body as Record<string, unknown>

    if (record._hp && String(record._hp).length > 0) {
      logSecurityEvent({ type: 'HONEYPOT_TRIGGERED', ip: guard.ip, path: '/api/leads', method: 'POST' })
      return NextResponse.json({ success: true, message: 'Mensaje recibido' })
    }

    const parsed = leadSchema.safeParse({
      nombre: record.nombre,
      email: record.email,
      empresa: record.empresa,
      mensaje: record.mensaje,
      telefono: record.telefono,
      contacto_pref: record.contacto_pref,
      presupuesto: record.presupuesto,
      servicio: record.servicio,
      consent: record.consent === true,
    })

    if (!parsed.success) {
      logSecurityEvent({
        type: 'VALIDATION_FAILURE',
        ip: guard.ip,
        path: '/api/leads',
        method: 'POST',
        details: parsed.error.issues.map((i) => i.message).join('; '),
      })
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Datos inválidos' },
        { status: 400 },
      )
    }

    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from('leads')
      .insert([{
        nombre: parsed.data.nombre,
        email: parsed.data.email,
        empresa: parsed.data.empresa || null,
        mensaje: parsed.data.mensaje || null,
        telefono: parsed.data.telefono || null,
        contacto_pref: parsed.data.contacto_pref,
        presupuesto: parsed.data.presupuesto || null,
        servicio: parsed.data.servicio || null,
        consent: parsed.data.consent,
        origen: 'web-leads-form',
        status: 'pending',
        attempts: 0,
      }])
      .select('id')
      .single()

    if (error) {
      console.error('Supabase insert error (leads):', error)
      return NextResponse.json({ error: 'Error al guardar el lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Lead recibido', id: data?.id }, { status: 202 })
  } catch (err) {
    logSecurityEvent({
      type: 'UNHANDLED_ERROR',
      ip: guard.ip,
      path: '/api/leads',
      method: 'POST',
      details: err instanceof Error ? err.message : 'unknown',
    })
    console.error('Leads API error:', err)
    return NextResponse.json({ error: 'Error interno al procesar solicitud' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  const redirectUrl = new URL('/api/contact', req.url)
  return NextResponse.redirect(redirectUrl, 308)
}
