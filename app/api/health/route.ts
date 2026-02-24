import { NextRequest, NextResponse } from 'next/server'

/** Health check — only GET allowed (A01: deny by default) */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  })
}

/** Block all non-GET methods with 405 */
export async function POST() { return methodNotAllowed() }
export async function PUT() { return methodNotAllowed() }
export async function DELETE() { return methodNotAllowed() }
export async function PATCH() { return methodNotAllowed() }

function methodNotAllowed() {
  return new NextResponse(null, {
    status: 405,
    headers: { Allow: 'GET' },
  })
}
