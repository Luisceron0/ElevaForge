import WhatsAppLink from '@/components/ui/WhatsAppLink'
import Reveal from '@/components/ui/Reveal'
import { WHATSAPP_URLS } from '@/lib/whatsapp'
import { safeExternalUrl } from '@/lib/safe-url'
import type { FamiliaDeSolucion } from '@/lib/site-content'

const ctaByFamiliaId: Record<string, string> = {
  'presencia-digital': WHATSAPP_URLS.familiaPresenciaDigital,
  'sistemas-de-gestion': WHATSAPP_URLS.familiaSistemasGestion,
  'software-personalizado': WHATSAPP_URLS.familiaSoftwarePersonalizado,
}

// ADR-011 editorial: each familia is a full-bleed color panel row (teal /
// clay / ink) with an oversized section index and a two-column layout —
// replaces the three equal side-by-side cards. Contrast verified per panel;
// clay uses ink text only.
type PanelStyle = {
  section: string
  index: string
  eyebrow: string
  heading: string
  body: string
  /** Fondo/borde de cada fila de solución dentro del panel. */
  card: string
  /** Separador entre filas cuando no hay tarjeta (recurso visual liviano). */
  divider: string
  pill: string
  /** Estado hover/focus del botón de demo. */
  pillLink: string
  capChip: string
  cta: string
}

const panelStyles: Record<string, PanelStyle> = {
  'presencia-digital': {
    section: 'bg-ef-blue-deep',
    index: 'text-ef-paper/55',
    eyebrow: 'text-ef-paper/70',
    heading: 'text-ef-paper',
    body: 'text-ef-paper/80',
    card: 'bg-ef-paper/[0.06] border-ef-paper/15',
    divider: 'divide-ef-paper/12',
    pill: 'border-ef-paper/35 text-ef-paper',
    pillLink: 'hover:bg-ef-paper hover:text-ef-blue-deep focus-visible:bg-ef-paper focus-visible:text-ef-blue-deep',
    capChip: 'border-ef-paper/25 text-ef-paper/80',
    cta: 'border-ef-paper/40 text-ef-paper hover:bg-ef-paper hover:text-ef-blue-deep',
  },
  'sistemas-de-gestion': {
    // clay panel: SOLO texto ink pleno — clay tiene poco margen, incluso
    // opacidades reducidas de ink caen bajo AA (ver lessons.md).
    section: 'bg-ef-orange',
    index: 'text-ef-ink/75',
    eyebrow: 'text-ef-ink',
    heading: 'text-ef-ink',
    body: 'text-ef-ink',
    card: 'bg-ef-ink/[0.05] border-ef-ink/15',
    divider: 'divide-ef-ink/12',
    pill: 'border-ef-ink/35 text-ef-ink',
    pillLink: 'hover:bg-ef-ink hover:text-ef-orange focus-visible:bg-ef-ink focus-visible:text-ef-orange',
    capChip: 'border-ef-ink/25 text-ef-ink',
    cta: 'border-ef-ink/40 text-ef-ink hover:bg-ef-ink hover:text-ef-orange',
  },
  'software-personalizado': {
    section: 'bg-ef-ink',
    index: 'text-ef-paper/45',
    eyebrow: 'text-ef-paper/70',
    heading: 'text-ef-paper',
    body: 'text-ef-paper/80',
    card: 'bg-ef-paper/[0.05] border-ef-paper/12',
    divider: 'divide-ef-paper/10',
    pill: 'border-ef-paper/35 text-ef-paper',
    pillLink: 'hover:bg-ef-paper hover:text-ef-ink focus-visible:bg-ef-paper focus-visible:text-ef-ink',
    capChip: 'border-ef-paper/20 text-ef-paper/80',
    cta: 'border-ef-paper/40 text-ef-paper hover:bg-ef-paper hover:text-ef-ink',
  },
}

interface SolucionesSectionProps {
  familias: FamiliaDeSolucion[]
  eyebrow: string
  title: string
  description: string
  ctaLabel: string
}

export default function SolucionesSection({ familias, eyebrow, title, description, ctaLabel }: SolucionesSectionProps) {
  return (
    <section id="soluciones" aria-label="Familias de soluciones">
      {/* intro */}
      <div className="bg-ef-paper-dim pt-24 md:pt-32 pb-16">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
          <Reveal className="max-w-3xl">
            <p className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-ef-blue-deep mb-6">
              <span>(04)</span>
              {eyebrow}
            </p>
            <h2 className="font-humanst text-fluid-display text-ef-ink mb-5">
              {title}
            </h2>
            <p className="text-ef-ink-soft text-lg md:text-xl leading-relaxed">
              {description}
            </p>
          </Reveal>
        </div>
      </div>

      {/* one full-bleed panel per familia */}
      {familias.map((familia, i) => {
        const style = panelStyles[familia.id] ?? panelStyles['presencia-digital']
        const idx = String(i + 1).padStart(2, '0')

        return (
          <div key={familia.id} className={`${style.section} py-16 md:py-24 overflow-hidden`}>
            <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
              <Reveal className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-start">
                {/* left: index + name */}
                <div>
                  <span aria-hidden="true" className={`font-humanst leading-[0.8] block ${style.index}`} style={{ fontSize: 'clamp(4rem, 9vw, 8rem)' }}>
                    {idx}
                  </span>
                  <h3 className={`font-humanst text-fluid-h1 mt-4 ${style.heading}`}>
                    {familia.nombre}
                  </h3>
                </div>

                {/* right: description + solutions + capacities + cta */}
                <div className="lg:pt-6">
                  <p className={`text-lg leading-relaxed mb-8 ${style.body}`}>
                    {familia.descripcion}
                  </p>

                  <p className={`text-xs font-semibold tracking-[0.2em] uppercase mb-3 ${style.eyebrow}`}>
                    Soluciones principales
                  </p>
                  {/* Cada solución con su propia descripción y, si existe, su
                      demo — visibles acá mismo, sin tener que entrar a
                      /soluciones/[familia] para verlas (pedido del cliente,
                      2026-08-03: la info relevante se ve desde el Home). */}
                  <div className={`mb-8 divide-y rounded-2xl border ${style.card} ${style.divider}`}>
                    {familia.soluciones.map((solucion) => {
                      // Re-sanitizado en render (defensa en profundidad): el
                      // valor ya pasó por zod al guardar y por safeExternalUrl
                      // al normalizar, pero la fila de site_content también
                      // puede escribirse por fuera del panel admin.
                      const demoUrl = safeExternalUrl(solucion.demoUrl)

                      return (
                        <div key={solucion.nombre} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 sm:px-5">
                          <div className="min-w-0">
                            <p className={`font-semibold ${style.heading}`}>{solucion.nombre}</p>
                            {solucion.descripcion && (
                              <p className={`mt-1 text-sm leading-relaxed ${style.body}`}>{solucion.descripcion}</p>
                            )}
                          </div>

                          {demoUrl && (
                            <a
                              href={demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors duration-200 ${style.pill} ${style.pillLink}`}
                            >
                              Ver demo
                              <span className="sr-only"> de {solucion.nombre} (se abre en una pestaña nueva)</span>
                              <svg aria-hidden="true" className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H18v4.5M17.5 6.5 10 14M15 14.5V18H6V9h3.5" />
                              </svg>
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {familia.capacidades.length > 0 && (
                    <div className="mb-8">
                      <p className={`text-xs font-semibold tracking-[0.2em] uppercase mb-3 ${style.eyebrow}`}>
                        Capacidades configurables
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {familia.capacidades.map((capacidad) => (
                          <span
                            key={capacidad}
                            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${style.capChip}`}
                          >
                            {capacidad}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <WhatsAppLink
                    href={ctaByFamiliaId[familia.id] ?? WHATSAPP_URLS.hero}
                    source={`soluciones-${familia.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-base font-semibold border transition-colors duration-200 ${style.cta}`}
                  >
                    {ctaLabel}
                  </WhatsAppLink>
                </div>
              </Reveal>
            </div>
          </div>
        )
      })}
    </section>
  )
}
