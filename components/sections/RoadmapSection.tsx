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
    const ctx = gsap.context(() => {
      // DIS-03: under prefers-reduced-motion, jump straight to the final
      // state instead of animating. `.timeline-line` starts collapsed via
      // a static `scale-y-0` Tailwind class (not GSAP), so skipping the
      // tween entirely — unlike HeroSection's plain `.from()` calls —
      // would leave it permanently invisible; gsap.set() fixes both in one
      // frame, no animation, no motion.
      if (prefersReducedMotion()) {
        gsap.set('.timeline-line', { scaleY: 1, transformOrigin: 'top center' })
        gsap.set('.timeline-step', { opacity: 1, x: 0 })
        return
      }

      gsap.to('.timeline-line', {
        scaleY: 1,
        transformOrigin: 'top center',
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 70%',
          end: 'bottom 50%',
          scrub: 0.5,
        },
      })

      gsap.from('.timeline-step', {
        opacity: 0,
        x: -24,
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 75%',
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="proceso"
      aria-label="Proceso"
      className="py-24 md:py-32 bg-ef-teal"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-ef-paper/70 mb-4">
            {eyebrow || 'Proceso transparente'}
          </p>
          <h2 className="font-humanst text-fluid-h2 text-ef-paper leading-tight mb-4">
            {title || 'De la idea a la entrega sin zonas grises'}
          </h2>
          <p className="text-ef-paper/85 text-lg leading-relaxed">
            {description || 'Cada fase está definida para que sepas qué estamos haciendo, por qué lo hacemos y qué sigue después.'}
          </p>
        </div>

        <div className="timeline-container relative">
          <div
            className="timeline-line absolute left-6 top-0 bottom-0 w-0.5 bg-ef-paper/25 scale-y-0 origin-top"
            aria-hidden="true"
          />

          <ol className="relative space-y-0 list-none m-0 p-0">
            {steps.map((step) => (
              <li
                key={step.number}
                className="timeline-step relative flex gap-8 pb-16 last:pb-0"
              >
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-ef-orange flex items-center justify-center">
                  <span className="font-humanst text-ef-ink text-sm">
                    {step.number}
                  </span>
                </div>

                <div className="pt-2 pb-2">
                  <span className="inline-flex items-center rounded-full border border-ef-paper/30 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-ef-paper/80 mb-3">
                    Paso {step.number}
                  </span>
                  <h3 className="font-humanst text-fluid-h3 text-ef-paper mb-3">
                    {step.title}
                  </h3>
                  <p className="text-ef-paper/85 text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-ef-ink/25 rounded-3xl p-8 mt-12 border border-ef-paper/15">
          <p className="font-humanst text-ef-paper text-fluid-h2 mb-6">
            {ctaTitle || '¿Listo para el paso 01?'}
          </p>
          <CTAButton href={WHATSAPP_URLS.roadmap} variant="outline" label={ctaLabel || 'Solicitar asesoría gratuita'} />
        </div>
      </div>
    </section>
  )
}
