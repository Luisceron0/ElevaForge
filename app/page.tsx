import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ForgeStandards from '@/components/sections/ForgeStandards'
import ProjectsSection from '@/components/sections/ProjectsSection'
import PricingSection from '@/components/sections/PricingSection'
import RoadmapSection from '@/components/sections/RoadmapSection'
import AutonomySection from '@/components/sections/AutonomySection'
import ContactSection from '@/components/sections/ContactSection'

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen w-full overflow-x-hidden">
        <HeroSection />
        <ForgeStandards />
        <ProjectsSection />
        <PricingSection />
        <RoadmapSection />
        <AutonomySection />
        <ContactSection />
      </main>
      <Footer />
    </>
  )
}
