'use client'

import React, { useState } from 'react'

export type FaqItem = {
  question: string
  answer: string
  meta?: string
}

// Each card is a fixed height — answer area is always reserved,
// only opacity/transform changes. This prevents any layout shift.
const ANSWER_HEIGHT = 72 // px — fits ~3 lines at 13px/1.7 lh + bottom padding

function FaqCard({
  item,
  open,
  onToggle,
}: {
  item: FaqItem
  open: boolean
  onToggle: () => void
}) {
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({})

  const onMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setGlowStyle({
      background: `radial-gradient(260px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(207,92,54,0.08), transparent 70%)`,
    })
  }

  return (
    <li
      className="group relative overflow-hidden rounded-2xl"
      style={{
        background:   '#131313',
        border:       `1px solid ${open ? 'rgba(207,92,54,0.3)' : 'rgba(238,229,233,0.08)'}`,
        transition:   'border-color 0.3s ease',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={() => setGlowStyle({})}
    >
      {/* Mouse glow */}
      <div className="pointer-events-none absolute inset-0" style={glowStyle} />

      {/* Question row */}
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="relative flex w-full items-center gap-5 px-7 pt-6 pb-3 text-left"
      >
        {/* Icon */}
        <span
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300"
          style={{
            border:     `1px solid ${open ? 'rgba(207,92,54,0.4)' : 'rgba(238,229,233,0.15)'}`,
            background: open ? 'rgba(207,92,54,0.1)' : 'rgba(238,229,233,0.04)',
          }}
        >
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{
              color:      open ? '#CF5C36' : 'rgba(238,229,233,0.5)',
              transform:  open ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), color 0.2s ease',
            }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>

        {/* Question + meta */}
        <span
          className="font-display font-medium leading-snug flex-1"
          style={{ fontSize: '15px', color: '#EEE5E9', letterSpacing: '-0.01em' }}
        >
          {item.question}
        </span>
        {item.meta && (
          <span
            className="font-sans text-[9px] tracking-[0.3em] uppercase rounded-full px-2.5 py-1 shrink-0 hidden sm:inline-flex"
            style={{ border: '1px solid rgba(238,229,233,0.1)', color: 'rgba(238,229,233,0.3)' }}
          >
            {item.meta}
          </span>
        )}
      </button>

      {/* Answer area — fixed height always, only opacity animates */}
      <div
        className="relative"
        style={{
          height:      `${ANSWER_HEIGHT}px`,
          // align text under the question (icon 40px + gap 20px + left padding 28px)
          paddingLeft:  '88px',
          paddingRight: '28px',
          paddingBottom:'24px',
        }}
      >
        <p
          className="font-sans leading-relaxed"
          style={{
            fontSize:   '13px',
            color:      'rgba(238,229,233,0.45)',
            letterSpacing: '0.01em',
            opacity:    open ? 1 : 0,
            transform:  open ? 'translateY(0)' : 'translateY(-6px)',
            transition: 'opacity 0.3s ease, transform 0.3s ease',
          }}
        >
          {item.answer}
        </p>
      </div>
    </li>
  )
}

export function FaqList({ items }: { items: FaqItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <FaqCard
          key={i}
          item={item}
          open={activeIndex === i}
          onToggle={() => setActiveIndex(prev => prev === i ? null : i)}
        />
      ))}
    </ul>
  )
}
