'use client'

import { useState } from 'react'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'
import { FaqSection } from '@/components/ui/faq-section'

type Category = 'General' | 'Website'

const CATEGORIES: Category[] = ['General', 'Website']

const FAQS: Record<Category, { question: string; answer: string }[]> = {
  General: [
    {
      question: "What's your typical turnaround time?",
      answer:   "Depends on the project. Usually 1–5 days — simpler edits land faster, more complex ones take longer. If you don't have a script or storyboard ready, that adds time too, so coming prepared helps a lot.",
    },
    {
      question: 'Do you work with early-stage startups?',
      answer:   "Yeah, absolutely. As long as you know what you're building and who it's for, I can work with you.",
    },
    {
      question: 'What do you need to get started?',
      answer:   "Your vision, mission, and target audience. From there, send over any creative direction — whether you want an explainer, a product demo, whatever fits. If you have videos you love and want to reference, send those too. Color schemes, brand assets, the basics.",
    },
  ],
  Website: [
    {
      question: 'What kind of websites do you build?',
      answer:   'Portfolios, service sites, marketing pages, and SaaS — basically anything business-facing that needs to look clean and convert.',
    },
    {
      question: 'Do you handle hosting and deployment?',
      answer:   'Vercel, yes. Serverless setups have a 2-user free limit so anything beyond that comes with an extra fee. Monthly maintenance is $20.',
    },
    {
      question: 'Do you build e-commerce stores?',
      answer:   "Not currently, but it's something being added soon.",
    },
  ],
}

const CATEGORY_LABELS: Record<Category, string> = {
  General: 'General',
  Website: 'Website FAQ',
}

export default function FaqPage() {
  const [active, setActive] = useState<Category>('General')

  return (
    <main>
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
              categories={CATEGORIES}
              categoryLabels={CATEGORY_LABELS}
              activeCategory={active}
              onCategoryChange={cat => setActive(cat as Category)}
              headingLine1="Frequently asked"
              headingAccent="questions"
              description="Everything you need to know before getting started."
              items={FAQS[active]}
            />
          </FadeIn>

        </div>
      </div>
    </main>
  )
}
