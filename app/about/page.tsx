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
        <div className="max-w-2xl mx-auto">

          {/* Back link */}
          <FadeIn>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.12em] uppercase text-ink/50 hover:text-ink transition-colors duration-200 mb-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              back
            </Link>
          </FadeIn>

          {/* Heading */}
          <FadeIn>
            <h1
              className="font-sans font-medium text-ink tracking-[-0.025em] mb-16 text-center"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            >
              About
            </h1>
          </FadeIn>

          {/* Headshot */}
          <FadeIn delay={80}>
            <div
              className="w-full aspect-[4/5] rounded-2xl mb-12"
              style={{ backgroundColor: '#E8E8E3' }}
            />
          </FadeIn>

          {/* Bio */}
          <FadeIn delay={130}>
            <div className="flex flex-col gap-5">
              <p className="font-sans text-sm leading-[1.9]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Ghazi is a motion designer based in Jakarta. He works under his studio, doing
                motion design for music artists, ads, and films.
              </p>
              <p className="font-sans text-sm leading-[1.9]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Fast turnaround and smooth collabs are kind of his thing. Projects get done without
                the back-and-forth headaches, and people tend to actually enjoy the process. Whether
                it&apos;s a quick ad or a full creative rollout, the work stays clean and the
                communication stays easy.
              </p>
              <p className="font-sans text-sm leading-[1.9]" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Currently taking on commissions for music artists and working on a few personal
                projects on the side.
              </p>
            </div>
          </FadeIn>

        </div>
      </div>
    </main>
  )
}
