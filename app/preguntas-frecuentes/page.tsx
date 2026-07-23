import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbJsonLd, faqJsonLd } from '@/lib/seo'
import { getResolvedSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: 'Respuestas claras sobre cómo trabajamos, qué incluye un diagnóstico y cómo se define la inversión de tu proyecto.',
  alternates: { canonical: '/preguntas-frecuentes' },
}

export default async function PreguntasFrecuentesPage() {
  // RF-019 / CRO-05: the Q&A lives in the content model (about.faq) so it is
  // editable from /admin; it also feeds the FAQPage structured data.
  const content = await getResolvedSiteContent()
  const faqItems = content.about.faq

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Preguntas frecuentes', path: '/preguntas-frecuentes' },
        ])}
      />
      <JsonLd data={faqJsonLd(faqItems)} />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-ef-paper pt-32 pb-24 md:pb-32">
        <section aria-label="Preguntas frecuentes" className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-ef-blue-deep mb-4">
            Preguntas frecuentes
          </p>
          <h1 className="font-humanst text-fluid-display text-ef-ink leading-[0.98] mb-10">
            Antes de escribirnos
          </h1>

          <div className="space-y-8">
            {faqItems.map((item) => (
              <div key={item.question} className="border-b border-ef-ink/12 pb-8">
                <h2 className="font-humanst text-ef-ink text-xl mb-3">{item.question}</h2>
                <p className="text-base text-ef-ink-soft leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
