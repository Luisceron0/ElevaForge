'use client'

import { useLayoutEffect, useRef } from 'react'
import CTAButton from '@/components/ui/CTAButton'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { gsap } from '@/lib/gsap'
import { WHATSAPP_URLS } from '@/lib/whatsapp'

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out', duration: 0.6 },
      })

      tl.from('[data-hero-badge]', { opacity: 0, y: -16 })
        .from('[data-hero-title]', { opacity: 0, y: 24 }, '-=0.3')
        .from('[data-hero-subtitle]', { opacity: 0, y: 16 }, '-=0.4')
        .from('[data-hero-ctas]', { opacity: 0, y: 12 }, '-=0.4')
        .from('[data-hero-card]', { opacity: 0, x: 20 }, '-=0.5')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="inicio"
      aria-label="Inicio"
      className="relative min-h-screen flex items-center pt-20 bg-forge-bg-dark overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[60%] h-[70%] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 85% 20%, rgba(49,133,197,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-12 items-center py-16 md:py-24 relative z-10">
        <div>
          <span
            data-hero-badge
            className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-forge-blue-mid/15 text-forge-blue-light border border-forge-blue-mid/25"
          >
            Agencia de software · Colombia
          </span>

          <h1
            data-hero-title
            className="font-humanst leading-none text-white mb-6"
            style={{ fontSize: 'clamp(2.8rem, 7vw, 5.5rem)' }}
          >
            Forjamos el motor digital
            <span className="block text-forge-orange-main">de tu empresa</span>
          </h1>

          <p
            data-hero-subtitle
            className="text-forge-text-body text-lg md:text-xl leading-relaxed max-w-xl mb-10"
          >
            Tecnología simple, resultados medibles. Entregas claras, costos
            transparentes y soporte real para cada proyecto.
          </p>

          <div data-hero-ctas className="flex flex-col sm:flex-row gap-4 mb-12">
            <CTAButton href={WHATSAPP_URLS.hero} size="lg" label="Iniciar proyecto" />
            <a
              href="#proyectos"
              className="inline-flex items-center justify-center gap-2.5 font-semibold px-8 py-4 rounded-xl transition-all duration-200 text-lg border border-forge-orange-main/60 text-forge-orange-main hover:bg-forge-orange-main hover:text-white hover:border-forge-orange-main focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forge-orange-main focus-visible:ring-offset-2 focus-visible:ring-offset-forge-bg-dark"
            >
              Ver proyectos
            </a>
          </div>

          <div className="flex flex-wrap gap-x-4 md:gap-x-8 gap-y-2 text-base text-forge-text-muted">
            <span>4 ingenieros graduados</span>
            <span className="text-forge-blue-mid/50">·</span>
            <span>2 proyectos entregados</span>
            <span className="text-forge-blue-mid/50">·</span>
            <span>Lighthouse 100/100</span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end" data-hero-card>
          <div className="bg-forge-card-bg rounded-2xl p-8 border border-forge-blue-mid/20 shadow-forge-hover w-full max-w-sm">
            <p className="text-xs font-semibold tracking-widest uppercase text-forge-text-muted mb-6">
              Validado con Google Lighthouse
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <AnimatedNumber
                  target={100}
                  className="font-humanst text-forge-orange-main leading-none text-[clamp(2.5rem,6vw,3.5rem)]"
                />
                <p className="text-xs text-forge-text-muted mt-1">Performance</p>
              </div>
              <div className="text-center">
                <AnimatedNumber
                  target={100}
                  className="font-humanst text-forge-orange-main leading-none text-[clamp(2.5rem,6vw,3.5rem)]"
                />
                <p className="text-xs text-forge-text-muted mt-1">SEO</p>
              </div>
              <div className="text-center">
                <AnimatedNumber
                  target={100}
                  className="font-humanst text-forge-orange-main leading-none text-[clamp(2.5rem,6vw,3.5rem)]"
                />
                <p className="text-xs text-forge-text-muted mt-1">Prácticas</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-forge-blue-mid/15 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <p className="text-xs text-forge-text-muted">
                Verificado en producción · AVC Inmobiliaria
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
