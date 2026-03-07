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
      answer:   "Depends on the project. Usually 1 to 5 days. Simpler edits land faster, more complex ones take longer. If you don't have a script or storyboard ready, that adds time too, so coming prepared helps a lot.",
    },
    {
      question: 'Do you work with early-stage startups?',
      answer:   "Yeah, absolutely. As long as you know what you're building and who it's for, we can work together.",
    },
    {
      question: 'What do you need to get started?',
      answer:   "Your vision, mission, and target audience. Send over any creative direction, whether you want an explainer, a product demo, whatever fits. If you have videos you love and want to reference, send those too. Color schemes, brand assets, the basics.",
    },
    {
      question: 'How many revision rounds are included?',
      answer:   "Every project comes with 2 revision rounds. Need more? Additional rounds are $15 each.",
    },
    {
      question: 'Do you offer retainer packages?',
      answer:   "Yeah. Retainers start at $250 and go up to $500 a month depending on how much output you need. Reach out and we'll figure out what works.",
    },
    {
      question: 'What formats do you deliver in?',
      answer:   "Whatever you need. MP4 is the default, exported in 4K. Just ask if you need something different.",
    },
    {
      question: 'Do you offer rush delivery?',
      answer:   "Yeah, rush delivery is available for an extra $50. You get it fast, no corners cut.",
    },
    {
      question: 'Do clients keep the source files?',
      answer:   "Final exports are always included. Source files are available for an additional fee.",
    },
    {
      question: 'Is there a minimum project budget?',
      answer:   "Nope. Work is work. Whether you're a solo creator or a growing brand, if you have a vision we can talk.",
    },
    {
      question: 'Do you require a deposit?',
      answer:   "Yes, 50% upfront before work begins. If you want to pay in full, that works too and we can get started immediately.",
    },
    {
      question: 'Do you work with international clients?',
      answer:   "Anywhere in the world. As long as you have an internet connection, speak a bit of English, and know what you want, we're good.",
    },
    {
      question: "What's the best way to reach you?",
      answer:   "Fill out the contact form on the site, or reach out directly on Discord at soracrt or via email at hello@kulaire.com.",
    },
  ],
  Website: [
    {
      question: 'What kind of websites do you build?',
      answer:   "Portfolios, service sites, marketing pages, and SaaS. Basically anything business-facing that needs to look clean and convert.",
    },
    {
      question: 'Do you handle hosting and deployment?',
      answer:   "Vercel, yes. Serverless setups have a 2 user free limit so anything beyond that comes with an extra fee.",
    },
    {
      question: 'Can you redesign an existing site?',
      answer:   "Yeah. Redesigns are 50 to 75% of the cost of a full build since we're only touching the front end, not rebuilding the whole thing.",
    },
    {
      question: 'Do you build e-commerce stores?',
      answer:   "Not currently, but it's something being added soon.",
    },
    {
      question: 'How long does a website project take?',
      answer:   "Depends on demand. If things are quiet, 1 to 2 days. If it's a busy period, expect around a week.",
    },
    {
      question: 'Do you offer maintenance?',
      answer:   "Yeah, monthly maintenance is $30. That covers updates, fixes, and making sure everything keeps running smoothly. It's separate from hosting.",
    },
    {
      question: 'Do you require a deposit for web projects?',
      answer:   "Same as everything else, 50% upfront. Pay in full and we start immediately.",
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
