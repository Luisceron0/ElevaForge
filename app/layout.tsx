import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Inter } from 'next/font/google'
import './globals.css'

const humanst = localFont({
  src: '../public/fonts/Humanist531BT-BlackA.woff2',
  variable: '--font-humanst',
  display: 'swap',
  preload: true,
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://elevaforge.com'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ElevaForge — Forjamos tu crecimiento digital',
    template: '%s | ElevaForge',
  },
  description:
    'Agencia de desarrollo de software con transparencia total. Sitios web, apps y herramientas digitales con Lighthouse 100/100.',
  keywords: [
    'desarrollo web',
    'agencia digital',
    'software a medida',
    'Next.js',
    'SEO',
    'PyMEs',
    'desarrollo de software México',
    'páginas web profesionales',
    'aplicaciones web',
  ],
  generator: 'Next.js',
  applicationName: 'ElevaForge',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ElevaForge — Forjamos tu crecimiento digital',
    description:
      'No solo creamos herramientas; forjamos el motor digital de tu empresa con transparencia total y estándares Lighthouse 100/100.',
    type: 'website',
    locale: 'es_MX',
    url: SITE_URL,
    siteName: 'ElevaForge',
    images: [
      {
        url: '/ElevaIcon.png',
        width: 1200,
        height: 630,
        alt: 'ElevaForge — Agencia de Desarrollo de Software',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElevaForge — Forjamos tu crecimiento digital',
    description:
      'Agencia de desarrollo de software con transparencia total y estándares Lighthouse 100/100.',
    images: ['/ElevaIcon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/ElevaIcon.png',
    apple: '/ElevaIcon.png',
  },
  manifest: '/manifest.json',
  other: {
    'theme-color': '#F97300',
    'color-scheme': 'dark light',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'ElevaForge',
    description:
      'Agencia de desarrollo de software con transparencia total. Sitios web, apps y herramientas digitales.',
    url: SITE_URL,
    logo: `${SITE_URL}/ElevaIcon.png`,
    image: `${SITE_URL}/ElevaIcon.png`,
    priceRange: '$$',
    foundingDate: '2024',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: 'contacto@elevaforge.com',
      availableLanguage: ['Spanish'],
    },
    areaServed: {
      '@type': 'Country',
      name: 'México',
    },
    knowsAbout: [
      'Desarrollo Web',
      'Desarrollo de Software',
      'SEO',
      'Aplicaciones Web',
      'Next.js',
      'React',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de Desarrollo',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Desarrollo Web Profesional',
            description: 'Sitios web con Lighthouse 100/100 y SEO optimizado',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Software a Medida',
            description: 'Aplicaciones personalizadas para tu negocio',
          },
        },
      ],
    },
  }

  return (
    <html lang="es" dir="ltr" className={`${humanst.variable} ${inter.variable}`}>
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, '\u003c'),
          }}
        />
      </head>
      <body>
        {/* Skip navigation - accesibilidad */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-forge-orange-main focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold focus:shadow-lg"
        >
          Saltar al contenido principal
        </a>
        {children}
      </body>
    </html>
  )
}
