'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

const LINKS = [
  { label: 'Work',     href: '/work' },
  { label: 'Services', href: '/contact' },
  { label: 'Reviews',  href: '/reviews' },
  { label: 'FAQ',      href: '/faq' },
  { label: 'Contact',  href: '/contact', accent: true },
]

// Full expanded width — must match inner content width
const OPEN_WIDTH  = 430
const CLOSED_SIZE = 44

export default function Nav() {
  const [open, setOpen]       = useState(false)
  const [visible, setVisible] = useState(true)
  const lastY  = useRef(0)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const scrollingDown = y > lastY.current && y > 80
      if (scrollingDown) { setOpen(false); setVisible(false) }
      else               { setVisible(true) }
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <nav
      className="fixed top-5 left-0 right-0 z-50 flex justify-center px-8"
      style={{
        transform:  visible ? 'translateY(0)' : 'translateY(-140%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      {/* Outer pill — width animates, overflow hidden reveals content */}
      <div
        ref={navRef}
        style={{
          width:                open ? `${OPEN_WIDTH}px` : `${CLOSED_SIZE}px`,
          height:               `${CLOSED_SIZE}px`,
          borderRadius:         '9999px',
          overflow:             'hidden',
          backdropFilter:       'blur(28px) saturate(180%)',
          WebkitBackdropFilter: 'blur(28px) saturate(180%)',
          background:           'rgba(12,12,12,0.65)',
          border:               '1px solid rgba(238,229,233,0.1)',
          boxShadow:            '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)',
          transition:           'width 0.5s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Inner row — fixed full width so content doesn't reflow */}
        <div
          style={{
            width:       `${OPEN_WIDTH}px`,
            height:      '100%',
            display:     'flex',
            alignItems:  'center',
            gap:         '18px',
            paddingLeft: '5px',
            paddingRight:'20px',
          }}
        >
          {/* Logo circle — always on the left */}
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center justify-center rounded-full flex-shrink-0 transition-all duration-300"
            style={{
              width:      `${CLOSED_SIZE - 10}px`,
              height:     `${CLOSED_SIZE - 10}px`,
              background: open ? 'rgba(207,92,54,0.12)' : 'rgba(238,229,233,0.06)',
              border:     `1px solid ${open ? 'rgba(207,92,54,0.35)' : 'rgba(238,229,233,0.12)'}`,
              flexShrink: 0,
            }}
            aria-label="Toggle navigation"
          >
            <Image src="/logo.png" alt="kulaire" width={16} height={16} className="w-4 h-auto" />
          </button>

          {/* Links — always rendered, revealed by pill expansion */}
          {LINKS.map(({ label, href, accent }, i) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="font-sans text-xs tracking-[0.12em] uppercase hover:opacity-50 transition-opacity duration-150"
              style={{
                color:      accent ? '#CF5C36' : 'rgba(238,229,233,0.65)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                opacity:    open ? 1 : 0,
                transform:  open ? 'translateX(0)' : 'translateX(8px)',
                transition: `opacity 0.3s ease ${0.15 + i * 0.04}s, transform 0.3s ease ${0.15 + i * 0.04}s`,
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
