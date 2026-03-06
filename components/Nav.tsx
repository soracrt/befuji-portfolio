'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1] as const

const NAV_LINKS = [
  { label: 'Work',     href: '/work' },
  { label: 'Services', href: '/contact' },
  { label: 'Reviews',  href: '/reviews' },
  { label: 'FAQ',      href: '/faq' },
  { label: 'Contact',  href: '/contact' },
]

export default function Nav() {
  const [open, setOpen]       = useState(false)
  const [visible, setVisible] = useState(true)
  const lastY  = useRef(0)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y < lastY.current || y < 80)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
      {/* Logo — centered */}
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

      {/* Expandable links */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="links"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="flex items-center justify-center gap-8 pt-4 pb-2"
          >
            {NAV_LINKS.map(({ label, href }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, delay: i * 0.04, ease: EASE }}
              >
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="font-sans text-xs tracking-[0.14em] uppercase transition-opacity duration-150 hover:opacity-60"
                  style={{ color: label === 'Contact' ? '#CF5C36' : '#EEE5E9' }}
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
