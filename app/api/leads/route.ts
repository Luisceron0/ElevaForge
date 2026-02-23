import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { leadSchema } from '@/lib/validations'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = leadSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()
    const { error } = await supabase
      .from('leads')
      .insert({ ...parsed.data, origen: 'landing_elevaforge' })

    if (error) throw error

    return NextResponse.json(
      { success: true, message: 'Lead registrado correctamente' },
      { status: 201 }
    )
  } catch (err) {
    console.error('Error al guardar lead:', err)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
