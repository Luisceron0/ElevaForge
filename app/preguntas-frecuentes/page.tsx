import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import JsonLd from '@/components/seo/JsonLd'
import { breadcrumbJsonLd, faqJsonLd, type FaqItem } from '@/lib/seo'

export const metadata: Metadata = {
  title: 'Preguntas frecuentes',
  description: 'Respuestas claras sobre cómo trabajamos, qué incluye un diagnóstico y cómo se define la inversión de tu proyecto.',
  alternates: { canonical: '/preguntas-frecuentes' },
}

// RF-019 / CRO-05: sin precios publicados (ADR-003), el prospecto que
// compara por costo necesita una respuesta aunque no sea un número — la
// pregunta sobre inversión es obligatoria acá, no opcional.
const FAQ_ITEMS: FaqItem[] = [
  {
    question: '¿Qué incluye una solicitud de diagnóstico?',
    answer:
      'Una conversación inicial sin costo donde entendemos tu problema de negocio, tu contexto y tus objetivos. De ahí sale un alcance preliminar y los próximos pasos concretos — no es una llamada de ventas genérica.',
  },
  {
    question: '¿Cómo se define la inversión, si no publican precios?',
    answer:
      'Cada solución es distinta porque cada negocio lo es. El costo se define en la fase de diseño y arquitectura, después de entender el alcance real — no antes. Eso evita cobrar de más por lo que no necesitás y de menos por lo que sí. Vas a conocer el número antes de que empecemos a construir, nunca después.',
  },
  {
    question: '¿El código y los accesos son míos?',
    answer:
      'Sí. Al finalizar la entrega, el código fuente, el repositorio, el dominio, el hosting y los accesos administrativos quedan a tu nombre. No dependés de nosotros para operar tu propio sistema.',
  },
  {
    question: '¿Qué pasa después de que el proyecto se entrega?',
    answer:
      'Incluimos 6 meses de mantenimiento sin costo adicional (correcciones, seguridad y ajustes menores), además de un manual y capacitación para que tu equipo pueda operar la plataforma sin depender de terceros.',
  },
  {
    question: '¿Cuánto tiempo toma un proyecto?',
    answer:
      'Depende del alcance — lo definimos juntos en la fase de exploración y queda documentado antes de empezar a desarrollar, con entregas parciales en el camino para que puedas monitorear avances en tiempo real.',
  },
  {
    question: 'Mi negocio recién empieza a digitalizarse — ¿igual pueden ayudarme?',
    answer:
      'Sí. Trabajamos con acompañamiento cercano desde el análisis hasta después del lanzamiento, pensado específicamente para negocios que dan sus primeros pasos en digitalización, no solo para equipos técnicos.',
  },
]

export default function PreguntasFrecuentesPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Preguntas frecuentes', path: '/preguntas-frecuentes' },
        ])}
      />
      <JsonLd data={faqJsonLd(FAQ_ITEMS)} />
      <Navbar />
      <main id="main-content" className="min-h-screen bg-forge-bg-dark pt-24 pb-24 md:pb-32">
        <section aria-label="Preguntas frecuentes" className="max-w-4xl mx-auto px-4 md:px-8 lg:px-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-light mb-4">
            Preguntas frecuentes
          </p>
          <h1 className="font-humanst text-white leading-tight mb-10" style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)' }}>
            Antes de escribirnos
          </h1>

          <div className="space-y-8">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="border-b border-forge-blue-mid/15 pb-8">
                <h2 className="font-humanst text-white text-xl mb-3">{item.question}</h2>
                <p className="text-base text-forge-text-body leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
