import type { ProjectItem } from '@/lib/site-content'
import Image from 'next/image'
import Link from 'next/link'

interface ProjectCardProps {
  project: ProjectItem
}

// Light card, designed to sit on the cream (ef-paper) panels. Stat numbers
// use teal on light backgrounds — orange as text on cream is only AA-large
// and axe-core reads the display font as normal weight, so teal is the safe
// accent here (orange stays a fill/dark-panel color, ADR-011).
export default function ProjectCard({ project }: ProjectCardProps) {
  const isDelivered = project.status === 'entregado'
  const isRemoteImage = Boolean(project.imageUrl && /^https?:\/\//i.test(project.imageUrl))

  return (
    <article
      className="group relative rounded-3xl overflow-hidden bg-white border border-ef-ink/10 w-full min-h-[320px] transition-all duration-300 hover:border-ef-teal/40 hover:shadow-[0_12px_40px_rgba(23,23,28,0.10)]"
      aria-label={`Proyecto ${project.title}`}
    >
      <div className="p-6 md:p-8 h-full flex flex-col">
        <div>
          {project.imageUrl && (
            <div className="mb-4 overflow-hidden rounded-2xl border border-ef-ink/10 bg-ef-paper-dim p-2">
              <Image
                src={project.imageUrl}
                alt={project.title || 'Proyecto'}
                width={960}
                height={540}
                className="h-36 w-full rounded-xl object-cover"
                unoptimized={isRemoteImage}
              />
            </div>
          )}

          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="inline-flex items-center rounded-full border border-ef-ink/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-ef-ink-soft break-words max-w-[60%]">
              {project.sector}
            </span>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-widest ${
                isDelivered
                  ? 'border border-ef-teal/30 bg-ef-teal/10 text-ef-teal'
                  : 'border border-ef-orange/50 bg-ef-orange/10 text-ef-ink'
              }`}
            >
              {isDelivered ? 'Entregado' : 'En curso'}
            </span>
          </div>

          <h3 className="mb-3 font-humanst text-fluid-h3 leading-tight text-ef-ink break-words">
            {project.title}
          </h3>

          <p className="text-sm leading-relaxed text-ef-ink-soft break-words">{project.summary}</p>

          {isDelivered && (
            <Link
              href={`/proyectos/${project.id}`}
              className="mt-4 inline-flex items-center justify-center rounded-full border border-ef-ink/25 px-4 py-2 text-sm font-semibold text-ef-ink transition-colors duration-200 hover:bg-ef-ink hover:text-ef-paper mr-2"
            >
              Ver caso completo
            </Link>
          )}

          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center rounded-full border border-ef-orange px-4 py-2 text-sm font-semibold text-ef-ink transition-colors duration-200 hover:bg-ef-orange"
            >
              Visitar sitio
            </a>
          )}
        </div>

        {project.lighthouse && (
          <div className="mt-6 grid grid-cols-2 gap-2 border-t border-ef-ink/10 pt-4">
            {project.lighthouse.performance && (
              <div className="rounded-xl bg-ef-paper p-2 text-center">
                <p className="font-humanst text-base leading-none text-ef-teal">
                  {project.lighthouse.performance.score}
                </p>
                <p className="mt-1 text-xs text-ef-ink-soft">Performance</p>
              </div>
            )}
            {project.lighthouse.accessibility && (
              <div className="rounded-xl bg-ef-paper p-2 text-center">
                <p className="font-humanst text-base leading-none text-ef-teal">
                  {project.lighthouse.accessibility.score}
                </p>
                <p className="mt-1 text-xs text-ef-ink-soft">Accessibility</p>
              </div>
            )}
            {project.lighthouse.bestPractices && (
              <div className="rounded-xl bg-ef-paper p-2 text-center">
                <p className="font-humanst text-base leading-none text-ef-teal">
                  {project.lighthouse.bestPractices.score}
                </p>
                <p className="mt-1 text-xs text-ef-ink-soft">Practices</p>
              </div>
            )}
            {project.lighthouse.seo && (
              <div className="rounded-xl bg-ef-paper p-2 text-center">
                <p className="font-humanst text-base leading-none text-ef-teal">
                  {project.lighthouse.seo.score}
                </p>
                <p className="mt-1 text-xs text-ef-ink-soft">SEO</p>
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
