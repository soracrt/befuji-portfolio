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
  categories?: string[]
  categoryLabels?: Record<string, string>
  activeCategory?: string
  onCategoryChange?: (cat: string) => void
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
      key={question}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
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
              color:      isOpen ? '#CF5C36' : 'rgba(238,229,233,0.5)',
              transform:  isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
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
  categories,
  categoryLabels,
  activeCategory,
  onCategoryChange,
  headingLine1 = 'Frequently asked',
  headingAccent = 'questions',
  description,
  items,
  className,
}: FaqSectionProps) {
  const hasTabs = categories && categories.length > 1

  return (
    <div className={cn('flex flex-col md:flex-row gap-12 md:gap-16', className)}>

      {/* Left */}
      <div className="md:w-[38%] shrink-0">

        {/* Category tab pills */}
        {hasTabs && (
          <div className="flex flex-wrap gap-2 mb-5">
            {categories!.map(cat => {
              const isActive = cat === activeCategory
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => onCategoryChange?.(cat)}
                  className="font-sans text-[10px] tracking-[0.18em] uppercase px-3 py-1 rounded-full transition-all duration-200"
                  style={{
                    background:  isActive ? 'rgba(207,92,54,0.12)' : 'transparent',
                    border:      `1px solid ${isActive ? 'rgba(207,92,54,0.45)' : 'rgba(238,229,233,0.12)'}`,
                    color:       isActive ? '#CF5C36' : 'rgba(238,229,233,0.4)',
                  }}
                >
                  {categoryLabels?.[cat] ?? cat}
                </button>
              )
            })}
          </div>
        )}

        {/* Heading */}
        <h2
          className="font-display font-bold leading-[1.05] mb-4"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-0.03em' }}
        >
          <span style={{ color: '#EEE5E9' }}>{headingLine1}</span>
          <br />
          <span style={{ color: '#CF5C36' }}>{headingAccent}</span>
        </h2>

        {/* Description */}
        {description && (
          <p
            className="font-sans leading-relaxed mb-5"
            style={{ fontSize: '13px', color: 'rgba(238,229,233,0.35)', maxWidth: '260px' }}
          >
            {description}
          </p>
        )}

        {/* Glow contact pill */}
        <a
          href="/contact"
          className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.1em] uppercase px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
          style={{
            background:  'rgba(207,92,54,0.1)',
            border:      '1px solid rgba(207,92,54,0.35)',
            color:       '#CF5C36',
            boxShadow:   '0 0 16px rgba(207,92,54,0.2), 0 0 40px rgba(207,92,54,0.08)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.boxShadow = '0 0 24px rgba(207,92,54,0.35), 0 0 60px rgba(207,92,54,0.15)'
            e.currentTarget.style.background = 'rgba(207,92,54,0.16)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.boxShadow = '0 0 16px rgba(207,92,54,0.2), 0 0 40px rgba(207,92,54,0.08)'
            e.currentTarget.style.background = 'rgba(207,92,54,0.1)'
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          Send a message
        </a>
      </div>

      {/* Right — accordion */}
      <div className="flex-1 flex flex-col gap-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory ?? 'default'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col gap-2"
          >
            {items.map((item, i) => (
              <FaqAccordionItem
                key={item.question}
                question={item.question}
                answer={item.answer}
                index={i}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  )
}
