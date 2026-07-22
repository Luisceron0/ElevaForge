'use client'

import { useLayoutEffect, useRef } from 'react'
import CTAButton from '@/components/ui/CTAButton'
import { gsap, prefersReducedMotion } from '@/lib/gsap'

interface HeroSectionProps {
  deliveredProjects: number
  inProgressProjects: number
  subtitle?: string
  badge?: string
  title?: string
  highlight?: string
  statement?: string
  primaryCtaLabel?: string
  secondaryCtaLabel?: string
}

export default function HeroSection({
  deliveredProjects,
  inProgressProjects,
  subtitle,
  badge,
  title,
  highlight,
  statement,
  primaryCtaLabel,
  secondaryCtaLabel,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from('[data-hero-eyebrow]', { opacity: 0, y: 20, duration: 0.5 })
        // Reveal each headline line from below a mask — the editorial move.
        .from('[data-hero-line]', { yPercent: 115, duration: 0.9, stagger: 0.12 }, '-=0.2')
        .from('[data-hero-sub]', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
        .from('[data-hero-ctas]', { opacity: 0, y: 16, duration: 0.6 }, '-=0.4')
        .from('[data-hero-meta] > *', { opacity: 0, y: 12, duration: 0.5, stagger: 0.08 }, '-=0.4')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const line1 = title || 'Resolvemos problemas'
  const line2 = highlight || 'de negocio.'

  return (
    <section
      ref={containerRef}
      id="inicio"
      aria-label="Inicio"
      className="relative min-h-screen flex flex-col justify-between bg-ef-ink overflow-hidden pt-32 pb-10"
    >
      {/* oversized decorative index in the corner */}
      <span
        aria-hidden="true"
        className="pointer-events-none select-none absolute -right-6 -bottom-16 font-humanst text-ef-paper/[0.04] leading-none"
        style={{ fontSize: 'clamp(16rem, 40vw, 44rem)' }}
      >
        EF
      </span>
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[60%] h-[70%] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 78% 12%, rgba(46,110,100,0.28) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-[1400px] w-full mx-auto px-4 md:px-8 lg:px-12 flex-1 flex flex-col justify-center">
        <p data-hero-eyebrow className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-ef-paper/60 mb-8">
          <span className="text-ef-orange">(01)</span>
          {badge || 'Estudio de ingeniería de software · Colombia'}
        </p>

        <h1 className="font-humanst text-fluid-mega leading-[1.02] text-ef-paper max-w-[16ch]">
          {/* pb/-mb pair keeps descenders (g, j, p) inside each overflow mask
              without adding to the visual line spacing. */}
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]"><span data-hero-line className="block">{line1}</span></span>
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]"><span data-hero-line className="block text-ef-orange">{line2}</span></span>
          <span className="block overflow-hidden pb-[0.12em] -mb-[0.12em]"><span data-hero-line className="block text-ef-paper/45">{statement || 'No vendemos tecnología.'}</span></span>
        </h1>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 lg:items-end">
          <p data-hero-sub className="text-ef-paper/70 text-lg md:text-xl leading-relaxed max-w-xl">
            {subtitle || 'Diseñamos, construimos y optimizamos software con métricas verificables, acompañamiento cercano y decisiones técnicas enfocadas en resultados de negocio.'}
          </p>

          <div data-hero-ctas className="flex flex-col sm:flex-row gap-4 lg:justify-end">
            <CTAButton href="/contacto" size="lg" label={primaryCtaLabel || 'Solicitar diagnóstico'} />
            <CTAButton href="/proyectos" size="lg" variant="outline" label={secondaryCtaLabel || 'Ver proyectos'} />
          </div>
        </div>
      </div>

      {/* bottom credential ticker */}
      <div data-hero-meta className="relative z-10 max-w-[1400px] w-full mx-auto px-4 md:px-8 lg:px-12 mt-10 border-t border-ef-paper/12 pt-6 flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-ef-paper/55">
        <span className="font-humanst text-ef-paper text-base">3 ingenieros de software</span>
        <span className="font-humanst text-ef-paper text-base">{deliveredProjects} {deliveredProjects === 1 ? 'proyecto entregado' : 'proyectos entregados'}</span>
        <span className="font-humanst text-ef-paper text-base">{inProgressProjects} en curso</span>
        <span className="hidden md:inline">Métricas Lighthouse verificadas en producción</span>
      </div>
    </section>
  )
}
