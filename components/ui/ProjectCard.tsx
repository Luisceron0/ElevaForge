interface Project {
  nombre: string
  estado: 'Entregado' | 'En curso'
  sector: string
  descripcion: string
  url: string | null
  scores: {
    performance: number
    seo: number
    practices: number
    accessibility: number
  } | null
}

interface ProjectCardProps {
  project: Project
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const isDelivered = project.estado === 'Entregado'

  return (
    <article
      className="group relative rounded-2xl overflow-hidden bg-forge-card-bg border border-forge-blue-mid/20 cursor-pointer flex-shrink-0 w-full md:w-[480px] min-h-[320px] transition-all duration-300 hover:border-forge-orange-main/40 hover:shadow-forge-hover snap-center"
      aria-label={`Proyecto ${project.nombre}`}
    >
      <div className="p-8 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4 gap-3">
            <span className="inline-flex items-center rounded-full border border-forge-blue-mid/30 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase text-forge-blue-light">
              {project.sector}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold tracking-widest uppercase ${
                isDelivered
                  ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                  : 'bg-forge-blue-light/10 text-forge-blue-light border border-forge-blue-light/30'
              }`}
            >
              {project.estado}
            </span>
          </div>

          <h3 className="font-humanst text-[clamp(1.2rem,2vw,1.7rem)] text-white mb-3 leading-tight">
            {project.nombre}
          </h3>

          <p className="text-forge-text-body text-base leading-relaxed">
            {project.descripcion}
          </p>
        </div>

        {project.scores && (
          <div className="flex gap-6 pt-6 border-t border-forge-blue-mid/15">
            <div className="text-center">
              <p className="font-humanst text-forge-orange-main text-2xl leading-none">
                {project.scores.performance}
              </p>
              <p className="text-xs text-forge-text-muted mt-1">Perf.</p>
            </div>
            <div className="text-center">
              <p className="font-humanst text-forge-blue-light text-2xl leading-none">
                {project.scores.seo}
              </p>
              <p className="text-xs text-forge-text-muted mt-1">SEO</p>
            </div>
            <div className="text-center">
              <p className="font-humanst text-forge-orange-gold text-2xl leading-none">
                {project.scores.practices}
              </p>
              <p className="text-xs text-forge-text-muted mt-1">Pract.</p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-forge-bg-dark/90 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 text-center">
        <p className="font-humanst text-white text-2xl">Ver proyecto</p>

        {project.url ? (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold bg-forge-orange-main hover:bg-forge-orange-gold text-white shadow-forge-cta transition-colors duration-200"
          >
            Visitar sitio
          </a>
        ) : (
          <p className="text-forge-text-body text-base">Disponible pronto</p>
        )}
      </div>
    </article>
  )
}
