import Badge from '@/components/ui/Badge'

const standards = [
  {
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6 text-white"
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
    title: 'Cargas rápidas',
    metric: '100',
    metricLabel: 'Performance',
    description:
      'Sitios optimizados para tiempos de carga mínimos y mejor experiencia para tus usuarios.',
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6 text-white"
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
    title: 'Protegido por diseño',
    metric: 'A+',
    metricLabel: 'Seguridad',
    description:
      'Protegemos tus datos y reducimos riesgos desde el inicio del proyecto.',
  },
  {
    icon: (
      <svg
        aria-hidden="true"
        className="h-6 w-6 text-white"
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
    title: 'Visible en Google',
    metric: '100',
    metricLabel: 'SEO',
    description:
      'Estructura y contenido pensados para que te encuentren fácilmente en buscadores.',
  },
]

export default function ForgeStandards() {
  return (
    <section id="estandar" className="py-20 bg-forge-bg-light">
      <div className="container mx-auto px-4">
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-forge-bg-dark mb-4">
            El Estándar{' '}
            <span className="text-forge-orange-main">Forge</span>
          </h2>
          <p className="text-lg text-forge-bg-dark/70 max-w-2xl mx-auto">
            Cada proyecto entregado cumple estos tres pilares sin excepción.
          </p>
        </div>

        {/* Grid de 3 cards - patrón AVC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {standards.map((item, index) => (
            <article
              key={index}
              className="bg-white rounded-2xl p-8 shadow-card border border-forge-blue-mid/10 hover:shadow-glow-blue transition-shadow duration-200"
            >
              <div className="p-3 bg-forge-orange-main/10 rounded-lg w-fit mb-5">
                <div className="w-12 h-12 bg-forge-orange-main rounded-full flex items-center justify-center shadow-lg">
                  {item.icon}
                </div>
              </div>
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
              <p className="font-inter text-forge-bg-dark/70 leading-relaxed">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
