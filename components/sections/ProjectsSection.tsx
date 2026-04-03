import { getResolvedSiteContent } from '@/lib/site-content'
import ProjectCard from '@/components/ui/ProjectCard'
import Image from 'next/image'

export default async function ProjectsSection() {
  const content = await getResolvedSiteContent()
  const projects = content.projects.filter((p) => p.id || p.title || p.summary || p.sector)
  const deliveredProjects = projects.filter((project) => project.status === 'entregado')
  const inProgressProjects = projects.filter((project) => project.status === 'en-curso')
  const narrative = content.about.experience
  const inProgressNotes = content.about.projectsInProgress
  const primaryDelivered = deliveredProjects[0]

  const normalizeText = (value: string) => String(value ?? '').trim().toLowerCase()
  const isNarrativeDuplicated =
    !!primaryDelivered &&
    normalizeText(narrative.title) === normalizeText(primaryDelivered.title) &&
    normalizeText(narrative.description) === normalizeText(primaryDelivered.summary)

  return (
    <section id="proyectos" aria-label="Proyectos" className="py-24 md:py-32 bg-forge-bg-light">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-mid mb-4">
            Proyectos y resultados
          </p>
          <h2
            className="font-humanst text-forge-bg-dark leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            Casos reales que respaldan nuestro estándar
          </h2>
          <p className="text-forge-blue-deep text-lg leading-relaxed">
            Experiencia aplicada en productos digitales con foco en velocidad,
            SEO y claridad operativa.
          </p>
        </div>

        {!isNarrativeDuplicated && (
          <article className="mb-12 rounded-2xl border border-forge-blue-mid/20 bg-white p-6 md:p-8 shadow-forge-card">
            <h3 className="font-humanst text-forge-bg-dark mb-3 text-[clamp(1.4rem,2.5vw,2rem)]">
              {narrative.title}
            </h3>
            <p className="text-forge-blue-deep text-base md:text-lg leading-relaxed mb-5">
              {narrative.description}
            </p>

            {narrative.imageUrl && (
              <div className="mb-5 overflow-hidden rounded-xl border border-forge-blue-mid/15 bg-forge-bg-light/40 p-2">
                <Image
                  src={narrative.imageUrl}
                  alt={narrative.title || 'Caso de experiencia'}
                  width={1200}
                  height={600}
                  className="h-48 w-full rounded-lg object-cover md:h-56"
                  unoptimized={narrative.imageUrl.startsWith('http') && !narrative.imageUrl.includes('/storage/v1/object/')}
                />
              </div>
            )}

            {narrative.items.length > 0 && (
              <ul className="grid gap-3 md:grid-cols-2">
                {narrative.items.map((item, index) => (
                  <li key={`${item}-${index}`} className="rounded-xl border border-forge-blue-mid/15 bg-forge-bg-light/40 px-4 py-3 text-sm md:text-base text-forge-bg-dark/85">
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </article>
        )}

        {deliveredProjects.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-humanst text-forge-bg-dark text-[clamp(1.3rem,2vw,1.8rem)]">Proyectos entregados</h3>
              <span className="rounded-full border border-emerald-600/30 bg-emerald-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                {deliveredProjects.length}
              </span>
            </div>
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {deliveredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {inProgressProjects.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-humanst text-forge-bg-dark text-[clamp(1.3rem,2vw,1.8rem)]">Proyectos en curso</h3>
              <span className="rounded-full border border-forge-orange-main/30 bg-forge-orange-main/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-forge-orange-main">
                {inProgressProjects.length}
              </span>
            </div>
            <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
              {inProgressProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {inProgressNotes.length > 0 && (
          <div className="mt-10 rounded-2xl border border-forge-blue-mid/20 bg-white p-6 md:p-8">
            <h4 className="font-humanst text-forge-bg-dark text-xl mb-4">Seguimiento activo del equipo</h4>
            <ul className="space-y-3">
              {inProgressNotes.map((note, index) => (
                <li key={`${note}-${index}`} className="text-forge-blue-deep text-base leading-relaxed">
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
