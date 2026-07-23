import type { Metadata } from 'next'
import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbJsonLd } from '@/lib/seo'
import { getResolvedSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Familias de soluciones',
  description:
    'Presencia Digital, Sistemas de Gestión y Software Personalizado. Resolvemos problemas de negocio, no vendemos tecnología.',
  alternates: { canonical: '/soluciones' },
}

export default async function SolucionesPage() {
  const content = await getResolvedSiteContent()
  const familias = content.soluciones

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Soluciones', path: '/soluciones' },
        ])}
      />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-ef-ink pt-32 pb-24 md:pb-32">
        <section aria-label="Familias de soluciones" className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-ef-paper/60 mb-4">
              Familias de soluciones
            </p>
            <h1 className="font-humanst text-fluid-display text-ef-paper leading-[0.98] mb-6">
              Resolvemos problemas de negocio, <span className="text-ef-orange">no vendemos tecnología</span>
            </h1>
            <p className="text-ef-paper/70 text-lg leading-relaxed">
              Cada familia agrupa soluciones y capacidades configurables según lo que tu negocio necesita, sin paquetes rígidos ni precios fijos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {familias.map((familia) => (
              <Link
                key={familia.id}
                href={`/soluciones/${familia.id}`}
                className="group block bg-ef-paper/[0.04] rounded-3xl p-8 border border-ef-paper/12 hover:border-ef-orange/40 hover:bg-ef-paper/[0.07] transition-all duration-300"
              >
                <h2 className="font-humanst text-ef-paper text-2xl mb-3">{familia.nombre}</h2>
                <p className="text-base text-ef-paper/70 leading-relaxed mb-4">{familia.descripcion}</p>
                <span className="text-sm font-semibold text-ef-orange">Ver soluciones →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
