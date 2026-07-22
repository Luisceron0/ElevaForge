import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import WhatsAppLink from '@/components/ui/WhatsAppLink'
import { breadcrumbJsonLd, serviceJsonLd } from '@/lib/seo'
import { getResolvedSiteContent, DEFAULT_SOLUCIONES, type FamiliaId } from '@/lib/site-content'
import { WHATSAPP_URLS } from '@/lib/whatsapp'

const ctaByFamiliaId: Record<FamiliaId, string> = {
  'presencia-digital': WHATSAPP_URLS.familiaPresenciaDigital,
  'sistemas-de-gestion': WHATSAPP_URLS.familiaSistemasGestion,
  'software-personalizado': WHATSAPP_URLS.familiaSoftwarePersonalizado,
}

export function generateStaticParams() {
  return DEFAULT_SOLUCIONES.map((familia) => ({ familia: familia.id }))
}

async function getFamilia(familiaParam: string) {
  const content = await getResolvedSiteContent()
  return content.soluciones.find((f) => f.id === familiaParam)
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ familia: string }>
}): Promise<Metadata> {
  const { familia: familiaParam } = await params
  const familia = await getFamilia(familiaParam)
  if (!familia) return {}

  return {
    title: familia.nombre,
    description: familia.descripcion,
    alternates: { canonical: `/soluciones/${familia.id}` },
  }
}

export default async function FamiliaPage({
  params,
}: {
  params: Promise<{ familia: string }>
}) {
  const { familia: familiaParam } = await params
  const familia = await getFamilia(familiaParam)
  if (!familia) notFound()

  const ctaHref = ctaByFamiliaId[familia.id] ?? WHATSAPP_URLS.hero

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Soluciones', path: '/soluciones' },
          { name: familia.nombre, path: `/soluciones/${familia.id}` },
        ])}
      />
      <JsonLd
        data={serviceJsonLd({
          nombre: familia.nombre,
          descripcion: familia.descripcion,
          path: `/soluciones/${familia.id}`,
        })}
      />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-ef-paper pt-32 pb-24 md:pb-32">
        <section aria-label={familia.nombre} className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-ef-teal mb-4">
            Familias de soluciones
          </p>
          <h1 className="font-humanst text-fluid-h1 text-ef-ink leading-tight mb-6">
            {familia.nombre}
          </h1>
          <p className="text-ef-ink-soft text-lg leading-relaxed mb-10">
            {familia.descripcion}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h2 className="text-xs font-semibold tracking-widest uppercase text-ef-teal mb-4">
                Soluciones principales
              </h2>
              <ul className="space-y-3">
                {familia.soluciones.map((solucion) => (
                  <li key={solucion} className="flex items-start gap-3 text-base text-ef-ink">
                    <svg aria-hidden="true" className="h-5 w-5 text-ef-teal mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{solucion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {familia.capacidades.length > 0 && (
              <div>
                <h2 className="text-xs font-semibold tracking-widest uppercase text-ef-teal mb-4">
                  Capacidades configurables
                </h2>
                <p className="text-sm text-ef-ink-soft leading-relaxed">
                  {familia.capacidades.join(' · ')}
                </p>
                <p className="text-xs text-ef-ink-soft mt-3">
                  Las capacidades complementan una solución — no son productos independientes.
                </p>
              </div>
            )}
          </div>

          <WhatsAppLink
            href={ctaHref}
            source={`soluciones-detalle-${familia.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-8 py-4 text-lg font-semibold bg-ef-orange text-ef-ink hover:bg-ef-ink hover:text-ef-orange transition-colors duration-200"
          >
            Solicitar diagnóstico
          </WhatsAppLink>
        </section>
      </main>
      <Footer />
    </>
  )
}
