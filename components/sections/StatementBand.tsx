import Reveal from '@/components/ui/Reveal'

// Big editorial statement panel (ADR-011 / CI&T pull-quote pattern). Copy is
// the brief's own positioning ("el software es un medio, la solución es el
// producto") — not an invented business claim.
export default function StatementBand() {
  return (
    <section aria-label="Nuestra filosofía" className="bg-ef-orange py-24 md:py-36">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <Reveal>
          <p className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-ef-ink mb-10">
            <span>(03)</span>
            Cómo pensamos
          </p>
          <p className="font-humanst text-ef-ink text-fluid-display max-w-[18ch]">
            El software es un medio. La solución es el{' '}
            <span className="italic">producto.</span>
          </p>
          <p className="mt-8 text-ef-ink text-lg md:text-xl leading-relaxed max-w-2xl">
            No vendemos frameworks, lenguajes ni horas de desarrollo. Empezamos por
            el problema de tu negocio y diseñamos la solución que lo resuelve —
            con ingeniería, documentación y autonomía para tu equipo.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
