import Link from 'next/link'
import FadeIn from './FadeIn'

export default function Work() {
  return (
    <section id="work" className="px-8 py-24">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <FadeIn>
          <h2
            className="font-serif text-ink tracking-[-0.02em] mb-14"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Work
          </h2>
        </FadeIn>

        {/* Featured video card */}
        <FadeIn delay={80}>
          <div className="w-full rounded-2xl overflow-hidden bg-[#111]">
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src="/NSX.mp4"
                autoPlay
                muted
                loop
                playsInline
              />
            </div>
          </div>
        </FadeIn>

        {/* See more link */}
        <FadeIn delay={120}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/work"
              className="font-sans text-xs tracking-[0.15em] uppercase text-ink border-b border-ink pb-0.5 hover:opacity-40 transition-opacity duration-200"
            >
              See more of my work →
            </Link>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
