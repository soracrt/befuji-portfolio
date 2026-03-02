'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import FadeIn from './FadeIn'
import ShinyText from './ShinyText'
import { ShimmerButton } from './ui/shimmer-button'

const ENDINGS = [
  'fade in.',
  'disappear.',
  'conform.',
]

const DELETE_SPEED = 35 // ms per char deleted (constant)
const HOLD_MS = 2000    // pause after fully typed

// Eased typing: starts fast (~25ms), slows to ~110ms by the end
function typeDelay(progress: number) {
  return 25 + 85 * (progress * progress)
}

type Phase = 'typing' | 'holding' | 'deleting'

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState<Phase>('typing')

  useEffect(() => {
    const target = ENDINGS[index]

    if (phase === 'typing') {
      if (displayed.length < target.length) {
        const progress = displayed.length / target.length
        const id = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          typeDelay(progress)
        )
        return () => clearTimeout(id)
      } else {
        const id = setTimeout(() => setPhase('holding'), HOLD_MS)
        return () => clearTimeout(id)
      }
    }

    if (phase === 'holding') {
      const id = setTimeout(() => setPhase('deleting'), 400)
      return () => clearTimeout(id)
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const id = setTimeout(
          () => setDisplayed(d => d.slice(0, -1)),
          DELETE_SPEED
        )
        return () => clearTimeout(id)
      } else {
        setIndex(i => (i + 1) % ENDINGS.length)
        setPhase('typing')
      }
    }
  }, [displayed, phase, index])

  return (
    <section className="relative z-[1] min-h-screen flex flex-col justify-center px-8 pt-28 pb-20 text-center">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center gap-6">

        {/* Line 1 — Inter Black, large */}
        <FadeIn delay={400}>
          <h1
            className="font-display font-black text-ink leading-[1.05] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2rem, 4.2vw, 4rem)' }}
          >
            motion designed to move.
          </h1>
        </FadeIn>

        {/* Line 2 — typewriter */}
        <FadeIn delay={520}>
          <p
            className="hero-subheading font-sans font-normal leading-snug"
            style={{ fontSize: 'clamp(0.95rem, 2.05vw, 1.95rem)' }}
          >
            for brands that refuse to{' '}
            <span className="whitespace-nowrap">
              {displayed}
              <span
                className="inline-block w-[2px] h-[1em] bg-ink align-middle ml-[1px]"
                style={{ animation: 'cursor-blink 0.8s step-end infinite' }}
              />
            </span>
          </p>
        </FadeIn>

        {/* Line 3 — open for work */}
        <FadeIn delay={630}>
          <div className="open-for-work flex items-center justify-center gap-2.5">
            <span
              className="animate-pulse-dot block w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: '#a10702' }}
            />
            <ShinyText
              text="open for work"
              speed={3}
              color="#a10702"
              shineColor="#e84444"
              spread={120}
              className="font-sans text-sm font-semibold"
            />
          </div>
        </FadeIn>

        {/* Line 4 — faded subtext */}
        <FadeIn delay={730}>
          <p
            className="font-sans font-normal text-sm text-ink"
            style={{ opacity: 0.5 }}
          >
            ads · saas films
          </p>
        </FadeIn>

        {/* CTA buttons — staggered individually */}
        <div className="flex flex-wrap items-center justify-center gap-4">

          {/* Get in touch — shimmer white pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{ boxShadow: '0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.12)', borderRadius: '9999px' }}
          >
            <Link href="/contact">
              <ShimmerButton
                background="rgba(255,255,252,1)"
                shimmerColor="#a10702"
                borderRadius="9999px"
                className="font-sans text-xs tracking-[0.15em] uppercase text-bg px-7 py-3 border-white/20"
              >
                get in touch
              </ShimmerButton>
            </Link>
          </motion.div>

          {/* View projects — outlined black pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/work"
              className="font-sans text-xs tracking-[0.15em] uppercase text-ink border border-ink px-7 py-3 rounded-full inline-block transition-all duration-300 ease-out hover:bg-ink hover:text-bg"
            >
              view projects
            </Link>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
