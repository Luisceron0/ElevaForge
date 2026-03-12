import { NextRequest, NextResponse } from 'next/server'
import { hasAdminSessionInRequest } from '@/lib/security/admin-session'
import { createServerSupabaseClient } from '@/lib/supabase/server'

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

export async function GET(request: NextRequest) {
  if (!hasAdminSessionInRequest(request)) {
    return unauthorized()
  }

  const search = request.nextUrl.searchParams
  const status = search.get('status')
  const limit = Number(search.get('limit') || '100')
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 500) : 100

  const supabase = createServerSupabaseClient()
  let query = supabase
    .from('leads')
    .select('id,nombre,email,empresa,mensaje,telefono,contacto_pref,presupuesto,servicio,consent,origen,status,attempts,created_at')
    .order('created_at', { ascending: false })
    .limit(safeLimit)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'No se pudieron cargar los leads' }, { status: 500 })
  }

  return NextResponse.json({ rows: data ?? [] })
}
