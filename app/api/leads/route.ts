/**
 * Leads API Route — DEPRECATED
 *
 * All lead submissions now go through /api/contact (lightweight outbox pattern).
 * This route is kept temporarily for backwards compatibility but redirects to /api/contact.
 */

import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  // Forward to /api/contact for unified lightweight handling
  const body = await request.json()
  const origin = request.nextUrl.origin
  const resp = await fetch(`${origin}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await resp.json()
  return NextResponse.json(data, { status: resp.status })
}

export async function GET() {
  return NextResponse.json(
    { message: 'Este endpoint solo acepta POST requests' },
    { status: 405 }
  )
}