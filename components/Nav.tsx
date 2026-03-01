'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Link as ScrollLink } from 'react-scroll'

const linkClass = 'cursor-pointer font-sans text-xs tracking-[0.15em] uppercase text-ink link-glow-red'
const contactGlow: React.CSSProperties = { boxShadow: '0 0 16px rgba(255,255,255,0.35), 0 0 32px rgba(255,255,255,0.15)' }

export default function Nav() {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const [visible, setVisible] = useState(true)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y < lastY.current || y < 60)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <Link
        href="/"
        className="hover:opacity-60 transition-opacity duration-200"
      >
        <img src="/icon.png" alt="befuji" className="h-12 w-auto" />
      </Link>

      <div className="flex items-center gap-7">
        <Link href="/work" className={linkClass}>projects</Link>

        {isHome ? (
          <ScrollLink to="about" smooth offset={-70} duration={500} className={linkClass}>
            about
          </ScrollLink>
        ) : (
          <Link href="/#about" className={linkClass}>about</Link>
        )}

        <Link href="/reviews" className={linkClass}>reviews</Link>

        <Link
          href="/contact"
          className="font-sans text-xs tracking-[0.15em] uppercase bg-ink text-bg px-5 py-2.5 rounded-full hover:opacity-70 transition-opacity duration-200"
          style={contactGlow}
        >
          contact
        </Link>
      </div>
    </nav>
  )
}
