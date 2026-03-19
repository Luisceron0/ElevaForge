import { NextRequest, NextResponse } from 'next/server'
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminSessionTtlSeconds,
  verifyAdminCredentials,
} from '@/lib/security/admin-session'
import { logSecurityEvent } from '@/lib/security/logger'

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(request: NextRequest) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const record = body as Record<string, unknown>
  const username = String(record.username ?? '').trim().toLowerCase()
  const password = String(record.password ?? '')
  const ip = getClientIp(request)

  if (!(await verifyAdminCredentials(username, password))) {
    logSecurityEvent({ type: 'LOGIN_FAILED', ip, path: '/api/admin/login', method: 'POST', details: `username: ${username}` })
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  logSecurityEvent({ type: 'LOGIN_SUCCESS', ip, path: '/api/admin/login', method: 'POST', details: `username: ${username}` })

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
