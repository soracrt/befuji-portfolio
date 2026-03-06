'use client'

import { useState } from 'react'
import Link from 'next/link'

const faqItems = [
  {
    q: "What's your typical turnaround time?",
    a: 'Around a week — 1 day for storyboarding, 2–3 days for the edit, 1 day for revisions.',
  },
  {
    q: 'Do you work with early-stage startups?',
    a: "Yes. Anyone with an idea worth visualizing. It doesn't matter where you're at — if you have a vision, that's enough.",
  },
  {
    q: 'What do you need to get started?',
    a: 'Your vision, target audience, and the type of content you want. The more context, the better the output.',
  },
  {
    q: 'How many revision rounds are included?',
    a: '2 rounds.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="border-b"
      style={{ borderColor: 'rgba(238,229,233,0.07)' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 text-left transition-opacity duration-150 hover:opacity-60"
      >
        <span
          className="font-sans"
          style={{ fontSize: '14px', color: '#EEE5E9', letterSpacing: '-0.01em' }}
        >
          {q}
        </span>
        <svg
          width="12" height="12" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          style={{
            color:     'rgba(238,229,233,0.3)',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.25s ease',
            flexShrink: 0,
            marginLeft: '16px',
          }}
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      <div
        style={{
          maxHeight:  open ? '200px' : '0',
          overflow:   'hidden',
          transition: 'max-height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <p
          className="font-sans pb-5 leading-relaxed"
          style={{ fontSize: '13px', color: 'rgba(238,229,233,0.45)', letterSpacing: '0.01em' }}
        >
          {a}
        </p>
      </div>
    </div>
  )
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-8 pt-24 pb-10">
      <div
        className="max-w-5xl mx-auto rounded-3xl px-10 py-12"
        style={{ background: '#0a0a0a', border: '1px solid rgba(238,229,233,0.06)' }}
      >
        {/* FAQ header */}
        <div className="flex items-end justify-between mb-8">
          <h2
            className="font-display"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#EEE5E9', fontWeight: 400, letterSpacing: '-0.03em' }}
          >
            Common questions
          </h2>
          <Link
            href="/contact"
            className="font-sans text-xs tracking-[0.12em] uppercase pb-0.5 border-b transition-colors duration-200 hidden sm:block"
            style={{ color: '#CF5C36', borderColor: '#CF5C36' }}
          >
            Ask one →
          </Link>
        </div>

        {/* FAQ list */}
        <div className="mb-12">
          {faqItems.map((item, i) => (
            <FAQItem key={i} q={item.q} a={item.a} />
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(238,229,233,0.06)' }}
        >
          <p
            className="font-sans text-xs"
            style={{ color: 'rgba(238,229,233,0.2)' }}
          >
            &copy; {year} Kulaire. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Work',     href: '/work' },
              { label: 'Reviews', href: '/reviews' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-xs tracking-[0.08em] uppercase transition-opacity duration-150 hover:opacity-60"
                style={{ color: 'rgba(238,229,233,0.3)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
