import { AboutContent } from '@/lib/site-content'
import TeamSection from '@/components/sections/TeamSection'

interface Props {
  about: AboutContent
}

export default function WhoWeAreSection({ about }: Props) {
  return (
    <section id="quienes" className="py-20 bg-white">
      <div className="container mx-auto px-4 space-y-14">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-forge-orange-main font-semibold">Quiénes somos</p>
          <h2 className="text-3xl md:text-4xl font-bold text-forge-bg-dark mt-3 mb-4">Metodología, equipo y resultados</h2>
          <p className="text-forge-bg-dark/75 text-lg leading-relaxed">{about.intro}</p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-forge-bg-dark mb-6">Metodología de trabajo</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {about.phases.map((phase) => (
              <article key={phase.title} className="rounded-2xl border border-forge-blue-mid/20 p-5 bg-forge-bg-light">
                <h4 className="font-semibold text-forge-bg-dark mb-2">{phase.title}</h4>
                <p className="text-forge-bg-dark/75 leading-relaxed">{phase.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl bg-forge-bg-dark text-white p-6">
            <h3 className="text-2xl font-semibold mb-4">Pilares obligatorios</h3>
            <div className="space-y-4">
              {about.pillars.map((pillar) => (
                <div key={pillar.title}>
                  <h4 className="font-semibold text-forge-orange-gold">{pillar.title}</h4>
                  <p className="text-white/80">{pillar.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-2xl bg-forge-bg-light p-6 border border-forge-blue-mid/20">
            <h3 className="text-2xl font-semibold text-forge-bg-dark mb-4">Lo que nos diferencia</h3>
            <div className="space-y-4">
              {about.differentiators.map((item) => (
                <div key={item.title}>
                  <h4 className="font-semibold text-forge-bg-dark">{item.title}</h4>
                  <p className="text-forge-bg-dark/75">{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Team profile cards — sección con fondo oscuro para contraste */}
        <div className="rounded-3xl bg-forge-bg-dark p-8 -mx-4 sm:mx-0">
          <TeamSection team={about.team} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <article className="rounded-2xl border border-forge-blue-mid/20 p-6 bg-white">
            <h3 className="text-xl font-semibold text-forge-bg-dark">Experiencia y resultados</h3>
            <p className="text-forge-orange-main font-semibold mt-2">{about.experience.title}</p>
            <p className="text-forge-bg-dark/75 mt-2">{about.experience.description}</p>
            <p className="text-forge-bg-dark/75 mt-3">{about.projectsInProgress}</p>
          </article>

          <article className="rounded-2xl border border-forge-blue-mid/20 p-6 bg-forge-bg-light">
            <h3 className="text-xl font-semibold text-forge-bg-dark">Soporte y mantenimiento</h3>
            <ul className="mt-3 space-y-2 text-forge-bg-dark/80">
              {about.supportItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-forge-orange-main mt-1">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </div>
    </section>
  )
}
