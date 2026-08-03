import type { NextConfig } from 'next'

const supabaseHost = (() => {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    return url ? new URL(url).hostname : undefined
  } catch {
    return undefined
  }
})()

const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: supabaseHost
      ? [
        {
          protocol: 'https',
          hostname: supabaseHost,
          pathname: '/storage/v1/object/**',
        },
      ]
      : [],
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Scanner/probe blocking — static redirects, no middleware needed
  // NOTE: '/admin' is intentionally NOT blocked here because the app has its
  // own admin UI at /admin. External scanner probes are blocked by auth +
  // rate-limiting in the API layer. Common CMS/PHP probe paths are still 404'd.
  redirects: async () => [
    ...['.git', '.env', '.svn', 'wp-admin', 'wp-login', 'phpmyadmin', 'wp-content', 'node_modules'].map((seg) => ({
      source: `/${seg}/:path*`,
      destination: '/404',
      permanent: false,
    })),
    { source: '/xmlrpc.php', destination: '/404', permanent: false },
    { source: '/.htaccess', destination: '/404', permanent: false },

    // ADR-012: /proyectos y sus casos dejaron de existir (el portafolio con
    // 1 caso entregado restaba confianza en vez de darla). Redirect
    // permanente a la sección de soluciones en Home. `permanent: true` en
    // Next emite 308, no 301 — igual de permanente para los buscadores y
    // además preserva el método.
    { source: '/proyectos', destination: '/#soluciones', permanent: true },
    { source: '/proyectos/:slug*', destination: '/#soluciones', permanent: true },

    // Este cambio: /soluciones y sus páginas de familia se eliminaron
    // (decisión del cliente, 2026-08-03 — el contenido quedaba duplicado
    // entre esa página y el Home, con fricción real de mantenimiento cada
    // vez que se agregaba un campo nuevo). Todo el catálogo ya vive en la
    // sección #soluciones del Home.
    { source: '/soluciones', destination: '/#soluciones', permanent: true },
    { source: '/soluciones/:familia*', destination: '/#soluciones', permanent: true },
  ],

  // Security headers in config (static) instead of middleware (dynamic)
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        // Deliberately disabled (not omitted): the legacy XSS auditor this
        // header controls was removed from all modern browsers and had its
        // own exploitable bugs in the ones that still shipped it (e.g. the
        // ~2015 "XSS Auditor" info-leak class). CSP (proxy.ts) is the actual
        // defense here — RNF-SEC-05.
        { key: 'X-XSS-Protection', value: '0' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
        { key: 'X-Download-Options', value: 'noopen' },
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'credentialless' },
      ],
    },
    {
      source: '/api/(.*)',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate' },
      ],
    },
    {
      source: '/fonts/:path*',
      headers: [
        { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
      ],
    },
  ],
}

export default config
