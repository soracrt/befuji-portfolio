'use client'

import { useState } from 'react'
import Link from 'next/link'

/* ── Types ────────────────────────────────────────────────────────────────── */

type Answers = {
  service: string
  motionWho: string
  videoFor: string
  trackLength: string
  styleRef: string
  existingAssets: string
  adFor: string
  saasVideoFor: string
  platforms: string
  scriptReady: string
  brandKit: string
  pages: string
  contentReady: string
  features: string
  webTimeline: string
  name: string
  email: string
  description: string
  timezone: string
  contact: string
}

type ChoiceDef = { type: 'choice'; key: keyof Answers; question: string; options: string[] }
type TextDef   = { type: 'text';   key: keyof Answers; question: string; placeholder: string }
type FinalDef  = { type: 'final' }
type StepDef   = ChoiceDef | TextDef | FinalDef

/* ── Step builder ─────────────────────────────────────────────────────────── */

const PH: StepDef = { type: 'choice', key: 'service', question: '', options: [] }

function buildSteps(a: Answers): StepDef[] {
  const s1: StepDef = {
    type: 'choice', key: 'service',
    question: 'What are you looking for?',
    options: ['Motion Graphics', 'Web Design'],
  }

  let mid: StepDef[]

  if (a.service === 'Motion Graphics') {
    const who: StepDef = {
      type: 'choice', key: 'motionWho',
      question: 'Who are you?',
      options: ['Artist', 'Brand', 'SaaS'],
    }
    if (a.motionWho === 'Artist') {
      mid = [
        who,
        { type: 'choice', key: 'videoFor',      question: "What's the video for?",                   options: ['Lyric video', 'Visualizer', 'Music promo', 'Album campaign'] },
        { type: 'choice', key: 'trackLength',    question: 'How long is the track?',                  options: ['Under 2 mins', '2–4 mins', '4–6 mins', '6 mins+'] },
        { type: 'choice', key: 'styleRef',       question: 'Do you have a style reference?',          options: ["Yes, I'll share it later", 'No, open to direction'] },
        { type: 'choice', key: 'existingAssets', question: 'Do you have existing branding / assets?', options: ['Yes', 'Partially', 'Starting from scratch'] },
      ]
    } else if (a.motionWho === 'Brand') {
      mid = [
        who,
        { type: 'choice', key: 'adFor',       question: "What's the ad for?",         options: ['Product launch', 'Event or campaign', 'Promo', 'Trailer'] },
        { type: 'choice', key: 'platforms',   question: 'Which platforms?',            options: ['Instagram / TikTok', 'YouTube', 'Website / landing page', 'Multiple'] },
        { type: 'choice', key: 'scriptReady', question: 'Do you have a script ready?', options: ['Yes', 'No, need direction'] },
        { type: 'choice', key: 'brandKit',    question: 'Do you have a brand kit?',    options: ['Yes', 'Partially', 'No'] },
      ]
    } else if (a.motionWho === 'SaaS') {
      mid = [
        who,
        { type: 'choice', key: 'saasVideoFor', question: "What's the video for?",      options: ['App demo', 'Explainer video', 'Product trailer', 'Ad'] },
        { type: 'choice', key: 'platforms',    question: 'Which platforms?',            options: ['Instagram / TikTok', 'YouTube', 'Website / landing page', 'Multiple'] },
        { type: 'choice', key: 'scriptReady',  question: 'Do you have a script ready?', options: ['Yes', 'No, need direction'] },
        { type: 'choice', key: 'brandKit',     question: 'Do you have a brand kit?',    options: ['Yes', 'Partially', 'No'] },
      ]
    } else {
      mid = [who, PH, PH, PH, PH]
    }
  } else if (a.service === 'Web Design') {
    mid = [
      { type: 'text',   key: 'pages',        question: 'What pages do you need?',     placeholder: 'Home, About, Contact, Portfolio...' },
      { type: 'choice', key: 'contentReady', question: 'Do you have content ready?',  options: ['Yes, fully', 'Partially', 'No, need help'] },
      { type: 'choice', key: 'brandKit',     question: 'Do you have a brand kit?',    options: ['Yes', 'Partially', 'No'] },
      { type: 'choice', key: 'features',     question: 'Any specific features?',      options: ['Contact form', 'Blog', 'Booking', 'E-commerce', 'Just static pages'] },
      { type: 'choice', key: 'webTimeline',  question: 'When do you need it?',        options: ['ASAP — under 2 weeks', '2–4 weeks', '1–2 months', 'No rush'] },
    ]
  } else {
    mid = [PH, PH, PH, PH, PH]
  }

  return [s1, ...mid, { type: 'final' }]
}

/* ── Constants ────────────────────────────────────────────────────────────── */

const EMPTY: Answers = {
  service: '', motionWho: '',
  videoFor: '', trackLength: '', styleRef: '', existingAssets: '',
  adFor: '', saasVideoFor: '', platforms: '', scriptReady: '', brandKit: '',
  pages: '', contentReady: '', features: '', webTimeline: '',
  name: '', email: '', description: '', timezone: '', contact: '',
}

const fieldBase = {
  background: 'rgba(238,229,233,0.03)',
  border: '1px solid rgba(238,229,233,0.08)',
  color: '#EEE5E9',
  fontSize: '14px',
  letterSpacing: '-0.01em',
} as const

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FINAL_FIELDS = [
  { k: 'name',        label: 'Full name',            ph: 'Your name',                  req: true,  isTextarea: false },
  { k: 'email',       label: 'Email address',        ph: 'your@email.com',             req: true,  isTextarea: false },
  { k: 'description', label: 'Project description',  ph: 'Tell us a bit more…',        req: false, isTextarea: true  },
  { k: 'timezone',    label: 'Timezone',             ph: 'EST, PST, GMT+2…',           req: false, isTextarea: false },
  { k: 'contact',     label: 'Phone or Discord',     ph: '+1 555 000 0000 / username', req: true,  isTextarea: false },
] as const

/* ── Component ────────────────────────────────────────────────────────────── */

export default function QuotePage() {
  const [step,       setStep]       = useState(1)
  const [dir,        setDir]        = useState<'fwd' | 'bck'>('fwd')
  const [answers,    setAnswers]    = useState<Answers>({ ...EMPTY })
  const [submitting, setSubmitting] = useState(false)
  const [submitted,  setSubmitted]  = useState(false)
  const [error,      setError]      = useState('')
  const [tosOpen,    setTosOpen]    = useState(false)
  const [tosAgreed,  setTosAgreed]  = useState(false)
  const [tosChecked, setTosChecked] = useState(false)

  const TOTAL = 7
  const steps = buildSteps(answers)
  const def   = steps[step - 1]

  function select(key: keyof Answers, value: string) {
    setAnswers(prev => {
      if (key === 'service')   return { ...EMPTY, service: value }
      if (key === 'motionWho') return { ...EMPTY, service: prev.service, motionWho: value }
      return { ...prev, [key]: value }
    })
  }

  function canAdvance(): boolean {
    if (def.type === 'choice') return !!answers[def.key]
    if (def.type === 'text')   return !!(answers[def.key] as string).trim()
    if (def.type === 'final')  return (
      !!answers.name.trim() &&
      EMAIL_RE.test(answers.email.trim()) &&
      !!answers.contact.trim()
    )
    return false
  }

  function goNext() {
    if (!canAdvance()) return
    const steps = buildSteps(answers)
    const nextIsFinal = steps[step] && steps[step].type === 'final'
    if (nextIsFinal && !tosAgreed) {
      setTosOpen(true)
      return
    }
    setDir('fwd')
    setStep(s => s + 1)
  }

  function goBack() {
    setDir('bck')
    setStep(s => s - 1)
  }

  async function submit() {
    if (!canAdvance()) return
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

  /* ── Confirmation ─────────────────────────────────────────────────────── */

  if (submitted) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-6"
          style={{ background: 'rgba(207,92,54,0.1)', border: '1px solid rgba(207,92,54,0.25)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#CF5C36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2
          className="font-display font-bold mb-3"
          style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#EEE5E9', letterSpacing: '-0.02em' }}
        >
          Your request has been sent.
        </h2>
        <p
          className="font-sans mb-8"
          style={{ fontSize: '14px', color: 'rgba(238,229,233,0.4)', maxWidth: '300px', lineHeight: 1.6 }}
        >
          Expect a reply within 3 business days.
        </p>
        <Link
          href="/"
          className="font-sans text-xs tracking-[0.1em] uppercase transition-opacity hover:opacity-60"
          style={{ color: 'rgba(238,229,233,0.3)' }}
        >
          ← Back to home
        </Link>
      </main>
    )
  }

  /* ── Quiz ─────────────────────────────────────────────────────────────── */

  const animName = dir === 'fwd' ? 'slideFwd' : 'slideBck'
  const active   = canAdvance()

  return (
    <>
      <style>{`
        @keyframes slideFwd {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideBck {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* TOS Modal */}
      {tosOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
        >
          <div
            style={{
              width:        '100%',
              maxWidth:     '520px',
              borderRadius: '20px',
              background:   'rgba(14,14,14,0.95)',
              border:       '1px solid rgba(238,229,233,0.08)',
              boxShadow:    '0 40px 120px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04)',
              overflow:     'hidden',
              animation:    'slideFwd 0.3s cubic-bezier(0.16,1,0.3,1) both',
            }}
          >
            {/* Header */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderBottom: '1px solid rgba(238,229,233,0.06)' }}
            >
              <p className="font-sans text-xs tracking-[0.14em] uppercase" style={{ color: 'rgba(207,92,54,0.8)' }}>
                Studio Terms
              </p>
              <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.2)' }}>
                Read before continuing
              </p>
            </div>

            {/* Scrollable terms */}
            <div
              className="px-6 py-5 flex flex-col gap-5 overflow-y-auto"
              style={{ maxHeight: '320px' }}
            >
              {[
                {
                  num: '01', title: 'Payments',
                  items: ['50% upfront to begin. No work starts before this clears.', '25% at the midpoint milestone.', '25% on completion, before final files are delivered.'],
                },
                {
                  num: '02', title: 'Revisions',
                  items: ['2 rounds of revisions per deliverable.', 'Feedback must be submitted as a single consolidated list.', 'Scope changes are quoted separately.'],
                },
                {
                  num: '03', title: 'Pause Fee',
                  items: ['A $50 fee applies to any client-initiated delay over 5 business days.', 'Projects paused 30+ days without contact may be considered abandoned.'],
                },
                {
                  num: '04', title: 'Portfolio Rights',
                  items: ['Kulaire retains the right to showcase completed work publicly.', 'Client owns full rights to final deliverables after all payments are made.'],
                },
              ].map(({ num, title, items }) => (
                <div key={num}>
                  <p className="font-sans text-xs tracking-[0.12em] uppercase mb-2" style={{ color: 'rgba(238,229,233,0.2)' }}>
                    {num}
                  </p>
                  <p className="font-display font-bold mb-2" style={{ fontSize: '13px', color: '#EEE5E9', letterSpacing: '-0.01em' }}>
                    {title}
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {items.map((item, i) => (
                      <li key={i} className="flex gap-2 font-sans" style={{ fontSize: '12px', color: 'rgba(238,229,233,0.45)', lineHeight: 1.6 }}>
                        <span style={{ color: '#CF5C36', flexShrink: 0 }}>&gt;</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Checkbox + CTA */}
            <div
              className="px-6 py-4 flex flex-col gap-4"
              style={{ borderTop: '1px solid rgba(238,229,233,0.06)' }}
            >
              <label className="flex items-start gap-3 cursor-pointer" onClick={() => setTosChecked(c => !c)}>
                <div
                  className="flex items-center justify-center shrink-0 mt-0.5"
                  style={{
                    width:        '16px',
                    height:       '16px',
                    borderRadius: '4px',
                    border:       `1px solid ${tosChecked ? 'rgba(207,92,54,0.8)' : 'rgba(238,229,233,0.2)'}`,
                    background:   tosChecked ? 'rgba(207,92,54,0.15)' : 'transparent',
                    transition:   'all 0.15s ease',
                    flexShrink:   0,
                  }}
                >
                  {tosChecked && (
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#CF5C36" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <span className="font-sans" style={{ fontSize: '12px', color: 'rgba(238,229,233,0.5)', lineHeight: 1.6 }}>
                  I have read and agree to the Kulaire Studio Terms.{' '}
                  <a href="/legal" target="_blank" rel="noopener noreferrer" style={{ color: '#CF5C36', textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                    Read full terms
                  </a>
                </span>
              </label>

              <button
                type="button"
                disabled={!tosChecked}
                onClick={() => {
                  setTosAgreed(true)
                  setTosOpen(false)
                  setDir('fwd')
                  setStep(s => s + 1)
                }}
                className="w-full font-display font-bold py-3 rounded-xl transition-all duration-200"
                style={{
                  fontSize:   '13px',
                  letterSpacing: '0.04em',
                  background: tosChecked ? '#CF5C36'                       : 'rgba(238,229,233,0.05)',
                  color:      tosChecked ? '#fff'                          : 'rgba(238,229,233,0.2)',
                  boxShadow:  tosChecked ? '0 0 20px rgba(207,92,54,0.4)' : 'none',
                  cursor:     tosChecked ? 'pointer'                       : 'not-allowed',
                }}
              >
                I Agree — Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="min-h-screen flex flex-col px-6 sm:px-8 pt-16 sm:pt-20 pb-12">

        {/* Segmented progress */}
        <div className="max-w-xl mx-auto w-full mb-10">
          <div className="flex gap-1.5">
            {Array.from({ length: TOTAL }).map((_, i) => {
              const done = i < step
              return (
                <div
                  key={i}
                  className="flex-1 rounded-full"
                  style={{
                    height:     '2.5px',
                    background: done ? '#CF5C36' : 'rgba(238,229,233,0.08)',
                    boxShadow:  done ? '0 0 6px rgba(207,92,54,0.5)' : 'none',
                    transition: 'background 0.3s ease, box-shadow 0.3s ease',
                  }}
                />
              )
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="flex-1 flex flex-col justify-center max-w-xl mx-auto w-full">
          <div
            key={step}
            style={{ animation: `${animName} 0.28s cubic-bezier(0.16,1,0.3,1) both` }}
          >

            {/* Step label */}
            <p
              className="font-sans text-xs tracking-[0.14em] uppercase mb-3"
              style={{ color: 'rgba(207,92,54,0.65)' }}
            >
              {def.type === 'final' ? 'Last step' : `Step ${step}`}
            </p>

            {/* ── Choice step ── */}
            {def.type === 'choice' && def.question && (
              <>
                <h1
                  className="font-display font-bold mb-8"
                  style={{
                    fontSize:      'clamp(1.4rem, 3.5vw, 2.1rem)',
                    color:         '#EEE5E9',
                    letterSpacing: '-0.02em',
                    lineHeight:    1.15,
                  }}
                >
                  {def.question}
                </h1>
                <div className="flex flex-col gap-3">
                  {def.options.map(opt => {
                    const sel = answers[def.key] === opt
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => select(def.key, opt)}
                        className="w-full text-left px-5 py-4 rounded-xl font-sans transition-all duration-150"
                        style={{
                          background:    sel ? 'rgba(207,92,54,0.1)'           : 'rgba(238,229,233,0.03)',
                          border:        `1px solid ${sel ? 'rgba(207,92,54,0.45)' : 'rgba(238,229,233,0.08)'}`,
                          color:         sel ? '#EEE5E9'                       : 'rgba(238,229,233,0.5)',
                          fontSize:      '14px',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        <span
                          className="inline-block w-2 h-2 rounded-full mr-3"
                          style={{
                            background:    sel ? '#CF5C36' : 'rgba(238,229,233,0.15)',
                            verticalAlign: 'middle',
                            transition:    'background 0.15s',
                          }}
                        />
                        {opt}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

            {/* ── Text step ── */}
            {def.type === 'text' && (
              <>
                <h1
                  className="font-display font-bold mb-2"
                  style={{
                    fontSize:      'clamp(1.4rem, 3.5vw, 2.1rem)',
                    color:         '#EEE5E9',
                    letterSpacing: '-0.02em',
                    lineHeight:    1.15,
                  }}
                >
                  {def.question}
                </h1>
                <p className="font-sans mb-6" style={{ fontSize: '13px', color: 'rgba(238,229,233,0.3)' }}>
                  A rough list is fine.
                </p>
                <textarea
                  rows={4}
                  placeholder={def.placeholder}
                  value={answers[def.key] as string}
                  onChange={e => setAnswers(a => ({ ...a, [def.key]: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 font-sans resize-none outline-none"
                  style={{ ...fieldBase, lineHeight: '1.6' }}
                  onFocus={e => { e.currentTarget.style.border = '1px solid rgba(207,92,54,0.35)' }}
                  onBlur={e  => { e.currentTarget.style.border = '1px solid rgba(238,229,233,0.08)' }}
                />
              </>
            )}

            {/* ── Final step ── */}
            {def.type === 'final' && (
              <>
                <h1
                  className="font-display font-bold mb-8"
                  style={{
                    fontSize:      'clamp(1.4rem, 3.5vw, 2.1rem)',
                    color:         '#EEE5E9',
                    letterSpacing: '-0.02em',
                    lineHeight:    1.15,
                  }}
                >
                  How do we reach you?
                </h1>
                <div className="flex flex-col gap-4">
                  {FINAL_FIELDS.map(({ k, label, ph, req, isTextarea }) => (
                    <div key={k}>
                      <label
                        className="font-sans block mb-1.5"
                        style={{ fontSize: '11px', color: 'rgba(238,229,233,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}
                      >
                        {label}
                        {req && <span style={{ color: '#CF5C36' }}> *</span>}
                      </label>
                      {isTextarea ? (
                        <textarea
                          rows={3}
                          placeholder={ph}
                          value={answers[k as keyof Answers]}
                          onChange={e => setAnswers(a => ({ ...a, [k]: e.target.value }))}
                          className="w-full rounded-xl px-4 py-3 font-sans resize-none outline-none"
                          style={{ ...fieldBase, lineHeight: '1.6' }}
                          onFocus={e => { e.currentTarget.style.border = '1px solid rgba(207,92,54,0.35)' }}
                          onBlur={e  => { e.currentTarget.style.border = '1px solid rgba(238,229,233,0.08)' }}
                        />
                      ) : (
                        <>
                          <input
                            type={k === 'email' ? 'email' : 'text'}
                            placeholder={ph}
                            required={req}
                            value={answers[k as keyof Answers]}
                            onChange={e => setAnswers(a => ({ ...a, [k]: e.target.value }))}
                            className="w-full rounded-xl px-4 py-3 font-sans outline-none"
                            style={fieldBase}
                            onFocus={e => { e.currentTarget.style.border = '1px solid rgba(207,92,54,0.35)' }}
                            onBlur={e  => { e.currentTarget.style.border = '1px solid rgba(238,229,233,0.08)' }}
                          />
                          {k === 'email' && answers.email.trim() && !EMAIL_RE.test(answers.email.trim()) && (
                            <p className="font-sans mt-1.5" style={{ fontSize: '11px', color: '#f87171' }}>
                              Enter a valid email address.
                            </p>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
                {error && (
                  <p className="font-sans mt-4" style={{ fontSize: '13px', color: '#f87171' }}>{error}</p>
                )}
              </>
            )}

          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="flex items-center justify-center rounded-full transition-all duration-150 hover:opacity-60"
                style={{
                  width:      '36px',
                  height:     '36px',
                  background: 'rgba(238,229,233,0.05)',
                  border:     '1px solid rgba(238,229,233,0.08)',
                  color:      'rgba(238,229,233,0.5)',
                  flexShrink: 0,
                }}
                aria-label="Go back"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
            ) : (
              <Link
                href="/"
                className="flex items-center justify-center rounded-full transition-all duration-150 hover:opacity-60"
                style={{
                  width:      '36px',
                  height:     '36px',
                  background: 'rgba(238,229,233,0.05)',
                  border:     '1px solid rgba(238,229,233,0.08)',
                  color:      'rgba(238,229,233,0.5)',
                  flexShrink: 0,
                }}
                aria-label="Back to home"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </Link>
            )}

            {step < TOTAL ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!active}
                className="font-display font-medium px-6 py-2.5 rounded-full transition-all duration-200"
                style={{
                  fontSize:   '14px',
                  background: active ? '#CF5C36'                      : 'rgba(238,229,233,0.06)',
                  color:      active ? '#EEE5E9'                      : 'rgba(238,229,233,0.2)',
                  boxShadow:  active ? '0 0 16px rgba(207,92,54,0.35)' : 'none',
                  cursor:     active ? 'pointer'                      : 'not-allowed',
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                onClick={submit}
                disabled={submitting || !active}
                className="font-display font-medium px-6 py-2.5 rounded-full transition-all duration-200"
                style={{
                  fontSize:   '14px',
                  background: active ? '#CF5C36'                      : 'rgba(238,229,233,0.06)',
                  color:      active ? '#EEE5E9'                      : 'rgba(238,229,233,0.2)',
                  boxShadow:  active ? '0 0 16px rgba(207,92,54,0.35)' : 'none',
                  cursor:     active && !submitting ? 'pointer'        : 'not-allowed',
                }}
              >
                {submitting ? '···' : 'Send my request'}
              </button>
            )}
          </div>

        </div>
      </main>
    </>
  )
}
