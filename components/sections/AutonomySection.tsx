import Badge from '@/components/ui/Badge'

const features = [
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-10 h-10 text-forge-blue-light"
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
    title: 'Dueño de tu Código',
    description:
      'Registramos hosting, código y dominio a tu nombre. La propiedad es completamente tuya desde el primer día.',
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-10 h-10 text-forge-blue-light"
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
    title: 'Capacitación ElevaForge',
    description:
      'Al finalizar recibes un Manual en PDF personalizado y video-tutoriales cortos para que tú y tu equipo dominen la herramienta sin depender de terceros.',
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-10 h-10 text-forge-blue-light"
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
    title: 'Acompañamiento por WhatsApp',
    description:
      'Una línea directa para que la tecnología nunca sea un obstáculo en tu día a día.',
  },
]

export default function AutonomySection() {
  return (
    <section id="autonomia" className="py-24 bg-forge-bg-dark">
      <div className="max-w-6xl mx-auto px-6">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <Badge variant="blue" className="mb-4">
            Tu Diferencial
          </Badge>
          <h2 className="font-humanst text-3xl md:text-4xl text-white">
            Autonomía y Formación
          </h2>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Terminado el proyecto, no dependes de nosotros. Ese es el objetivo.
          </p>
        </div>

        {/* Grid de 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-forge-card-bg rounded-2xl p-8 border border-forge-blue-mid/30 hover:border-forge-orange-main/50 transition-all duration-300"
            >
              <div className="mb-5">{item.icon}</div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold mb-5 bg-forge-orange-main/10 text-forge-orange-main border border-forge-orange-main/30">
                {item.badge}
              </span>
              <h3 className="font-humanst text-xl text-white mb-3">
                {item.title}
              </h3>
              <p className="font-inter text-white/60 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
