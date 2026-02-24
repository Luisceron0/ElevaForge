'use client'

/**
 * Root-level Error Boundary — catches errors in the root layout itself.
 *
 * OWASP A10:2025 — Mishandling of Exceptional Conditions
 *
 * Must include its own <html> and <body> tags because the root layout
 * may have failed. Keeps error details private.
 */

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="es" dir="ltr">
      <body className="min-h-screen flex items-center justify-center bg-[#19192E] px-4">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold text-white mb-3">
            Error del sistema
          </h2>
          <p className="text-white/70 mb-8">
            Ocurrió un error crítico. Por favor, recarga la página.
          </p>
          <button
            onClick={reset}
            className="bg-[#F97300] hover:bg-[#FBA81E] text-white font-bold py-3 px-8 rounded-xl transition-colors"
          >
            Recargar
          </button>
        </div>
      </body>
    </html>
  )
}
