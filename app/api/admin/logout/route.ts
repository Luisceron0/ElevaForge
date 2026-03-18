import { NextRequest, NextResponse } from 'next/server'
import { getAdminCookieName } from '@/lib/security/admin-session'
import { validateOrigin } from '@/lib/security/csrf'

export async function POST(request: NextRequest) {
  const origin = validateOrigin(request)
  if (!origin.valid) {
    return NextResponse.json({ error: 'Solicitud no autorizada' }, { status: 403 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: getAdminCookieName(),
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  })
  return response
}
