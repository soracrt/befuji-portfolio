'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import FadeIn from './FadeIn'

function slotLabel(slots: number): string {
  if (slots === 0) return 'No slots available'
  if (slots === 1) return '1 slot left this month'
  return `${slots} slots available this month`
}

export default function Hero() {
  const [slots, setSlots] = useState<number | null>(null)
  const [showText, setShowText] = useState(false)

  useEffect(() => {
    // Dot shows immediately (slots fetched), text fades in shortly after
    fetch('/api/admin/stats', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => {
        if (typeof d.slots === 'number') setSlots(d.slots)
        setTimeout(() => setShowText(true), 120)
      })
      .catch(() => setShowText(true))
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-8 text-center">

      {/* Slogan — immediate, no animation */}
      <h1
        className="font-display leading-[0.95] tracking-[-0.04em] mb-8"
        style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', fontWeight: 400, color: '#EEE5E9' }}
      >
        <span className="block">built to be</span>
        <span className="block">remembered<span style={{ color: '#CF5C36' }}>.</span></span>
      </h1>

      {/* Availability badge — dot instant, text instant after fetch */}
      <div className="flex items-center gap-2 mb-8">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{
            background: slots === 0 ? '#ef4444' : '#CF5C36',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }}
        />
        <span
          className="font-sans text-xs"
          style={{
            color: 'rgba(238,229,233,0.45)',
            opacity: showText ? 1 : 0,
            transition: 'opacity 0.15s ease',
            letterSpacing: '0.04em',
          }}
        >
          {slots === null ? '\u00a0' : slotLabel(slots)}
        </span>
      </div>

      {/* CTA pills — fade in */}
      <FadeIn delay={200}>
        <div className="flex items-center gap-3">
          {/* Primary — filled + glow */}
          <Link
            href="/contact"
            className="font-serif font-medium px-5 py-2.5 rounded-full transition-all duration-200 flex items-center gap-2"
            style={{
              fontSize: '15px',
              background: '#CF5C36',
              color: '#EEE5E9',
              boxShadow: '0 0 18px rgba(207,92,54,0.55), 0 0 40px rgba(207,92,54,0.25)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 0 26px rgba(207,92,54,0.75), 0 0 60px rgba(207,92,54,0.35)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = '0 0 18px rgba(207,92,54,0.55), 0 0 40px rgba(207,92,54,0.25)'
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            Get a quote
          </Link>

          {/* Secondary — stroke */}
          <Link
            href="/work"
            className="font-serif font-medium px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-80"
            style={{
              fontSize: '15px',
              border: '1px solid rgba(238,229,233,0.45)',
              color: 'rgba(238,229,233,0.75)',
            }}
          >
            View work
          </Link>
        </div>
      </FadeIn>

    </section>
  )
}
