import type { Metadata } from 'next'
import Image from 'next/image'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { getResolvedSiteContent } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Quiénes somos · ElevaForge',
  description:
    'Equipo de ingenieros de software colombianos enfocados en arquitectura, seguridad, backend, frontend y rendimiento.',
}

/** "Luis Cerón" -> "LC". Fallback when a member has no photo uploaded. */
function initialsFor(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

export default async function NosotrosPage() {
  // The team is edited from /admin (about.team). It used to be a hardcoded
  // array in this file, so admin edits never reached the page.
  const content = await getResolvedSiteContent()
  const team = content.about.team

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen bg-ef-paper pt-32 pb-24 md:pb-32">
        <section aria-label="Equipo ElevaForge" className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12">
          <div className="max-w-3xl mb-12">
            <p className="text-xs font-semibold tracking-widest uppercase text-ef-blue-deep mb-4">
              {content.about.teamSection.eyebrow}
            </p>
            <h1 className="font-humanst text-fluid-display text-ef-ink leading-[0.98] mb-6">
              {content.about.teamSection.title}
            </h1>
            <p className="text-ef-ink-soft text-lg leading-relaxed">
              {content.about.teamSection.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map((member, index) => (
              <article
                key={`${member.owner}-${index}`}
                className="bg-white rounded-3xl p-6 border border-ef-ink/10"
              >
                <div className="flex items-center gap-4 mb-4">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.owner}
                      width={128}
                      height={128}
                      className="w-16 h-16 rounded-2xl object-cover"
                      unoptimized={/^https?:\/\//i.test(member.imageUrl)}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-ef-blue-deep flex items-center justify-center text-ef-paper font-humanst text-xl">
                      {initialsFor(member.owner)}
                    </div>
                  )}
                  <div>
                    <h2 className="font-humanst text-ef-ink text-xl">{member.owner}</h2>
                    <p className="text-xs text-ef-ink-soft uppercase tracking-widest">
                      {member.area}
                    </p>
                  </div>
                </div>

                <p className="text-base text-ef-ink-soft leading-relaxed">
                  {member.description}
                </p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
