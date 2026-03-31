import CTAButton from '@/components/ui/CTAButton'
import { buildWhatsAppURL } from '@/lib/whatsapp'
import { PackagePlan } from '@/lib/site-content'

interface PricingSectionProps {
  plans: PackagePlan[]
}

export default function PricingSection({ plans }: PricingSectionProps) {

  return (
    <section id="precios" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold !text-forge-bg-dark">Paquetes orientativos</h2>
          <p className="text-forge-bg-dark/70 max-w-2xl mx-auto mt-2">
            Rango de precios pensados para Scaleups en Colombia. Los precios son
            orientativos y pueden variar según alcance.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((p) => (
            <article key={p.id} className="border rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-2 !text-forge-bg-dark break-words">{p.title}</h3>
              <p className="text-3xl font-humanst text-forge-orange-main mb-4">
                ${p.priceUsd} <span className="text-sm text-forge-bg-dark/60">(≈ {p.priceCop.toLocaleString()} COP)</span>
              </p>
              <ul className="mb-6 space-y-2 text-sm text-forge-bg-dark/70">
                {p.bullets.map((b, i) => (
                  <li key={i}>• {b}</li>
                ))}
              </ul>
              <CTAButton
                href={buildWhatsAppURL(`Hola ElevaForge, estoy interesado en el paquete ${p.title} (id: ${p.id}). ¿Podemos conversar sobre alcance y costos?`)}
                label="Solicitar propuesta"
                className="w-full justify-center"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
