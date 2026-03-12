import { NextRequest, NextResponse } from 'next/server'
import { hasAdminSessionInRequest } from '@/lib/security/admin-session'
import { createServerSupabaseClient } from '@/lib/supabase/server'

const ALLOWED_STATUS = new Set(['pending', 'sent', 'failed'])

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!hasAdminSessionInRequest(request)) {
    return unauthorized()
  }

  const { id } = await context.params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const status = String((body as Record<string, unknown>).status ?? '')
  if (!ALLOWED_STATUS.has(status)) {
    return NextResponse.json({ error: 'Estado inválido' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('leads')
    .update({ status })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'No se pudo actualizar el lead' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
