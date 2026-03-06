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

  // Hide nav on scroll-down, reveal on scroll-up
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
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{
        transform:  visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Logo */}
      <Link href="/" className="hover:opacity-60 transition-opacity duration-200">
        <Image src="/logo.png" alt="kulaire" height={24} width={96} className="h-6 w-auto" />
      </Link>

      {/* Center — expandable pill */}
      <div
        className="flex items-center rounded-full"
        style={{
          background:     'rgba(238,229,233,0.04)',
          border:         '1px solid rgba(238,229,233,0.1)',
          backdropFilter: 'blur(16px)',
        }}
      >
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="links"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 'auto', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.38, ease: EASE }}
              className="flex items-center overflow-hidden"
              style={{ whiteSpace: 'nowrap' }}
            >
              <Link
                href="/work"
                onClick={() => setOpen(false)}
                className="font-sans text-xs tracking-[0.12em] uppercase px-5 py-2.5 hover:opacity-50 transition-opacity duration-150"
                style={{ color: '#EEE5E9' }}
              >
                Work
              </Link>
              <Link
                href="/contact"
                onClick={() => setOpen(false)}
                className="font-sans text-xs tracking-[0.12em] uppercase px-5 py-2.5 hover:opacity-50 transition-opacity duration-150"
                style={{ color: '#EEE5E9' }}
              >
                Services
              </Link>
              <Link
                href="/reviews"
                onClick={() => setOpen(false)}
                className="font-sans text-xs tracking-[0.12em] uppercase px-5 py-2.5 hover:opacity-50 transition-opacity duration-150"
                style={{ color: '#EEE5E9' }}
              >
                Reviews
              </Link>
              {/* Divider */}
              <div
                className="h-4 w-px mx-1 shrink-0"
                style={{ background: 'rgba(238,229,233,0.12)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zoom-out toggle button */}
        <button
          onClick={() => setOpen(o => !o)}
          className="p-2.5 flex items-center justify-center rounded-full transition-colors duration-200"
          aria-label={open ? 'Collapse menu' : 'Expand menu'}
          style={{ color: open ? '#CF5C36' : '#EEE5E9' }}
        >
          {/* Magnifying glass. Minus = zoom out (closed), Plus = collapse (open) */}
          <svg
            width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="10" cy="10" r="7" />
            <line x1="21" y1="21" x2="15.5" y2="15.5" />
            {/* Horizontal minus inside circle */}
            <line x1="7" y1="10" x2="13" y2="10" />
            {/* Vertical — only shown when closed (add) */}
            {!open && <line x1="10" y1="7" x2="10" y2="13" />}
          </svg>
        </button>
      </div>

      {/* Contact button */}
      <Link
        href="/contact"
        className="font-sans text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded-full transition-opacity duration-200 hover:opacity-80"
        style={{ background: '#CF5C36', color: '#000000', fontWeight: 500 }}
      >
        Contact
      </Link>
    </nav>
  )
}
