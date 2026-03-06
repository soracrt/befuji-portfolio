import Hero from '@/components/Hero'
import StatsBar from '@/components/StatsBar'
import WhatIDo from '@/components/WhatIDo'
import FeaturedWork from '@/components/FeaturedWork'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <WhatIDo />
      <FeaturedWork />
      <Footer />
    </main>
  )
}
