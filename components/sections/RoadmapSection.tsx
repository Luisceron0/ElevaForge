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
      // DIS-03: under reduced motion, jump everything to the final state.
      // The progress fill starts collapsed via a static class, so it needs
      // an explicit set() (skipping wouldn't reveal it).
      if (prefersReducedMotion()) {
        gsap.set('.timeline-progress-fill', { scaleY: 1 })
        gsap.set('.timeline-step', { opacity: 1, y: 0 })
        gsap.set('.timeline-num', { opacity: 1, x: 0, scale: 1 })
        return
      }

      // Vertical progress rail fills as the list scrolls through the viewport.
      gsap.to('.timeline-progress-fill', {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-container',
          start: 'top 65%',
          end: 'bottom 70%',
          scrub: 0.4,
        },
      })

      // Each step reveals as it enters: number slides + scales in, text lifts.
      gsap.utils.toArray<HTMLElement>('.timeline-step').forEach((li) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: li, start: 'top 82%' },
          defaults: { ease: 'power3.out' },
        })
        tl.from(li.querySelector('.timeline-num'), { x: -40, scale: 0.7, opacity: 0, duration: 0.6 })
          .from(li.querySelector('.timeline-body'), { y: 26, opacity: 0, duration: 0.6 }, '-=0.4')
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="proceso"
      aria-label="Proceso"
      className="py-24 md:py-32 bg-ef-blue-deep overflow-hidden"
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

        <div className="relative">
          {/* scroll-scrubbed progress rail */}
          <div aria-hidden="true" className="hidden md:block absolute left-0 top-0 bottom-0 w-px bg-ef-paper/15">
            <div className="timeline-progress-fill absolute inset-0 bg-ef-orange origin-top scale-y-0" />
          </div>

          <ol className="timeline-container list-none m-0 p-0 border-t border-ef-paper/20 md:pl-12">
            {steps.map((step) => (
              <li
                key={step.number}
                className="timeline-step group grid grid-cols-1 md:grid-cols-[auto_1fr] gap-4 md:gap-12 items-baseline border-b border-ef-paper/20 py-10 md:py-12"
              >
                <span className="timeline-num font-humanst text-ef-orange leading-[0.8] transition-colors duration-300 group-hover:text-ef-gold" style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}>
                  {step.number}
                </span>
                <div className="timeline-body">
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
        </div>

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
