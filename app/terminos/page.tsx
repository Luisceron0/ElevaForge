import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Términos y Condiciones',
  description:
    'Términos y condiciones de uso de los servicios de ElevaForge.',
  alternates: { canonical: '/terminos' },
}

export default function TerminosPage() {
  return (
    <main className="min-h-screen bg-forge-bg-light py-20">
      <article className="container mx-auto px-4 max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-forge-orange-main hover:underline text-sm font-semibold mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Volver al inicio
        </Link>

        <h1 className="font-humanst text-3xl md:text-4xl font-bold text-forge-bg-dark mb-8">
          Términos y{' '}
          <span className="text-forge-orange-main">Condiciones</span>
        </h1>

        <div className="prose prose-lg max-w-none text-forge-bg-dark/80 space-y-6">
          <p>
            <strong>Última actualización:</strong> Febrero 2026
          </p>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              1. Aceptación de los términos
            </h2>
            <p>
              Al acceder y utilizar el sitio web de ElevaForge
              (elevaforge.com), aceptas cumplir con estos términos y
              condiciones. Si no estás de acuerdo con alguno de ellos, te
              pedimos que no utilices nuestro sitio.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              2. Servicios
            </h2>
            <p>
              ElevaForge ofrece servicios de desarrollo de software, diseño
              web, aplicaciones personalizadas y consultoría tecnológica. Los
              detalles, alcance, costos y plazos específicos de cada proyecto
              se acordarán por separado mediante un contrato o propuesta formal.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              3. Propiedad intelectual
            </h2>
            <p>
              El contenido de este sitio web (textos, diseños, logotipos,
              gráficos e íconos) es propiedad de ElevaForge y está protegido
              por las leyes de propiedad intelectual aplicables.
            </p>
            <p>
              El código fuente y los entregables de cada proyecto serán
              propiedad del cliente una vez completado el pago total, según lo
              establecido en el contrato correspondiente.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              4. Uso del sitio
            </h2>
            <p>Te comprometes a:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                No utilizar el sitio para fines ilegales o no autorizados
              </li>
              <li>
                No intentar acceder a áreas restringidas del servidor o
                infraestructura
              </li>
              <li>
                No enviar información falsa a través de nuestros formularios
              </li>
              <li>
                No realizar actividades que puedan dañar, sobrecargar o
                deteriorar el funcionamiento del sitio
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              5. Limitación de responsabilidad
            </h2>
            <p>
              ElevaForge no será responsable por daños indirectos,
              incidentales o consecuentes que resulten del uso o la
              imposibilidad de uso de este sitio web. La información
              proporcionada en este sitio es de carácter informativo y no
              constituye una oferta contractual vinculante.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              6. Enlaces a terceros
            </h2>
            <p>
              Este sitio puede contener enlaces a sitios web de terceros
              (como WhatsApp). No tenemos control sobre el contenido o las
              políticas de privacidad de estos sitios y no asumimos
              responsabilidad por ellos.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              7. Modificaciones
            </h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en
              cualquier momento. Las modificaciones entrarán en vigor
              inmediatamente después de su publicación en esta página.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              8. Legislación aplicable
            </h2>
            <p>
              Estos términos se regirán e interpretarán de acuerdo con las
              leyes de la República de Colombia, en especial la normativa
              relacionada con protección de datos personales (Ley 1581 de
              2012 y Decreto 1377 de 2013), en la medida en que aplique.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              9. Contacto
            </h2>
            <p>
              Para cualquier consulta sobre estos términos, contáctanos en{' '}
              <a
                href="mailto:contacto@elevaforge.com"
                className="text-forge-orange-main hover:underline"
              >
                contacto@elevaforge.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
