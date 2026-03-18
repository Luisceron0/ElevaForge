import CTAButton from '@/components/ui/CTAButton'
import { buildWhatsAppURL } from '@/lib/whatsapp'

const steps = [
  {
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    title: 'Explorar',
    description:
      'Cuéntanos tu necesidad en pocas palabras. Respondemos con opciones claras y sin tecnicismos.',
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Planificar',
    description:
      'Transformamos tu idea en un plan claro con entregables, tiempos y costos definidos.',
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Presupuesto claro',
    description:
      'Recibes una propuesta con costos desglosados en lenguaje simple y opciones según tu presupuesto.',
  },
  {
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Construir y entregar',
    description:
      'Desarrollo iterativo con entregas periódicas y soporte para que uses la herramienta desde el primer día.',
  },
]

// Testimonials removed per request

export default function RoadmapSection() {
  return (
    <section id="proceso" className="py-20 bg-forge-bg-light">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forge-bg-dark mb-4">
            Metodología y{' '}
            <span className="text-forge-orange-main">Transparencia</span>
          </h2>
          <p className="text-lg text-forge-bg-dark/70 max-w-2xl mx-auto">
            Nuestro proceso de trabajo, paso a paso, para que sepas exactamente en qué etapa estamos en todo momento.
          </p>
        </div>

        {/* Grid 2 columnas - patrón AVC: Timeline + Testimonials */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Columna izquierda - Timeline + Testimonials */}
          <div className="space-y-10">
            {/* Process Timeline - patrón AVC SellSection */}
            <div>
              <h3 className="text-xl font-semibold text-forge-bg-dark mb-6">
                Metodología de trabajo
              </h3>
              <div className="relative">
                <div
                  className="absolute left-6 top-0 bottom-0 w-0.5 bg-forge-blue-mid/25"
                  aria-hidden="true"
                />
                <ol className="list-none p-0 m-0">
                  {steps.map((step, index) => (
                    <li
                      key={index}
                      className="relative flex gap-6 pb-8 last:pb-0"
                    >
                      <div className="relative z-10 flex-shrink-0 w-12 h-12 bg-forge-bg-dark rounded-full flex items-center justify-center shadow-lg">
                        <span className="sr-only">Paso {index + 1}:</span>
                        {step.icon}
                      </div>
                      <div className="pt-1">
                        <h4 className="font-semibold text-forge-bg-dark mb-1">
                          <span className="text-forge-orange-main mr-1" aria-hidden="true">{String(index + 1).padStart(2, '0')}.</span>
                          {step.title}
                        </h4>
                        <p className="text-forge-bg-dark/70 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Testimonials removed */}
          </div>

          {/* Columna derecha - CTA grande */}
          <div className="lg:sticky lg:top-24 space-y-8">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-forge-blue-mid/10">
              <h3 className="text-xl font-semibold text-forge-bg-dark mb-4">
                ¿Listo para empezar?
              </h3>
              <p className="text-forge-bg-dark/70 mb-6 leading-relaxed">
                El paso 01 es tuyo. Cuéntanos tu idea por WhatsApp y te
                respondemos en menos de 24 horas.
              </p>
              <CTAButton
                href={buildWhatsAppURL(
                  'Hola ElevaForge, quiero iniciar mi proyecto digital'
                )}
                label="Iniciar proyecto por WhatsApp"
                className="w-full justify-center"
              />
            </div>

            {/* Estadísticas removidas por claridad */}
          </div>
        </div>
      </div>
    </section>
  )
}
