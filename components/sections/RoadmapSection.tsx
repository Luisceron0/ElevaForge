'use client'

import { useLayoutEffect, useRef } from 'react'
import CTAButton from '@/components/ui/CTAButton'
import { gsap, prefersReducedMotion } from '@/lib/gsap'
import { WHATSAPP_URLS } from '@/lib/whatsapp'
import type { AboutPhase } from '@/lib/site-content'

interface RoadmapSectionProps {
  phases: AboutPhase[]
  eyebrow?: string
  title?: string
  description?: string
  ctaTitle?: string
  ctaLabel?: string
}

export default function RoadmapSection({ phases, eyebrow, title, description, ctaTitle, ctaLabel }: RoadmapSectionProps) {
  const containerRef = useRef<HTMLElement>(null)
  const steps = phases.slice(0, 4).map((phase, index) => ({
    number: String(index + 1).padStart(2, '0'),
    title: phase.title,
    description: phase.description,
  }))

  useLayoutEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.from('.timeline-step', {
        opacity: 0,
        y: 32,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.timeline-container', start: 'top 78%' },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="proceso"
      aria-label="Proceso"
      className="py-24 md:py-32 bg-ef-teal overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mb-16">
          <p className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-ef-paper/70 mb-6">
            <span className="text-ef-paper">(05)</span>
            {eyebrow || 'Proceso transparente'}
          </p>
          <h2 className="font-humanst text-fluid-display text-ef-paper mb-5">
            {title || 'De la idea a la entrega sin zonas grises'}
          </h2>
          <p className="text-ef-paper/85 text-lg md:text-xl leading-relaxed">
            {description || 'Cada fase está definida para que sepas qué estamos haciendo, por qué lo hacemos y qué sigue después.'}
          </p>
        </div>

        <ol className="timeline-container list-none m-0 p-0 border-t border-ef-paper/20">
          {steps.map((step) => (
            <li
              key={step.number}
              className="timeline-step grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-12 items-baseline border-b border-ef-paper/20 py-10 md:py-12"
            >
              <span className="font-humanst text-ef-orange leading-[0.8]" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
                {step.number}
              </span>
              <div>
                <h3 className="font-humanst text-fluid-h2 text-ef-paper mb-3">
                  {step.title}
                </h3>
                <p className="text-ef-paper/85 text-lg leading-relaxed max-w-2xl">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-14 flex flex-col sm:flex-row sm:items-center gap-6">
          <p className="font-humanst text-ef-paper text-fluid-h3">
            {ctaTitle || '¿Listo para el paso 01?'}
          </p>
          <CTAButton href={WHATSAPP_URLS.roadmap} variant="outline" label={ctaLabel || 'Solicitar asesoría gratuita'} />
        </div>
      </div>
    </section>
  )
}
