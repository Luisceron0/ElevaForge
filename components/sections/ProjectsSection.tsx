import type { ProjectItem } from '@/lib/site-content'
import ProjectCard from '@/components/ui/ProjectCard'

interface ProjectsSectionProps {
  projects: ProjectItem[]
  inProgressNotes: string[]
  eyebrow: string
  title: string
  description: string
  deliveredLabel: string
  inProgressLabel: string
  notesTitle: string
}

export default function ProjectsSection({
  projects,
  inProgressNotes,
  eyebrow,
  title,
  description,
  deliveredLabel,
  inProgressLabel,
  notesTitle,
}: ProjectsSectionProps) {
  const filteredProjects = projects.filter((p) => p.id || p.title || p.summary || p.sector)
  const deliveredProjects = filteredProjects.filter((project) => project.status === 'entregado')
  const inProgressProjects = filteredProjects.filter((project) => project.status === 'en-curso')

  return (
    <section id="proyectos" aria-label="Proyectos" className="py-24 md:py-32 bg-forge-bg-light">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-mid mb-4">
            {eyebrow}
          </p>
          <h2
            className="font-humanst text-forge-bg-dark leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {title}
          </h2>
          <p className="text-forge-blue-deep text-lg leading-relaxed">
            {description}
          </p>
        </div>

        {deliveredProjects.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-humanst text-forge-bg-dark text-[clamp(1.3rem,2vw,1.8rem)]">{deliveredLabel}</h3>
              <span className="rounded-full border border-emerald-600/30 bg-emerald-600/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-emerald-700">
                {deliveredProjects.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {deliveredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {inProgressProjects.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-humanst text-forge-bg-dark text-[clamp(1.3rem,2vw,1.8rem)]">{inProgressLabel}</h3>
              <span className="rounded-full border border-forge-orange-main/30 bg-forge-orange-main/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-forge-orange-main">
                {inProgressProjects.length}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {inProgressProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {inProgressNotes.length > 0 && (
          <div className="mt-10 rounded-2xl border border-forge-blue-mid/20 bg-white p-6 md:p-8">
            <h4 className="font-humanst text-forge-bg-dark text-xl mb-4">{notesTitle}</h4>
            <ul className="space-y-3">
              {inProgressNotes.map((note, index) => (
                <li key={`${note}-${index}`} className="text-forge-blue-deep text-base leading-relaxed break-words">
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
