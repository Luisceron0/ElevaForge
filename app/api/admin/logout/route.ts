import { NextResponse } from 'next/server'
import { getAdminCookieName } from '@/lib/security/admin-session'

export async function POST() {
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
