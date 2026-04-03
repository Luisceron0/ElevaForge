import type { ProjectItem } from '@/lib/site-content'

interface ProjectCardProps {
  project: ProjectItem
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isDelivered = project.status === 'entregado'

  return (
    <article
      className="group relative rounded-2xl overflow-hidden bg-forge-card-bg border border-forge-blue-mid/20 cursor-pointer flex-shrink-0 w-full md:w-[480px] min-h-[320px] transition-all duration-300 hover:border-forge-orange-main/40 hover:shadow-forge-hover snap-center"
      aria-label={`Proyecto ${project.title}`}
    >
      <div className="p-8 h-full flex flex-col justify-between">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-forge-blue-mid/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-forge-blue-light">
              {project.sector}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${
                isDelivered
                  ? 'border border-green-500/30 bg-green-500/10 text-green-400'
                  : 'border border-forge-blue-light/30 bg-forge-blue-light/10 text-forge-blue-light'
              }`}
            >
              {isDelivered ? 'Entregado' : 'En curso'}
            </span>
          </div>

          <h3 className="mb-3 font-humanst text-[clamp(1.2rem,2vw,1.7rem)] leading-tight text-white">
            {project.title}
          </h3>

          <p className="text-sm leading-relaxed text-forge-text-body">{project.summary}</p>
        </div>

        {project.lighthouse && (
          <div className="grid grid-cols-2 gap-2 border-t border-forge-blue-mid/15 pt-4">
            {project.lighthouse.performance && (
              <div className="rounded-lg bg-forge-bg-dark/50 p-2 text-center">
                <p className="font-humanst text-base leading-none text-forge-orange-main">
                  {project.lighthouse.performance.score}
                </p>
                <p className="mt-1 text-xs text-forge-text-muted">Performance</p>
              </div>
            )}
            {project.lighthouse.accessibility && (
              <div className="rounded-lg bg-forge-bg-dark/50 p-2 text-center">
                <p className="font-humanst text-base leading-none text-forge-blue-light">
                  {project.lighthouse.accessibility.score}
                </p>
                <p className="mt-1 text-xs text-forge-text-muted">Accessibility</p>
              </div>
            )}
            {project.lighthouse.bestPractices && (
              <div className="rounded-lg bg-forge-bg-dark/50 p-2 text-center">
                <p className="font-humanst text-base leading-none text-forge-orange-gold">
                  {project.lighthouse.bestPractices.score}
                </p>
                <p className="mt-1 text-xs text-forge-text-muted">Practices</p>
              </div>
            )}
            {project.lighthouse.seo && (
              <div className="rounded-lg bg-forge-bg-dark/50 p-2 text-center">
                <p className="font-humanst text-base leading-none text-forge-blue-light">
                  {project.lighthouse.seo.score}
                </p>
                <p className="mt-1 text-xs text-forge-text-muted">SEO</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-2xl bg-forge-bg-dark/90 p-6 text-center opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
        <p className="font-humanst text-2xl text-white">Ver proyecto</p>

        {project.externalUrl ? (
          <a
            href={project.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-forge-orange-main px-6 py-3 text-base font-semibold text-white shadow-forge-cta transition-colors duration-200 hover:bg-forge-orange-gold"
          >
            Visitar sitio
          </a>
        ) : (
          <p className="text-base text-forge-text-body">Disponible pronto</p>
        )}
      </div>
    </article>
  )
}
