import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logSecurityEvent } from '@/lib/security/logger'

// ═════════════════════════════════════════════════════════════════
// A01:2025 — Blocked paths (force-browsing / scanner probes)
// ═════════════════════════════════════════════════════════════════
const BLOCKED_PATH_PATTERNS = [
  /\/\.git/i,
  /\/\.env/i,
  /\/\.svn/i,
  /\/\.htaccess/i,
  /\/\.htpasswd/i,
  /\/\.ds_store/i,
  /\/backup\//i,
  /\/wp-admin/i,
  /\/wp-login/i,
  /\/wp-content/i,
  /\/xmlrpc\.php/i,
  /\/phpmyadmin/i,
  /\/admin\/?$/i,
  /\/administrator/i,
  /\/web\.config/i,
  /\/server-status/i,
  /\/server-info/i,
  /\/composer\.(json|lock)/i,
  /\/package\.json/i,
  /\/package-lock\.json/i,
  /\/node_modules/i,
  /\/\.well-known\/(?!security\.txt)/i, // allow only security.txt
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const response = NextResponse.next()

  // Helper to extract client IP
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() ?? request.headers.get('x-real-ip') ?? 'unknown'

  // ── A01: Block sensitive / scanner-probe paths ──
  if (BLOCKED_PATH_PATTERNS.some((re) => re.test(pathname))) {
    logSecurityEvent({
      type: 'SCANNER_PROBE',
      ip,
      path: pathname,
      method: request.method,
      details: 'Blocked path access attempt',
    })
    // Return generic 404 — never reveal why it was blocked
    return new NextResponse('Not Found', { status: 404 })
  }

  // ── A09: X-Request-Id for tracing & correlation ──
  const requestId = crypto.randomUUID()
  response.headers.set('X-Request-Id', requestId)

  // --- Security headers ---
  // HSTS — enforce HTTPS for 2 years
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  )

  // CSP — tight policy (allows external backend via env var)
  // Note: In production, replace * in connect-src with your actual backend URL
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline'", // Next.js requires unsafe-inline for hydration
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob:",
      "font-src 'self' https://fonts.gstatic.com",
      // Allow Supabase + external backend (Railway, Render, Fly.io, etc.)
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.railway.app https://*.onrender.com https://*.fly.dev",
      "frame-ancestors 'none'",
      "form-action 'self'",
      "base-uri 'self'",
      "object-src 'none'",
      "worker-src 'self' blob:",
      'upgrade-insecure-requests',
    ].join('; ')
  )

  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY')

  // Prevent MIME sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff')

  // XSS filter (legacy browsers)
  response.headers.set('X-XSS-Protection', '1; mode=block')

  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

  // Extended permissions policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()'
  )

  // Prevent cross-domain policies
  response.headers.set('X-Permitted-Cross-Domain-Policies', 'none')

  // DNS prefetch control
  response.headers.set('X-DNS-Prefetch-Control', 'on')

  // Prevent download dialog sniffing (IE)
  response.headers.set('X-Download-Options', 'noopen')

  // Cross-Origin policies
  response.headers.set('Cross-Origin-Opener-Policy', 'same-origin')
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin')

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json|.*\\.png$|.*\\.ico$).*)',
  ],
}
