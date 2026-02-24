/**
 * Leads API Route — Handles lead submission to Supabase
 *
 * Frontend ContactForm sends leads to this endpoint,
 * which validates and stores them in Supabase.
 */

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { LeadInsert } from '@/types/lead'

// Simple email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Sanitize input - strip control characters
function sanitizeInput(value: string | undefined): string {
  if (!value) return ''
  return value.replace(/[\u0000-\u001F\u007F]/g, '').trim()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Honeypot check - if filled, it's a bot
    if (body._hp && body._hp.length > 0) {
      // Return success to not alert bot, but don't save
      return NextResponse.json({ success: true, message: 'Mensaje recibido' })
    }

    // Validate required fields
    const nombre = sanitizeInput(body.nombre)
    const email = sanitizeInput(body.email)

    if (!nombre || nombre.length < 2) {
      return NextResponse.json(
        { error: 'El nombre es requerido (mínimo 2 caracteres)' },
        { status: 400 }
      )
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Prepare lead data
    const leadData: LeadInsert = {
      nombre,
      email,
      empresa: sanitizeInput(body.empresa).slice(0, 100),
      mensaje: sanitizeInput(body.mensaje).slice(0, 500),
      telefono: sanitizeInput(body.telefono).slice(0, 32),
      contacto_pref: sanitizeInput(body.contacto_pref).slice(0, 16) || 'email',
      presupuesto: sanitizeInput(body.presupuesto).slice(0, 64),
      servicio: sanitizeInput(body.servicio).slice(0, 64),
      utm_source: sanitizeInput(body.utm_source).slice(0, 100),
      utm_medium: sanitizeInput(body.utm_medium).slice(0, 100),
      utm_campaign: sanitizeInput(body.utm_campaign).slice(0, 100),
      consent: body.consent === true,
      origen: 'web-contact-form',
    }

    // Insert into Supabase
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('leads')
      .insert([leadData])
      .select('id')
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Error al guardar el lead' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Lead guardado correctamente',
      id: data?.id,
    })
  } catch (err) {
    console.error('API leads error:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Este endpoint solo acepta POST requests' },
    { status: 405 }
  )
}