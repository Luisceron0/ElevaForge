import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export const metadata: Metadata = {
  title: 'Quiénes somos · ElevaForge',
  description:
    'Equipo de 4 ingenieros de software colombianos enfocados en arquitectura, rendimiento, backend y experiencia de usuario.',
}

const team = [
  {
    initials: 'LU',
    name: 'Luis',
    role: 'Arquitectura y Seguridad',
    description:
      'Define arquitectura de sistemas, requisitos funcionales y buenas prácticas de seguridad desde el inicio del proyecto.',
    area: 'Ingeniería de software',
  },
  {
    initials: 'JH',
    name: 'Jhonatan',
    role: 'Backend y Datos',
    description:
      'Construye servicios robustos, modela base de datos y configura infraestructura cloud orientada a continuidad operativa.',
    area: 'Ingeniería de software',
  },
  {
    initials: 'MI',
    name: 'Miguel',
    role: 'Optimización y Rendimiento',
    description:
      'Detecta cuellos de botella y mejora tiempos de respuesta para mantener una experiencia rápida en todos los dispositivos.',
    area: 'Ingeniería de software',
  },
  {
    initials: 'SA',
    name: 'Santiago',
    role: 'Frontend y Pruebas',
    description:
      'Diseña interfaces claras, valida flujos críticos y ejecuta pruebas para garantizar estabilidad antes de cada entrega.',
    area: 'Ingeniería de software',
  },
]

export default function NosotrosPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-forge-bg-dark pt-24 pb-24 md:pb-32">
        <section aria-label="Equipo ElevaForge" className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-light mb-4">
              Quiénes somos
            </p>
            <h1 className="font-humanst text-white leading-tight mb-4" style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}>
              Equipo de ingeniería orientado a resultados
            </h1>
            <p className="text-forge-text-body text-lg leading-relaxed">
              Somos cuatro ingenieros de software colombianos enfocados en
              construir tecnología útil, clara y sostenible para empresas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member) => (
              <article
                key={member.name}
                className="bg-forge-card-bg rounded-2xl p-6 border border-forge-blue-mid/20"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-forge-blue-primary to-forge-blue-deep flex items-center justify-center text-white font-humanst text-xl">
                    {member.initials}
                  </div>
                  <div>
                    <h2 className="font-humanst text-white text-xl">{member.name}</h2>
                    <p className="text-xs text-forge-text-muted uppercase tracking-widest">
                      {member.role}
                    </p>
                  </div>
                </div>

                <p className="text-base text-forge-text-body leading-relaxed">
                  {member.description}
                </p>

                <div className="mt-4 pt-4 border-t border-forge-blue-mid/15">
                  <span className="text-xs text-forge-blue-light">
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
