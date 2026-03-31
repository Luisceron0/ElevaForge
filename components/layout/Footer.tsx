'use client'

import type React from 'react'
import { memo } from 'react'
import Link from 'next/link'
import { buildWhatsAppURL } from '@/lib/whatsapp'

const quickLinks = [
  { label: 'Paquetes', href: '#precios' },
  { label: 'Quiénes somos', href: '#quienes' },
  { label: 'Proyectos', href: '#proyectos' },
  { label: 'Estándares', href: '#estandar' },
  { label: 'Proceso', href: '#proceso' },
  { label: 'Diferencial', href: '#autonomia' },
]

const CURRENT_YEAR = new Date().getFullYear()

export default memo(function Footer() {
  const scrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault()
    const element = document.querySelector(href)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-forge-bg-dark text-white">
      <div className="container mx-auto px-4 py-10 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Columna 1 - Logo + slogan */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src="/LogoEleva.svg" alt="ElevaForge" className="h-10 w-auto object-contain" />
            </div>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-md">
              Sitios y herramientas que venden: entregas claras, precios
              transparentes y soporte real. Construimos soluciones pensadas
              para hacer crecer tu negocio.
            </p>
          </div>

          {/* Columna 2 - Enlaces Rápidos */}
          <nav aria-label="Enlaces rápidos del pie de página">
            <h4 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Enlaces Rápidos
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className="text-sm sm:text-base text-white/80 hover:text-forge-orange-main transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <Link
                  href="/privacidad"
                  className="text-sm sm:text-base text-white/80 hover:text-forge-orange-main transition-colors"
                >
                  Privacidad
                </Link>
              </li>
              <li>
                <Link
                  href="/terminos"
                  className="text-sm sm:text-base text-white/80 hover:text-forge-orange-main transition-colors"
                >
                  Términos
                </Link>
              </li>
            </ul>
          </nav>

          {/* Columna 3 - Contacto */}
          <address className="not-italic">
            <h4 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6">
              Contacto
            </h4>
            <ul className="space-y-3 sm:space-y-4">
              <li className="flex items-center gap-2 sm:gap-3">
                {/* WhatsApp icon */}
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-forge-orange-main flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <a
                  href={buildWhatsAppURL()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm sm:text-base text-white/80 hover:text-forge-orange-main transition-colors"
                >
                  WhatsApp directo
                </a>
              </li>
              <li className="flex items-center gap-2 sm:gap-3">
                {/* Mail icon */}
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5 text-forge-orange-main flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:elevaforge@gmail.com"
                  className="text-sm sm:text-base text-white/80 hover:text-forge-orange-main transition-colors break-all"
                >
                  elevaforge@gmail.com
                </a>
              </li>
            </ul>
          </address>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-white/20">
        <div className="container mx-auto px-4 py-4 sm:py-6 text-center">
          <p className="text-xs sm:text-sm text-white/70">
            © {CURRENT_YEAR} ElevaForge. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
})
