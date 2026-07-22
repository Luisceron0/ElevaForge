import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbJsonLd } from '@/lib/seo'
import { getResolvedSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Proyectos',
  description: 'Casos reales de ElevaForge — reto, solución y resultado, con métricas Lighthouse verificables.',
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
      <main id="main-content" className="min-h-screen bg-forge-bg-dark pt-24 pb-24 md:pb-32">
        <section aria-label="Proyectos" className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-light mb-4">
              Proyectos
            </p>
            <h1 className="font-humanst text-fluid-display text-white leading-tight mb-4">
              Casos reales que respaldan nuestro estándar
            </h1>
            <p className="text-forge-text-body text-lg leading-relaxed">
              Experiencia aplicada en productos digitales con foco en velocidad, SEO y claridad operativa.
            </p>
          </div>

          {entregados.length > 0 && (
            <div className="mb-12">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-forge-blue-light mb-4">
                Proyectos entregados
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {entregados.map((project) => (
                  <Link
                    key={project.id}
                    href={`/proyectos/${project.id}`}
                    className="block bg-forge-card-bg rounded-2xl p-6 border border-forge-blue-mid/20 hover:border-forge-orange-main/40 transition-all duration-300"
                  >
                    <p className="text-xs text-forge-blue-light uppercase tracking-widest mb-2">{project.sector}</p>
                    <h3 className="font-humanst text-white text-xl mb-2">{project.title}</h3>
                    <p className="text-sm text-forge-text-body leading-relaxed">{project.summary}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {enCurso.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-forge-blue-light mb-4">
                Proyectos en curso
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enCurso.map((project) => (
                  <div
                    key={project.id}
                    className="bg-forge-card-bg/50 rounded-2xl p-6 border border-forge-blue-mid/10"
                  >
                    <p className="text-xs text-forge-text-muted uppercase tracking-widest mb-2">{project.sector}</p>
                    <h3 className="font-humanst text-white/80 text-xl mb-2">{project.title}</h3>
                    <p className="text-sm text-forge-text-muted leading-relaxed">{project.summary}</p>
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
