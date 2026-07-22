'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CTAButton from '@/components/ui/CTAButton'

const links = [
  { href: '/soluciones', label: 'Soluciones' },
  { href: '/proyectos', label: 'Proyectos' },
  { href: '/proceso', label: 'Proceso' },
  { href: '/#autonomia', label: 'Diferencial' },
  { href: '/nosotros', label: 'Quiénes somos' },
  { href: '/preguntas-frecuentes', label: 'FAQ' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    const closeMenu = () => setIsOpen(false)
    window.addEventListener('hashchange', closeMenu)
    window.addEventListener('popstate', closeMenu)
    return () => {
      window.removeEventListener('hashchange', closeMenu)
      window.removeEventListener('popstate', closeMenu)
    }
  }, [])

  // A solid-ink header always: it sits above alternating cream/teal/ink
  // panels, so a translucent adaptive bar would risk unreadable states.
  // Ink + cream text is legible over anything.
  const headerClass = isScrolled || isOpen
    ? 'bg-ef-ink/95 backdrop-blur-md border-b border-ef-paper/10'
    : 'bg-ef-ink/80 backdrop-blur-sm border-b border-transparent'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 h-16 transition-all duration-300 ${headerClass}`}>
      <nav className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 h-full flex items-center justify-between" aria-label="Navegación principal">
        <Link href="/" className="flex items-center" aria-label="ElevaForge inicio">
          <Image
            src="/LogoEleva.svg"
            alt="ElevaForge"
            width={168}
            height={48}
            className="h-10 w-auto"
            priority
          />
        </Link>

        <ul className="hidden lg:flex items-center gap-7" role="list">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-sm font-medium tracking-wide text-ef-paper/70 hover:text-ef-paper transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <CTAButton href="/contacto" size="sm" label="Solicitar diagnóstico" />
        </div>

        <button
          type="button"
          className="lg:hidden text-ef-paper p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ef-orange"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Menu</span>
          <div className="w-6 h-6 relative">
            <span className={`absolute left-0 top-1 h-0.5 w-6 bg-ef-paper transition-all ${isOpen ? 'rotate-45 top-3' : ''}`} />
            <span className={`absolute left-0 top-3 h-0.5 w-6 bg-ef-paper transition-all ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 top-5 h-0.5 w-6 bg-ef-paper transition-all ${isOpen ? '-rotate-45 top-3' : ''}`} />
          </div>
        </button>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 z-[100] bg-ef-ink flex flex-col justify-center items-center gap-8 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {links.map((link) =>
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="font-humanst text-3xl text-ef-paper hover:text-ef-orange transition-colors"
          >
            {link.label}
          </Link>
        )}

        <div className="w-full px-8 max-w-sm">
          <CTAButton href="/contacto" size="full" label="Solicitar diagnóstico" />
        </div>
      </div>
    </header>
  )
}
