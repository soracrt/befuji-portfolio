import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import StatsBar from '@/components/StatsBar'
import FeaturedWork from '@/components/FeaturedWork'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main>
      <Nav />
      <Hero />
      <StatsBar />
      <FeaturedWork />
      <Footer />
    </main>
  )
}
