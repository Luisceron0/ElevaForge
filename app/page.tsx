import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ProjectsSection from '@/components/sections/ProjectsSection'
import PricingSection from '@/components/sections/PricingSection'
import RoadmapSection from '@/components/sections/RoadmapSection'
import AutonomySection from '@/components/sections/AutonomySection'
import ContactSection from '@/components/sections/ContactSection'
import { getResolvedSiteContent } from '@/lib/site-content'

export default async function Home() {
  const content = await getResolvedSiteContent()
  const lighthouse = content.about.lighthouse
  const phases = content.about.phases
  const deliveredProjects = content.projects.filter((project) => project.status === 'entregado').length
  const inProgressProjects = content.projects.filter((project) => project.status === 'en-curso').length
  const supportItems = content.about.supportItems

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen w-full overflow-x-hidden">
        <HeroSection
          lighthouse={lighthouse}
          deliveredProjects={deliveredProjects}
          inProgressProjects={inProgressProjects}
          subtitle={content.about.heroSubtitle}
        />
        <ProjectsSection />
        <PricingSection />
        <RoadmapSection phases={phases} />
        <AutonomySection supportItems={supportItems} />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
