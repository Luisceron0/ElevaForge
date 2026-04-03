import { getResolvedSiteContent } from '@/lib/site-content'
import ProjectCard from '@/components/ui/ProjectCard'

export default async function ProjectsSection() {
  const content = await getResolvedSiteContent()
  const projects = content.projects.filter((p) => p.title && p.summary)

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

        <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
          {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
