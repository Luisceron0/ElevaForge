import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    // Disable image optimization to reduce function invocations
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,

  // Scanner/probe blocking — static redirects, no middleware needed
  redirects: async () => [
    ...['.git', '.env', '.svn', 'wp-admin', 'wp-login', 'phpmyadmin', 'wp-content', 'node_modules'].map((seg) => ({
      source: `/${seg}/:path*`,
      destination: '/404',
      permanent: false,
    })),
    { source: '/xmlrpc.php', destination: '/404', permanent: false },
    { source: '/.htaccess', destination: '/404', permanent: false },
    { source: '/admin/:path*', destination: '/404', permanent: false },
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
        {
          key: 'Content-Security-Policy',
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "img-src 'self' data: blob:",
            "font-src 'self' https://fonts.gstatic.com",
            "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.railway.app https://*.onrender.com https://*.fly.dev",
            "frame-ancestors 'none'",
            "form-action 'self'",
            "base-uri 'self'",
            "object-src 'none'",
            "worker-src 'self' blob:",
            'upgrade-insecure-requests',
          ].join('; '),
        },
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
