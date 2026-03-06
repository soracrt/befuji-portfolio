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
      .faqm-card {
        --faq-x: 50%;
        --faq-y: 50%;
      }
      .faqm-glow {
        background: radial-gradient(
          220px circle at var(--faq-x) var(--faq-y),
          rgba(207,92,54,0.07),
          transparent 70%
        );
      }
    `
    document.head.appendChild(style)
    return () => { style.parentNode && style.remove() }
  }, [])
}

function FaqCard({ item, index }: { item: FaqItem; index: number }) {
  const [open, setOpen] = useState(false)
  const [glowStyle, setGlowStyle] = useState<React.CSSProperties>({})

  const onMouseMove = (e: React.MouseEvent<HTMLLIElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setGlowStyle({
      background: `radial-gradient(220px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, rgba(207,92,54,0.07), transparent 70%)`,
    })
  }

  const onMouseLeave = () => setGlowStyle({})

  return (
    <li
      className="faqm-card group relative overflow-hidden rounded-2xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-px"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(238,229,233,0.07)' }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Mouse glow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={glowStyle}
      />

      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
        className="relative flex w-full items-start gap-5 px-7 py-6 text-left"
      >
        {/* Icon ring */}
        <span
          className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-105"
          style={{ border: '1px solid rgba(238,229,233,0.12)', background: 'rgba(238,229,233,0.04)' }}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full"
            style={{
              border: '1px solid rgba(238,229,233,0.12)',
              opacity: open ? 0.4 : 0,
              animation: open ? 'ping 1s cubic-bezier(0,0,0.2,1) 1' : 'none',
            }}
          />
          <svg
            width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            style={{
              color: open ? '#CF5C36' : 'rgba(238,229,233,0.5)',
              transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), color 0.2s ease',
            }}
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>

        <div className="flex flex-1 flex-col gap-3 min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="font-display font-medium leading-snug"
              style={{ fontSize: '15px', color: '#EEE5E9', letterSpacing: '-0.01em' }}
            >
              {item.question}
            </span>
            {item.meta && (
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 font-sans text-[9px] tracking-[0.3em] uppercase ml-auto"
                style={{ border: '1px solid rgba(238,229,233,0.1)', color: 'rgba(238,229,233,0.3)' }}
              >
                {item.meta}
              </span>
            )}
          </div>

          <div
            style={{
              maxHeight:  open ? '300px' : '0',
              overflow:   'hidden',
              transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <p
              className="font-sans leading-relaxed pb-1"
              style={{ fontSize: '13px', color: 'rgba(238,229,233,0.4)', letterSpacing: '0.01em' }}
            >
              {item.answer}
            </p>
          </div>
        </div>
      </button>
    </li>
  )
}

export function FaqList({ items }: { items: FaqItem[] }) {
  useInjectStyles()

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, i) => (
        <FaqCard key={i} item={item} index={i} />
      ))}
    </ul>
  )
}
