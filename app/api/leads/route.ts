/**
 * Leads API Route — Proxy stub
 *
 * The leads endpoint is now handled by the external backend (ElevaForgeBack).
 * This file returns a clear message if something hits this route directly.
 *
 * Frontend ContactForm sends leads directly to NEXT_PUBLIC_API_URL/api/leads.
 */

import { NextResponse } from 'next/server'

const BACKEND_MSG =
  'Este endpoint ha sido migrado al backend externo. Configura NEXT_PUBLIC_API_URL en tu .env.local.'

export async function POST() {
  return NextResponse.json({ error: BACKEND_MSG }, { status: 410 })
}

export async function GET() {
  return NextResponse.json({ error: BACKEND_MSG }, { status: 410 })
}