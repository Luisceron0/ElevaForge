import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbJsonLd } from '@/lib/seo'
import { getResolvedSiteContent } from '@/lib/site-content'

// Contenido dinámico (Supabase) — los proyectos "en curso" no tienen
// página propia (§14): solo se resuelven acá los "entregado".
async function getEntregado(slug: string) {
  const content = await getResolvedSiteContent()
  const project = content.projects.find((p) => p.id === slug)
  if (!project || project.status !== 'entregado') return undefined
  return project
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = await getEntregado(slug)
  if (!project) return {}

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/proyectos/${project.id}` },
  }
}

export default async function ProyectoDetallePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getEntregado(slug)
  if (!project) notFound()

  const lighthouseEntries = project.lighthouse
    ? Object.entries(project.lighthouse).filter(([, metric]) => metric)
    : []

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Proyectos', path: '/proyectos' },
          { name: project.title, path: `/proyectos/${project.id}` },
        ])}
      />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-ef-paper pt-32 pb-24 md:pb-32">
        <article aria-label={project.title} className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-ef-blue-deep mb-4">
            {project.sector}
          </p>
          <h1 className="font-humanst text-fluid-h1 text-ef-ink leading-tight mb-6">
            {project.title}
          </h1>

          <section className="mb-10">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-ef-blue-deep mb-3">
              Reto y solución
            </h2>
            <p className="text-ef-ink-soft text-lg leading-relaxed">{project.summary}</p>
          </section>

          {project.results.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-ef-blue-deep mb-4">
                Resultado
              </h2>
              <ul className="space-y-3">
                {project.results.map((result) => (
                  <li key={result} className="flex items-start gap-3 text-base text-ef-ink">
                    <svg aria-hidden="true" className="h-5 w-5 text-ef-blue-deep mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {lighthouseEntries.length > 0 && (
            <section className="mb-10">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-ef-blue-deep mb-4">
                Métricas Lighthouse verificadas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {lighthouseEntries.map(([key, metric]) => (
                  <div key={key} className="rounded-2xl border border-ef-ink/10 bg-white p-4 text-center">
                    <p className="font-humanst text-ef-blue-deep text-3xl leading-none">{metric?.score}</p>
                    <p className="text-xs text-ef-ink-soft mt-2 capitalize">{key}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {project.externalUrl && (
            <a
              href={project.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-semibold border border-ef-ink/25 text-ef-ink hover:bg-ef-ink hover:text-ef-paper transition-colors duration-200"
            >
              Ver sitio en vivo →
            </a>
          )}
        </article>
      </main>
      <Footer />
    </>
  )
}
