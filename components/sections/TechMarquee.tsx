import Reveal from '@/components/ui/Reveal'

// NF-06: honest tech-stack band as an infinite marquee. These are the real
// tools ElevaForge builds with — a credibility signal, not partner logos or
// a claimed alliance. CSS-only scroll; disabled under prefers-reduced-motion.
const STACK = [
  'Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL',
  'Vercel', 'Tailwind CSS', 'GSAP', 'Node.js', 'Playwright',
]

function Row({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-12 md:gap-20 pr-12 md:pr-20 motion-safe:animate-marquee"
    >
      {STACK.map((tech, i) => (
        <span key={`${tech}-${i}`} className="flex items-center gap-12 md:gap-20 whitespace-nowrap">
          <span className="font-humanst text-ef-paper/80 text-2xl md:text-4xl">{tech}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-ef-orange shrink-0" />
        </span>
      ))}
    </div>
  )
}

export default function TechMarquee() {
  return (
    <section aria-label="Stack tecnológico" className="bg-ef-ink py-20 md:py-28 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 lg:px-12 mb-10">
        <Reveal>
          <p className="flex items-center gap-3 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-ef-paper/60">
            <span className="text-ef-orange">(06)</span>
            Construimos con herramientas modernas y probadas
          </p>
        </Reveal>
      </div>
      <div className="relative flex w-full overflow-hidden">
        <Row />
        <Row ariaHidden />
      </div>
    </section>
  )
}
