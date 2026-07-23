import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbJsonLd } from '@/lib/seo'
import { getResolvedSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Casos reales de ElevaForge: reto, solución y resultado, con métricas Lighthouse verificables.',
  alternates: { canonical: '/proyectos' },
}

export default async function ProyectosPage() {
  const content = await getResolvedSiteContent()
  const entregados = content.projects.filter((p) => p.status === 'entregado')
  const enCurso = content.projects.filter((p) => p.status === 'en-curso')

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Proyectos', path: '/proyectos' },
        ])}
      />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-ef-paper pt-32 pb-24 md:pb-32">
        <section aria-label="Proyectos" className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-ef-blue-deep mb-4">
              Proyectos
            </p>
            <h1 className="font-humanst text-fluid-display text-ef-ink leading-[0.98] mb-6">
              Casos reales que respaldan nuestro estándar
            </h1>
            <p className="text-ef-ink-soft text-lg leading-relaxed">
              Experiencia aplicada en productos digitales con foco en velocidad, SEO y claridad operativa.
            </p>
          </div>

          {entregados.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-ef-blue-deep mb-5">
                Proyectos entregados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entregados.map((project) => (
                  <Link
                    key={project.id}
                    href={`/proyectos/${project.id}`}
                    className="block bg-white rounded-3xl p-6 border border-ef-ink/10 hover:border-ef-blue-deep/40 hover:shadow-[0_12px_40px_rgba(23,23,28,0.10)] transition-all duration-300"
                  >
                    <p className="text-xs text-ef-blue-deep uppercase tracking-widest mb-2">{project.sector}</p>
                    <h3 className="font-humanst text-ef-ink text-xl mb-2">{project.title}</h3>
                    <p className="text-sm text-ef-ink-soft leading-relaxed">{project.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {enCurso.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-ef-blue-deep mb-5">
                Proyectos en curso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enCurso.map((project) => (
                  <div
                    key={project.id}
                    className="bg-ef-paper-dim rounded-3xl p-6 border border-ef-ink/10"
                  >
                    <p className="text-xs text-ef-ink-soft uppercase tracking-widest mb-2">{project.sector}</p>
                    <h3 className="font-humanst text-ef-ink text-xl mb-2">{project.title}</h3>
                    <p className="text-sm text-ef-ink-soft leading-relaxed">{project.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  )
}
