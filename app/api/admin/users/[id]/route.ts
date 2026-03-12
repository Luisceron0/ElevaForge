import { NextRequest, NextResponse } from 'next/server'
import { hasAdminSessionInRequest } from '@/lib/security/admin-session'
import { createServerSupabaseClient } from '@/lib/supabase/server'

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

  const record = body as Record<string, unknown>
  const isActive = Boolean(record.is_active)

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('admin_users')
    .update({ is_active: isActive })
    .eq('id', id)
    .select('id,username,is_active,created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: 'No se pudo actualizar el administrador' }, { status: 500 })
  }

  return NextResponse.json({ row: data })
}
