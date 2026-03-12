import { NextRequest, NextResponse } from 'next/server'
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminSessionTtlSeconds,
  verifyAdminCredentials,
} from '@/lib/security/admin-session'

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const record = body as Record<string, unknown>
  const username = String(record.username ?? '')
  const password = String(record.password ?? '')

  if (!(await verifyAdminCredentials(username, password))) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: getAdminCookieName(),
    value: createAdminSessionToken(username),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: getAdminSessionTtlSeconds(),
    path: '/',
  })

  return response
}
