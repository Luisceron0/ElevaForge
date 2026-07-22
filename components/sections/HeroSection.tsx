'use client'

import { useLayoutEffect, useRef } from 'react'
import CTAButton from '@/components/ui/CTAButton'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { WHATSAPP_URLS } from '@/lib/whatsapp'
import type { LighthouseScores } from '@/lib/site-content'

interface HeroSectionProps {
  lighthouse: LighthouseScores
  deliveredProjects: number
  inProgressProjects: number
  subtitle?: string
  badge?: string
  title?: string
  highlight?: string
  primaryCtaLabel?: string
  secondaryCtaLabel?: string
}

export default function HeroSection({
  lighthouse,
  deliveredProjects,
  inProgressProjects,
  subtitle,
  badge,
  title,
  highlight,
  primaryCtaLabel,
  secondaryCtaLabel,
}: HeroSectionProps) {
  const containerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    // DIS-03: skip the entrance timeline entirely under reduced-motion —
    // elements render at their natural visible state (see lib/gsap.ts).
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out', duration: 0.6 } })
      tl.from('[data-hero-badge]', { opacity: 0, y: -16 })
        .from('[data-hero-title]', { opacity: 0, y: 24 }, '-=0.3')
        .from('[data-hero-subtitle]', { opacity: 0, y: 16 }, '-=0.4')
        .from('[data-hero-ctas]', { opacity: 0, y: 12 }, '-=0.4')
        .from('[data-hero-card]', { opacity: 0, x: 20 }, '-=0.5')
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const scores = [
    { label: 'Performance', metric: lighthouse.performance },
    { label: 'Accessibility', metric: lighthouse.accessibility },
    { label: 'Best Practices', metric: lighthouse.bestPractices },
    { label: 'SEO', metric: lighthouse.seo },
  ]

  return (
    <section
      ref={containerRef}
      id="inicio"
      aria-label="Inicio"
      className="relative min-h-screen flex items-center pt-24 pb-16 bg-ef-ink overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[70%] h-[80%] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 55% 55% at 80% 15%, rgba(46,110,100,0.22) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 w-full grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-14 items-center relative z-10">
        <div>
          <span
            data-hero-badge
            className="inline-flex items-center gap-2 mb-7 px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase bg-ef-paper/[0.06] text-ef-paper/75 border border-ef-paper/15"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-ef-orange" aria-hidden="true" />
            {badge || 'Estudio de ingeniería de software · Colombia'}
          </span>

          <h1
            data-hero-title
            className="font-humanst text-fluid-display leading-[0.98] text-ef-paper mb-7"
          >
            {title || 'Resolvemos problemas de negocio'}
            <span className="block text-ef-orange">{highlight || 'con ingeniería, no con tecnología'}</span>
          </h1>

          <p
            data-hero-subtitle
            className="text-ef-paper/70 text-lg md:text-xl leading-relaxed max-w-xl mb-10"
          >
            {subtitle || 'Diseñamos, construimos y optimizamos software con métricas verificables, acompañamiento cercano y decisiones técnicas enfocadas en resultados de negocio.'}
          </p>

          <div data-hero-ctas className="flex flex-col sm:flex-row gap-4 mb-12">
            <CTAButton href="/contacto" size="lg" label={primaryCtaLabel || 'Solicitar diagnóstico'} />
            <CTAButton href="/proyectos" size="lg" variant="outline" label={secondaryCtaLabel || 'Ver proyectos'} />
          </div>

          <div className="flex flex-wrap gap-x-4 md:gap-x-8 gap-y-2 text-base text-ef-paper/55">
            <span>3 ingenieros de software</span>
            <span className="text-ef-paper/30" aria-hidden="true">·</span>
            <span>{deliveredProjects} {deliveredProjects === 1 ? 'proyecto entregado' : 'proyectos entregados'}</span>
            <span className="text-ef-paper/30" aria-hidden="true">·</span>
            <span>{inProgressProjects} en curso</span>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end" data-hero-card>
          <div className="bg-ef-paper/[0.04] rounded-3xl p-6 md:p-8 border border-ef-paper/12 backdrop-blur-sm w-full max-w-md">
            <p className="text-xs font-semibold tracking-widest uppercase text-ef-paper/55 mb-6 text-center">
              Validado con Lighthouse
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {scores.map((item) => (
                <div key={item.label} className="rounded-2xl border border-ef-paper/10 bg-ef-ink/40 p-4">
                  <AnimatedNumber
                    target={item.metric.score}
                    className="font-humanst text-ef-orange leading-none text-fluid-stat block"
                  />
                  <p className="text-xs text-ef-paper/70 mt-2 font-semibold">{item.label}</p>
                  <p className="text-xs text-ef-paper/50 mt-2 leading-snug line-clamp-2">
                    {item.metric.description}
                  </p>
                </div>
              ))}
            </div>

            <div className="relative pt-6 border-t border-ef-paper/10">
              <div className="flex items-start justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-ef-teal-mid animate-pulse flex-shrink-0 mt-1" />
                <p className="text-xs text-ef-paper/55 text-center">
                  Verificado en producción · {lighthouse.auditedProject}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
