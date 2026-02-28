import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import FadeIn from '@/components/FadeIn'

export const metadata: Metadata = {
  title: 'About — Befuji',
  description: 'Motion designer working with brands, labels, and startups.',
}

export default function AboutPage() {
  return (
    <main>
      <Nav />

      <div className="pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto">

          {/* Heading */}
          <FadeIn>
            <h1
              className="font-serif text-white tracking-[-0.025em] mb-20"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            >
              About
            </h1>
          </FadeIn>

          {/* Bio + headshot */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-start mb-24">
            <FadeIn>
              <div className="flex flex-col gap-5 max-w-md">
                <p className="font-sans text-sm leading-[1.9]" style={{ color: 'rgba(245,245,240,0.65)' }}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p className="font-sans text-sm leading-[1.9]" style={{ color: 'rgba(245,245,240,0.65)' }}>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <p className="font-sans text-sm leading-[1.9]" style={{ color: 'rgba(245,245,240,0.65)' }}>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                  doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                  veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={130}>
              {/* Placeholder headshot */}
              <div
                className="w-full max-w-sm aspect-[4/5]"
                style={{ backgroundColor: '#141414' }}
              />
            </FadeIn>
          </div>

          {/* Approach / Tools / Clients */}
          <FadeIn>
            <div className="border-t border-divider pt-16 grid grid-cols-1 md:grid-cols-3 border-l border-divider">
              {[
                {
                  label: 'Approach',
                  text: 'Restraint over excess. Every frame earns its place. Work built to outlast trends.',
                },
                {
                  label: 'Tools',
                  text: 'After Effects, Premiere Pro, DaVinci Resolve, Cinema 4D, Figma.',
                },
                {
                  label: 'Clients',
                  text: 'Lorem ipsum dolor — consectetur adipiscing brands, studios, and labels.',
                },
              ].map((col) => (
                <div key={col.label} className="px-8 py-10 border-r border-b border-divider">
                  <h3 className="font-serif text-lg text-white tracking-tight mb-4">{col.label}</h3>
                  <p className="font-sans text-sm leading-relaxed" style={{ color: 'rgba(245,245,240,0.48)' }}>
                    {col.text}
                  </p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Back link */}
          <FadeIn delay={80}>
            <div className="mt-20 pt-12 border-t border-divider">
              <Link
                href="/"
                className="font-sans text-xs tracking-[0.15em] uppercase text-white border-b border-white pb-0.5 hover:opacity-40 transition-opacity duration-200"
              >
                ← Back
              </Link>
            </div>
          </FadeIn>

        </div>
      </div>
    </main>
  )
}
