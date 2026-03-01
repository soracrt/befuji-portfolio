import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Work from '@/components/Work'
import About from '@/components/About'
import HomeCTA from '@/components/HomeCTA'
import HeroBackground from '@/components/HeroBackground'

export default function Home() {
  return (
    <main>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <HeroBackground />
        <Nav />
        <Hero />
      </div>
      <Work />
      <About />
      <HomeCTA />
    </main>
  )
}
