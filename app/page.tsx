import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import PricingSection from '@/components/sections/PricingSection'
import RoadmapSection from '@/components/sections/RoadmapSection'
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
      <Navbar />
      <main id="main-content" className="min-h-screen w-full overflow-x-hidden">
        <HeroSection
          lighthouse={lighthouse}
          deliveredProjects={deliveredProjects}
          inProgressProjects={inProgressProjects}
          subtitle={content.about.heroSubtitle}
          badge={homeContent.hero.badge}
          title={homeContent.hero.title}
          highlight={homeContent.hero.highlight}
          primaryCtaLabel={homeContent.hero.primaryCta}
          secondaryCtaLabel={homeContent.hero.secondaryCta}
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
        <PricingSection
          plans={content.packages}
          eyebrow={homeContent.pricing.eyebrow}
          title={homeContent.pricing.title}
          description={homeContent.pricing.description}
          legalNote={homeContent.pricing.legalNote}
          ctaLabel={homeContent.pricing.ctaLabel}
        />
        <RoadmapSection
          phases={phases}
          eyebrow={homeContent.roadmap.eyebrow}
          title={homeContent.roadmap.title}
          description={homeContent.roadmap.description}
          ctaTitle={homeContent.roadmap.ctaTitle}
          ctaLabel={homeContent.roadmap.ctaButton}
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
