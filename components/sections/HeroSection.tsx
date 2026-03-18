'use client'

import { useRef, useEffect, useState } from 'react'
import CTAButton from '@/components/ui/CTAButton'
import { buildWhatsAppURL } from '@/lib/whatsapp'

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    if (reducedMotion) return
    // Only enable parallax on larger screens
    if (typeof window === 'undefined' || window.innerWidth < 768) return

    let ticking = false
    let isVisible = true

    // Use IntersectionObserver to pause parallax when section is off-screen
    const observer = new IntersectionObserver(
      ([entry]) => { isVisible = entry.isIntersecting },
      { threshold: 0 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)

    const handleScroll = () => {
      if (ticking || !isVisible) return
      ticking = true
      requestAnimationFrame(() => {
        if (!parallaxRef.current) { ticking = false; return }
        const y = window.scrollY * 0.12
        parallaxRef.current.style.transform = `translate3d(0, ${y}px, 0)`
        ticking = false
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      observer.disconnect()
    }
  }, [reducedMotion])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) element.scrollIntoView({ behavior: 'smooth' })
  }

  // Simple A/B experiment: read ?ab=variantB to show alternate copy
  const [abVariant, setAbVariant] = useState<'A' | 'B'>('A')
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      if (params.get('ab') === 'variantB') setAbVariant('B')
    } catch {
      // ignore server-side
    }
  }, [])

  const headline = abVariant === 'B'
    ? 'Multiplica tus ventas con productos digitales' 
    : 'Construimos productos digitales que hacen crecer tu negocio'

  const subtitle = abVariant === 'B'
    ? 'Soluciones prácticas: entregas rápidas, precios claros y soporte humano.'
    : 'Sitios y herramientas que venden: entregas claras, costos transparentes y soporte real. Hacemos tecnologías simples para que tú vendas más.'

  const ctaLabel = abVariant === 'B' ? 'Quiero una propuesta' : 'Iniciar proyecto'

  return (
    <section
      ref={sectionRef}
      id="inicio"
      className="relative py-20 min-h-[60vh] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-forge-bg-dark to-[#0f0f22] text-white"
    >
      {/* Background Pattern - cruces SVG como en AVC */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23306A9C' fillOpacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Degradado inferior para transición suave */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forge-bg-dark to-transparent"
      />

      {/* Contenido con parallax */}
      <div
        ref={parallaxRef}
        className={`relative z-10 container mx-auto px-4 text-center ${reducedMotion ? '' : 'will-change-transform'}`}
      >
        {/* Headline */}
        <h1 className="font-humanst text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-balance leading-tight">{headline}</h1>

        {/* Subtítulo más claro y no técnico */}
        <p className="text-base md:text-lg text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">{subtitle}</p>

        {/* CTAs - patrón AVC: flex-col sm:flex-row */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
          <CTAButton
            href={buildWhatsAppURL()}
            label={ctaLabel}
            className="w-full sm:w-auto"
          />
          <button
            type="button"
            onClick={() => scrollToSection('precios')}
            className="inline-flex items-center gap-2 border-2 border-white/30 bg-white/10 hover:bg-forge-orange-main hover:border-forge-orange-main text-white font-bold px-6 py-3 text-base rounded-lg shadow-lg transition-colors duration-200 w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:ring-offset-2 focus:ring-offset-forge-bg-dark"
          >
            Paquetes
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('estandar')}
            className="inline-flex items-center gap-2 border-2 border-white/30 bg-white/10 hover:bg-forge-orange-main hover:border-forge-orange-main text-white font-bold px-6 py-3 text-base rounded-lg shadow-lg transition-colors duration-200 w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:ring-offset-2 focus:ring-offset-forge-bg-dark"
          >
            Nuestros Estándares
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('proceso')}
            className="inline-flex items-center gap-2 border-2 border-white/30 bg-white/10 hover:bg-forge-orange-main hover:border-forge-orange-main text-white font-bold px-6 py-3 text-base rounded-lg shadow-lg transition-colors duration-200 w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:ring-offset-2 focus:ring-offset-forge-bg-dark"
          >
            Ver Proceso
          </button>

          <button
            type="button"
            onClick={() => scrollToSection('autonomia')}
            className="inline-flex items-center gap-2 border-2 border-white/30 bg-white/10 hover:bg-forge-orange-main hover:border-forge-orange-main text-white font-bold px-6 py-3 text-base rounded-lg shadow-lg transition-colors duration-200 w-full sm:w-auto justify-center focus:outline-none focus:ring-2 focus:ring-forge-orange-main focus:ring-offset-2 focus:ring-offset-forge-bg-dark"
          >
            Diferencial
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      {/* Scroll indicator removed to reduce visual clutter on mobile */}
    </section>
  )
}
