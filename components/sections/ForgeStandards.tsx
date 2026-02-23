import Badge from '@/components/ui/Badge'

const standards = [
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-10 h-10 text-forge-orange-main"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
    title: 'Rendimiento Implacable',
    metric: '100',
    metricLabel: 'Lighthouse Performance',
    description:
      'Desarrollamos bajo estándares de optimización del 100%, asegurando que tu sitio vuele.',
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-10 h-10 text-forge-orange-main"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: 'Blindaje Digital',
    metric: 'A+',
    metricLabel: 'Security Rating',
    description:
      'Seguridad y mejores prácticas integradas desde la primera línea de código.',
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="w-10 h-10 text-forge-orange-main"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    title: 'Visibilidad Nativa',
    metric: '100',
    metricLabel: 'Lighthouse SEO',
    description:
      'Estructuras pensadas para que Google te encuentre antes que a la competencia.',
  },
]

export default function ForgeStandards() {
  return (
    <section id="estandar" className="py-24 bg-forge-bg-light">
      <div className="max-w-6xl mx-auto px-6">
        {/* Encabezado de sección */}
        <div className="text-center mb-16">
          <Badge variant="orange" className="mb-4">
            Nuestra Garantía
          </Badge>
          <h2 className="font-humanst text-3xl md:text-4xl text-forge-bg-dark">
            El Estándar Forge
          </h2>
          <p className="mt-4 text-forge-bg-dark/65 max-w-xl mx-auto">
            Cada proyecto entregado cumple estos tres pilares sin excepción.
          </p>
        </div>

        {/* Grid de 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {standards.map((item, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl p-8 shadow-card border border-forge-blue-mid/10 hover:shadow-glow-blue transition-all duration-300"
            >
              <div className="mb-5">{item.icon}</div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="font-humanst text-5xl text-forge-orange-main">
                  {item.metric}
                </span>
                <span className="text-xs font-bold text-forge-blue-mid uppercase">
                  {item.metricLabel}
                </span>
              </div>
              <h3 className="font-humanst text-xl text-forge-bg-dark mb-3">
                {item.title}
              </h3>
              <p className="font-inter text-forge-bg-dark/65 leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
