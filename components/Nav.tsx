'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'

const EASE = [0.16, 1, 0.3, 1] as const

const LEFT_LINKS = [
  { label: 'Work',     href: '/work' },
  { label: 'Services', href: '/contact' },
]

const RIGHT_LINKS = [
  { label: 'Reviews', href: '/reviews' },
  { label: 'FAQ',     href: '/faq' },
  { label: 'Contact', href: '/contact', accent: true },
]

export default function Nav() {
  const [open, setOpen]       = useState(false)
  const [visible, setVisible] = useState(true)
  const lastY  = useRef(0)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const scrollingDown = y > lastY.current && y > 80
      if (scrollingDown) {
        setOpen(false)
        setVisible(false)
      } else {
        setVisible(true)
      }
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
      className="fixed top-5 left-0 right-0 z-50 flex justify-center px-8"
      style={{
        transform:  visible ? 'translateY(0)' : 'translateY(-120%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <motion.div
        ref={navRef}
        layout
        transition={{ duration: 0.45, ease: EASE }}
        className="flex items-center"
        style={{
          borderRadius:         '9999px',
          backdropFilter:       'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          background:           'rgba(12,12,12,0.6)',
          border:               '1px solid rgba(238,229,233,0.1)',
          boxShadow:            '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
          padding:              open ? '7px 20px' : '7px',
          gap:                  open ? '20px' : '0px',
        }}
      >
        {/* Left links — slide in from left */}
        <AnimatePresence>
          {open && LEFT_LINKS.map(({ label, href }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -14, width: 0, marginRight: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{   opacity: 0, x: -10, width: 0 }}
              transition={{ duration: 0.35, delay: (LEFT_LINKS.length - 1 - i) * 0.05, ease: EASE }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="font-sans text-xs tracking-[0.12em] uppercase transition-opacity duration-150 hover:opacity-50"
                style={{ color: 'rgba(238,229,233,0.6)' }}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Logo circle — always centered */}
        <motion.button
          layout
          onClick={() => setOpen(o => !o)}
          className="flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-300"
          style={{
            width:      '34px',
            height:     '34px',
            background: open ? 'rgba(207,92,54,0.12)' : 'rgba(238,229,233,0.06)',
            border:     `1px solid ${open ? 'rgba(207,92,54,0.35)' : 'rgba(238,229,233,0.12)'}`,
          }}
          aria-label="Toggle navigation"
        >
          <Image src="/logo.png" alt="kulaire" width={18} height={18} className="w-[18px] h-auto" />
        </motion.button>

        {/* Right links — slide in left to right */}
        <AnimatePresence>
          {open && RIGHT_LINKS.map(({ label, href, accent }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: 14, width: 0 }}
              animate={{ opacity: 1, x: 0, width: 'auto' }}
              exit={{   opacity: 0, x: 10, width: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease: EASE }}
              style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              <Link
                href={href}
                onClick={() => setOpen(false)}
                className="font-sans text-xs tracking-[0.12em] uppercase transition-opacity duration-150 hover:opacity-50"
                style={{ color: accent ? '#CF5C36' : 'rgba(238,229,233,0.6)' }}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </nav>
  )
}
