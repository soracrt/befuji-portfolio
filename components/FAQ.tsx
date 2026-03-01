'use client'

import { motion } from 'motion/react'
import FadeIn from './FadeIn'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const faqItems = [
  {
    id: 'item-1',
    question: "What's your typical turnaround time?",
    answer: 'around a week — 1 day for storyboarding, 2-3 days for the edit, 1 day for revisions.',
  },
  {
    id: 'item-2',
    question: 'Do you work with early-stage startups or only funded companies?',
    answer: "anyone with an idea they want to visualize. doesn't matter where you're at — if you have a vision, that's enough.",
  },
  {
    id: 'item-3',
    question: 'What do you need from us to get started?',
    answer: 'your vision, mission, target audience, and the type of video you want — feature explainer, brand story, whatever it is. the more context the better.',
  },
  {
    id: 'item-4',
    question: 'How many revision rounds are included?',
    answer: '2 rounds.',
  },
  {
    id: 'item-5',
    question: 'Can you handle the full creative direction or do we need to provide a script?',
    answer: "both work, but a script is preferred. if you can't provide one, share everything about your product and audience and i'll take it from there.",
  },
]

function BlurredStagger({ text }: { text: string }) {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.04 } },
  }
  const word = {
    hidden: { opacity: 0, filter: 'blur(8px)' },
    show:   { opacity: 1, filter: 'blur(0px)' },
  }

  return (
    <motion.p
      variants={container}
      initial="hidden"
      animate="show"
      className="font-sans leading-[1.85]"
      style={{ fontSize: '13.5px', color: 'rgba(255,255,252,0.5)' }}
    >
      {text.split(' ').map((w, i) => (
        <motion.span
          key={i}
          variants={word}
          transition={{ duration: 0.3 }}
          className="inline-block whitespace-nowrap"
        >
          {w}{'\u00A0'}
        </motion.span>
      ))}
    </motion.p>
  )
}

export default function FAQ() {
  return (
    <section className="px-8 py-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-12 md:gap-16">

        {/* Left label */}
        <FadeIn className="md:col-span-2">
          <h2
            className="font-sans font-medium text-ink tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            FAQ
          </h2>
          <p
            className="font-sans text-sm mt-4 leading-[1.85]"
            style={{ color: 'rgba(255,255,252,0.35)' }}
          >
            Still have questions?{' '}
            <a
              href="mailto:hello@befuji.com"
              className="text-ink underline underline-offset-4 hover:opacity-60 transition-opacity"
            >
              reach out.
            </a>
          </p>
        </FadeIn>

        {/* Accordion */}
        <FadeIn delay={100} className="md:col-span-3">
          <Accordion type="single" collapsible>
            {faqItems.map(item => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b"
                style={{ borderColor: 'rgba(255,255,252,0.08)' }}
              >
                <AccordionTrigger
                  className="font-sans text-left py-5 text-ink hover:opacity-60 transition-opacity"
                  style={{ fontSize: '14.5px', letterSpacing: '-0.01em' }}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <BlurredStagger text={item.answer} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </FadeIn>

      </div>
    </section>
  )
}
