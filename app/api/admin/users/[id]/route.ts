import { NextRequest, NextResponse } from 'next/server'
import { hasActiveAdminSessionInRequest } from '@/lib/security/admin-access'
import { getAdminCookieName, getSessionUsername, hashAdminPassword } from '@/lib/security/admin-session'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { runApiGuard } from '@/lib/security/api-guard'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401, headers: NO_STORE })
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const USERNAME_RE = /^[a-z0-9._-]+$/

function getSessionUserFromRequest(request: NextRequest): string | null {
  const token = request.cookies.get(getAdminCookieName())?.value
  const username = getSessionUsername(token)
  return username ? username.trim().toLowerCase() : null
}

async function getAdminById(id: string): Promise<{ id: string; username: string; is_active: boolean; created_at: string | null } | null> {
  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('id,username,is_active,created_at')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) return null
  return data
}

async function parseAndValidateId(context: { params: Promise<{ id: string }> }): Promise<{ id: string } | { error: NextResponse }> {
  const { id } = await context.params
  if (!UUID_RE.test(id)) {
    return { error: NextResponse.json({ error: 'ID inválido' }, { status: 400, headers: NO_STORE }) }
  }
  return { id }
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
    rateLimitMax: 20,
    rateLimitWindowMs: 60_000,
  })
  if (guard.blocked) return guard.response

  const idResult = await parseAndValidateId(context)
  if ('error' in idResult) return idResult.error
  const { id } = idResult

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400, headers: NO_STORE })
  }

  const record = body as Record<string, unknown>
  if (typeof record.is_active !== 'boolean') {
    return NextResponse.json({ error: 'is_active debe ser booleano' }, { status: 400, headers: NO_STORE })
  }
  const isActive = record.is_active

  const target = await getAdminById(id)
  if (!target) {
    return NextResponse.json({ error: 'Administrador no encontrado' }, { status: 404, headers: NO_STORE })
  }

  const sessionUsername = getSessionUserFromRequest(request)
  if (target.username.toLowerCase() === sessionUsername && !isActive) {
    return NextResponse.json({ error: 'No puedes desactivar el administrador de tu sesión actual' }, { status: 400, headers: NO_STORE })
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('admin_users')
    .update({ is_active: isActive })
    .eq('id', id)
    .select('id,username,is_active,created_at')
    .single()

  if (error) {
    return NextResponse.json({ error: 'No se pudo actualizar el administrador' }, { status: 500, headers: NO_STORE })
  }

  return NextResponse.json({ row: data }, { headers: NO_STORE })
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await hasActiveAdminSessionInRequest(request))) {
    return unauthorized()
  }

  const guard = await runApiGuard(request, {
    maxBodyBytes: 4_096,
    rateLimitMax: 20,
    rateLimitWindowMs: 60_000,
  })
  if (guard.blocked) return guard.response

  const idResult = await parseAndValidateId(context)
  if ('error' in idResult) return idResult.error
  const { id } = idResult

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400, headers: NO_STORE })
  }

  const record = body as Record<string, unknown>
  const rawUsername = String(record.username ?? '').trim().toLowerCase()
  const rawPassword = String(record.password ?? '')

  if (!rawUsername && !rawPassword) {
    return NextResponse.json({ error: 'Debes enviar username o password para actualizar' }, { status: 400, headers: NO_STORE })
  }

  const target = await getAdminById(id)
  if (!target) {
    return NextResponse.json({ error: 'Administrador no encontrado' }, { status: 404, headers: NO_STORE })
  }

  const sessionUsername = getSessionUserFromRequest(request)
  if (rawUsername && target.username.toLowerCase() === sessionUsername && rawUsername !== sessionUsername) {
    return NextResponse.json({ error: 'No puedes cambiar el username del administrador de tu sesión actual' }, { status: 400, headers: NO_STORE })
  }

  const updatePayload: Record<string, unknown> = {}

  if (rawUsername) {
    if (rawUsername.length < 3 || rawUsername.length > 50) {
      return NextResponse.json({ error: 'Username inválido (3-50 caracteres)' }, { status: 400, headers: NO_STORE })
    }
    if (!USERNAME_RE.test(rawUsername)) {
      return NextResponse.json({ error: 'Username inválido (solo a-z, 0-9, punto, guion, guion bajo)' }, { status: 400, headers: NO_STORE })
    }
    updatePayload.username = rawUsername
  }

  if (rawPassword) {
    if (rawPassword.length < 10) {
      return NextResponse.json({ error: 'La contraseña debe tener al menos 10 caracteres' }, { status: 400, headers: NO_STORE })
    }
    updatePayload.password_hash = hashAdminPassword(rawPassword)
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('admin_users')
    .update(updatePayload)
    .eq('id', id)
    .select('id,username,is_active,created_at')
    .single()

  if (error) {
    const message = String(error.message || '')
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique')) {
      return NextResponse.json({ error: 'Ese username ya existe' }, { status: 409, headers: NO_STORE })
    }
    return NextResponse.json({ error: 'No se pudo actualizar el administrador' }, { status: 500, headers: NO_STORE })
  }

  return NextResponse.json({ row: data }, { headers: NO_STORE })
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await hasActiveAdminSessionInRequest(request))) {
    return unauthorized()
  }

  const guard = await runApiGuard(request, {
    maxBodyBytes: 512,
    rateLimitMax: 20,
    rateLimitWindowMs: 60_000,
  })
  if (guard.blocked) return guard.response

  const idResult = await parseAndValidateId(context)
  if ('error' in idResult) return idResult.error
  const { id } = idResult

  const target = await getAdminById(id)
  if (!target) {
    return NextResponse.json({ error: 'Administrador no encontrado' }, { status: 404, headers: NO_STORE })
  }

  const sessionUsername = getSessionUserFromRequest(request)
  if (target.username.toLowerCase() === sessionUsername) {
    return NextResponse.json({ error: 'No puedes eliminar el administrador de tu sesión actual' }, { status: 400, headers: NO_STORE })
  }

  const supabase = createServerSupabaseClient()
  const { error } = await supabase
    .from('admin_users')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'No se pudo eliminar el administrador' }, { status: 500, headers: NO_STORE })
  }

  return NextResponse.json({ success: true }, { headers: NO_STORE })
}
