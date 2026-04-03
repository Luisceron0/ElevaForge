import { ReactNode } from 'react'

interface BentoCardProps {
  label: string
  value: ReactNode
  description: string
  icon: ReactNode
  valueClassName?: string
  className?: string
}

export default function BentoCard({
  label,
  value,
  description,
  icon,
  valueClassName = '',
  className = '',
}: BentoCardProps) {
  return (
    <article
      className={`bento-card bg-forge-card-bg rounded-2xl p-8 md:p-10 border border-forge-blue-mid/20 flex flex-col justify-between min-h-[240px] shadow-forge-card ${className}`}
    >
      <div className="flex items-start justify-between mb-6">
        <span className="inline-flex items-center rounded-full border border-forge-blue-mid/30 px-3 py-1.5 text-xs font-semibold tracking-widest uppercase text-forge-blue-light">
          {label}
        </span>
        <span aria-hidden="true">{icon}</span>
      </div>

      <div>
        <div className={valueClassName}>{value}</div>
      </div>

      <p className="text-forge-text-body text-base leading-relaxed mt-auto pt-4 border-t border-forge-blue-mid/15">
        {description}
      </p>
    </article>
  )
}
