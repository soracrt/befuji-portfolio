'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 text-center">

      <h1
        className="font-display leading-[0.95] tracking-[-0.04em] mb-8"
        style={{ fontSize: 'clamp(3rem, 11vw, 8.5rem)', fontWeight: 400, color: '#EEE5E9' }}
      >
        <span className="block">built to be</span>
        <span className="block">remembered<span style={{ color: '#CF5C36' }}>.</span></span>
      </h1>

      <div className="flex items-center gap-2 mb-8">
        <span
          className="inline-block w-2 h-2 rounded-full flex-shrink-0"
          style={{ background: '#CF5C36', animation: 'pulse-dot 2s ease-in-out infinite' }}
        />
        <span
          className="font-sans text-sm"
          style={{
            color: '#EEE5E9',
            letterSpacing: '0.04em',
            textShadow: '0 0 12px rgba(238,229,233,0.4), 0 0 28px rgba(238,229,233,0.15)',
          }}
        >
          Limited spots left in April
        </span>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/quote"
          className="font-display font-medium px-5 py-2.5 rounded-full transition-colors duration-200 flex items-center gap-2"
          style={{
            fontSize: '14px',
            background: '#CF5C36',
            color: '#EEE5E9',
            boxShadow: '0 0 18px rgba(207,92,54,0.55), 0 0 40px rgba(207,92,54,0.25)',
          }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 26px rgba(207,92,54,0.75), 0 0 60px rgba(207,92,54,0.35)' }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 18px rgba(207,92,54,0.55), 0 0 40px rgba(207,92,54,0.25)' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Get a quote
        </Link>

        <Link
          href="/work"
          className="font-display font-medium px-5 py-2.5 rounded-full transition-opacity duration-200 hover:opacity-80"
          style={{
            fontSize: '14px',
            border: '1px solid rgba(238,229,233,0.45)',
            color: 'rgba(238,229,233,0.75)',
          }}
        >
          View work
        </Link>
      </div>

    </section>
  )
}
