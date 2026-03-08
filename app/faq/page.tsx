'use client'

import { useState } from 'react'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'
import BackButton from '@/components/BackButton'
import { FaqSection } from '@/components/ui/faq-section'

type Category = 'General' | 'Motion' | 'Website'

const CATEGORIES: Category[] = ['General', 'Motion', 'Website']

const FAQS: Record<Category, { question: string; answer: string }[]> = {
  General: [
    {
      question: "What's your typical turnaround time?",
      answer:   "Depends on the project. Usually 1 to 5 days. Simpler edits land faster, more complex ones take longer. If you don't have a script or storyboard ready, that adds time too, so coming prepared helps a lot.",
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
      question: 'Do you require a deposit?',
      answer:   "Yes, 50% upfront before work begins. If you want to pay in full, that works too and we can get started immediately.",
    },
  ],
  Motion: [
    {
      question: 'What software do you use?',
      answer:   "After Effects for motion graphics, Premiere Pro for cutting and sound design, and Figma for storyboarding.",
    },
    {
      question: 'Do you write scripts?',
      answer:   "It's better if you come with one ready, but if you need help putting it together, that's something we can work out.",
    },
    {
      question: 'Do you handle voiceovers?',
      answer:   "Not personally. If you need one, you'll need to source your own talent or provide a recording.",
    },
    {
      question: 'Do you work with existing brand guidelines?',
      answer:   "Yeah, send them over and we'll build around what you already have.",
    },
    {
      question: 'Is there a video length limit?',
      answer:   "No hard limit. A minute or two is the sweet spot, but as long as the scope is clear we can make it work.",
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
      question: 'How long does a website project take?',
      answer:   "Depends on demand. If things are quiet, 1 to 2 days. If it's a busy period, expect around a week.",
    },
    {
      question: 'Do you offer maintenance?',
      answer:   "Yeah, monthly maintenance is $30. That covers updates, fixes, and making sure everything keeps running smoothly. It's separate from hosting.",
    },
    {
      question: 'Do you build e-commerce stores?',
      answer:   "Not currently, but it's something being added soon.",
    },
  ],
}

const CATEGORY_LABELS: Record<Category, string> = {
  General: 'General',
  Motion:  'Motion Graphics',
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
            <div className="mb-16">
              <BackButton href="/" />
            </div>
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
