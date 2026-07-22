import WhatsAppLink from '@/components/ui/WhatsAppLink'
import Reveal from '@/components/ui/Reveal'
import { WHATSAPP_URLS } from '@/lib/whatsapp'
import type { FamiliaDeSolucion } from '@/lib/site-content'

const ctaByFamiliaId: Record<string, string> = {
  'presencia-digital': WHATSAPP_URLS.familiaPresenciaDigital,
  'sistemas-de-gestion': WHATSAPP_URLS.familiaSistemasGestion,
  'software-personalizado': WHATSAPP_URLS.familiaSoftwarePersonalizado,
}

// RF-026/DIS-05 (SRS v0.3 §29): cada familia tiene su propio panel de color
// saturado en vez de la tarjeta blanca uniforme anterior — 3 familias reales,
// 3 tonos ya verificados en ADR-010 (contraste calculado, no a ojo). El orden
// de la tabla no implica jerarquía de valor (RF-022): ninguna familia lleva
// badge de "recomendado".
const panelStyles: Record<string, {
  section: string
  eyebrow: string
  heading: string
  body: string
  divider: string
  pillBorder: string
  pillText: string
  capacidadText: string
  iconWrap: string
  iconColor: string
  cta: string
}> = {
  // ADR-011: teal / clay / ink panels, contraste verificado por par.
  'presencia-digital': {
    section: 'bg-ef-teal',
    eyebrow: 'text-ef-paper/75',
    heading: 'text-ef-paper',
    body: 'text-ef-paper/85',
    divider: 'bg-ef-paper/15',
    pillBorder: 'border-ef-paper/30',
    pillText: 'text-ef-paper',
    capacidadText: 'text-ef-paper/75',
    iconWrap: 'bg-ef-paper/10',
    iconColor: 'text-ef-paper',
    cta: 'border-ef-paper/40 text-ef-paper hover:bg-ef-paper hover:text-ef-teal',
  },
  'sistemas-de-gestion': {
    // clay panel: SOLO texto ink (cream/white falla contraste). Sin
    // variantes de opacidad reducida — clay tiene poco margen, ink pleno.
    section: 'bg-ef-clay',
    eyebrow: 'text-ef-ink',
    heading: 'text-ef-ink',
    body: 'text-ef-ink',
    divider: 'bg-ef-ink/20',
    pillBorder: 'border-ef-ink/30',
    pillText: 'text-ef-ink',
    capacidadText: 'text-ef-ink',
    iconWrap: 'bg-ef-ink/10',
    iconColor: 'text-ef-ink',
    cta: 'border-ef-ink/40 text-ef-ink hover:bg-ef-ink hover:text-ef-clay',
  },
  'software-personalizado': {
    section: 'bg-ef-ink',
    eyebrow: 'text-ef-paper/75',
    heading: 'text-ef-paper',
    body: 'text-ef-paper/85',
    divider: 'bg-ef-paper/15',
    pillBorder: 'border-ef-paper/30',
    pillText: 'text-ef-paper',
    capacidadText: 'text-ef-paper/75',
    iconWrap: 'bg-ef-paper/10',
    iconColor: 'text-ef-paper',
    cta: 'border-ef-paper/40 text-ef-paper hover:bg-ef-paper hover:text-ef-ink',
  },
}

const familiaIcons: Record<string, React.ReactNode> = {
  'presencia-digital': (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  ),
  'sistemas-de-gestion': (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  'software-personalizado': (
    <svg aria-hidden="true" className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 8l-4 4 4 4" />
    </svg>
  ),
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
    <section id="soluciones" aria-label="Familias de soluciones" className="py-24 md:py-32 bg-ef-paper-dim">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <Reveal className="max-w-3xl mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-ef-teal mb-4">
            {eyebrow}
          </p>
          <h2 className="font-humanst text-fluid-h2 text-ef-ink leading-tight mb-4">
            {title}
          </h2>
          <p className="text-ef-ink-soft text-lg leading-relaxed">
            {description}
          </p>
        </Reveal>

        <Reveal stagger className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {familias.map((familia) => {
            const style = panelStyles[familia.id] ?? panelStyles['presencia-digital']

            return (
              <article
                key={familia.id}
                className={`${style.section} rounded-3xl p-8 flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-full ${style.iconWrap} ${style.iconColor} flex items-center justify-center mb-5`}>
                    {familiaIcons[familia.id] ?? familiaIcons['presencia-digital']}
                  </div>

                  <p className={`font-humanst leading-tight mb-3 ${style.heading}`} style={{ fontSize: '1.5rem' }}>
                    {familia.nombre}
                  </p>
                  <p className={`text-base leading-relaxed mb-6 ${style.body}`}>
                    {familia.descripcion}
                  </p>

                  <div className={`h-px ${style.divider} mb-6`} />

                  <p className={`text-xs font-semibold tracking-widest uppercase mb-3 ${style.eyebrow}`}>
                    Soluciones principales
                  </p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {familia.soluciones.map((solucion) => (
                      <span
                        key={solucion}
                        className={`inline-flex items-center rounded-full border ${style.pillBorder} ${style.pillText} px-3 py-1.5 text-sm font-medium`}
                      >
                        {solucion}
                      </span>
                    ))}
                  </div>

                  {familia.capacidades.length > 0 && (
                    <>
                      <p className={`text-xs font-semibold tracking-widest uppercase mb-2 ${style.eyebrow}`}>
                        Capacidades configurables
                      </p>
                      <p className={`text-sm leading-relaxed ${style.capacidadText}`}>
                        {familia.capacidades.join(' · ')}
                      </p>
                    </>
                  )}
                </div>

                <WhatsAppLink
                  href={ctaByFamiliaId[familia.id] ?? WHATSAPP_URLS.hero}
                  source={`soluciones-${familia.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-8 w-full text-center inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold border transition-colors duration-200 ${style.cta}`}
                >
                  {ctaLabel}
                </WhatsAppLink>
              </article>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
