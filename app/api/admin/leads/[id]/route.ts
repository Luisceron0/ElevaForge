import { NextRequest, NextResponse } from 'next/server'
import { hasActiveAdminSessionInRequest } from '@/lib/security/admin-access'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { runApiGuard } from '@/lib/security/api-guard'

const ALLOWED_STATUS = new Set(['pending', 'sent', 'failed'])

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await hasActiveAdminSessionInRequest(request))) {
    return unauthorized()
  }

  const guard = await runApiGuard(request, {
    maxBodyBytes: 2_048,
    rateLimitMax: 30,
    rateLimitWindowMs: 60_000,
  })
  if (guard.blocked) return guard.response

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
