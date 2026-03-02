'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import FadeIn from './FadeIn'
import ShinyText from './ShinyText'
import { ShimmerButton } from './ui/shimmer-button'

const PHRASES = ['fade into', 'disappear into', 'conform to']

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const id = setTimeout(() => {
      setCurrent(i => (i + 1) % PHRASES.length)
    }, 2200)
    return () => clearTimeout(id)
  }, [current])

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

        {/* Line 2 — animated phrase */}
        <FadeIn delay={520}>
          <p
            className="hero-subheading font-sans font-normal leading-snug"
            style={{ fontSize: 'clamp(0.95rem, 2.05vw, 1.95rem)' }}
          >
            for brands that refuse to{' '}
            <motion.span
              layout
              className="relative inline-flex overflow-hidden"
              style={{ height: '1.25em', verticalAlign: 'bottom' }}
              transition={{ layout: { type: 'spring', stiffness: 50, damping: 18 } }}
            >
              {/* drives width — always matches current phrase */}
              <span className="invisible whitespace-nowrap" aria-hidden>{PHRASES[current]}</span>
              {PHRASES.map((phrase, i) => (
                <motion.span
                  key={phrase}
                  className="absolute left-0 whitespace-nowrap"
                  initial={{ y: '100%', opacity: 0 }}
                  animate={
                    current === i
                      ? { y: 0, opacity: 1 }
                      : { y: current > i ? '-100%' : '100%', opacity: 0 }
                  }
                  transition={{ type: 'spring', stiffness: 50, damping: 18 }}
                >
                  {phrase}
                </motion.span>
              ))}
            </motion.span>
            {' '}the rest.
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
