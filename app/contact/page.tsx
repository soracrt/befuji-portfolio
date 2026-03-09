'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'

// ── form steps ────────────────────────────────────────────────────────────────
const STEPS = [
  { key: 'name',        placeholder: 'Enter your name',          hint: 'Your full name',                 type: 'text'  },
  { key: 'email',       placeholder: 'Enter your email',         hint: 'Your email address',             type: 'email' },
  { key: 'purpose',     placeholder: 'What is it for?',          hint: 'Tab or → to complete',           type: 'text'  },
  { key: 'description', placeholder: "What's the description?",  hint: 'Brief overview of your project', type: 'text'  },
]

const SERVICES = ['Ads', 'Film', 'SaaS', 'Website Development', 'Artist Promo', 'Motion Graphics']

type FormValues = { [key: string]: string }
type Dir = 'fwd' | 'back'

function isValidEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
}

// ── component ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const router = useRouter()
  const [step,            setStep]           = useState(0)
  const [exiting,         setExiting]        = useState(false)
  const [dir,             setDir]            = useState<Dir>('fwd')
  const [values,          setValues]         = useState<FormValues>({ name: '', email: '', purpose: '', description: '' })
  const [submitted,       setSubmitted]      = useState(false)
  const [sending,         setSending]        = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1
  const filled  = !!values[current?.key]?.trim()

  // Ghost autocomplete for the purpose field
  const typed      = values.purpose ?? ''
  const ghostMatch = typed.length > 0
    ? SERVICES.find(s => s.toLowerCase().startsWith(typed.toLowerCase())) ?? null
    : null
  const ghost = ghostMatch ? ghostMatch.slice(typed.length) : ''

  useEffect(() => {
    if (!submitted) setTimeout(() => inputRef.current?.focus(), 260)
  }, [step, submitted])

  function transition(fn: () => void) {
    setExiting(true)
    setTimeout(() => { fn(); setExiting(false) }, 220)
  }

  function goTo(target: number, d: Dir) {
    if (exiting) return
    setDir(d)
    setError('')
    transition(() => setStep(target))
  }

  function handleNext() {
    if (!filled || exiting || sending) return
    if (current.key === 'email' && !isValidEmail(values.email)) {
      setError('Enter a valid email address')
      return
    }
    setError('')
    if (isLast) { handleSubmit(); return }
    goTo(step + 1, 'fwd')
  }

  function handleBack() {
    if (step === 0) return
    goTo(step - 1, 'back')
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Enter') handleNext()
  }

  async function handleSubmit() {
    setSending(true)
    try {
      await fetch('/api/contact', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(values),
      })
    } catch { /* silent */ }
    setSending(false)
    setDir('fwd')
    transition(() => setSubmitted(true))
  }

  // ── slide animation vars ──────────────────────────────────────────────────
  const enterAnim  = dir === 'fwd' ? 'slide-in-fwd 0.25s ease forwards' : 'slide-in-back 0.25s ease forwards'
  const exitOffset = dir === 'fwd' ? 'translateX(-24px)' : 'translateX(24px)'

  return (
    <main style={{
      background:    '#000',
      height:        '100vh',
      overflow:      'hidden',
      display:       'flex',
      flexDirection: 'column',
      padding:       'clamp(80px, 10vh, 128px) clamp(24px, 6vw, 80px) clamp(40px, 6vh, 80px)',
    }}>

      <style>{`
        @keyframes slide-in-fwd {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes slide-in-back {
          from { opacity: 0; transform: translateX(-28px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        .contact-input::placeholder { color: rgba(238,229,233,0.2); }
        .contact-link:hover         { color: #EEE5E9 !important;    }
        .dot-btn:hover              { background: rgba(207,92,54,0.5) !important; }
      `}</style>

      {/* ── back button ── */}
      <div style={{ marginBottom: 'clamp(32px, 5vh, 64px)' }}>
        <button
          onClick={() => router.back()}
          className="font-sans"
          style={{
            display:       'flex',
            alignItems:    'center',
            gap:           '8px',
            height:        '34px',
            paddingLeft:   '14px',
            paddingRight:  '16px',
            borderRadius:  '9999px',
            background:    'rgba(238,229,233,0.05)',
            border:        '1px solid rgba(238,229,233,0.12)',
            color:         'rgba(238,229,233,0.72)',
            fontSize:      '11px',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            cursor:        'pointer',
            transition:    'background 0.15s, border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background   = 'rgba(238,229,233,0.08)'
            e.currentTarget.style.borderColor  = 'rgba(238,229,233,0.22)'
            e.currentTarget.style.color        = '#EEE5E9'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background   = 'rgba(238,229,233,0.05)'
            e.currentTarget.style.borderColor  = 'rgba(238,229,233,0.12)'
            e.currentTarget.style.color        = 'rgba(238,229,233,0.72)'
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
      </div>

      {/* ── heading ── */}
      <div style={{ marginBottom: 'clamp(20px, 3vh, 36px)' }}>
        <h1
          className="font-display"
          style={{ fontSize: 'clamp(2.8rem, 6vw, 6rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#EEE5E9' }}
        >
          Contact us<span style={{ color: '#CF5C36' }}>.</span>
        </h1>
      </div>

      {/* ── email ── */}
      <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '28px', marginBottom: 'clamp(28px, 4vh, 52px)' }}>
        <p
          className="font-sans"
          style={{ fontSize: '10px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(238,229,233,0.3)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'rgba(238,229,233,0.3)', flexShrink: 0 }}>
            <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
          </svg>
          Email
        </p>
        <a href="mailto:hello@kulaire.com" className="contact-link font-sans" style={{ fontSize: '14px', color: 'rgba(238,229,233,0.55)', letterSpacing: '-0.01em', transition: 'color 0.15s ease', display: 'inline-block' }}>
          hello@kulaire.com
        </a>
      </div>

      {/* ── get in touch ── */}
      <div style={{ maxWidth: '860px' }}>
        <p
          className="font-sans"
          style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(238,229,233,0.4)', marginBottom: '36px', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <span style={{ width: '2px', height: '14px', background: '#CF5C36', display: 'inline-block', borderRadius: '1px', flexShrink: 0 }} />
          Get in touch
        </p>

        <div>

          {/* ── success ── */}
          {submitted ? (
            <div style={{ animation: 'slide-in-fwd 0.3s ease forwards' }}>
              <p
                className="font-display"
                style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 600, letterSpacing: '-0.03em', color: '#EEE5E9', lineHeight: 1, marginBottom: '16px' }}
              >
                We'll be in touch<span style={{ color: '#CF5C36' }}>.</span>
              </p>
              <p className="font-sans" style={{ fontSize: '13px', color: 'rgba(238,229,233,0.3)', letterSpacing: '0.01em' }}>
                Expect a reply within 24 hours.
              </p>
            </div>

          ) : (

            <div
              key={step}
              style={{
                opacity:    exiting ? 0 : 1,
                transform:  exiting ? exitOffset : 'translateX(0)',
                transition: exiting ? 'opacity 0.2s ease, transform 0.2s ease' : 'none',
                animation:  !exiting ? enterAnim : 'none',
              }}
            >

              {/* ── purpose step: ghost inline autocomplete ── */}
              {current.key === 'purpose' ? (
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  {/* ghost overlay — typed portion invisible (holds width), completion faint */}
                  {ghost && (
                    <div
                      aria-hidden
                      className="font-display"
                      style={{
                        position:      'absolute',
                        top:           0,
                        left:          0,
                        right:         0,
                        paddingTop:    '4px',
                        fontSize:      'clamp(1.8rem, 4vw, 3.8rem)',
                        fontWeight:    500,
                        letterSpacing: '-0.02em',
                        pointerEvents: 'none',
                        whiteSpace:    'nowrap',
                        overflow:      'hidden',
                        userSelect:    'none',
                      }}
                    >
                      {/* invisible spacer matching typed text */}
                      <span style={{ visibility: 'hidden' }}>{typed}</span>
                      {/* ghost completion */}
                      <span style={{ color: 'rgba(238,229,233,0.28)' }}>{ghost}</span>
                    </div>
                  )}
                  <input
                    ref={inputRef}
                    type="text"
                    value={typed}
                    onChange={e => {
                      const v = e.target.value
                      setValues(prev => ({ ...prev, purpose: v.length > 0 ? v[0].toUpperCase() + v.slice(1) : v }))
                    }}
                    onKeyDown={e => {
                      if ((e.key === 'Tab' || e.key === 'ArrowRight') && ghost) {
                        e.preventDefault()
                        setValues(v => ({ ...v, purpose: ghostMatch! }))
                      } else {
                        handleKey(e)
                      }
                    }}
                    placeholder="What is it for?"
                    className="contact-input font-display"
                    style={{
                      position:      'relative',
                      width:         '100%',
                      background:    'transparent',
                      border:        'none',
                      borderBottom:  '1px solid rgba(238,229,233,0.12)',
                      outline:       'none',
                      fontSize:      'clamp(1.8rem, 4vw, 3.8rem)',
                      fontWeight:    500,
                      letterSpacing: '-0.02em',
                      color:         '#EEE5E9',
                      paddingBottom: '18px',
                      paddingTop:    '4px',
                      paddingLeft:   '0',
                      caretColor:    '#CF5C36',
                      display:       'block',
                    }}
                  />
                </div>

              ) : (
                /* ── all other steps: plain input ── */
                <div style={{ position: 'relative', marginBottom: '20px' }}>
                  <input
                    ref={inputRef}
                    type={current.type}
                    value={values[current.key] ?? ''}
                    onChange={e => {
                      setValues(v => ({ ...v, [current.key]: e.target.value }))
                      if (error) setError('')
                    }}
                    onKeyDown={handleKey}
                    placeholder={current.placeholder}
                    className="contact-input font-display"
                    style={{
                      width:         '100%',
                      background:    'transparent',
                      border:        'none',
                      borderBottom:  `1px solid ${error ? 'rgba(207,92,54,0.5)' : 'rgba(238,229,233,0.12)'}`,
                      outline:       'none',
                      fontSize:      'clamp(1.8rem, 4vw, 3.8rem)',
                      fontWeight:    500,
                      letterSpacing: '-0.02em',
                      color:         '#EEE5E9',
                      paddingBottom: '18px',
                      paddingTop:    '4px',
                      caretColor:    '#CF5C36',
                      display:       'block',
                      transition:    'border-color 0.15s ease',
                    }}
                  />
                  {error && (
                    <p
                      className="font-sans"
                      style={{ fontSize: '11px', color: '#CF5C36', letterSpacing: '0.04em', marginTop: '8px' }}
                    >
                      {error}
                    </p>
                  )}
                </div>
              )}

              {/* hint + back + next row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

                {/* back button */}
                {step > 0 && (
                  <button
                    onClick={handleBack}
                    className="font-sans"
                    style={{
                      display:       'flex',
                      alignItems:    'center',
                      justifyContent: 'center',
                      width:         '40px',
                      height:        '40px',
                      borderRadius:  '50%',
                      background:    'rgba(238,229,233,0.04)',
                      border:        '1px solid rgba(238,229,233,0.08)',
                      color:         'rgba(238,229,233,0.35)',
                      cursor:        'pointer',
                      flexShrink:    0,
                      transition:    'background 0.15s, border-color 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background    = 'rgba(238,229,233,0.08)'
                      e.currentTarget.style.borderColor   = 'rgba(238,229,233,0.18)'
                      e.currentTarget.style.color         = 'rgba(238,229,233,0.7)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background    = 'rgba(238,229,233,0.04)'
                      e.currentTarget.style.borderColor   = 'rgba(238,229,233,0.08)'
                      e.currentTarget.style.color         = 'rgba(238,229,233,0.35)'
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="10" y1="6" x2="2" y2="6"/><polyline points="5,3 2,6 5,9"/>
                    </svg>
                  </button>
                )}

                {/* hint */}
                <p
                  className="font-sans"
                  style={{ fontSize: '11px', color: 'rgba(238,229,233,0.22)', letterSpacing: '0.06em', textTransform: 'uppercase', flex: 1 }}
                >
                  {current.hint}
                </p>

                {/* next / send button */}
                <button
                  onClick={handleNext}
                  disabled={!filled || sending}
                  className="font-sans"
                  style={{
                    display:       'flex',
                    alignItems:    'center',
                    gap:           '10px',
                    paddingLeft:   '20px',
                    paddingRight:  '8px',
                    height:        '40px',
                    borderRadius:  '9999px',
                    background:    filled ? 'rgba(207,92,54,0.1)' : 'rgba(238,229,233,0.03)',
                    border:        `1px solid ${filled ? 'rgba(207,92,54,0.3)' : 'rgba(238,229,233,0.07)'}`,
                    color:         filled ? '#CF5C36' : 'rgba(238,229,233,0.18)',
                    fontSize:      '11px',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    cursor:        filled ? 'pointer' : 'default',
                    transition:    'background 0.2s, border-color 0.2s, color 0.2s',
                    flexShrink:    0,
                  }}
                >
                  {sending ? 'Sending…' : isLast ? 'Send' : 'Next'}
                  <span
                    style={{
                      width:          '26px',
                      height:         '26px',
                      borderRadius:   '50%',
                      background:     filled ? '#CF5C36' : 'rgba(238,229,233,0.06)',
                      display:        'flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      flexShrink:     0,
                      transition:     'background 0.2s',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: filled ? '#fff' : 'rgba(238,229,233,0.18)' }}>
                      {isLast
                        ? <><path d="M10.5 1.5 5 7M10.5 1.5H7M10.5 1.5V5"/><path d="M5.5 3H2v7h7V6.5"/></>
                        : <><line x1="2" y1="6" x2="10" y2="6"/><polyline points="7,3 10,6 7,9"/></>
                      }
                    </svg>
                  </span>
                </button>
              </div>

              {/* step dots — completed dots are clickable */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '36px', alignItems: 'center' }}>
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={i < step ? 'dot-btn' : ''}
                    onClick={() => i < step && goTo(i, 'back')}
                    style={{
                      width:        i === step ? '20px' : '5px',
                      height:       '5px',
                      borderRadius: '9999px',
                      background:   i === step ? '#CF5C36' : i < step ? 'rgba(207,92,54,0.4)' : 'rgba(238,229,233,0.08)',
                      transition:   'width 0.3s ease, background 0.3s ease',
                      cursor:       i < step ? 'pointer' : 'default',
                    }}
                  />
                ))}
              </div>

            </div>
          )}
        </div>
      </div>
    </main>
  )
}
