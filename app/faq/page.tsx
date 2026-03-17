'use client'

import { useState, useRef, useEffect } from 'react'
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
  Motion:  'Motion',
  Website: 'Website',
}

type Message = { role: 'user' | 'assistant'; content: string }

const SUGGESTIONS = [
  'How fast is turnaround?',
  'What does a website cost?',
  'Do you offer retainers?',
]

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 2px' }}>
      {[0, 1, 2].map(i => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: '#CF5C36',
            animation: 'chat-dot 1.2s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  )
}

function FaqChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [remaining, setRemaining] = useState(15)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(override?: string) {
    const text = (override ?? input).trim()
    if (!text || streaming || remaining <= 0) return
    setInput('')

    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setStreaming(true)
    setRemaining(r => Math.max(0, r - 1))
    setMessages(m => [...m, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/faq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })

      const data = await res.json()
      if (res.status === 429) throw new Error(data.error)
      if (!res.ok) throw new Error(data.error ?? 'Server error')

      setMessages(m => {
        const copy = [...m]
        copy[copy.length - 1] = { role: 'assistant', content: data.text ?? '' }
        return copy
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Try again or reach out directly.'
      setMessages(m => {
        const copy = [...m]
        copy[copy.length - 1] = { role: 'assistant', content: msg }
        return copy
      })
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const isEmpty = messages.length === 0

  return (
    <div
      style={{
        background: '#080808',
        border: '1px solid #1e1e1e',
        borderRadius: 24,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', borderBottom: '1px solid #141414' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#CF5C36', display: 'inline-block', boxShadow: '0 0 8px rgba(207,92,54,0.6)' }} />
        <span className="font-sans text-xs tracking-[0.1em] uppercase" style={{ color: 'rgba(238,229,233,0.3)' }}>
          Kulaire Assistant
        </span>
        <span className="font-sans text-xs ml-auto" style={{ color: remaining <= 5 ? 'rgba(207,92,54,0.7)' : 'rgba(238,229,233,0.2)', letterSpacing: '0.02em' }}>
          {remaining} / 15
        </span>
      </div>

      {/* Messages */}
      <div
        className="chat-scroll"
        style={{
          minHeight: 220,
          maxHeight: 360,
          overflowY: 'auto',
          padding: '18px 18px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {isEmpty && (
          <div style={{ margin: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <p className="font-sans text-xs tracking-[0.06em]" style={{ color: 'rgba(238,229,233,0.18)', textAlign: 'center' }}>
              Ask anything about services, pricing, or timelines.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="font-sans text-xs"
                  style={{
                    padding: '6px 12px',
                    borderRadius: 999,
                    border: '1px solid #1e1e1e',
                    background: '#0f0f0f',
                    color: 'rgba(238,229,233,0.45)',
                    cursor: 'pointer',
                    letterSpacing: '0.02em',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(207,92,54,0.4)'; (e.currentTarget as HTMLButtonElement).style.color = '#EEE5E9' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#1e1e1e'; (e.currentTarget as HTMLButtonElement).style.color = 'rgba(238,229,233,0.45)' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div
              className="font-sans text-sm leading-relaxed"
              style={{
                maxWidth: '78%',
                padding: '9px 14px',
                borderRadius: m.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                background: m.role === 'user' ? '#CF5C36' : '#111',
                color: m.role === 'user' ? '#fff' : 'rgba(238,229,233,0.75)',
                border: m.role === 'assistant' ? '1px solid #1a1a1a' : 'none',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.role === 'assistant' && m.content === '' && streaming
                ? <TypingDots />
                : m.content
              }
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ borderTop: '1px solid #141414', display: 'flex', alignItems: 'flex-end', gap: 10, padding: '10px 14px 12px' }}>
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Ask a question..."
          disabled={streaming || remaining <= 0}
          className="font-sans text-sm chat-scroll"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            color: '#EEE5E9',
            lineHeight: 1.6,
            maxHeight: 96,
            overflowY: 'auto',
            caretColor: '#CF5C36',
          }}
        />
        <button
          onClick={() => send()}
          disabled={!input.trim() || streaming || remaining <= 0}
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: input.trim() && !streaming && remaining > 0 ? '#CF5C36' : '#161616',
            border: '1px solid ' + (input.trim() && !streaming && remaining > 0 ? '#CF5C36' : '#1e1e1e'),
            cursor: input.trim() && !streaming && remaining > 0 ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s ease, border-color 0.2s ease',
          }}
          aria-label="Send"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default function FaqPage() {
  const [active, setActive] = useState<Category>('General')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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

          {/* Chatbot */}
          <FadeIn>
            <div className="mt-24" style={{ borderTop: '1px solid #1a1a1a', paddingTop: '4rem' }}>
              <div className="mb-8">
                <h2
                  className="font-display font-bold mb-2"
                  style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#EEE5E9', letterSpacing: '-0.04em', lineHeight: 0.95 }}
                >
                  Still confused?
                </h2>
                <p className="font-sans text-sm" style={{ color: 'rgba(238,229,233,0.4)', lineHeight: 1.6 }}>
                  Ask our assistant — or{' '}
                  <Link href="/contact" style={{ color: '#CF5C36', textDecoration: 'none' }}>
                    reach out directly
                  </Link>
                  .
                </p>
              </div>
              <FaqChatbot />
            </div>
          </FadeIn>

        </div>
      </div>
    </main>
  )
}
