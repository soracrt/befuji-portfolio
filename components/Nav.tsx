'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1] as const

export default function Nav() {
  const [open, setOpen]       = useState(false)
  const [visible, setVisible] = useState(true)
  const lastY  = useRef(0)
  const navRef = useRef<HTMLDivElement>(null)

  // Hide on scroll-down, reveal on scroll-up
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y < lastY.current || y < 80)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 px-8 pt-5"
      style={{
        transform:  visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Main bar — 3-column grid keeps logo perfectly centered */}
      <div className="grid grid-cols-3 items-center">

        {/* Left: @soracrt → Instagram */}
        <div>
          <a
            href="https://instagram.com/soracrt"
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-xs transition-opacity duration-150 hover:opacity-60"
            style={{ color: 'rgba(238,229,233,0.35)', letterSpacing: '0.02em' }}
          >
            @soracrt
          </a>
        </div>

        {/* Center: logo — always centered, acts as toggle */}
        <div className="flex justify-center">
          <button
            onClick={() => setOpen(o => !o)}
            className="hover:opacity-70 transition-opacity duration-200"
            aria-label={open ? 'Close navigation' : 'Open navigation'}
          >
            <Image
              src="/logo.png"
              alt="kulaire"
              height={24}
              width={96}
              className="h-6 w-auto"
            />
          </button>
        </div>

        {/* Right: Contact */}
        <div className="flex justify-end">
          <Link
            href="/contact"
            className="font-sans text-xs tracking-[0.12em] uppercase transition-opacity duration-150 hover:opacity-60"
            style={{ color: '#EEE5E9' }}
          >
            Contact
          </Link>
        </div>
      </div>

      {/* Expandable links row */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="links"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex items-center justify-center gap-10 pt-4 pb-2"
          >
            {[
              { label: 'Work',     href: '/work' },
              { label: 'Services', href: '/contact' },
              { label: 'Reviews',  href: '/reviews' },
            ].map(({ label, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, delay: i * 0.05, ease: EASE }}
              >
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="font-sans text-xs tracking-[0.14em] uppercase transition-colors duration-150 hover:opacity-60"
                  style={{ color: '#EEE5E9' }}
                >
                  {label}
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
