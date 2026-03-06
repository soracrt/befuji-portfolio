'use client'

import Link from 'next/link'
import { FaqList, type FaqItem } from './ui/faq-monochrome'

const faqItems: FaqItem[] = [
  {
    question: "What's your typical turnaround time?",
    answer:   'Around a week — 1 day for storyboarding, 2–3 days for the edit, 1 day for revisions.',
    meta:     'Timeline',
  },
  {
    question: 'Do you work with early-stage startups?',
    answer:   "Yes. Anyone with an idea worth visualizing. It doesn't matter where you're at — if you have a vision, that's enough.",
    meta:     'Clients',
  },
  {
    question: 'What do you need to get started?',
    answer:   'Your vision, target audience, and the type of content you want. The more context, the better the output.',
    meta:     'Process',
  },
  {
    question: 'How many revision rounds are included?',
    answer:   '2 rounds.',
    meta:     'Revisions',
  },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-8 pt-24 pb-10">
      <div
        className="max-w-5xl mx-auto rounded-3xl px-10 py-12"
        style={{ background: '#0a0a0a', border: '1px solid rgba(238,229,233,0.06)' }}
      >
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#EEE5E9', letterSpacing: '-0.03em' }}
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

        {/* FAQ cards */}
        <div className="mb-12">
          <FaqList items={faqItems} />
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
