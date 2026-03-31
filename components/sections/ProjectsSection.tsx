import Image from 'next/image'
import { ProjectItem } from '@/lib/site-content'

interface Props {
  projects: ProjectItem[]
}

export default function ProjectsSection({ projects }: Props) {
  return (
    <section id="proyectos" className="py-20 bg-forge-bg-light">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <p className="text-sm uppercase tracking-[0.2em] text-forge-orange-main font-semibold">Proyectos, experiencia y resultados</p>
          <h2 className="text-3xl md:text-4xl font-bold text-forge-bg-dark mt-3">Trabajos que respaldan nuestro estándar</h2>
          <p className="text-forge-bg-dark/70 mt-4 text-lg">
            Aquí consolidamos experiencia aplicada y resultados medibles en proyectos entregados y casos en curso. Todo este contenido es editable desde el panel de administración.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <article key={project.id} className="bg-white rounded-2xl border border-forge-blue-mid/15 overflow-hidden shadow-sm">
              {project.imageUrl && (
                <div className="h-44 bg-forge-bg-dark/5 flex items-center justify-center p-4">
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    width={720}
                    height={360}
                    className="max-h-full w-auto object-contain"
                    unoptimized={project.imageUrl.startsWith('http') && !project.imageUrl.includes('/storage/v1/object/')}
                  />
                </div>
              )}
              <div className="p-6">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-xl text-forge-bg-dark">{project.title}</h3>
                  <span className="px-2 py-1 rounded-full text-xs font-semibold bg-forge-orange-main/10 text-forge-orange-main">
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-forge-blue-mid font-semibold">{project.sector}</p>
                <p className="text-forge-bg-dark/75 mt-3">{project.summary}</p>

                <ul className="mt-4 space-y-2 text-sm text-forge-bg-dark/75">
                  {project.results.map((result) => (
                    <li key={result} className="flex items-start gap-2">
                      <span className="text-forge-orange-main mt-1">●</span>
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>

                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-5 text-forge-orange-main font-semibold hover:underline"
                  >
                    Ver proyecto
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
