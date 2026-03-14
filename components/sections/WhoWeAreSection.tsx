import { AboutContent, ProjectItem } from '@/lib/site-content'
import TeamSection from '@/components/sections/TeamSection'

interface Props {
  about: AboutContent
  projects: ProjectItem[]
}

export default function WhoWeAreSection({ about, projects }: Props) {
  const differentiationItems = mergeDifferentiationItems(about)
  const finishedProjects = projects.filter((project) => project.status === 'entregado')
  const inProgressProjects = projects.filter((project) => project.status === 'en-curso')

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
              {differentiationItems.map((item) => (
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

        <article id="proyectos" className="rounded-2xl bg-forge-bg-light p-6 border border-forge-blue-mid/20">
          <h3 className="text-2xl font-semibold text-forge-bg-dark mb-4">{about.experience.title}</h3>
          <p className="text-forge-bg-dark/75 mb-4">{about.experience.description}</p>
          {about.experience.items.length > 0 && (
            <ul className="grid gap-2 sm:grid-cols-2 mb-6">
              {about.experience.items.map((item, index) => (
                <li key={`${item}-${index}`} className="bg-white rounded-xl border border-forge-blue-mid/15 p-3 text-sm text-forge-bg-dark/80">
                  {item}
                </li>
              ))}
            </ul>
          )}

          <div className="space-y-8">
            <section aria-labelledby="proyectos-terminados">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 id="proyectos-terminados" className="text-2xl font-semibold text-forge-bg-dark">Proyectos terminados</h3>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-600/10 text-emerald-700 border border-emerald-600/20">
                  Entregados
                </span>
              </div>
              {finishedProjects.length > 0 ? (
                <div className="space-y-4">
                  {finishedProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-xl border border-emerald-600/20 p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h4 className="font-semibold text-forge-bg-dark">{project.title || 'Proyecto sin título'}</h4>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-600/10 text-emerald-700">
                          entregado
                        </span>
                      </div>
                      <p className="text-sm text-forge-blue-mid font-semibold">{project.sector || 'Sector no especificado'}</p>
                      <p className="text-forge-bg-dark/75 mt-2 text-sm">{project.summary || 'Sin resumen'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-forge-bg-dark/70">Aún no hay proyectos entregados para mostrar.</p>
              )}
            </section>

            <section aria-labelledby="proyectos-desarrollo" className="pt-6 border-t border-forge-blue-mid/20">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 id="proyectos-desarrollo" className="text-2xl font-semibold text-forge-bg-dark">Proyectos en desarrollo</h3>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-forge-orange-main/10 text-forge-orange-main border border-forge-orange-main/20">
                  En curso
                </span>
              </div>

              {about.projectsInProgress.length > 0 && (
                <ul className="space-y-2 mb-5">
                  {about.projectsInProgress.map((item, index) => (
                    <li key={`${item}-${index}`} className="text-forge-bg-dark/75 flex items-start gap-2">
                      <span className="mt-2 inline-block h-1.5 w-1.5 rounded-full bg-forge-orange-main" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              {inProgressProjects.length > 0 ? (
                <div className="space-y-4">
                  {inProgressProjects.map((project) => (
                    <div key={project.id} className="bg-white rounded-xl border border-forge-orange-main/20 p-4">
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <h4 className="font-semibold text-forge-bg-dark">{project.title || 'Proyecto sin título'}</h4>
                        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-forge-orange-main/10 text-forge-orange-main">
                          en-curso
                        </span>
                      </div>
                      <p className="text-sm text-forge-blue-mid font-semibold">{project.sector || 'Sector no especificado'}</p>
                      <p className="text-forge-bg-dark/75 mt-2 text-sm">{project.summary || 'Sin resumen'}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-forge-bg-dark/70">En este momento no tenemos proyectos activos publicados.</p>
              )}
            </section>
          </div>
        </article>
      </div>
    </section>
  )
}

function mergeDifferentiationItems(about: AboutContent): AboutContent['pillars'] {
  const items = [...about.pillars, ...about.differentiators]
  const seen = new Set<string>()
  const merged: AboutContent['pillars'] = []

  for (const item of items) {
    const title = String(item?.title ?? '').trim()
    const description = String(item?.description ?? '').trim()
    if (!title || !description) continue

    const key = `${title.toLowerCase()}::${description.toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push({ title, description })
  }

  return merged
}
