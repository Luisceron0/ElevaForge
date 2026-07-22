/**
 * Leads API Route — DEPRECATED (§12 / RF-012).
 *
 * The POST here used to duplicate the exact insert logic of /api/contact —
 * two sources of truth for the same operation. That duplicate is now gone:
 * both GET and POST issue a 308 Permanent Redirect to /api/contact.
 *
 * A 308 preserves the request method AND body, so any external integration
 * still calling POST /api/leads is transparently forwarded to the single
 * canonical endpoint (/api/contact) — no breakage, no duplicated insert, no
 * second place where leadSchema/runApiGuard could drift out of sync.
 */

import { NextRequest, NextResponse } from 'next/server'

function redirectToContact(req: NextRequest) {
  return NextResponse.redirect(new URL('/api/contact', req.url), 308)
}

export function GET(req: NextRequest) {
  return redirectToContact(req)
}

export function POST(req: NextRequest) {
  return redirectToContact(req)
}
