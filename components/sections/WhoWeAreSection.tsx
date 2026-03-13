import { AboutContent, ProjectItem } from '@/lib/site-content'
import TeamSection from '@/components/sections/TeamSection'

interface Props {
  about: AboutContent
  projects: ProjectItem[]
}

export default function WhoWeAreSection({ about, projects }: Props) {
  return (
    <section id="quienes" className="py-20 bg-white">
      <div className="container mx-auto px-4 space-y-14">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-forge-orange-main font-semibold">Quiénes somos</p>
          <h2 className="text-3xl md:text-4xl font-bold text-forge-bg-dark mt-3 mb-4">Equipo y enfoque de trabajo</h2>
          <p className="text-forge-bg-dark/75 text-lg leading-relaxed">{about.intro}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-1">
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

        <article className="rounded-2xl bg-forge-bg-light p-6 border border-forge-blue-mid/20">
          <h3 className="text-2xl font-semibold text-forge-bg-dark mb-4">Proyectos y experiencia</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-xl border border-forge-blue-mid/15 p-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h4 className="font-semibold text-forge-bg-dark">{project.title || 'Proyecto sin título'}</h4>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-forge-orange-main/10 text-forge-orange-main">
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-forge-blue-mid font-semibold">{project.sector || 'Sector no especificado'}</p>
                <p className="text-forge-bg-dark/75 mt-2 text-sm">{project.summary || 'Sin resumen'}</p>
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  )
}
