"use client"

import * as React from "react"
import { motion, AnimatePresence } from "motion/react"
import { ChevronDown, Mail } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface FaqSectionProps extends React.HTMLAttributes<HTMLElement> {
  title: string
  description?: string
  items: {
    question: string
    answer: string
  }[]
  contactInfo?: {
    title: string
    description: string
    buttonText: string
    onContact?: () => void
  }
}

const FaqSection = React.forwardRef<HTMLElement, FaqSectionProps>(
  ({ className, title, description, items, contactInfo, ...props }, ref) => {
    return (
      <section ref={ref} className={cn("w-full", className)} {...props}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', color: '#EEE5E9', letterSpacing: '-0.03em' }}
          >
            {title}
          </h2>
          {description && (
            <p className="font-sans text-sm mt-1" style={{ color: 'rgba(238,229,233,0.35)' }}>
              {description}
            </p>
          )}
        </motion.div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <FaqItem
              key={index}
              question={item.question}
              answer={item.answer}
              index={index}
            />
          ))}
        </div>

        {/* Contact Section */}
        {contactInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-start gap-3"
          >
            <div className="flex items-center gap-2">
              <Mail className="h-3.5 w-3.5" style={{ color: '#CF5C36' }} />
              <p className="font-sans text-xs font-medium" style={{ color: '#EEE5E9' }}>
                {contactInfo.title}
              </p>
            </div>
            {contactInfo.description && (
              <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.35)' }}>
                {contactInfo.description}
              </p>
            )}
            <Button size="sm" onClick={contactInfo.onContact}>
              {contactInfo.buttonText}
            </Button>
          </motion.div>
        )}
      </section>
    )
  }
)
FaqSection.displayName = "FaqSection"

const FaqItem = React.forwardRef<
  HTMLDivElement,
  { question: string; answer: string; index: number }
>((props, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const { question, answer, index } = props

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, delay: index * 0.06 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#131313',
        border: `1px solid ${isOpen ? 'rgba(207,92,54,0.3)' : 'rgba(238,229,233,0.08)'}`,
        transition: 'border-color 0.3s ease',
      }}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-5 px-7 py-5 text-left"
      >
        <h3
          className="font-display font-medium leading-snug flex-1"
          style={{
            fontSize: '15px',
            color: isOpen ? '#EEE5E9' : 'rgba(238,229,233,0.7)',
            letterSpacing: '-0.01em',
            transition: 'color 0.2s ease',
          }}
        >
          {question}
        </h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="shrink-0 flex items-center justify-center rounded-full w-8 h-8"
          style={{
            background: isOpen ? 'rgba(207,92,54,0.1)' : 'rgba(238,229,233,0.04)',
            border: `1px solid ${isOpen ? 'rgba(207,92,54,0.4)' : 'rgba(238,229,233,0.1)'}`,
            color: isOpen ? '#CF5C36' : 'rgba(238,229,233,0.35)',
            transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
          }}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
            exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: [0.7, 0, 0.84, 0] } }}
          >
            <div className="px-7 pb-5 pt-0">
              <p
                className="font-sans leading-relaxed"
                style={{ fontSize: '13px', color: 'rgba(238,229,233,0.45)', letterSpacing: '0.01em' }}
              >
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})
FaqItem.displayName = "FaqItem"

export { FaqSection }
