/**
 * Custom 404 page.
 *
 * OWASP A01:2025 — Broken Access Control (force browsing)
 * OWASP A02:2025 — Security Misconfiguration (no info leakage on 404)
 *
 * Returns a branded 404 without revealing internal paths, server info,
 * or framework details. Prevents URL-guessing reconnaissance.
 */

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-forge-bg-dark px-4">
      <div className="text-center max-w-md">
        <p className="font-humanst text-7xl text-forge-orange-main mb-4">
          404
        </p>
        <h1 className="font-humanst text-2xl text-white mb-3">
          Página no encontrada
        </h1>
        <p className="text-white/70 mb-8 leading-relaxed">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block bg-forge-orange-main hover:bg-forge-orange-gold text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:ring-offset-2 focus:ring-offset-forge-bg-dark"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
