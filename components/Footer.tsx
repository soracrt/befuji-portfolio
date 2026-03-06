'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaqSection } from './ui/faq-section'

const faqItems = [
  {
    question: "What's your typical turnaround time?",
    answer:   'Around a week — 1 day for storyboarding, 2–3 days for the edit, 1 day for revisions.',
  },
  {
    question: 'Do you work with early-stage startups?',
    answer:   "Yes. Anyone with an idea worth visualizing. It doesn't matter where you're at — if you have a vision, that's enough.",
  },
  {
    question: 'What do you need to get started?',
    answer:   'Your vision, target audience, and the type of content you want. The more context, the better the output.',
  },
  {
    question: 'How many revision rounds are included?',
    answer:   '2 rounds.',
  },
]

export default function Footer() {
  const router = useRouter()
  const year = new Date().getFullYear()

  return (
    <footer className="px-8 pt-24 pb-10">
      <div
        className="max-w-5xl mx-auto rounded-3xl px-10 py-12"
        style={{ background: '#0a0a0a', border: '1px solid rgba(238,229,233,0.06)' }}
      >
        {/* FAQ */}
        <div className="mb-12">
          <FaqSection
            title="Common questions"
            items={faqItems}
            contactInfo={{
              title:       'Still have questions?',
              description: "Send one through and we'll get back to you.",
              buttonText:  'Ask one →',
              onContact:   () => router.push('/contact'),
            }}
          />
        </div>

        {/* Bottom bar */}
        <div
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(238,229,233,0.06)' }}
        >
          <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.2)' }}>
            &copy; {year} Kulaire. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Work',    href: '/work' },
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
