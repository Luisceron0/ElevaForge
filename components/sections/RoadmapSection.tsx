'use client'

import { useLayoutEffect, useRef } from 'react'
import CTAButton from '@/components/ui/CTAButton'
import { gsap } from '@/lib/gsap'
import { WHATSAPP_URLS } from '@/lib/whatsapp'

const steps = [
  {
    number: '01',
    title: 'Exploración',
    description:
      'Cuéntanos tu necesidad en pocas palabras. Respondemos con opciones claras y sin tecnicismos.',
  },
  {
    number: '02',
    title: 'Planificación',
    description:
      'Transformamos tu idea en un plan claro con entregables, tiempos y costos definidos.',
  },
  {
    number: '03',
    title: 'Presupuesto claro',
    description:
      'Recibes una propuesta con costos desglosados en lenguaje simple y opciones según tu presupuesto.',
  },
  {
    number: '04',
    title: 'Construir y entregar',
    description:
      'Desarrollo iterativo con entregas periódicas y soporte para que uses la herramienta desde el primer día.',
  },
]

export default function RoadmapSection() {
  const containerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
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
      className="py-24 md:py-32 bg-forge-bg-dark"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-light mb-4">
            Proceso transparente
          </p>
          <h2
            className="font-humanst text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            De la idea a la entrega sin zonas grises
          </h2>
          <p className="text-forge-text-body text-lg leading-relaxed">
            Cada fase está definida para que sepas qué estamos haciendo, por qué
            lo hacemos y qué sigue después.
          </p>
        </div>

        <div className="timeline-container relative">
          <div
            className="timeline-line absolute left-6 top-0 bottom-0 w-0.5 bg-forge-blue-mid/30 scale-y-0 origin-top"
            aria-hidden="true"
          />

          <ol className="relative space-y-0 list-none m-0 p-0">
            {steps.map((step) => (
              <li
                key={step.number}
                className="timeline-step relative flex gap-8 pb-16 last:pb-0"
              >
                <div className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-forge-bg-dark border-2 border-forge-orange-main flex items-center justify-center">
                  <span className="font-humanst text-forge-orange-main text-sm">
                    {step.number}
                  </span>
                </div>

                <div className="pt-2 pb-2">
                  <span className="inline-flex items-center rounded-full border border-forge-orange-main/30 px-3 py-1 text-xs font-semibold tracking-widest uppercase text-forge-orange-main mb-3">
                    Paso {step.number}
                  </span>
                  <h3 className="font-humanst text-[clamp(1.2rem,2vw,1.6rem)] text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-forge-text-body text-lg leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="bg-forge-blue-deep/20 rounded-2xl p-8 mt-12 border border-forge-blue-mid/30">
          <p className="font-humanst text-white text-[clamp(1.5rem,3vw,2.2rem)] mb-6">
            ¿Listo para el paso 01?
          </p>
          <CTAButton href={WHATSAPP_URLS.roadmap} label="Solicitar asesoría gratuita" />
        </div>
      </div>
    </section>
  )
}
