import { TeamCapability } from '@/lib/site-content'

interface TeamProfileCardProps {
  member: TeamCapability
  index: number
}

/** Paleta de colores por posición — complementa el design system forge */
const AVATAR_PALETTES = [
  { from: '#F97300', to: '#FBA81E', text: '#19192E' }, // orange-main→gold
  { from: '#3185C5', to: '#49ACED', text: '#ffffff' }, // blue-primary→light
  { from: '#174166', to: '#306A9C', text: '#ffffff' }, // blue-deep→mid
  { from: '#F97300', to: '#3185C5', text: '#ffffff' }, // orange→blue (dual)
]

/** Íconos SVG por área de especialidad */
function AreaIcon({ area }: { area: string }) {
  const lower = area.toLowerCase()

  if (lower.includes('arquitectura') || lower.includes('seguridad')) {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )
  }
  if (lower.includes('backend') || lower.includes('base') || lower.includes('nube')) {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
      </svg>
    )
  }
  if (lower.includes('optimización') || lower.includes('rendimiento')) {
    return (
      <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  }
  // Frontend / pruebas
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

function TeamProfileCard({ member, index }: TeamProfileCardProps) {
  const palette = AVATAR_PALETTES[index % AVATAR_PALETTES.length]
  const initials = member.owner.slice(0, 2).toUpperCase()

  return (
    <article
      className="
        group relative flex flex-col rounded-3xl overflow-hidden
        bg-[#1F1F3A] border border-white/[0.06]
        transition-all duration-300 ease-out
        hover:-translate-y-1.5 hover:shadow-[0_0_32px_0_rgba(49,133,197,0.2)]
      "
    >
      {/* Franja superior decorativa con gradiente */}
      <div
        className="h-1 w-full"
        style={{ background: `linear-gradient(90deg, ${palette.from}, ${palette.to})` }}
        aria-hidden="true"
      />

      <div className="flex flex-col gap-5 p-7">
        {/* Avatar + datos de identidad */}
        <div className="flex items-center gap-4">
          {member.imageUrl ? (
            <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl shadow-lg">
              <img
                src={member.imageUrl}
                alt={member.owner}
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ) : (
            <div
              className="relative h-16 w-16 flex-shrink-0 rounded-2xl flex items-center justify-center text-xl font-bold shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
                color: palette.text,
              }}
              aria-hidden="true"
            >
              {initials}
              <div className="absolute inset-0 rounded-2xl bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          )}

          <div className="min-w-0">
            <p className="text-xl font-bold text-white leading-tight">{member.owner}</p>
            {/* Badge de área */}
            <span
              className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: `${palette.from}18`,
                color: palette.from,
                border: `1px solid ${palette.from}30`,
              }}
            >
              <AreaIcon area={member.area} />
              {member.area}
            </span>
          </div>
        </div>

        {/* Separador decorativo */}
        <div
          className="h-px w-full opacity-20"
          style={{ background: `linear-gradient(90deg, ${palette.from}, transparent)` }}
          aria-hidden="true"
        />

        {/* Descripción */}
        <p className="text-white/65 text-sm leading-relaxed">{member.description}</p>

        {/* Punto de especialidad visual */}
        <div className="mt-auto flex items-center gap-2">
          <div
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: palette.from }}
            aria-hidden="true"
          />
          <span className="text-xs text-white/40 font-medium tracking-wide uppercase">Ingeniería de software</span>
        </div>
      </div>
    </article>
  )
}

interface Props {
  team: TeamCapability[]
}

export default function TeamSection({ team }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h3 className="text-2xl font-semibold text-forge-bg-dark">Capacidades del equipo</h3>
        <span className="text-sm text-forge-bg-dark/50 hidden sm:block">
          {team.length} especialistas · Ingenieros graduados
        </span>
      </div>

      {/* Grid de profile cards */}
      <div className="grid sm:grid-cols-2 gap-4">
        {team.map((member, index) => (
          <TeamProfileCard key={`${member.area}-${member.owner}`} member={member} index={index} />
        ))}
      </div>
    </div>
  )
}
