'use client'

import ProjectCard from '@/components/ui/ProjectCard'

const projects = [
  {
    nombre: 'AVC Inmobiliaria y Constructora',
    estado: 'Entregado' as const,
    sector: 'Finca raíz',
    descripcion:
      'Sitio institucional para el sector inmobiliario en Colombia, diseñado para posicionamiento orgánico y tiempos de carga mínimos.',
    url: 'https://www.avcinmobiliariayconstructora.com/',
    scores: { performance: 100, seo: 100, practices: 100, accessibility: 86 },
  },
  {
    nombre: 'Made In Heaven',
    estado: 'En curso' as const,
    sector: 'Moda',
    descripcion: 'Catálogo virtual para marca de moda colombiana.',
    url: null,
    scores: null,
  },
]

export default function ProjectsSection() {
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
            <ProjectCard key={project.nombre} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
