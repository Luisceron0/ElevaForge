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

export const metadata: Metadata = {
  title: 'ElevaForge — Forjamos tu crecimiento digital',
  description:
    'Agencia de desarrollo de software con transparencia total. Sitios web, apps y herramientas digitales con Lighthouse 100/100.',
  keywords: [
    'desarrollo web',
    'agencia digital',
    'software a medida',
    'Next.js',
    'SEO',
    'PyMEs',
  ],
  openGraph: {
    title: 'ElevaForge — Forjamos tu crecimiento digital',
    description:
      'No solo creamos herramientas; forjamos el motor digital de tu empresa.',
    type: 'website',
    locale: 'es_MX',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ElevaForge',
  },
  robots: { index: true, follow: true },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${humanst.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  )
}
