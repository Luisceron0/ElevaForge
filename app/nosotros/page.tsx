import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Quiénes somos · ElevaForge',
  description:
    'Equipo de 3 ingenieros de software colombianos enfocados en arquitectura, seguridad, backend, frontend y rendimiento.',
}

const team = [
  {
    initials: 'LC',
    name: 'Luis Cerón',
    role: 'Arquitectura y Seguridad',
    description:
      'Define arquitectura de sistemas, requisitos funcionales y buenas prácticas de seguridad desde el inicio del proyecto.',
    area: 'Ingeniería de software',
  },
  {
    initials: 'JD',
    name: 'Jhonatan Diaz',
    role: 'Backend, Datos y Nube',
    description:
      'Construye servicios robustos, modela base de datos y configura infraestructura cloud orientada a continuidad operativa.',
    area: 'Ingeniería de software',
  },
  {
    initials: 'SR',
    name: 'Santiago Reyes',
    role: 'Frontend, Rendimiento y Pruebas',
    description:
      'Diseña interfaces claras, valida flujos críticos, ejecuta pruebas y elimina cuellos de botella para garantizar estabilidad y velocidad en cada entrega.',
    area: 'Ingeniería de software',
  },
]

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-ef-paper pt-32 pb-24 md:pb-32">
        <section aria-label="Equipo ElevaForge" className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-ef-blue-deep mb-4">
              Quiénes somos
            </p>
            <h1 className="font-humanst text-fluid-display text-ef-ink leading-[0.98] mb-6">
              Equipo de ingeniería orientado a resultados
            </h1>
            <p className="text-ef-ink-soft text-lg leading-relaxed">
              Somos tres ingenieros de software colombianos enfocados en
              construir tecnología útil, clara y sostenible para empresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member) => (
              <article
                key={member.name}
                className="bg-white rounded-3xl p-6 border border-ef-ink/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-ef-blue-deep flex items-center justify-center text-ef-paper font-humanst text-xl">
                    {member.initials}
                  </div>
                  <div>
                    <h2 className="font-humanst text-ef-ink text-xl">{member.name}</h2>
                    <p className="text-xs text-ef-ink-soft uppercase tracking-widest">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="text-base text-ef-ink-soft leading-relaxed">
                  {member.description}
                </p>

                <div className="mt-4 pt-4 border-t border-ef-ink/10">
                  <span className="text-xs text-ef-blue-deep">
                    {member.area}
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
