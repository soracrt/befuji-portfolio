'use client'

import React, { useState, useEffect } from 'react'

export type FaqItem = {
  question: string
  answer: string
  meta?: string
}

const STYLE_ID = 'faq-monochrome-styles'

function useInjectStyles() {
  useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(STYLE_ID)) return
    const style = document.createElement('style')
    style.id = STYLE_ID
    style.innerHTML = `
      @keyframes faqm-ping {
        0%   { transform: scale(1); opacity: 0.4; }
        100% { transform: scale(1.6); opacity: 0; }
      }
    `
    document.head.appendChild(style)
    return () => { style.parentNode && style.remove() }
  }, [])
}

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

  const onMouseLeave = () => setGlowStyle({})

  return (
    <li
      className="group relative overflow-hidden rounded-2xl transition-all duration-300"
      style={{
        background:   '#131313',
        border:       `1px solid ${open ? 'rgba(207,92,54,0.25)' : 'rgba(238,229,233,0.08)'}`,
        transition:   'border-color 0.3s ease',
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Mouse glow */}
      <div className="pointer-events-none absolute inset-0" style={glowStyle} />

      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="relative flex w-full items-center gap-5 px-7 py-6 text-left"
      >
        {/* Icon ring */}
        <span
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300"
          style={{
            border:     `1px solid ${open ? 'rgba(207,92,54,0.4)' : 'rgba(238,229,233,0.15)'}`,
            background: open ? 'rgba(207,92,54,0.08)' : 'rgba(238,229,233,0.04)',
            flexShrink: 0,
          }}
        >
          {open && (
            <span
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                border:    '1px solid rgba(207,92,54,0.3)',
                animation: 'faqm-ping 0.6s ease-out forwards',
              }}
            />
          )}
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

        <div className="flex flex-1 items-center gap-4 min-w-0">
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
        </div>
      </button>

      {/* Answer */}
      <div
        style={{
          maxHeight:  open ? '300px' : '0',
          overflow:   'hidden',
          transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <p
          className="font-sans leading-relaxed px-7 pb-6"
          style={{ fontSize: '13px', color: 'rgba(238,229,233,0.45)', letterSpacing: '0.01em' }}
        >
          {item.answer}
        </p>
      </div>
    </li>
  )
}

export function FaqList({ items }: { items: FaqItem[] }) {
  useInjectStyles()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const toggle = (i: number) => setActiveIndex(prev => prev === i ? null : i)

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <FaqCard
          key={i}
          item={item}
          open={activeIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}
    </ul>
  )
}
