import Reveal from '@/components/ui/Reveal'

// NF-06: honest tech-stack band as two opposing marquees — the real
// languages and frameworks ElevaForge builds with. A credibility signal,
// not partner logos or a claimed alliance. All copy/lists are editable from
// the admin (homeContent.techStack). CSS-only; paused under reduced-motion.
interface TechMarqueeProps {
  eyebrow?: string
  languagesLabel?: string
  frameworksLabel?: string
  languages?: string[]
  frameworks?: string[]
}

const DEFAULT_LENGUAJES = [
  'C', 'Java', 'Python', 'C#', 'C++', 'JavaScript', 'TypeScript', 'Dart', 'HTML5', 'CSS3',
]
const DEFAULT_FRAMEWORKS = [
  'Spring Boot', 'Django', 'React', 'Vue.js', 'Angular', 'Astro', 'Bootstrap', 'Tailwind CSS', 'Next.js', 'Nuxt.js',
]

function Track({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const anim = reverse ? 'motion-safe:animate-marquee-reverse' : 'motion-safe:animate-marquee'
  return (
    <div className="flex w-full overflow-hidden">
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1 || undefined}
          className={`flex shrink-0 items-center gap-10 md:gap-16 pr-10 md:pr-16 ${anim}`}
        >
          {items.map((tech, i) => (
            <span key={`${tech}-${i}`} className="flex items-center gap-10 md:gap-16 whitespace-nowrap">
              <span className="font-humanst text-ef-paper/85 text-xl md:text-3xl">{tech}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-ef-orange shrink-0" />
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function TechMarquee({
  eyebrow,
  languagesLabel,
  frameworksLabel,
  languages,
  frameworks,
}: TechMarqueeProps) {
  const langs = languages && languages.length > 0 ? languages : DEFAULT_LENGUAJES
  const fws = frameworks && frameworks.length > 0 ? frameworks : DEFAULT_FRAMEWORKS

  return (
    <section aria-label="Stack tecnológico" className="bg-ef-ink py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mb-10">
        <Reveal>
          <p className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-ef-paper/60">
            <span className="text-ef-orange">(06)</span>
            {eyebrow || 'Construimos con herramientas modernas y probadas'}
          </p>
        </Reveal>
      </div>

      <div className="space-y-6 md:space-y-8">
        <div>
          <p className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 text-xs font-semibold tracking-[0.2em] uppercase text-ef-paper/55 mb-4">
            {languagesLabel || 'Lenguajes'}
          </p>
          <Track items={langs} />
        </div>
        <div>
          <p className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 text-xs font-semibold tracking-[0.2em] uppercase text-ef-paper/55 mb-4">
            {frameworksLabel || 'Frameworks'}
          </p>
          <Track items={fws} reverse />
        </div>
      </div>
    </section>
  )
}
