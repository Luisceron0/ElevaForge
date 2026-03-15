import { NextRequest, NextResponse } from 'next/server'
import { hasActiveAdminSessionInRequest } from '@/lib/security/admin-access'
import { resolveAssetUrl } from '@/lib/storage-assets'

export async function GET(request: NextRequest) {
  if (!(await hasActiveAdminSessionInRequest(request))) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const ref = String(request.nextUrl.searchParams.get('ref') ?? '').trim()
  if (!ref) {
    return NextResponse.json({ error: 'Referencia inválida' }, { status: 400 })
  }

  const resolvedUrl = await resolveAssetUrl(ref)
  if (!resolvedUrl) {
    return NextResponse.json({ error: 'Imagen no encontrada' }, { status: 404 })
  }

  return NextResponse.redirect(resolvedUrl, { status: 307 })
}
