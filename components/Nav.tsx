'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'

const LINKS = [
  { label: 'Home',    href: '/' },
  { label: 'Work',    href: '/work' },
  { label: 'FAQ',     href: '/faq' },
  { label: 'Contact', href: '/contact', accent: true },
]

// Full expanded width — must match inner content width
const OPEN_WIDTH  = 320
const CLOSED_SIZE = 44

export default function Nav() {
  const [open, setOpen]       = useState(false)
  const [visible, setVisible] = useState(true)
  const lastY  = useRef(0)
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let collapseTimer: ReturnType<typeof setTimeout> | null = null

    const onScroll = () => {
      const y = window.scrollY
      const scrollingDown = y > lastY.current && y > 80
      if (scrollingDown) {
        // Slide up first
        setVisible(false)
        // Contract to circle only after slide-up finishes
        collapseTimer = setTimeout(() => setOpen(false), 420)
      } else {
        if (collapseTimer) { clearTimeout(collapseTimer); collapseTimer = null }
        setVisible(true)
      }
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (collapseTimer) clearTimeout(collapseTimer)
    }
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
        transform:  visible ? 'translateY(0)' : 'translateY(-200%)',
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
            paddingLeft: '0px',
            paddingRight:'20px',
          }}
        >
          {/* Logo button — same size as closed pill, img absolutely centered */}
          <button
            onClick={() => setOpen(o => !o)}
            aria-label="Toggle navigation"
            style={{
              position:   'relative',
              width:      `${CLOSED_SIZE}px`,
              height:     `${CLOSED_SIZE}px`,
              flexShrink:  0,
              background:  'none',
              border:      'none',
              outline:     'none',
              padding:     0,
              cursor:      'pointer',
              marginRight: '10px',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="kulaire"
              style={{
                position:  'absolute',
                top:       '50%',
                left:      '50%',
                transform: 'translate(-50%, -50%)',
                width:     '22px',
                height:    '22px',
                objectFit: 'contain',
                display:   'block',
                border:    'none',
                outline:   'none',
              }}
            />
          </button>

          {/* Links — always rendered, revealed by pill expansion */}
          {LINKS.map(({ label, href, accent }, i) => (
            <Link
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="font-sans text-xs tracking-[0.12em] uppercase"
              style={{
                color:      accent ? '#CF5C36' : 'rgba(238,229,233,0.65)',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                opacity:    open ? 1 : 0,
                transform:  open ? 'translateX(0)' : 'translateX(8px)',
                textShadow: accent ? (open ? '0 0 12px rgba(207,92,54,0.7), 0 0 24px rgba(207,92,54,0.3)' : 'none') : 'none',
                transition: `opacity 0.3s ease ${0.15 + i * 0.04}s, transform 0.3s ease ${0.15 + i * 0.04}s, color 0.15s ease, text-shadow 0.15s ease${accent ? `, text-shadow 0.5s ease ${open ? '0.4s' : '0s'}` : ''}`,
              }}
              onMouseEnter={e => {
                if (accent) {
                  e.currentTarget.style.color = '#ff7f47'
                  e.currentTarget.style.textShadow = '0 0 16px rgba(207,92,54,0.9), 0 0 32px rgba(207,92,54,0.5)'
                } else {
                  e.currentTarget.style.color = '#ffffff'
                  e.currentTarget.style.textShadow = 'none'
                }
              }}
              onMouseLeave={e => {
                if (accent) {
                  e.currentTarget.style.color = '#CF5C36'
                  e.currentTarget.style.textShadow = open ? '0 0 12px rgba(207,92,54,0.7), 0 0 24px rgba(207,92,54,0.3)' : 'none'
                } else {
                  e.currentTarget.style.color = 'rgba(238,229,233,0.65)'
                  e.currentTarget.style.textShadow = 'none'
                }
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
