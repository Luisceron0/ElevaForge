import { NextRequest, NextResponse } from 'next/server'
import { hasActiveAdminSessionInRequest } from '@/lib/security/admin-access'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { runApiGuard } from '@/lib/security/api-guard'

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await hasActiveAdminSessionInRequest(request))) {
    return unauthorized()
  }

  const guard = await runApiGuard(request, {
    maxBodyBytes: 2_048,
    rateLimitMax: 20,
    rateLimitWindowMs: 60_000,
  })
  if (guard.blocked) return guard.response

  const { id } = await context.params
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

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
