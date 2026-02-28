import Link from 'next/link'
import FadeIn from './FadeIn'

export default function About() {
  return (
    <section id="about" className="px-8 py-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Text */}
        <FadeIn>
          <div>
            <h2
              className="font-serif text-ink tracking-[-0.02em] mb-8"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              About
            </h2>
            <p
              className="font-sans text-sm leading-[1.85] max-w-sm"
              style={{ color: 'rgba(10,10,10,0.6)' }}
            >
              Ghazi is a motion designer based in Jakarta working under his studio. He does
              motion design for music artists, ads, and films. Fast turnaround, smooth collabs,
              no headaches.
            </p>
            <Link
              href="/about"
              className="inline-block font-sans text-xs tracking-[0.15em] uppercase text-ink mt-8 border-b border-ink pb-0.5 hover:opacity-40 transition-opacity duration-200"
            >
              Full story →
            </Link>
          </div>
        </FadeIn>

        {/* Placeholder headshot */}
        <FadeIn delay={160}>
          <div
            className="w-full aspect-square md:aspect-[4/5] ml-auto max-w-md"
            style={{ backgroundColor: '#141414' }}
          />
        </FadeIn>
      </div>
    </section>
  )
}
