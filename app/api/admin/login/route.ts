import { NextRequest, NextResponse } from 'next/server'
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminSessionTtlSeconds,
  verifyAdminCredentials,
} from '@/lib/security/admin-session'
import { logSecurityEvent } from '@/lib/security/logger'
import { runApiGuard } from '@/lib/security/api-guard'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

export async function POST(request: NextRequest) {
  const guard = await runApiGuard(request, {
    maxBodyBytes: 2_048,
    rateLimitMax: 8,
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
  const ip = getClientIp(request)

  if (!(await verifyAdminCredentials(username, password))) {
    logSecurityEvent({ type: 'LOGIN_FAILED', ip, path: '/api/admin/login', method: 'POST', details: `username: ${username}` })
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401, headers: NO_STORE })
  }

  logSecurityEvent({ type: 'LOGIN_SUCCESS', ip, path: '/api/admin/login', method: 'POST', details: `username: ${username}` })

  const response = NextResponse.json({ success: true }, { headers: NO_STORE })
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
