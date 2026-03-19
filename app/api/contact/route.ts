import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { leadSchema } from '@/lib/validations'
import { runApiGuard } from '@/lib/security/api-guard'
import { logSecurityEvent } from '@/lib/security/logger'

/**
 * Insert lead as 'pending' in Supabase outbox table (leads) and return quickly.
 * A separate worker will process pending leads and notify Discord.
 */
export async function POST(request: NextRequest) {
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
    logSecurityEvent({
      type: 'MALFORMED_BODY',
      ip: guard.ip,
      path: '/api/contact',
      method: 'POST',
    })
    return NextResponse.json({ error: 'Cuerpo de solicitud inválido' }, { status: 400 })
  }

  try {
    const record = body as Record<string, unknown>

    // Honeypot — silently accept if triggered
    if (record._hp && String(record._hp).length > 0) {
      logSecurityEvent({ type: 'HONEYPOT_TRIGGERED', ip: guard.ip, path: '/api/contact', method: 'POST' })
      return NextResponse.json({ success: true, message: 'Mensaje recibido' })
    }

    // Validate incoming payload
    const parsed = leadSchema.safeParse({
      nombre: record.nombre,
      email: record.email,
      telefono: record.telefono,
      empresa: record.empresa,
      mensaje: record.mensaje,
      servicio: record.servicio,
      presupuesto: record.presupuesto,
      contacto_pref: record.contacto_pref,
      consent: record.consent === true,
    })

    if (!parsed.success) {
      logSecurityEvent({
        type: 'VALIDATION_FAILURE',
        ip: guard.ip,
        path: '/api/contact',
        method: 'POST',
        details: parsed.error.issues.map((i) => i.message).join('; '),
      })
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Datos inválidos' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    const insertData = {
      nombre: parsed.data.nombre,
      email: parsed.data.email,
      telefono: parsed.data.telefono || null,
      empresa: parsed.data.empresa || null,
      mensaje: parsed.data.mensaje || null,
      servicio: parsed.data.servicio || null,
      contacto_pref: parsed.data.contacto_pref || null,
      presupuesto: parsed.data.presupuesto || null,
      consent: parsed.data.consent === true,
      origen: 'web-contact-form',
      status: 'pending',
      attempts: 0,
    }

    const { data, error } = await supabase.from('leads').insert([insertData]).select('id').single()
    if (error) {
      console.error('Supabase insert error (contact outbox):', error)
      return NextResponse.json({ error: 'Error al guardar el lead' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Lead recibido', id: data?.id }, { status: 202 })
  } catch (err) {
    logSecurityEvent({
      type: 'UNHANDLED_ERROR',
      ip: guard.ip,
      path: '/api/contact',
      method: 'POST',
      details: err instanceof Error ? err.message : 'unknown',
    })
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Error interno al procesar solicitud' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405, headers: { Allow: 'POST' } })
}
export async function PUT() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405, headers: { Allow: 'POST' } })
}
export async function DELETE() {
  return NextResponse.json({ error: 'Método no permitido' }, { status: 405, headers: { Allow: 'POST' } })
}
