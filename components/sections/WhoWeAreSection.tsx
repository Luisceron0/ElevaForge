import { AboutContent } from '@/lib/site-content'
import TeamSection from '@/components/sections/TeamSection'

interface Props {
  about: AboutContent
}

export default function WhoWeAreSection({ about }: Props) {
  return (
    <section id="quienes" className="py-20 bg-white">
      <div className="container mx-auto px-4 space-y-14">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-forge-orange-main font-semibold">Quiénes somos</p>
          <h2 className="text-3xl md:text-4xl font-bold text-forge-bg-dark mt-3 mb-4">Equipo y enfoque de trabajo</h2>
          <p className="text-forge-bg-dark/75 text-lg leading-relaxed">{about.intro}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-1">
          <article className="rounded-2xl bg-forge-bg-light p-6 border border-forge-blue-mid/20">
            <h3 className="text-2xl font-semibold text-forge-bg-dark mb-4">Lo que nos diferencia</h3>
            <div className="space-y-4">
              {about.differentiators.map((item) => (
                <div key={item.title}>
                  <h4 className="font-semibold text-forge-bg-dark">{item.title}</h4>
                  <p className="text-forge-bg-dark/75">{item.description}</p>
                </div>
              ))}
            </div>
          </article>
        </div>

        {/* Team profile cards — sección con fondo oscuro para contraste */}
        <div className="rounded-3xl bg-forge-bg-dark p-8 -mx-4 sm:mx-0">
          <TeamSection team={about.team} />
        </div>
      </div>
    </section>
  )
}
