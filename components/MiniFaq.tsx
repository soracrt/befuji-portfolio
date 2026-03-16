'use client'

import Link from 'next/link'
import { FaqSection } from './ui/faq-section'

const ITEMS = [
  {
    question: "What's your typical turnaround time?",
    answer:   "Depends on the project — usually 1 to 5 days. Simpler edits land faster, more complex ones take longer. Coming prepared with a clear brief helps a lot.",
  },
  {
    question: 'What do you need to get started?',
    answer:   "Your vision, target audience, and any creative direction. Brand assets, color schemes, reference videos — send whatever you have. The more context, the better.",
  },
  {
    question: 'How many revision rounds are included?',
    answer:   "Every project comes with 2 revision rounds. Additional rounds are $15 each.",
  },
  {
    question: 'Do you require a deposit?',
    answer:   "Yes, 50% upfront before work begins. Pay in full and we can start immediately.",
  },
  {
    question: 'Do you offer retainer packages?',
    answer:   "Retainers start at $250 and go up to $500/month depending on output. Reach out and we'll figure out what works.",
  },
  {
    question: 'Do you handle hosting and maintenance?',
    answer:   "Yes — we deploy on Vercel and offer monthly maintenance at $30. That covers updates, fixes, and keeping everything running smoothly.",
  },
]

export default function MiniFaq() {
  return (
    <section className="px-4 sm:px-8 pb-24">
      <div className="max-w-5xl mx-auto">
        <FaqSection
          headingLine1="Common"
          headingAccent="questions."
          description="Anything else? We're a message away."
          items={ITEMS}
        />
        <div className="mt-8 pl-0 md:pl-[38%]">
          <Link
            href="/faq"
            className="font-sans text-xs tracking-[0.1em] uppercase transition-colors duration-200"
            style={{ color: 'rgba(238,229,233,0.3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#CF5C36')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(238,229,233,0.3)')}
          >
            View full FAQ →
          </Link>
        </div>
      </div>
    </section>
  )
}
