'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import CTAButton from '@/components/ui/CTAButton'
import { WHATSAPP_URLS } from '@/lib/whatsapp'

const links = [
  { href: '/#precios', label: 'Paquetes' },
  { href: '/#proyectos', label: 'Proyectos' },
  { href: '/#estandar', label: 'Garantía' },
  { href: '/#proceso', label: 'Proceso' },
  { href: '/#autonomia', label: 'Diferencial' },
  { href: '/nosotros', label: 'Quiénes somos' },
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

  const headerClass = isOpen || isScrolled
    ? 'bg-forge-bg-dark/95 backdrop-blur-md border-b border-forge-blue-mid/15 shadow-forge-card'
    : 'bg-forge-bg-dark/95 lg:bg-transparent'

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

        <ul className="hidden lg:flex items-center gap-6" role="list">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="text-base font-medium text-white/65 hover:text-white transition-colors duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <CTAButton href={WHATSAPP_URLS.hero} size="sm" label="Iniciar proyecto" />
        </div>

        <button
          type="button"
          className="lg:hidden text-white p-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-orange-main"
          aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isOpen}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="sr-only">Menu</span>
          <div className="w-6 h-6 relative">
            <span className={`absolute left-0 top-1 h-0.5 w-6 bg-white transition-all ${isOpen ? 'rotate-45 top-3' : ''}`} />
            <span className={`absolute left-0 top-3 h-0.5 w-6 bg-white transition-all ${isOpen ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 top-5 h-0.5 w-6 bg-white transition-all ${isOpen ? '-rotate-45 top-3' : ''}`} />
          </div>
        </button>
      </nav>

      <div
        className={`lg:hidden fixed inset-0 z-[100] bg-forge-bg-dark flex flex-col justify-center items-center gap-8 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {links.map((link) =>
          <Link
            key={link.label}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="font-humanst text-3xl text-white hover:text-forge-orange-main transition-colors"
          >
            {link.label}
          </Link>
        )}

        <div className="w-full px-8 max-w-sm">
          <CTAButton href={WHATSAPP_URLS.hero} size="full" label="Iniciar proyecto" />
        </div>
      </div>
    </header>
  )
}
