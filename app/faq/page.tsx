'use client'

import { useState } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import FadeIn from '@/components/FadeIn'
import { FaqSection } from '@/components/ui/faq-section'

type Category = 'General' | 'Website' | 'Discord'

const CATEGORIES: Category[] = ['General', 'Website', 'Discord']

const FAQS: Record<Category, { question: string; answer: string }[]> = {
  General: [
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
  ],
  Website: [
    {
      question: 'What kind of websites do you build?',
      answer:   'Minimal, fast, and visually sharp sites — portfolios, landing pages, SaaS marketing sites. Built with Next.js and Tailwind.',
    },
    {
      question: 'Do you handle hosting and deployment?',
      answer:   'Yes. We deploy to Vercel or your preferred host and can manage the domain setup end-to-end.',
    },
    {
      question: 'Can you redesign an existing site?',
      answer:   'Absolutely. Send over your current site and we can audit it and quote a redesign.',
    },
    {
      question: 'Do you build e-commerce stores?',
      answer:   'We work with Shopify for e-commerce. Custom storefronts and headless setups are available on request.',
    },
    {
      question: 'How long does a website project take?',
      answer:   'A standard landing page takes 5–7 days. More complex builds are scoped individually.',
    },
  ],
  Discord: [
    {
      question: 'What is the Kulaire Discord community?',
      answer:   'A space for creators, editors, and motion designers to share work, get feedback, and stay sharp.',
    },
    {
      question: 'How do I join the Discord?',
      answer:   'Reach out through the contact page or DM @soracrt on Instagram — we\'ll send you the invite link.',
    },
    {
      question: 'Is it free to join?',
      answer:   'Yes. The community is free. Some premium channels and resources may be gated in the future.',
    },
    {
      question: 'What kind of content is shared in the server?',
      answer:   'Motion design breakdowns, editing tips, plugin recommendations, client acquisition advice, and member work showcases.',
    },
    {
      question: 'Can I promote my own work or services?',
      answer:   'Yes — there are dedicated channels for self-promotion. Keep it relevant and quality-first.',
    },
  ],
}

const CATEGORY_LABELS: Record<Category, string> = {
  General: 'General',
  Website: 'Website FAQ',
  Discord: 'Discord Community',
}

export default function FaqPage() {
  const [active, setActive] = useState<Category>('General')

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
