'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import FadeIn from './FadeIn'
import ShinyText from './ShinyText'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-8 pt-28 pb-20 text-center">
      <div className="max-w-5xl mx-auto w-full flex flex-col items-center gap-6">

        {/* Line 1 — Inter Black, large */}
        <FadeIn>
          <h1
            className="font-sans font-black text-white leading-[1.05] tracking-[-0.03em]"
            style={{ fontSize: 'clamp(2rem, 4.2vw, 4rem)' }}
          >
            motion designed to move.
          </h1>
        </FadeIn>

        {/* Line 2 — Inter Regular */}
        <FadeIn delay={120}>
          <p
            className="font-sans font-normal text-ink leading-snug"
            style={{ fontSize: 'clamp(0.95rem, 2.05vw, 1.95rem)' }}
          >
            for brands that refuse to blend in with the rest.
          </p>
        </FadeIn>

        {/* Line 3 — open for work */}
        <FadeIn delay={230}>
          <div className="flex items-center justify-center gap-2.5">
            <span
              className="animate-pulse-dot block w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: '#16a34a' }}
            />
            <ShinyText
              text="open for work"
              speed={3}
              color="#16a34a"
              shineColor="#4ade80"
              spread={120}
              className="font-sans text-sm font-semibold"
            />
          </div>
        </FadeIn>

        {/* Line 4 — faded subtext */}
        <FadeIn delay={340}>
          <p
            className="font-sans font-normal text-sm text-ink"
            style={{ opacity: 0.5 }}
          >
            ads · saas films
          </p>
        </FadeIn>

        {/* CTA buttons — staggered individually */}
        <div className="flex flex-wrap items-center justify-center gap-4">

          {/* Book a call — filled black with glow */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              scale: 1.02,
              boxShadow: '0 0 28px rgba(255,255,255,0.15), 0 0 56px rgba(255,255,255,0.08)',
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
            style={{ boxShadow: '0 0 20px rgba(255,255,255,0.10), 0 0 40px rgba(255,255,255,0.05)', borderRadius: '9999px' }}
          >
            <a
              href="https://cal.com/befuji"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs tracking-[0.15em] uppercase bg-white text-black border border-white px-7 py-3 rounded-full inline-block"
            >
              book a call
            </a>
          </motion.div>

          {/* Get in touch — outlined */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.70, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{
              scale: 1.02,
              transition: { duration: 0.3, ease: 'easeOut' },
            }}
          >
            <Link
              href="/contact"
              className="font-sans text-xs tracking-[0.15em] uppercase text-white border border-white px-7 py-3 rounded-full hover:border-white transition-colors duration-300 inline-block"
            >
              get in touch
            </Link>
          </motion.div>

        </div>

      </div>
    </section>
  )
}
