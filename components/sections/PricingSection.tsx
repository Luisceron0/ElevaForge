import { WHATSAPP_URLS } from '@/lib/whatsapp'
import type { PackagePlan } from '@/lib/site-content'

const ctaByPlanId: Record<string, string> = {
  web: WHATSAPP_URLS.pricingWeb,
  pos: WHATSAPP_URLS.pricingPos,
  custom: WHATSAPP_URLS.pricingCustom,
}

const badgeByPlanId: Record<string, string> = {
  web: 'Negocios locales',
  pos: 'Comercio',
  custom: 'Operaciones',
}

interface PricingSectionProps {
  plans: PackagePlan[]
  eyebrow: string
  title: string
  description: string
  legalNote: string
  ctaLabel: string
}

export default function PricingSection({ plans, eyebrow, title, description, legalNote, ctaLabel }: PricingSectionProps) {

  return (
    <section id="precios" aria-label="Paquetes" className="py-24 md:py-32 bg-forge-bg-light">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
        <div className="max-w-3xl mb-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-mid mb-4">
            {eyebrow}
          </p>
          <h2
            className="font-humanst text-forge-bg-dark leading-tight mb-4"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}
          >
            {title}
          </h2>
          <p className="text-forge-blue-deep text-lg leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className="bg-white rounded-2xl p-8 border border-forge-blue-mid/20 shadow-forge-card flex flex-col justify-between hover:border-forge-orange-main/30 hover:shadow-forge-hover transition-all duration-300"
            >
              <div>
                <div className="flex items-start justify-between mb-6 gap-4">
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-forge-blue-mid mb-2">
                      {plan.title}
                    </p>
                    <p
                      className="font-humanst text-forge-bg-dark leading-none"
                      style={{ fontSize: '2rem' }}
                    >
                      ${plan.priceUsd}
                    </p>
                    <p className="text-base text-forge-blue-deep/70 mt-1">
                      (≈ {plan.priceCop.toLocaleString()} COP)
                    </p>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-forge-blue-mid/30 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase text-forge-blue-mid">
                    {badgeByPlanId[plan.id] ?? 'Paquete'}
                  </span>
                </div>

                <div className="h-px bg-forge-blue-mid/15 mb-6" />

                <ul className="space-y-3">
                  {plan.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-base text-forge-bg-dark">
                      <svg
                        aria-hidden="true"
                        className="h-5 w-5 text-forge-orange-main mt-0.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={ctaByPlanId[plan.id] ?? WHATSAPP_URLS.hero}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full text-center inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold border border-forge-blue-mid text-forge-blue-deep hover:bg-forge-blue-deep hover:text-white transition-colors duration-200"
              >
                {ctaLabel}
              </a>
            </article>
          ))}
        </div>

        <p className="text-center text-base text-forge-bg-dark/50 mt-8">
          {legalNote}
        </p>
      </div>
    </section>
  )
}
