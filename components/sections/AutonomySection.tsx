const items = [
  {
    badge: '100% tuya',
    title: 'Propiedad del código',
    description:
      'Registramos hosting, código y dominio a tu nombre para que el producto quede bajo tu control total.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-forge-orange-main" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
      </svg>
    ),
  },
  {
    badge: 'Manual PDF + Video',
    title: 'Capacitación real',
    description:
      'Recibes material paso a paso para operar tu plataforma sin fricción desde el primer día.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-forge-orange-main" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    badge: 'Soporte directo',
    title: 'WhatsApp sin intermediarios',
    description:
      'Canal directo con nuestro equipo para resolver dudas y mantener continuidad operativa.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-forge-orange-main" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
  },
  {
    badge: 'Sin dependencia',
    title: 'Autonomía operativa',
    description:
      'La meta final es que puedas administrar tu plataforma sin depender de terceros para tareas cotidianas.',
    icon: (
      <svg aria-hidden="true" className="h-6 w-6 text-forge-orange-main" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
]

export default function AutonomySection() {
  return (
    <section id="autonomia" aria-label="Autonomía y formación" className="py-24 md:py-32 bg-forge-bg-light">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-mid mb-4">
            Diferencial ElevaForge
          </p>
          <h2 className="font-humanst text-forge-bg-dark leading-tight mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Autonomía y formación desde el día uno
          </h2>
          <p className="text-forge-blue-deep text-lg leading-relaxed">
            Entregamos tecnología útil, documentada y operable por tu equipo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {items.map((item) => (
            <article
              key={item.badge}
              className="flex flex-col gap-4 p-8 bg-white rounded-2xl border border-forge-blue-mid/15 shadow-forge-card"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-forge-orange-main/10 flex items-center justify-center flex-shrink-0">
                  {item.icon}
                </div>

                <span className="inline-flex items-center rounded-full border border-forge-orange-main/30 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase text-forge-orange-main">
                  {item.badge}
                </span>
              </div>

              <h3 className="font-humanst text-[clamp(1.1rem,2vw,1.4rem)] text-forge-bg-dark">
                {item.title}
              </h3>
              <p className="text-forge-bg-dark/65 leading-relaxed text-base">
                {item.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
