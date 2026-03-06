'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'motion/react'
import { InstagramIcon } from 'lucide-react'

const WORDS = ['boring.', 'average.', 'forgettable.', 'ordinary.', 'predictable.']

function CyclingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % WORDS.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="block relative" style={{ minHeight: '1.05em' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ y: '60%', opacity: 0, filter: 'blur(8px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-60%', opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="block"
          style={{ color: '#CF5C36' }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function FooterSection() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full px-8 pt-20 pb-8" style={{ borderTop: '1px solid rgba(238,229,233,0.07)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Top section */}
        <div className="grid grid-cols-2 gap-8 mb-16">

          {/* Left: CTA */}
          <div className="flex flex-col justify-between">
            <h2
              className="font-display font-bold leading-[1.0]"
              style={{ fontSize: 'clamp(2.5rem, 4.5vw, 5rem)', color: '#EEE5E9', letterSpacing: '-0.03em' }}
            >
              Ready to work<br />with us?
            </h2>
            <a
              href="/contact"
              className="self-start inline-flex items-center font-sans text-xs tracking-[0.08em] uppercase px-4 py-2 rounded-full mt-8 transition-all duration-200 hover:opacity-70"
              style={{ border: '1px solid rgba(238,229,233,0.25)', color: 'rgba(238,229,233,0.6)' }}
            >
              Get in touch →
            </a>
          </div>

          {/* Right: animated tagline */}
          <div className="flex flex-col justify-between items-end text-right">
            <h2
              className="font-display font-bold leading-[1.0]"
              style={{ fontSize: 'clamp(2.5rem, 4.5vw, 5rem)', color: '#EEE5E9', letterSpacing: '-0.03em' }}
            >
              <span className="block">Don&apos;t be</span>
              <CyclingWord />
            </h2>
            <div className="flex gap-12 mt-8">
              <div className="text-right">
                <p className="font-sans text-sm font-medium mb-1" style={{ color: '#EEE5E9' }}>Motion</p>
                <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(238,229,233,0.35)' }}>
                  Film, ads, SaaS<br />brand videos.
                </p>
              </div>
              <div className="text-right">
                <p className="font-sans text-sm font-medium mb-1" style={{ color: '#EEE5E9' }}>Web</p>
                <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(238,229,233,0.35)' }}>
                  Minimal sites,<br />built fast.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="mb-6" style={{ borderTop: '1px solid rgba(238,229,233,0.07)' }} />

        {/* Middle row */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-8">
            {[
              { label: 'Work',    href: '/work' },
              { label: 'Reviews', href: '/reviews' },
              { label: 'FAQ',     href: '/faq' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-xs tracking-[0.1em] uppercase transition-opacity duration-150 hover:opacity-60"
                style={{ color: 'rgba(238,229,233,0.4)' }}
              >
                • {label}
              </Link>
            ))}
          </div>
          <a
            href="https://instagram.com/soracrt"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity duration-150 hover:opacity-60"
            style={{ color: 'rgba(238,229,233,0.4)' }}
            aria-label="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.18)' }}>
            &copy; {year} Kulaire. All rights reserved.
          </p>
          <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.18)' }}>
            kulaire.com
          </p>
        </div>

      </div>
    </footer>
  )
}
