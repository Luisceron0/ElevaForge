import HeroSection from '@/components/sections/HeroSection'
import ForgeStandards from '@/components/sections/ForgeStandards'
import AutonomySection from '@/components/sections/AutonomySection'
import RoadmapSection from '@/components/sections/RoadmapSection'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <ForgeStandards />
      <AutonomySection />
      <RoadmapSection />
      <Footer />
    </main>
  )
}
