'use client'

/**
 * Route-level Error Boundary.
 *
 * OWASP A10:2025 — Mishandling of Exceptional Conditions
 * OWASP A02:2025 — Security Misconfiguration (no stack traces to users)
 *
 * Catches unhandled errors inside page components and renders a safe,
 * branded fallback UI. Never exposes stack traces, component names,
 * or internal paths to the user.
 */

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to observability — digest is safe, no PII
    console.error('[ErrorBoundary]', error.digest ?? 'unknown')
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-forge-bg-dark px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="font-humanst text-2xl text-white mb-3">
          Algo salió mal
        </h2>
        <p className="text-white/70 mb-8 leading-relaxed">
          Ocurrió un error inesperado. Puedes intentar recargar la página.
        </p>
        <button
          onClick={reset}
          className="bg-forge-orange-main hover:bg-forge-orange-gold text-white font-bold py-3 px-8 rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:ring-offset-2 focus:ring-offset-forge-bg-dark"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  )
}
