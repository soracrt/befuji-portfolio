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

function FaqChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send() {
    const text = input.trim()
    if (!text || streaming) return
    setInput('')

    const next: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(next)
    setStreaming(true)

    const placeholder: Message = { role: 'assistant', content: '' }
    setMessages(m => [...m, placeholder])

    try {
      const res = await fetch('/api/faq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next }),
      })

      if (!res.body) throw new Error('No body')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages(m => {
          const copy = [...m]
          copy[copy.length - 1] = { role: 'assistant', content: accumulated }
          return copy
        })
      }
    } catch {
      setMessages(m => {
        const copy = [...m]
        copy[copy.length - 1] = { role: 'assistant', content: 'Something went wrong. Try again or reach out directly.' }
        return copy
      })
    } finally {
      setStreaming(false)
      inputRef.current?.focus()
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div
      style={{
        background: '#0a0a0a',
        border: '1px solid #1a1a1a',
        borderRadius: 20,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Messages */}
      <div
        style={{
          minHeight: 240,
          maxHeight: 380,
          overflowY: 'auto',
          padding: '20px 20px 8px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
        className="hide-scrollbar"
      >
        {messages.length === 0 && (
          <p className="font-sans text-sm" style={{ color: 'rgba(238,229,233,0.2)', textAlign: 'center', margin: 'auto' }}>
            Ask anything about services, pricing, or timelines.
          </p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <div
              className="font-sans text-sm leading-relaxed"
              style={{
                maxWidth: '80%',
                padding: '10px 14px',
                borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: m.role === 'user' ? '#CF5C36' : '#141414',
                color: m.role === 'user' ? '#fff' : 'rgba(238,229,233,0.8)',
                border: m.role === 'assistant' ? '1px solid #1a1a1a' : 'none',
                whiteSpace: 'pre-wrap',
              }}
            >
              {m.content}
              {m.role === 'assistant' && m.content === '' && streaming && (
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#CF5C36', animation: 'pulse 1s ease-in-out infinite', verticalAlign: 'middle' }} />
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: '#1a1a1a' }} />

      {/* Input */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, padding: '12px 14px' }}>
        <textarea
          ref={inputRef}
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type your question..."
          disabled={streaming}
          className="font-sans text-sm hide-scrollbar"
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            resize: 'none',
            color: '#EEE5E9',
            lineHeight: 1.5,
            maxHeight: 100,
            overflowY: 'auto',
          }}
        />
        <button
          onClick={send}
          disabled={!input.trim() || streaming}
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: input.trim() && !streaming ? '#CF5C36' : '#1a1a1a',
            border: 'none',
            cursor: input.trim() && !streaming ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            transition: 'background 0.2s ease',
          }}
          aria-label="Send"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </div>
    </div>
  )
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
