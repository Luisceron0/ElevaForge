import WhatsAppLink from '@/components/ui/WhatsAppLink'
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
  'presencia-digital': {
    section: 'bg-forge-blue-deep',
    // forge-blue-light sobre blue-deep da 4.23:1 (falla 4.5:1 en texto
    // pequeño) — se descarta en vez de dejarlo "casi bien"; white/70 ya
    // está verificado en este mismo panel (6.08:1).
    eyebrow: 'text-white/70',
    heading: 'text-white',
    body: 'text-white/80',
    divider: 'bg-white/15',
    pillBorder: 'border-white/30',
    pillText: 'text-white',
    capacidadText: 'text-white/70',
    iconWrap: 'bg-white/10',
    iconColor: 'text-white',
    cta: 'border-white/40 text-white hover:bg-white hover:text-forge-blue-deep',
  },
  'sistemas-de-gestion': {
    section: 'bg-forge-orange-main',
    // orange-main tiene mucho menos margen de contraste que blue-deep/
    // peach-tint (6.13:1 a opacidad completa vs. 10-14:1 de los otros) — a
    // 70-80% de opacidad cae por debajo de 4.5:1 (verificado: 3.8:1/4.58:1).
    // Por eso este panel usa forge-bg-dark a opacidad completa en todo su
    // texto, sin variantes atenuadas.
    eyebrow: 'text-forge-bg-dark',
    heading: 'text-forge-bg-dark',
    body: 'text-forge-bg-dark',
    divider: 'bg-forge-bg-dark/15',
    pillBorder: 'border-forge-bg-dark/30',
    pillText: 'text-forge-bg-dark',
    capacidadText: 'text-forge-bg-dark',
    iconWrap: 'bg-forge-bg-dark/10',
    iconColor: 'text-forge-bg-dark',
    cta: 'border-forge-bg-dark/40 text-forge-bg-dark hover:bg-forge-bg-dark hover:text-forge-orange-main',
  },
  'software-personalizado': {
    section: 'bg-forge-peach-tint',
    // forge-orange-deep sobre este fondo solo pasa AA en texto grande/negrita
    // (3.74:1) — el eyebrow es texto pequeño (12px), así que usa bg-dark/70
    // (13.51:1 de base, con margen de sobra incluso con la opacidad).
    eyebrow: 'text-forge-bg-dark/70',
    heading: 'text-forge-bg-dark',
    body: 'text-forge-bg-dark/80',
    divider: 'bg-forge-bg-dark/15',
    pillBorder: 'border-forge-bg-dark/30',
    pillText: 'text-forge-bg-dark',
    capacidadText: 'text-forge-bg-dark/70',
    iconWrap: 'bg-forge-bg-dark/10',
    iconColor: 'text-forge-bg-dark',
    cta: 'border-forge-bg-dark/40 text-forge-bg-dark hover:bg-forge-bg-dark hover:text-forge-peach-tint',
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
    <section id="soluciones" aria-label="Familias de soluciones" className="py-24 md:py-32 bg-forge-bg-light">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-mid mb-4">
            {eyebrow}
          </p>
          <h2 className="font-humanst text-fluid-h2 text-forge-bg-dark leading-tight mb-4">
            {title}
          </h2>
          <p className="text-forge-blue-deep text-lg leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {familias.map((familia) => {
            const style = panelStyles[familia.id] ?? panelStyles['presencia-digital']

            return (
              <article
                key={familia.id}
                className={`${style.section} rounded-2xl p-8 shadow-forge-card flex flex-col justify-between transition-transform duration-300 hover:-translate-y-1`}
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
        </div>
      </div>
    </section>
  )
}
