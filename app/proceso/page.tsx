import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbJsonLd } from '@/lib/seo'
import { getResolvedSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Estándar Forge — nuestro proceso de ingeniería',
  description:
    'Estándar Forge: el método de ingeniería propio de ElevaForge, de la exploración a la entrega, con visibilidad y control en cada etapa.',
  alternates: { canonical: '/proceso' },
}

export default async function ProcesoPage() {
  const content = await getResolvedSiteContent()
  const phases = content.about.phases

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Proceso', path: '/proceso' },
        ])}
      />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-ef-blue-deep pt-32 pb-24 md:pb-32">
        <section aria-label="Estándar Forge" className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-ef-paper/70 mb-4">
            Nuestro método
          </p>
          <h1 className="font-humanst text-fluid-display text-ef-paper leading-[0.98] mb-6">
            Estándar Forge
          </h1>
          <p className="text-ef-paper/85 text-lg leading-relaxed mb-14">
            {content.about.intro}
          </p>

          <ol className="space-y-8">
            {phases.map((phase, index) => (
              <li key={phase.title} className="flex gap-6">
                <div className="shrink-0 w-12 h-12 rounded-full bg-ef-orange flex items-center justify-center font-humanst text-ef-ink text-lg">
                  {index + 1}
                </div>
                <div>
                  <h2 className="font-humanst text-ef-paper text-xl mb-2">{phase.title}</h2>
                  <p className="text-base text-ef-paper/85 leading-relaxed">{phase.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <Footer />
    </>
  )
}
