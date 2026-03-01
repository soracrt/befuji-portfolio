'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Link as ScrollLink } from 'react-scroll'

const linkClass = 'cursor-pointer font-sans text-xs tracking-[0.15em] uppercase text-ink hover:opacity-40 transition-opacity duration-200'
const linkGlow: React.CSSProperties = { textShadow: '0 0 20px rgba(255,255,255,0.4)' }
const contactGlow: React.CSSProperties = { boxShadow: '0 0 16px rgba(255,255,255,0.35), 0 0 32px rgba(255,255,255,0.15)' }

export default function Nav() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5">
      <Link
        href="/"
        className="hover:opacity-60 transition-opacity duration-200"
      >
        <div className="relative overflow-hidden">
          <img src="/icon.png" alt="befuji" className="h-12 w-auto" />
          <div
            className="logo-shine absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.45) 50%, transparent 70%)',
              maskImage: 'url(/icon.png)',
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskImage: 'url(/icon.png)',
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
            }}
          />
        </div>
      </Link>

      <div className="flex items-center gap-7">
        <Link href="/work" className={linkClass} style={linkGlow}>projects</Link>

        {isHome ? (
          <ScrollLink to="about" smooth offset={-70} duration={500} className={linkClass} style={linkGlow}>
            about
          </ScrollLink>
        ) : (
          <Link href="/#about" className={linkClass} style={linkGlow}>about</Link>
        )}

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
