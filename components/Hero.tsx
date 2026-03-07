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

  useEffect(() => {
    fetch('/api/admin/stats', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { if (typeof d.slots === 'number') setSlots(d.slots) })
      .catch(() => {})
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-8 text-center">

      {/* Availability badge */}
      <FadeIn delay={100}>
        <div className="flex items-center gap-2 mb-10">
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{
              background: slots === 0 ? '#ef4444' : '#CF5C36',
              boxShadow:  slots === 0
                ? '0 0 0 0 rgba(239,68,68,0.4)'
                : '0 0 0 0 rgba(207,92,54,0.4)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          <span
            className="font-sans text-xs tracking-[0.12em] uppercase"
            style={{ color: 'rgba(238,229,233,0.45)' }}
          >
            {slots === null ? '\u00a0' : slotLabel(slots)}
          </span>
        </div>
      </FadeIn>

      {/* Slogan */}
      <FadeIn delay={200}>
        <h1
          className="font-display leading-[0.95] tracking-[-0.04em] mb-12"
          style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', fontWeight: 400, color: '#EEE5E9' }}
        >
          <span className="block">built to be</span>
          <span className="block">remembered<span style={{ color: '#CF5C36' }}>.</span></span>
        </h1>
      </FadeIn>

      {/* CTA pills */}
      <FadeIn delay={340}>
        <div className="flex items-center gap-3">
          {/* Primary — filled */}
          <Link
            href="/contact"
            className="font-sans font-semibold text-xs tracking-[0.1em] uppercase px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-85"
            style={{
              background: '#CF5C36',
              color: '#000',
            }}
          >
            Get a Quote
          </Link>

          {/* Secondary — stroke */}
          <Link
            href="/work"
            className="font-sans text-xs tracking-[0.1em] uppercase px-5 py-2.5 rounded-full transition-all duration-200 hover:opacity-70"
            style={{
              border: '1px solid rgba(238,229,233,0.2)',
              color: 'rgba(238,229,233,0.55)',
            }}
          >
            View Work
          </Link>
        </div>
      </FadeIn>

    </section>
  )
}
