'use client'

import { useState, useEffect, useRef } from 'react'
import CTAButton from '@/components/ui/CTAButton'
import { buildWhatsAppURL } from '@/lib/whatsapp'

const navLinks = [
  { href: '#precios', label: 'Paquetes' },
  { href: '#estandar', label: 'Garantía' },
  { href: '#autonomia', label: 'Diferencial' },
  { href: '#proceso', label: 'Proceso' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const hamburgerRef = useRef<HTMLButtonElement>(null)

  // Consolidated keyboard handler: Escape to close + focus trap when open
  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false)
        hamburgerRef.current?.focus()
        return
      }

      // Focus trap
      if (e.key === 'Tab' && menuRef.current) {
        const focusables = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    // Auto-focus first link when menu opens
    if (menuRef.current) {
      const firstFocusable = menuRef.current.querySelector<HTMLElement>(
        'a[href], button'
      )
      firstFocusable?.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    setIsOpen(false)
    const element = document.querySelector(href)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-forge-bg-dark/95 border-b border-forge-blue-mid/20">
      <nav
        className="container mx-auto px-4 h-16 flex items-center justify-between"
        aria-label="Navegación principal"
      >
        {/* Logo: usar LogoEleva.svg con tamaño mayor */}
        <a
          href="#inicio"
          onClick={(e) => scrollToSection(e, '#inicio')}
          aria-label="ElevaForge - Inicio"
          className="flex items-center gap-3"
        >
          <img src="/LogoEleva.svg" alt="ElevaForge" className="h-12 w-auto object-contain" />
          <span className="sr-only">ElevaForge</span>
        </a>

        {/* Links desktop */}
        <ul className="hidden md:flex items-center gap-8" role="list">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className="text-white/70 hover:text-white transition-colors duration-150 text-sm"
              >
                {link.label}
              </a>
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
          ref={hamburgerRef}
          className="md:hidden text-white p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-forge-orange-main"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
          aria-expanded={isOpen}
          aria-controls="mobile-nav-menu"
        >
          {isOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
              aria-hidden="true"
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
        <div
          ref={menuRef}
          id="mobile-nav-menu"
          className="md:hidden bg-forge-bg-dark border-b border-forge-blue-mid/20"
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación móvil"
        >
          <ul className="px-6 py-4 space-y-4" role="list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className="block text-white/70 hover:text-white transition-colors text-lg"
                >
                  {link.label}
                </a>
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
