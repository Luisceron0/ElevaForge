import CTAButton from '@/components/ui/CTAButton'

export default function PricingSection() {
  // Prices in USD with COP equivalents (1 USD = 3800 COP)
  const plans = [
    {
      id: 'web',
      title: 'Sitio Web / Landing',
      priceUsd: 125,
      priceCop: 125 * 3800,
      bullets: [
        'Landing + gestor de contenido (CMS) y panel de administración',
        'Diseño responsivo y optimización',
        'SEO y optimización de rendimiento',
        'Entrega en 2-4 semanas',
      ],
    },
    {
      id: 'pos',
      title: 'PoS + Gestor de Inventario',
      priceUsd: 80,
      priceCop: 80 * 3800,
      bullets: [
        'Punto de venta funcional',
        'Gestión de inventario',
        'Capacitación incluida',
        'Entrega en 1-3 semanas',
      ],
    },
    {
      id: 'custom',
      title: 'Software Personalizado',
      priceUsd: 80,
      priceCop: 80 * 3800,
      bullets: [
        'Soluciones a medida (desde opciones sencillas hasta sistemas complejos)',
        'Arquitectura escalable',
        'Soporte y roadmap definido',
        'Entrega según alcance acordado',
      ],
    },
  ]

  return (
    <section id="precios" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-forge-bg-dark">Paquetes orientativos</h2>
          <p className="text-forge-bg-dark/70 max-w-2xl mx-auto mt-2">
            Rango de precios pensados para Scaleups en Colombia. Los precios son
            orientativos y pueden variar según alcance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <article key={p.id} className="border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-3xl font-humanst text-forge-orange-main mb-4">
                ${p.priceUsd} <span className="text-sm text-forge-bg-dark/60">(≈ {p.priceCop.toLocaleString()} COP)</span>
              </p>
              <ul className="mb-6 space-y-2 text-sm text-forge-bg-dark/70">
                {p.bullets.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
              <CTAButton href="#proceso" label="Solicitar propuesta" className="w-full justify-center" />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
