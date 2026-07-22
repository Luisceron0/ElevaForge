import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LegacyAnchorRedirect from '@/components/seo/LegacyAnchorRedirect'
import HeroSection from '@/components/sections/HeroSection'
import StatsBand from '@/components/sections/StatsBand'
import StatementBand from '@/components/sections/StatementBand'
import ProjectsSection from '@/components/sections/ProjectsSection'
import SolucionesSection from '@/components/sections/SolucionesSection'
import RoadmapSection from '@/components/sections/RoadmapSection'
import TechMarquee from '@/components/sections/TechMarquee'
import AutonomySection from '@/components/sections/AutonomySection'
import ContactSection from '@/components/sections/ContactSection'
import { getResolvedSiteContent } from '@/lib/site-content'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const content = await getResolvedSiteContent()
  const lighthouse = content.about.lighthouse
  const phases = content.about.phases
  const deliveredProjects = content.projects.filter((project) => project.status === 'entregado').length
  const inProgressProjects = content.projects.filter((project) => project.status === 'en-curso').length
  const projectsInProgress = content.about.projectsInProgress
  const autonomyCards = content.about.autonomyCards
  const homeContent = content.about.homeContent

  return (
    <>
      <LegacyAnchorRedirect />
      <Navbar />
      <main id="main-content" className="min-h-screen w-full overflow-x-hidden">
        <HeroSection
          deliveredProjects={deliveredProjects}
          inProgressProjects={inProgressProjects}
          subtitle={content.about.heroSubtitle}
          badge={homeContent.hero.badge}
          title={homeContent.hero.title}
          highlight={homeContent.hero.highlight}
          statement={homeContent.hero.statement}
          primaryCtaLabel={homeContent.hero.primaryCta}
          secondaryCtaLabel={homeContent.hero.secondaryCta}
        />
        <StatsBand
          lighthouse={lighthouse}
          eyebrow={homeContent.stats.eyebrow}
          title={homeContent.stats.title}
        />
        <StatementBand
          eyebrow={homeContent.statement.eyebrow}
          title={homeContent.statement.title}
          body={homeContent.statement.body}
        />
        <SolucionesSection
          familias={content.soluciones}
          eyebrow={homeContent.soluciones.eyebrow}
          title={homeContent.soluciones.title}
          description={homeContent.soluciones.description}
          ctaLabel={homeContent.soluciones.ctaLabel}
        />
        <RoadmapSection
          phases={phases}
          eyebrow={homeContent.roadmap.eyebrow}
          title={homeContent.roadmap.title}
          description={homeContent.roadmap.description}
          ctaTitle={homeContent.roadmap.ctaTitle}
          ctaLabel={homeContent.roadmap.ctaButton}
        />
        <TechMarquee
          eyebrow={homeContent.techStack.eyebrow}
          languagesLabel={homeContent.techStack.languagesLabel}
          frameworksLabel={homeContent.techStack.frameworksLabel}
          languages={homeContent.techStack.languages}
          frameworks={homeContent.techStack.frameworks}
        />
        <ProjectsSection
          projects={content.projects}
          inProgressNotes={projectsInProgress}
          eyebrow={homeContent.projects.eyebrow}
          title={homeContent.projects.title}
          description={homeContent.projects.description}
          deliveredLabel={homeContent.projects.deliveredLabel}
          inProgressLabel={homeContent.projects.inProgressLabel}
          notesTitle={homeContent.projects.notesTitle}
        />
        <AutonomySection
          eyebrow={homeContent.autonomy.eyebrow}
          title={homeContent.autonomy.title}
          description={homeContent.autonomy.description}
          cards={autonomyCards}
        />
        <ContactSection
          title={homeContent.contact.title}
          description={homeContent.contact.description}
          responseTime={homeContent.contact.responseTime}
        />
      </main>
      <Footer />
    </>
  )
}
