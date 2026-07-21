import WhatsAppLink from '@/components/ui/WhatsAppLink'
import { WHATSAPP_URLS } from '@/lib/whatsapp'
import type { FamiliaDeSolucion } from '@/lib/site-content'

const ctaByFamiliaId: Record<string, string> = {
  'presencia-digital': WHATSAPP_URLS.familiaPresenciaDigital,
  'sistemas-de-gestion': WHATSAPP_URLS.familiaSistemasGestion,
  'software-personalizado': WHATSAPP_URLS.familiaSoftwarePersonalizado,
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
          <h2
            className="font-humanst text-forge-bg-dark leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {title}
          </h2>
          <p className="text-forge-blue-deep text-lg leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {familias.map((familia) => (
            <article
              key={familia.id}
              className="bg-white rounded-2xl p-8 border border-forge-blue-mid/20 shadow-forge-card flex flex-col justify-between hover:border-forge-orange-main/30 hover:shadow-forge-hover transition-all duration-300"
            >
              <div>
                <p className="font-humanst text-forge-bg-dark leading-tight mb-3" style={{ fontSize: '1.5rem' }}>
                  {familia.nombre}
                </p>
                <p className="text-base text-forge-blue-deep/80 leading-relaxed mb-6">
                  {familia.descripcion}
                </p>

                <div className="h-px bg-forge-blue-mid/15 mb-6" />

                <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-mid mb-3">
                  Soluciones principales
                </p>
                <ul className="space-y-3 mb-6">
                  {familia.soluciones.map((solucion) => (
                    <li key={solucion} className="flex items-start gap-3 text-base text-forge-bg-dark">
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5 text-forge-orange-main mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{solucion}</span>
                    </li>
                  ))}
                </ul>

                {familia.capacidades.length > 0 && (
                  <>
                    <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-mid/70 mb-2">
                      Capacidades configurables
                    </p>
                    <p className="text-sm text-forge-bg-dark/60 leading-relaxed">
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
                className="mt-8 w-full text-center inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold border border-forge-blue-mid text-forge-blue-deep hover:bg-forge-blue-deep hover:text-white transition-colors duration-200"
              >
                {ctaLabel}
              </WhatsAppLink>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
