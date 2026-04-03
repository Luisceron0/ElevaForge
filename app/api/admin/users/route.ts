import { NextRequest, NextResponse } from 'next/server'
import { hasActiveAdminSessionInRequest } from '@/lib/security/admin-access'
import { hashAdminPassword } from '@/lib/security/admin-session'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { runApiGuard } from '@/lib/security/api-guard'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401, headers: NO_STORE })
}

export async function GET(request: NextRequest) {
  if (!(await hasActiveAdminSessionInRequest(request))) {
    return unauthorized()
  }

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('id,username,is_active,created_at')
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'No se pudieron cargar los administradores' }, { status: 500, headers: NO_STORE })
  }

  return NextResponse.json({ rows: data ?? [] }, { headers: NO_STORE })
}

export async function POST(request: NextRequest) {
  if (!(await hasActiveAdminSessionInRequest(request))) {
    return unauthorized()
  }

  const guard = await runApiGuard(request, {
    maxBodyBytes: 4_096,
    rateLimitMax: 12,
    rateLimitWindowMs: 60_000,
  })
  if (guard.blocked) return guard.response

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400, headers: NO_STORE })
  }

  const record = body as Record<string, unknown>
  const username = String(record.username ?? '').trim().toLowerCase()
  const password = String(record.password ?? '')

  if (!username || username.length < 3 || username.length > 50) {
    return NextResponse.json({ error: 'Username inválido (3-50 caracteres)' }, { status: 400, headers: NO_STORE })
  }

  if (!/^[a-z0-9._-]+$/.test(username)) {
    return NextResponse.json({ error: 'Username inválido (solo a-z, 0-9, punto, guion, guion bajo)' }, { status: 400, headers: NO_STORE })
  }

  if (!password || password.length < 10) {
    return NextResponse.json({ error: 'La contraseña debe tener al menos 10 caracteres' }, { status: 400, headers: NO_STORE })
  }

  const passwordHash = hashAdminPassword(password)

  const supabase = createServerSupabaseClient()
  const { data, error } = await supabase
    .from('admin_users')
    .insert({ username, password_hash: passwordHash, is_active: true })
    .select('id,username,is_active,created_at')
    .single()

  if (error) {
    const message = String(error.message || '')
    if (message.toLowerCase().includes('duplicate') || message.toLowerCase().includes('unique')) {
      return NextResponse.json({ error: 'Ese username ya existe' }, { status: 409, headers: NO_STORE })
    }

    return NextResponse.json({ error: 'No se pudo crear el administrador' }, { status: 500, headers: NO_STORE })
  }

  return NextResponse.json({ row: data }, { headers: NO_STORE })
}
