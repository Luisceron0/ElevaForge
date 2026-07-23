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
    <div className="min-h-screen flex items-center justify-center bg-ef-ink px-4">
      <div className="text-center max-w-md">
        <p className="font-humanst text-7xl text-ef-orange mb-4">
          404
        </p>
        <h1 className="font-humanst text-2xl text-ef-paper mb-3">
          Página no encontrada
        </h1>
        <p className="text-ef-paper/70 mb-8 leading-relaxed">
          La página que buscas no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block bg-ef-orange hover:bg-ef-ink hover:text-ef-orange text-ef-ink font-bold py-3 px-8 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-ef-orange focus:ring-offset-2 focus:ring-offset-ef-ink border border-transparent hover:border-ef-orange"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
