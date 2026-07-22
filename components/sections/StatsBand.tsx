import { AnimatedNumber } from '@/components/ui/AnimatedNumber'
import Reveal from '@/components/ui/Reveal'
import type { LighthouseScores } from '@/lib/site-content'

interface StatsBandProps {
  lighthouse: LighthouseScores
}

// Editorial authority band (ADR-011 / RF-018): the Lighthouse scores as
// oversized numbers on a full-bleed teal panel — the CI&T "big number"
// pattern. Orange numerals read as large text (>24px) so 3.51:1 clears the
// AA large-text threshold; labels stay cream. Real values render in SSR
// (RF-018), the count-up is progressive enhancement.
export default function StatsBand({ lighthouse }: StatsBandProps) {
  const scores = [
    { label: 'Performance', metric: lighthouse.performance },
    { label: 'Accessibility', metric: lighthouse.accessibility },
    { label: 'Best Practices', metric: lighthouse.bestPractices },
    { label: 'SEO', metric: lighthouse.seo },
  ]

  return (
    <section aria-label="Métricas verificadas" className="bg-ef-blue-deep py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
          <p className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-ef-paper/70">
            <span className="text-ef-paper">(02)</span>
            Prueba antes que promesa
          </p>
          <p className="text-ef-paper/75 text-base max-w-md md:text-right">
            Puntajes Lighthouse reales, verificados en producción, no aspiracionales.
          </p>
        </Reveal>

        <Reveal stagger className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 border-t border-ef-paper/20 pt-12">
          {scores.map((item) => (
            <div key={item.label}>
              <AnimatedNumber
                target={item.metric.score}
                className="font-humanst text-ef-orange text-fluid-giant block leading-[0.85]"
              />
              <p className="mt-3 font-humanst text-ef-paper text-lg md:text-xl">{item.label}</p>
              <p className="mt-1 text-sm text-ef-paper/65 leading-snug max-w-[22ch]">
                {item.metric.description}
              </p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
