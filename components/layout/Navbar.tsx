'use client'

import { useState } from 'react'
import Link from 'next/link'
import CTAButton from '@/components/ui/CTAButton'
import { buildWhatsAppURL } from '@/lib/whatsapp'

const navLinks = [
  { href: '#estandar', label: 'Garantía' },
  { href: '#autonomia', label: 'Diferencial' },
  { href: '#proceso', label: 'Proceso' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-forge-bg-dark/90 backdrop-blur-md border-b border-forge-blue-mid/20">
      <nav
        className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link href="/" aria-label="ElevaForge - Inicio">
          <span className="font-humanst text-2xl text-white">
            Eleva<span className="text-forge-orange-main">Forge</span>
          </span>
        </Link>

        {/* Links desktop */}
        <ul
          className="hidden md:flex items-center gap-8"
          role="list"
        >
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-white/70 hover:text-white transition-colors text-sm"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA desktop */}
        <CTAButton
          href={buildWhatsAppURL()}
          label="Iniciar proyecto"
          className="hidden md:inline-flex text-sm px-5 py-2.5"
        />

        {/* Botón hamburger móvil */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </nav>

      {/* Menú móvil */}
      {isOpen && (
        <div className="md:hidden bg-forge-bg-dark/95 backdrop-blur-md border-b border-forge-blue-mid/20">
          <ul className="px-6 py-4 space-y-4" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block text-white/70 hover:text-white transition-colors text-lg"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="pt-4">
              <CTAButton
                href={buildWhatsAppURL()}
                label="Iniciar proyecto"
                className="w-full justify-center text-sm px-5 py-3"
              />
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
