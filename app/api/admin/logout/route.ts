import { NextRequest, NextResponse } from 'next/server'
import { getAdminCookieName } from '@/lib/security/admin-session'
import { validateOrigin } from '@/lib/security/csrf'

const NO_STORE = { 'Cache-Control': 'no-store, no-cache, must-revalidate' }

export async function POST(request: NextRequest) {
  const origin = validateOrigin(request)
  if (!origin.valid) {
    return NextResponse.json({ error: 'Solicitud no autorizada' }, { status: 403, headers: NO_STORE })
  }

  const response = NextResponse.json({ success: true }, { headers: NO_STORE })
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
