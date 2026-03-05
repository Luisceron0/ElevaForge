import nextDynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

// Lazy load below-the-fold sections for better performance
const ForgeStandards = nextDynamic(
  () => import('@/components/sections/ForgeStandards'),
  { loading: () => <SectionSkeleton /> }
)
const AutonomySection = nextDynamic(
  () => import('@/components/sections/AutonomySection'),
  { loading: () => <SectionSkeleton /> }
)
const RoadmapSection = nextDynamic(
  () => import('@/components/sections/RoadmapSection'),
  { loading: () => <SectionSkeleton /> }
)
const PricingSection = nextDynamic(
  () => import('@/components/sections/PricingSection'),
  { loading: () => <SectionSkeleton /> }
)

function SectionSkeleton() {
  return (
    <div
      className="py-20 animate-pulse bg-forge-bg-light"
      aria-hidden="true"
    >
      <div className="container mx-auto px-4">
        <div className="h-8 bg-forge-blue-mid/10 rounded w-1/3 mx-auto mb-4" />
        <div className="h-4 bg-forge-blue-mid/10 rounded w-1/2 mx-auto" />
      </div>
    </div>
  )
}

export default function Home({ searchParams }: { searchParams?: { hideTestimonials?: string } }) {
  const hideTestimonials =
    Boolean(searchParams && (searchParams.hideTestimonials === '1' || searchParams.hideTestimonials === 'true'))

  return (
    <>
      <Navbar />
      <main id="main-content" className="min-h-screen w-full overflow-x-hidden">
        <HeroSection />
        <PricingSection />
        <ForgeStandards />
        <AutonomySection />
        <RoadmapSection hideTestimonials={hideTestimonials} />
      </main>
      <Footer />
    </>
  )
}
