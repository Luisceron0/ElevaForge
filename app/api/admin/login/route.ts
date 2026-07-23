import { NextRequest, NextResponse } from 'next/server'
import {
  createAdminSessionToken,
  getAdminCookieName,
  getAdminSessionTtlSeconds,
  verifyAdminCredentials,
} from '@/lib/security/admin-session'
import { logSecurityEvent, hashIdentifier } from '@/lib/security/logger'
import { runApiGuard } from '@/lib/security/api-guard'
import { getTrustedClientIp } from '@/lib/security/client-ip'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }

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
  const ip = getTrustedClientIp(request)

  // RF-015: never log the username in cleartext — a hash still lets you
  // correlate repeated attempts against the same account without exposing
  // the identity itself in logs.
  const userHash = hashIdentifier(username)

  if (!(await verifyAdminCredentials(username, password))) {
    logSecurityEvent({ type: 'LOGIN_FAILED', ip, path: '/api/admin/login', method: 'POST', details: `user_hash: ${userHash}` })
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401, headers: NO_STORE })
  }

  logSecurityEvent({ type: 'LOGIN_SUCCESS', ip, path: '/api/admin/login', method: 'POST', details: `user_hash: ${userHash}` })

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
