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
    'Presencia Digital, Sistemas de Gestión y Software Personalizado — resolvemos problemas de negocio, no vendemos tecnología.',
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
      <main id="main-content" className="min-h-screen bg-forge-bg-dark pt-24 pb-24 md:pb-32">
        <section aria-label="Familias de soluciones" className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mb-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-light mb-4">
              Familias de soluciones
            </p>
            <h1 className="font-humanst text-white leading-tight mb-4" style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}>
              Resolvemos problemas de negocio, no vendemos tecnología
            </h1>
            <p className="text-forge-text-body text-lg leading-relaxed">
              Cada familia agrupa soluciones y capacidades configurables según lo que tu negocio necesita — sin paquetes rígidos ni precios fijos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {familias.map((familia) => (
              <Link
                key={familia.id}
                href={`/soluciones/${familia.id}`}
                className="block bg-forge-card-bg rounded-2xl p-8 border border-forge-blue-mid/20 hover:border-forge-orange-main/40 hover:shadow-forge-hover transition-all duration-300"
              >
                <h2 className="font-humanst text-white text-2xl mb-3">{familia.nombre}</h2>
                <p className="text-base text-forge-text-body leading-relaxed mb-4">{familia.descripcion}</p>
                <span className="text-sm font-semibold text-forge-orange-main">Ver soluciones →</span>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
