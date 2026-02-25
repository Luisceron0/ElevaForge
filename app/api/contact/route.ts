import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'

function sanitizeInput(value: any): string {
  if (!value) return ''
  return String(value).replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

/**
 * Insert lead as 'pending' in Supabase outbox table (leads) and return quickly.
 * A separate worker will process pending leads and notify Discord.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot check
    if (body._hp && String(body._hp).length > 0) {
      return NextResponse.json({ success: true, message: 'Mensaje recibido' })
    }

    const nombre = sanitizeInput(body.nombre)
    const email = sanitizeInput(body.email)
    const presupuesto = sanitizeInput(body.presupuesto)
    const contacto_pref = sanitizeInput(body.contacto_pref) || 'email'

    if (!nombre || nombre.length < 2) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 })
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
    }

    const supabase = createServerSupabaseClient()

    // Store a lightweight record only
    const insertData = {
      nombre,
      email,
      contacto_pref,
      presupuesto,
      consent: body.consent === true,
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
    console.error('Contact API error:', err)
    return NextResponse.json({ error: 'Error interno al procesar lead' }, { status: 500 })
  }
}
