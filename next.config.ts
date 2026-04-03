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
  ],

  // Security headers in config (static) instead of middleware (dynamic)
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-DNS-Prefetch-Control', value: 'on' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
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
