import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ContactSection from '@/components/sections/ContactSection'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbJsonLd } from '@/lib/seo'
import { getResolvedSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Contacto — Solicitar diagnóstico',
  description: 'Solicitá un diagnóstico gratuito con ElevaForge. Respuesta en menos de 24 horas.',
  alternates: { canonical: '/contacto' },
}

export default async function ContactoPage() {
  const content = await getResolvedSiteContent()
  const contact = content.about.homeContent.contact

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Contacto', path: '/contacto' },
        ])}
      />
      <Navbar />
      <main id="main-content" className="min-h-screen w-full overflow-x-hidden pt-16">
        <ContactSection
          title={contact.title}
          description={contact.description}
          responseTime={contact.responseTime}
          headingLevel="h1"
        />
      </main>
      <Footer />
    </>
  )
}
