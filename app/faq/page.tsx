'use client'

import Link from 'next/link'
import Nav from '@/components/Nav'
import FadeIn from '@/components/FadeIn'
import { FaqSection } from '@/components/ui/faq-section'

const faqs = [
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
  {
    question: 'Do you offer ongoing retainer packages?',
    answer:   'Yes — monthly retainers are available for brands that need consistent content. Reach out and we can put something together.',
  },
  {
    question: 'What formats do you deliver in?',
    answer:   'MP4 (H.264/H.265) at up to 4K resolution. Additional formats on request.',
  },
]

export default function FaqPage() {
  return (
    <main>
      <Nav />

      <div className="pt-32 pb-24 px-8">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <FadeIn>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase mb-16 transition-opacity hover:opacity-50"
              style={{ color: 'rgba(238,229,233,0.4)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              Back
            </Link>
          </FadeIn>

          <FadeIn>
            <FaqSection
              badge="FAQs"
              headingLine1="Frequently asked"
              headingAccent="questions"
              description="Everything you need to know before getting started. Still unsure? Send us a message."
              items={faqs}
            />
          </FadeIn>

        </div>
      </div>
    </main>
  )
}
