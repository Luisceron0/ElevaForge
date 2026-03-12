import { NextRequest, NextResponse } from 'next/server'
import { hasAdminSessionInRequest } from '@/lib/security/admin-session'
import {
  DEFAULT_SITE_CONTENT,
  getSiteContent,
  saveSiteContent,
  SiteContent,
} from '@/lib/site-content'

function unauthorized() {
  return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
}

export async function GET(request: NextRequest) {
  if (!hasAdminSessionInRequest(request)) {
    return unauthorized()
  }

  const content = await getSiteContent()
  return NextResponse.json(content)
}

export async function PUT(request: NextRequest) {
  if (!hasAdminSessionInRequest(request)) {
    return unauthorized()
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const record = body as Record<string, unknown>
  const key = String(record.key ?? '') as keyof SiteContent
  const value = record.value

  if (!['about', 'projects', 'packages'].includes(key)) {
    return NextResponse.json({ error: 'Clave de contenido inválida' }, { status: 400 })
  }

  const fallback = DEFAULT_SITE_CONTENT[key]
  if (Array.isArray(fallback) && !Array.isArray(value)) {
    return NextResponse.json({ error: 'El valor debe ser una lista' }, { status: 400 })
  }
  if (!Array.isArray(fallback) && (!value || typeof value !== 'object' || Array.isArray(value))) {
    return NextResponse.json({ error: 'El valor debe ser un objeto' }, { status: 400 })
  }

  try {
    await saveSiteContent(key, value as SiteContent[typeof key])
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'No se pudo guardar el contenido'
    return NextResponse.json(
      {
        error: message,
        hint:
          'Verifica que exista la tabla site_content con columnas: key text primary key, value jsonb not null, updated_at timestamptz.',
      },
      { status: 500 },
    )
  }
}
