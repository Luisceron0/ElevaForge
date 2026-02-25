import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware disabled — all headers/cache handled by next.config.ts (static).
 * Scanner blocking moved to next.config.ts redirects.
 * Keeping this file empty with an empty matcher so Next.js doesn't invoke it.
 */
export function middleware(_request: NextRequest) {
  return NextResponse.next()
}

export const config = {
  matcher: [],
}
