import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Política de Tratamiento de Datos Personales de ElevaForge, conforme a la Ley 1581 de 2012 (Habeas Data, Colombia).',
  alternates: { canonical: '/privacidad' },
}

export default function PrivacidadPage() {
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
          Política de Tratamiento de{' '}
          <span className="text-forge-orange-main">Datos Personales</span>
        </h1>

        <div className="prose prose-lg max-w-none text-forge-bg-dark/80 space-y-6">
          <p>
            <strong>Última actualización:</strong> Julio 2026
          </p>
          <p>
            Esta política se expide en cumplimiento de la{' '}
            <strong>Ley 1581 de 2012</strong> y el{' '}
            <strong>Decreto 1074 de 2015</strong> (que compiló el Decreto 1377
            de 2013) de la República de Colombia, que regulan el tratamiento
            de datos personales (Habeas Data).
          </p>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              1. Responsable del tratamiento
            </h2>
            <p>
              <strong>ElevaForge</strong>, estudio de ingeniería de software con
              operación en Colombia, es el responsable del tratamiento de tus
              datos personales. Para cualquier asunto relacionado con tus datos
              puedes contactarnos en{' '}
              <a
                href="mailto:contacto@elevaforge.com"
                className="text-forge-orange-main hover:underline"
              >
                contacto@elevaforge.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              2. Datos que recopilamos
            </h2>
            <p>
              Recopilamos únicamente la información que nos proporcionas de
              forma voluntaria a través de nuestro formulario de contacto o
              solicitud de diagnóstico:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nombre</li>
              <li>Correo electrónico</li>
              <li>Teléfono o WhatsApp (opcional)</li>
              <li>Nombre de empresa (opcional)</li>
              <li>Mensaje o descripción del proyecto (opcional)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              3. Finalidad del tratamiento
            </h2>
            <p>Tratamos tus datos exclusivamente para las siguientes finalidades:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Responder a tu consulta o solicitud de diagnóstico</li>
              <li>
                Contactarte por el medio que indiques (correo, teléfono o
                WhatsApp) para dar seguimiento a tu solicitud
              </li>
              <li>
                Elaborar una propuesta de servicios ajustada a tu necesidad
              </li>
            </ul>
            <p>
              <strong>Nunca</strong> vendemos, alquilamos ni compartimos tu
              información personal con terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              4. Autorización
            </h2>
            <p>
              Al enviar el formulario y marcar la casilla de aceptación de esta
              política, otorgas tu <strong>autorización previa, expresa e
              informada</strong> para el tratamiento de tus datos con las
              finalidades descritas. Puedes revocar esta autorización en
              cualquier momento mediante el procedimiento de la sección 8.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              5. Datos sensibles y menores de edad
            </h2>
            <p>
              No solicitamos ni tratamos datos sensibles (origen racial,
              salud, orientación sexual, convicciones políticas o religiosas,
              datos biométricos, entre otros). Nuestros servicios no están
              dirigidos a menores de edad y no recolectamos deliberadamente sus
              datos personales.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              6. Almacenamiento, seguridad y encargados
            </h2>
            <p>
              Tu información se almacena de forma segura con cifrado en tránsito
              (TLS 1.2+) y en reposo. Aplicamos medidas técnicas y organizativas
              para proteger tus datos contra acceso no autorizado, pérdida o
              alteración. Para la operación del sitio y la base de datos nos
              apoyamos en encargados del tratamiento (proveedores de
              infraestructura como Supabase y Vercel), que pueden procesar los
              datos en servidores ubicados fuera de Colombia bajo estándares
              adecuados de protección.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              7. Retención de datos
            </h2>
            <p>
              Conservamos tus datos únicamente durante el tiempo necesario para
              cumplir las finalidades descritas. Las solicitudes ya gestionadas
              se depuran automáticamente de nuestros sistemas transcurridos 30
              días, salvo que exista un deber legal o contractual de
              conservarlas por más tiempo.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              8. Tus derechos como titular (Habeas Data)
            </h2>
            <p>
              Conforme a la Ley 1581 de 2012, como titular de los datos tienes
              derecho a:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Conocer, actualizar y rectificar</strong> tus datos
                personales
              </li>
              <li>
                <strong>Solicitar prueba</strong> de la autorización otorgada
              </li>
              <li>
                <strong>Ser informado</strong> sobre el uso que se ha dado a tus
                datos
              </li>
              <li>
                <strong>Revocar la autorización</strong> y/o solicitar la
                supresión de tus datos cuando no exista un deber legal o
                contractual de conservarlos
              </li>
              <li>
                <strong>Acceder de forma gratuita</strong> a tus datos
                personales
              </li>
              <li>
                <strong>Presentar quejas</strong> ante la Superintendencia de
                Industria y Comercio (SIC) por infracciones a la ley
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              9. Procedimiento de consultas y reclamos
            </h2>
            <p>
              Para ejercer tus derechos, envía tu solicitud a{' '}
              <a
                href="mailto:contacto@elevaforge.com"
                className="text-forge-orange-main hover:underline"
              >
                contacto@elevaforge.com
              </a>{' '}
              indicando tu identificación y el derecho que deseas ejercer.
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Consultas:</strong> se atienden en un plazo máximo de 10
                días hábiles, prorrogable hasta por 5 días hábiles más.
              </li>
              <li>
                <strong>Reclamos:</strong> se atienden en un plazo máximo de 15
                días hábiles, prorrogable hasta por 8 días hábiles más.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              10. Cookies y analítica
            </h2>
            <p>
              Este sitio utiliza únicamente cookies funcionales necesarias para
              su operación básica. Para medir el uso del sitio empleamos una
              herramienta de analítica que no utiliza cookies de rastreo
              invasivo y no recopila datos personales identificables.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              11. Cambios a esta política
            </h2>
            <p>
              Nos reservamos el derecho de actualizar esta política. Cualquier
              cambio se publicará en esta página con su fecha de última
              actualización.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              12. Contacto y autoridad de control
            </h2>
            <p>
              Para dudas o solicitudes sobre el tratamiento de tus datos
              personales, escríbenos a{' '}
              <a
                href="mailto:contacto@elevaforge.com"
                className="text-forge-orange-main hover:underline"
              >
                contacto@elevaforge.com
              </a>
              . La autoridad de control en materia de protección de datos
              personales en Colombia es la{' '}
              <strong>
                Superintendencia de Industria y Comercio (SIC)
              </strong>
              , ante la cual puedes presentar quejas o reclamos.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
