import { NextRequest, NextResponse } from 'next/server'

type WindowEntry = { hits: number[] }

const loginStore = new Map<string, WindowEntry>()
const LOGIN_WINDOW_MS = 10 * 60_000
const LOGIN_MAX = 5

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'
  )
}

function allowOrigin(req: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development') return true

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elevaforge.com'
  let allowed = new Set<string>()
  try {
    const base = new URL(siteUrl)
    allowed.add(base.origin)
    const host = base.hostname
    if (host.startsWith('www.')) {
      allowed.add(`${base.protocol}//${host.replace(/^www\./, '')}`)
    } else {
      allowed.add(`${base.protocol}//www.${host}`)
    }
  } catch {
    return false
  }

  const origin = req.headers.get('origin')
  if (origin) return allowed.has(origin)

  const referer = req.headers.get('referer')
  if (!referer) return false
  try {
    return allowed.has(new URL(referer).origin)
  } catch {
    return false
  }
}

function checkLoginRate(key: string): { ok: boolean; retryAfterSec: number } {
  const now = Date.now()
  let entry = loginStore.get(key)
  if (!entry) {
    entry = { hits: [] }
    loginStore.set(key, entry)
  }

  const cutoff = now - LOGIN_WINDOW_MS
  entry.hits = entry.hits.filter((t) => t > cutoff)

  if (entry.hits.length >= LOGIN_MAX) {
    const reset = Math.ceil((entry.hits[0] + LOGIN_WINDOW_MS - now) / 1000)
    return { ok: false, retryAfterSec: Math.max(reset, 1) }
  }

  entry.hits.push(now)
  return { ok: true, retryAfterSec: 0 }
}

function reject(status: number, error: string, extraHeaders?: Record<string, string>) {
  return NextResponse.json({ error }, { status, headers: extraHeaders })
}

export function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname
  const method = req.method.toUpperCase()

  if (!path.startsWith('/api/admin/')) {
    return NextResponse.next()
  }

  if (method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS') {
    if (!allowOrigin(req)) {
      return reject(403, 'Solicitud no autorizada')
    }

    const ct = req.headers.get('content-type') ?? ''
    if (!ct.includes('application/json')) {
      return reject(415, 'Content-Type debe ser application/json')
    }

    const len = Number(req.headers.get('content-length') ?? '0')
    if (Number.isFinite(len) && len > 128_000) {
      return reject(413, 'Payload demasiado grande')
    }
  }

  if (path === '/api/admin/login' && method === 'POST') {
    const ip = getClientIp(req)
    const rl = checkLoginRate(ip)
    if (!rl.ok) {
      return reject(429, 'Demasiados intentos, intenta más tarde', {
        'Retry-After': String(rl.retryAfterSec),
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/admin/:path*'],
}