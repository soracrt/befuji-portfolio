"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

interface FaqItem {
  question: string
  answer: string
}

interface FaqSectionProps {
  badge?: string
  headingLine1?: string
  headingAccent?: string
  description?: string
  items: FaqItem[]
  className?: string
}

function FaqAccordionItem({
  question,
  answer,
  index,
}: {
  question: string
  answer: string
  index: number
}) {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.06 }}
      className="rounded-xl overflow-hidden"
      style={{
        background: '#111111',
        border: `1px solid ${isOpen ? 'rgba(207,92,54,0.25)' : 'rgba(238,229,233,0.07)'}`,
        transition: 'border-color 0.25s ease',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span
          className="font-sans font-medium leading-snug flex-1"
          style={{
            fontSize: '14px',
            color: isOpen ? '#EEE5E9' : 'rgba(238,229,233,0.75)',
            letterSpacing: '-0.01em',
            transition: 'color 0.2s ease',
          }}
        >
          {question}
        </span>

        {/* + / × icon */}
        <span
          className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full"
          style={{
            background: isOpen ? 'rgba(207,92,54,0.12)' : 'rgba(238,229,233,0.05)',
            border: `1px solid ${isOpen ? 'rgba(207,92,54,0.35)' : 'rgba(238,229,233,0.1)'}`,
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
        >
          <svg
            width="12" height="12" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{
              color:     isOpen ? '#CF5C36' : 'rgba(238,229,233,0.5)',
              transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s cubic-bezier(0.16,1,0.3,1), color 0.2s ease',
            }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5"  y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } }}
            exit={{   height: 0, opacity: 0, transition: { duration: 0.2,  ease: [0.7, 0, 0.84, 0] } }}
          >
            <div className="px-5 pb-5 pt-0">
              <p
                className="font-sans leading-relaxed"
                style={{ fontSize: '13px', color: 'rgba(238,229,233,0.4)', letterSpacing: '0.01em' }}
              >
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqSection({
  badge = 'FAQs',
  headingLine1 = 'Frequently asked',
  headingAccent = 'questions',
  description,
  items,
  className,
}: FaqSectionProps) {
  return (
    <div className={cn('flex flex-col md:flex-row gap-12 md:gap-16', className)}>
      {/* Left — label + heading */}
      <div className="md:w-[38%] shrink-0">
        {badge && (
          <span
            className="font-sans text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full inline-block mb-5"
            style={{ border: '1px solid rgba(238,229,233,0.12)', color: 'rgba(238,229,233,0.4)' }}
          >
            {badge}
          </span>
        )}
        <h2
          className="font-display font-bold leading-[1.05] mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
        >
          <span style={{ color: '#EEE5E9' }}>{headingLine1}</span>
          <br />
          <span style={{ color: '#CF5C36' }}>{headingAccent}</span>
        </h2>
        {description && (
          <p
            className="font-sans leading-relaxed"
            style={{ fontSize: '13px', color: 'rgba(238,229,233,0.35)', maxWidth: '260px' }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Right — accordion */}
      <div className="flex-1 flex flex-col gap-2">
        {items.map((item, i) => (
          <FaqAccordionItem
            key={i}
            question={item.question}
            answer={item.answer}
            index={i}
          />
        ))}
      </div>
    </div>
  )
}
