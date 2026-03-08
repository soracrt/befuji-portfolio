'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import BackButton from '@/components/BackButton'

type Answers = {
  service:  string
  who:      string
  audience: string
  ready:    string
  budget:   string
  extra:    string
  name:     string
  email:    string
  discord:  string
}

const STEPS = [
  {
    key:      'service' as keyof Answers,
    question: 'What are you looking for?',
    options:  ['Motion graphics', 'Web development', 'Both'],
  },
  {
    key:      'who' as keyof Answers,
    question: 'Who are you?',
    options:  ['Independent artist', 'Startup or SaaS', 'Business owner', 'Just exploring'],
  },
  {
    key:      'audience' as keyof Answers,
    question: 'Who are you building this for?',
    options:  ['Consumers', 'Other businesses', 'A niche community', 'Not sure yet'],
  },
  {
    key:      'ready' as keyof Answers,
    question: 'What do you already have ready?',
    options:  ['Script and storyboard', 'Brand identity', 'Both', 'Nothing yet, starting from scratch'],
  },
  {
    key:      'budget' as keyof Answers,
    question: "What's your budget?",
    options:  ['Under $200', '$200–$500', '$500–$1,000', '$1,000+'],
  },
]

export default function QuotePage() {
  const router = useRouter()
  const [step, setStep]       = useState(1)
  const [answers, setAnswers] = useState<Answers>({
    service: '', who: '', audience: '', ready: '', budget: '',
    extra: '', name: '', email: '', discord: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState('')

  const totalSteps = 7
  const progress   = ((step - 1) / (totalSteps - 1)) * 100

  function selectOption(key: keyof Answers, value: string) {
    setAnswers(a => ({ ...a, [key]: value }))
  }

  function canAdvance() {
    if (step <= 5) return !!answers[STEPS[step - 1].key]
    if (step === 6) return true
    return !!answers.name && !!answers.email
  }

  function next() { if (canAdvance()) setStep(s => s + 1) }
  function back() { setStep(s => s - 1) }

  async function submit() {
    if (!answers.name || !answers.email) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/quote', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(answers),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Try again or email hello@kulaire.com.')
      }
    } catch {
      setError('Something went wrong. Try again or email hello@kulaire.com.')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(207,92,54,0.12)', border: '1px solid rgba(207,92,54,0.3)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CF5C36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2
          className="font-display font-bold mb-3"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#EEE5E9', letterSpacing: '-0.02em' }}
        >
          We&apos;ll be in touch.
        </h2>
        <p className="font-sans mb-8" style={{ fontSize: '14px', color: 'rgba(238,229,233,0.4)' }}>
          Your request has been sent. Expect a reply within 24 hours.
        </p>
        <Link
          href="/"
          className="font-sans text-xs tracking-[0.1em] uppercase transition-opacity hover:opacity-60"
          style={{ color: 'rgba(238,229,233,0.35)' }}
        >
          ← Back to home
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col px-8 pt-28 pb-12">

      {/* Header */}
      <div className="flex items-center justify-between mb-12 max-w-xl mx-auto w-full">
        <BackButton href="/" />
        <span
          className="font-sans text-xs"
          style={{ color: 'rgba(238,229,233,0.25)', letterSpacing: '0.06em' }}
        >
          {step} / {totalSteps}
        </span>
      </div>

      {/* Progress bar */}
      <div className="max-w-xl mx-auto w-full mb-12">
        <div className="w-full h-[2px] rounded-full" style={{ background: 'rgba(238,229,233,0.07)' }}>
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: '#CF5C36',
              transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
              boxShadow: '0 0 8px rgba(207,92,54,0.5)',
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">

        {/* Steps 1–5: MCQ */}
        {step <= 5 && (() => {
          const s = STEPS[step - 1]
          return (
            <div>
              <p
                className="font-sans text-xs tracking-[0.14em] uppercase mb-3"
                style={{ color: 'rgba(207,92,54,0.7)' }}
              >
                Step {step}
              </p>
              <h1
                className="font-display font-bold mb-8"
                style={{
                  fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                  color: '#EEE5E9',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                {s.question}
              </h1>
              <div className="flex flex-col gap-3">
                {s.options.map(opt => {
                  const selected = answers[s.key] === opt
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => selectOption(s.key, opt)}
                      className="w-full text-left px-5 py-4 rounded-xl font-sans transition-all duration-150"
                      style={{
                        background:   selected ? 'rgba(207,92,54,0.1)'  : 'rgba(238,229,233,0.03)',
                        border:       `1px solid ${selected ? 'rgba(207,92,54,0.45)' : 'rgba(238,229,233,0.08)'}`,
                        color:        selected ? '#EEE5E9' : 'rgba(238,229,233,0.5)',
                        fontSize:     '14px',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      <span
                        className="inline-block w-2 h-2 rounded-full mr-3 flex-shrink-0"
                        style={{
                          background: selected ? '#CF5C36' : 'rgba(238,229,233,0.15)',
                          verticalAlign: 'middle',
                          transition: 'background 0.15s',
                        }}
                      />
                      {opt}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })()}

        {/* Step 6: open text */}
        {step === 6 && (
          <div>
            <p
              className="font-sans text-xs tracking-[0.14em] uppercase mb-3"
              style={{ color: 'rgba(207,92,54,0.7)' }}
            >
              Step 6
            </p>
            <h1
              className="font-display font-bold mb-3"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                color: '#EEE5E9',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              Anything else we should know?
            </h1>
            <p className="font-sans mb-6" style={{ fontSize: '13px', color: 'rgba(238,229,233,0.3)' }}>
              Optional — skip if nothing comes to mind.
            </p>
            <textarea
              rows={5}
              placeholder="References, deadlines, specific requests..."
              value={answers.extra}
              onChange={e => setAnswers(a => ({ ...a, extra: e.target.value }))}
              className="w-full rounded-xl px-4 py-3 font-sans resize-none outline-none"
              style={{
                background:   'rgba(238,229,233,0.03)',
                border:       '1px solid rgba(238,229,233,0.08)',
                color:        '#EEE5E9',
                fontSize:     '14px',
                letterSpacing: '-0.01em',
                lineHeight:   '1.6',
              }}
              onFocus={e  => { e.currentTarget.style.border = '1px solid rgba(207,92,54,0.35)' }}
              onBlur={e   => { e.currentTarget.style.border = '1px solid rgba(238,229,233,0.08)' }}
            />
          </div>
        )}

        {/* Step 7: contact fields */}
        {step === 7 && (
          <div>
            <p
              className="font-sans text-xs tracking-[0.14em] uppercase mb-3"
              style={{ color: 'rgba(207,92,54,0.7)' }}
            >
              Step 7
            </p>
            <h1
              className="font-display font-bold mb-8"
              style={{
                fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
                color: '#EEE5E9',
                letterSpacing: '-0.02em',
                lineHeight: 1.1,
              }}
            >
              How do we reach you?
            </h1>
            <div className="flex flex-col gap-4">
              {[
                { key: 'name',    label: 'Name',              placeholder: 'Your name',           required: true,  type: 'text'  },
                { key: 'email',   label: 'Email',             placeholder: 'your@email.com',       required: true,  type: 'email' },
                { key: 'discord', label: 'Discord (optional)',placeholder: 'yourusername',         required: false, type: 'text'  },
              ].map(({ key, label, placeholder, required, type }) => (
                <div key={key}>
                  <label
                    className="font-sans block mb-1.5"
                    style={{ fontSize: '11px', color: 'rgba(238,229,233,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    required={required}
                    placeholder={placeholder}
                    value={answers[key as keyof Answers]}
                    onChange={e => setAnswers(a => ({ ...a, [key]: e.target.value }))}
                    className="w-full rounded-xl px-4 py-3 font-sans outline-none"
                    style={{
                      background:    'rgba(238,229,233,0.03)',
                      border:        '1px solid rgba(238,229,233,0.08)',
                      color:         '#EEE5E9',
                      fontSize:      '14px',
                      letterSpacing: '-0.01em',
                    }}
                    onFocus={e => { e.currentTarget.style.border = '1px solid rgba(207,92,54,0.35)' }}
                    onBlur={e  => { e.currentTarget.style.border = '1px solid rgba(238,229,233,0.08)' }}
                  />
                </div>
              ))}
            </div>
            {error && (
              <p className="font-sans mt-4" style={{ fontSize: '13px', color: '#f87171' }}>{error}</p>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10">
          {step > 1 ? (
            <button
              type="button"
              onClick={back}
              className="font-sans text-xs tracking-[0.1em] uppercase transition-opacity hover:opacity-60"
              style={{ color: 'rgba(238,229,233,0.35)' }}
            >
              ← Back
            </button>
          ) : <div />}

          {step < totalSteps ? (
            <button
              type="button"
              onClick={next}
              disabled={!canAdvance()}
              className="font-display font-medium px-6 py-2.5 rounded-full transition-all duration-200"
              style={{
                fontSize:   '14px',
                background: canAdvance() ? '#CF5C36' : 'rgba(238,229,233,0.06)',
                color:      canAdvance() ? '#EEE5E9' : 'rgba(238,229,233,0.2)',
                boxShadow:  canAdvance() ? '0 0 16px rgba(207,92,54,0.4)' : 'none',
                cursor:     canAdvance() ? 'pointer' : 'not-allowed',
              }}
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={submitting || !canAdvance()}
              className="font-display font-medium px-6 py-2.5 rounded-full transition-all duration-200"
              style={{
                fontSize:   '14px',
                background: canAdvance() ? '#CF5C36' : 'rgba(238,229,233,0.06)',
                color:      canAdvance() ? '#EEE5E9' : 'rgba(238,229,233,0.2)',
                boxShadow:  canAdvance() ? '0 0 16px rgba(207,92,54,0.4)' : 'none',
                cursor:     canAdvance() && !submitting ? 'pointer' : 'not-allowed',
              }}
            >
              {submitting ? '···' : 'Submit'}
            </button>
          )}
        </div>

      </div>
    </main>
  )
}
