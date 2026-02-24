import ContactForm from '@/components/sections/ContactForm'

const features = [
  {
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6 text-forge-orange-main"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
        />
      </svg>
    ),
    badge: '100% tuya',
    text: 'Registramos hosting, código y dominio a tu nombre. La propiedad es completamente tuya desde el primer día.',
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6 text-forge-orange-main"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
        />
      </svg>
    ),
    badge: 'Manual PDF + Video',
    text: 'Al finalizar recibes un Manual en PDF personalizado y video-tutoriales cortos para dominar la herramienta.',
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6 text-forge-orange-main"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
    badge: 'Soporte directo',
    text: 'Una línea directa de WhatsApp para que la tecnología nunca sea un obstáculo en tu día a día.',
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6 text-forge-orange-main"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    badge: 'Sin dependencia',
    text: 'Terminado el proyecto, no dependes de nosotros. Ese es el objetivo real de cada entrega.',
  },
]

export default function AutonomySection() {
  return (
    <section id="autonomia" className="py-20 bg-forge-bg-dark">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Autonomía y{' '}
            <span className="text-forge-orange-main">Formación</span>
          </h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            No solo entregamos un producto; te empoderamos para que lo domines
          </p>
        </div>

        {/* Grid 2 columnas - patrón AVC: Beneficios + Form */}
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Izquierda - Beneficios */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                ¿Qué recibes con cada proyecto?
              </h3>
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="p-3 bg-forge-orange-main/10 rounded-lg flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-1 bg-forge-orange-main/10 text-forge-orange-main border border-forge-orange-main/30">
                      {feature.badge}
                    </span>
                    <p className="text-white/80 leading-relaxed">
                      {feature.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Derecha - Formulario de contacto */}
          <div className="bg-forge-bg-light rounded-2xl shadow-xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-forge-bg-dark mb-6">
              Cuéntanos tu proyecto
            </h3>
            <ContactForm type="proyecto" />
          </div>
        </div>
      </div>
    </section>
  )
}
