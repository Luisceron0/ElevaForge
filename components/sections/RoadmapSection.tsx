import Badge from '@/components/ui/Badge'
import CTAButton from '@/components/ui/CTAButton'
import { buildWhatsAppURL } from '@/lib/whatsapp'

const steps = [
  {
    number: '01',
    title: 'Exploración',
    description:
      'Cuéntanos tu idea por WhatsApp. Sin formularios largos, sin tecnicismos. Solo una conversación.',
  },
  {
    number: '02',
    title: 'Traducción',
    description:
      'Convertimos tus necesidades en un plan técnico claro y entendible.',
  },
  {
    number: '03',
    title: 'Presupuesto Humano',
    description:
      'Costos claros y desglosados en lenguaje que entiendes. Sin letras pequeñas.',
  },
  {
    number: '04',
    title: 'La Forja',
    description:
      'Diseño, desarrollo y pruebas constantes con actualizaciones semanales de avance.',
  },
  {
    number: '05',
    title: 'Entrega y Empoderamiento',
    description:
      'Lanzamiento, entrega de manual PDF, video-tutoriales y soporte activo post-entrega.',
  },
]

export default function RoadmapSection() {
  return (
    <section id="proceso" className="py-24 bg-forge-bg-light">
      <div className="max-w-3xl mx-auto px-6">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <Badge variant="orange" className="mb-4">
            Proceso Claro
          </Badge>
          <h2 className="font-humanst text-3xl md:text-4xl text-forge-bg-dark">
            Roadmap de Transparencia
          </h2>
          <p className="mt-4 text-forge-bg-dark/65">
            Sabes exactamente en qué etapa estamos en todo momento.
          </p>
        </div>

        {/* Timeline */}
        <ol aria-label="Pasos del proceso">
          {steps.map((step, index) => (
            <li
              key={index}
              className="relative flex gap-8 items-start pb-12 last:pb-0"
            >
              {/* Línea vertical conectora */}
              {index < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="absolute left-6 top-12 bottom-0 w-0.5 bg-forge-blue-mid/25"
                />
              )}

              {/* Círculo con número */}
              <div
                aria-hidden="true"
                className="relative z-10 flex-shrink-0 w-12 h-12 rounded-full bg-forge-bg-dark border-2 border-forge-orange-main flex items-center justify-center"
              >
                <span className="font-humanst text-forge-orange-main text-xs">
                  {step.number}
                </span>
              </div>

              {/* Texto del paso */}
              <div className="pt-2">
                <h3 className="font-humanst text-xl text-forge-bg-dark mb-2">
                  {step.title}
                </h3>
                <p className="font-inter text-forge-bg-dark/65 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* CTA final */}
        <div className="text-center mt-16">
          <p className="text-forge-bg-dark/65 mb-6 text-lg">
            ¿Listo para empezar? El paso 01 es tuyo.
          </p>
          <CTAButton
            href={buildWhatsAppURL(
              'Hola ElevaForge, quiero iniciar mi proyecto digital'
            )}
            label="Iniciar proyecto por WhatsApp"
          />
        </div>
      </div>
    </section>
  )
}
