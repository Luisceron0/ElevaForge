import { NextRequest, NextResponse } from 'next/server'
import { hasActiveAdminSessionInRequest } from '@/lib/security/admin-access'
import {
  DEFAULT_SITE_CONTENT,
  getSiteContent,
  saveSiteContent,
  SiteContent,
} from '@/lib/site-content'
import { validateContentByKey } from '@/lib/admin-content-validation'
import { runApiGuard } from '@/lib/security/api-guard'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401, headers: NO_STORE })
}

export async function GET(request: NextRequest) {
  if (!(await hasActiveAdminSessionInRequest(request))) {
    return unauthorized()
  }

  const content = await getSiteContent()
  return NextResponse.json(content, { headers: NO_STORE })
}

export async function PUT(request: NextRequest) {
  if (!(await hasActiveAdminSessionInRequest(request))) {
    return unauthorized()
  }

  const guard = await runApiGuard(request, {
    maxBodyBytes: 128_000,
    rateLimitMax: 20,
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
  const key = String(record.key ?? '') as keyof SiteContent
  const value = record.value

  if (!['about', 'projects', 'packages'].includes(key)) {
    return NextResponse.json({ error: 'Clave de contenido inválida' }, { status: 400, headers: NO_STORE })
  }

  const fallback = DEFAULT_SITE_CONTENT[key]
  if (Array.isArray(fallback) && !Array.isArray(value)) {
    return NextResponse.json({ error: 'El valor debe ser una lista' }, { status: 400, headers: NO_STORE })
  }
  if (!Array.isArray(fallback) && (!value || typeof value !== 'object' || Array.isArray(value))) {
    return NextResponse.json({ error: 'El valor debe ser un objeto' }, { status: 400, headers: NO_STORE })
  }

  const validated = validateContentByKey(key, value)
  if (!validated.ok) {
    return NextResponse.json({ error: validated.error }, { status: 400, headers: NO_STORE })
  }

  try {
    await saveSiteContent(key, validated.data)
    return NextResponse.json({ success: true }, { headers: NO_STORE })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo guardar el contenido'
    return NextResponse.json(
      {
        error: message,
        hint:
          'Verifica que exista la tabla site_content con columnas: key text primary key, value jsonb not null, updated_at timestamptz.',
      },
      { status: 500, headers: NO_STORE },
    )
  }
}
