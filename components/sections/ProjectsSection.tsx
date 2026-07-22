import type { ProjectItem } from '@/lib/site-content'
import ProjectCard from '@/components/ui/ProjectCard'
import Reveal from '@/components/ui/Reveal'

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
    <section id="proyectos" aria-label="Proyectos" className="py-24 md:py-32 bg-ef-paper">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12">
        <Reveal className="max-w-3xl mb-14">
          <p className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-ef-teal mb-6">
            <span>(07)</span>
            {eyebrow}
          </p>
          <h2 className="font-humanst text-fluid-display text-ef-ink mb-5">
            {title}
          </h2>
          <p className="text-ef-ink-soft text-lg md:text-xl leading-relaxed">
            {description}
          </p>
        </Reveal>

        {deliveredProjects.length > 0 && (
          <div className="mb-12">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-humanst text-fluid-h3 text-ef-ink">{deliveredLabel}</h3>
              <span className="rounded-full border border-ef-teal/30 bg-ef-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ef-teal">
                {deliveredProjects.length}
              </span>
            </div>
            <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {deliveredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Reveal>
          </div>
        )}

        {inProgressProjects.length > 0 && (
          <div>
            <div className="mb-5 flex items-center justify-between">
              <h3 className="font-humanst text-fluid-h3 text-ef-ink">{inProgressLabel}</h3>
              <span className="rounded-full border border-ef-orange/50 bg-ef-orange/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-ef-ink">
                {inProgressProjects.length}
              </span>
            </div>
            <Reveal stagger className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {inProgressProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </Reveal>
          </div>
        )}

        {inProgressNotes.length > 0 && (
          <div className="mt-10 rounded-3xl border border-ef-ink/10 bg-ef-paper-dim p-6 md:p-8">
            <h4 className="font-humanst text-ef-ink text-xl mb-4">{notesTitle}</h4>
            <ul className="space-y-3">
              {inProgressNotes.map((note, index) => (
                <li key={`${note}-${index}`} className="text-ef-ink-soft text-base leading-relaxed break-words">
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
