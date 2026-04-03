'use client'

import { useLayoutEffect, useRef } from 'react'
import BentoCard from '@/components/ui/BentoCard'
import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import { gsap } from '@/lib/gsap'

export default function ForgeStandards() {
  const containerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.bento-card', {
        opacity: 0,
        y: 32,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.bento-grid',
          start: 'top 80%',
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      id="estandar"
      aria-label="Estándares Forge"
      className="py-24 md:py-32 bg-forge-bg-dark"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-light mb-4">
            Estándares obligatorios
          </p>
          <h2
            className="font-humanst text-white leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Trust & Authority por defecto en cada entrega
          </h2>
          <p className="text-forge-text-body text-lg leading-relaxed">
            Cada proyecto pasa por rendimiento, SEO y seguridad antes de salir
            a producción. Sin excepciones.
          </p>
        </div>

        <div className="bento-grid grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <BentoCard
            label="Performance"
            className="md:col-span-2"
            value={
              <>
                <AnimatedNumber
                  target={100}
                  className="font-humanst text-forge-orange-main leading-none mb-2"
                />
                <p className="text-forge-text-muted text-base">
                  Lighthouse · Google PageSpeed
                </p>
              </>
            }
            valueClassName="font-humanst text-forge-orange-main leading-none mb-2 text-[clamp(5rem,10vw,8rem)]"
            description="Validamos con herramientas de Google antes de cada entrega. Tu sitio carga rápido desde el primer día."
            icon={
              <svg aria-hidden="true" className="h-6 w-6 text-forge-orange-main" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
          />

          <BentoCard
            label="SEO"
            value={
              <>
                <AnimatedNumber
                  target={100}
                  className="font-humanst text-forge-blue-light leading-none mb-2"
                />
                <p className="text-forge-text-muted text-base">
                  Estructura semántica y contenido optimizado
                </p>
              </>
            }
            valueClassName="text-[clamp(4rem,8vw,6rem)]"
            description="Estructuras pensadas para que Google te encuentre antes que a la competencia."
            icon={
              <svg aria-hidden="true" className="h-6 w-6 text-forge-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />

          <BentoCard
            label="Seguridad"
            value={
              <>
                <p className="font-humanst text-forge-orange-gold leading-none mb-2 text-[clamp(4rem,8vw,6rem)]">
                  A+
                </p>
                <p className="text-forge-text-muted text-base">Protección activa desde arquitectura</p>
              </>
            }
            description="Seguridad desde la arquitectura, no como parche."
            icon={
              <svg aria-hidden="true" className="h-6 w-6 text-forge-orange-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            }
          />

          <article className="bento-card md:col-span-2 bg-forge-blue-deep/30 rounded-2xl p-8 md:p-10 border border-forge-blue-mid/30 flex flex-col justify-between min-h-[240px] shadow-forge-card">
            <p
              className="font-humanst text-white leading-tight max-w-2xl"
              style={{ fontSize: 'clamp(1.4rem, 3vw, 2.3rem)' }}
            >
              Cada proyecto pasa por los 3 antes de ser entregado. Sin
              excepciones.
            </p>
            <a
              href="#proceso"
              className="mt-8 inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold border border-forge-orange-main/60 text-forge-orange-main hover:bg-forge-orange-main hover:text-white transition-colors duration-200 w-fit"
            >
              Ver nuestro proceso
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
