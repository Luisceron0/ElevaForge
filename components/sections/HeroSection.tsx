'use client'

import { useRef, useEffect } from 'react'
import Badge from '@/components/ui/Badge'
import CTAButton from '@/components/ui/CTAButton'
import { buildWhatsAppURL } from '@/lib/whatsapp'

export default function HeroSection() {
  const parallaxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (!parallaxRef.current) return
      const y = window.scrollY * 0.12
      parallaxRef.current.style.transform = `translateY(${y}px)`
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-forge-bg-dark pt-16"
    >
      {/* Patrón de puntos SVG */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, #306A9C 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* Degradado inferior */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-forge-bg-dark to-transparent"
      />

      {/* Contenido con parallax */}
      <div
        ref={parallaxRef}
        className="relative z-10 text-center px-6 max-w-5xl mx-auto"
      >
        {/* Badge superior */}
        <Badge variant="blue" className="mb-6">
          Agencia de Desarrollo de Software
        </Badge>

        {/* Headline */}
        <h1 className="font-humanst text-5xl md:text-7xl lg:text-8xl text-white leading-tight mb-4">
          Eleva<span className="text-forge-orange-main">Forge</span>
        </h1>

        {/* Eslogan */}
        <p className="font-humanst text-2xl md:text-3xl text-forge-blue-light mb-6">
          Forjamos tu crecimiento
        </p>

        {/* Subtítulo */}
        <p className="font-inter text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
          No solo creamos herramientas; forjamos el motor digital de tu empresa
          con transparencia total y acompañamiento real.
        </p>

        {/* CTA WhatsApp */}
        <CTAButton
          href={buildWhatsAppURL()}
          label="Iniciar proyecto por WhatsApp"
        />
      </div>
    </section>
  )
}
