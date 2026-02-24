import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidad',
  description:
    'Conoce cómo ElevaForge recopila, usa y protege tu información personal.',
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
          Política de <span className="text-forge-orange-main">Privacidad</span>
        </h1>

        <div className="prose prose-lg max-w-none text-forge-bg-dark/80 space-y-6">
          <p>
            <strong>Última actualización:</strong> Febrero 2026
          </p>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              1. Información que recopilamos
            </h2>
            <p>
              Cuando utilizas nuestro formulario de contacto, recopilamos
              únicamente la información que nos proporcionas voluntariamente:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Nombre</li>
              <li>Correo electrónico</li>
              <li>Nombre de empresa (opcional)</li>
              <li>Mensaje o descripción del proyecto (opcional)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              2. Cómo usamos tu información
            </h2>
            <p>Utilizamos tu información exclusivamente para:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Responder a tu consulta o solicitud de proyecto</li>
              <li>Enviarte información relevante sobre nuestros servicios</li>
              <li>Mejorar la experiencia de nuestro sitio web</li>
            </ul>
            <p>
              <strong>Nunca</strong> vendemos, alquilamos ni compartimos tu
              información personal con terceros con fines comerciales.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              3. Almacenamiento y seguridad
            </h2>
            <p>
              Tu información se almacena de forma segura en servidores con
              cifrado en tránsito (TLS 1.2+) y en reposo. Implementamos
              medidas de seguridad técnicas y organizativas para proteger tus
              datos contra acceso no autorizado, pérdida o alteración.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              4. Tus derechos (Habeas Data)
            </h2>
            <p>
              Conforme a la legislación colombiana (Ley 1581 de 2012 y el
              Decreto 1377 de 2013), tienes derecho a ejercer acciones sobre
              tus datos personales, incluyendo:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Acceder</strong> a los datos personales que conservamos
              </li>
              <li>
                <strong>Solicitar la corrección</strong> de datos inexactos o
                incompletos
              </li>
              <li>
                <strong>Solicitar la supresión</strong> o eliminación cuando
                proceda
              </li>
              <li>
                <strong>Oponerte</strong> al tratamiento para fines específicos
              </li>
            </ul>
            <p>
              Para ejercer estos derechos o recibir más información sobre el
              tratamiento de tus datos, envía una solicitud a{' '}
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
              5. Cookies y tecnologías de rastreo
            </h2>
            <p>
              Este sitio web utiliza únicamente cookies funcionales necesarias
              para la operación básica. No usamos tecnologías de tracking que
              compartan datos personales con terceros para fines de
              comportamiento sin tu consentimiento.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              6. Cambios a esta política
            </h2>
            <p>
              Nos reservamos el derecho de actualizar esta política de
              privacidad. Cualquier cambio será publicado en esta página con la
              fecha de última actualización.
            </p>
          </section>

          <section>
            <h2 className="font-humanst text-xl font-bold text-forge-bg-dark mt-8 mb-3">
              7. Contacto
            </h2>
            <p>
              Para dudas o solicitudes sobre datos personales (Habeas Data),
              escríbenos a{' '}
              <a
                href="mailto:contacto@elevaforge.com"
                className="text-forge-orange-main hover:underline"
              >
                contacto@elevaforge.com
              </a>
              . Responderemos conforme a plazos legales establecidos en
              Colombia.
            </p>
          </section>
        </div>
      </article>
    </main>
  )
}
