'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import Footer from '@/components/Footer'

// ── form steps ────────────────────────────────────────────────────────────────
const STEPS = [
  { key: 'name',        placeholder: 'Enter your name',          hint: 'Your full name',                 type: 'text'  },
  { key: 'email',       placeholder: 'Enter your email',         hint: 'Your email address',             type: 'email' },
  { key: 'purpose',     placeholder: 'What is it for?',          hint: 'e.g. Ads, Film, SaaS, Web',      type: 'text'  },
  { key: 'description', placeholder: "What's the description?",  hint: 'Brief overview of your project', type: 'text'  },
]

type FormValues = { [key: string]: string }

// ── contact links ─────────────────────────────────────────────────────────────
const LINKS = [
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/><polyline points="2,4 12,13 22,4"/>
      </svg>
    ),
    label: 'Email',
    value: 'hello@kulaire.com',
    href: 'mailto:hello@kulaire.com',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
    label: 'LinkedIn',
    value: 'linkedin.com/company/kulaire',
    href: 'https://linkedin.com/company/kulaire',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
    label: 'Instagram',
    value: '@kulaire',
    href: 'https://instagram.com/kulaire',
  },
  {
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    label: 'Support',
    value: 'support@kulaire.com',
    href: 'mailto:support@kulaire.com',
  },
]

// ── component ─────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [step,      setStep]      = useState(0)
  const [exiting,   setExiting]   = useState(false)
  const [values,    setValues]    = useState<FormValues>({ name: '', email: '', purpose: '', description: '' })
  const [submitted, setSubmitted] = useState(false)
  const [sending,   setSending]   = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const current = STEPS[step]
  const isLast  = step === STEPS.length - 1
  const filled  = !!values[current?.key]?.trim()

  // Focus input when step changes
  useEffect(() => {
    if (!submitted) setTimeout(() => inputRef.current?.focus(), 260)
  }, [step, submitted])

  function transition(fn: () => void) {
    setExiting(true)
    setTimeout(() => { fn(); setExiting(false) }, 220)
  }

  function handleNext() {
    if (!filled || exiting || sending) return
    if (isLast) { handleSubmit(); return }
    transition(() => setStep(s => s + 1))
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
    transition(() => setSubmitted(true))
  }

  return (
    <main style={{ background: '#000', minHeight: '100vh' }}>

      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateX(28px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        .contact-input::placeholder {
          color: rgba(238,229,233,0.2);
        }
        .contact-link:hover { color: #EEE5E9 !important; }
      `}</style>

      {/* ── header ── */}
      <section style={{ padding: 'clamp(120px, 14vw, 180px) clamp(24px, 6vw, 80px) 0' }}>

        <p
          className="font-sans"
          style={{
            fontSize:      '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color:         'rgba(238,229,233,0.4)',
            marginBottom:  '14px',
            display:       'flex',
            alignItems:    'center',
            gap:           '10px',
          }}
        >
          <span style={{ width: '2px', height: '14px', background: '#CF5C36', display: 'inline-block', borderRadius: '1px', flexShrink: 0 }} />
          How to contact us
        </p>

        <h1
          className="font-display"
          style={{
            fontSize:      'clamp(3rem, 7vw, 7rem)',
            fontWeight:    700,
            letterSpacing: '-0.03em',
            lineHeight:    0.95,
            color:         '#EEE5E9',
          }}
        >
          Contact us<span style={{ color: '#CF5C36' }}>.</span>
        </h1>

      </section>

      {/* ── contact info row ── */}
      <section style={{ padding: 'clamp(48px, 6vw, 72px) clamp(24px, 6vw, 80px)' }}>
        <div
          style={{
            display:               'grid',
            gridTemplateColumns:   'repeat(auto-fit, minmax(180px, 1fr))',
            gap:                   '32px 40px',
            borderTop:             '1px solid #1a1a1a',
            paddingTop:            '40px',
          }}
        >
          {LINKS.map(link => (
            <div key={link.label}>
              <p
                className="font-sans"
                style={{
                  fontSize:      '10px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color:         'rgba(238,229,233,0.3)',
                  marginBottom:  '10px',
                  display:       'flex',
                  alignItems:    'center',
                  gap:           '6px',
                }}
              >
                <span style={{ color: 'rgba(238,229,233,0.3)', display: 'flex' }}>{link.icon}</span>
                {link.label}
              </p>
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="contact-link font-sans"
                style={{
                  fontSize:   '14px',
                  color:      'rgba(238,229,233,0.55)',
                  letterSpacing: '-0.01em',
                  transition: 'color 0.15s ease',
                  display:    'block',
                }}
              >
                {link.value}
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* ── get in touch ── */}
      <section style={{ padding: '0 clamp(24px, 6vw, 80px) clamp(80px, 10vw, 140px)', maxWidth: '860px' }}>

        <p
          className="font-sans"
          style={{
            fontSize:      '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color:         'rgba(238,229,233,0.4)',
            marginBottom:  '48px',
            display:       'flex',
            alignItems:    'center',
            gap:           '10px',
          }}
        >
          <span style={{ width: '2px', height: '14px', background: '#CF5C36', display: 'inline-block', borderRadius: '1px', flexShrink: 0 }} />
          Get in touch
        </p>

        {/* form area */}
        <div style={{ minHeight: '180px' }}>

          {/* ── success ── */}
          {submitted ? (
            <div style={{ animation: 'slide-in 0.3s ease forwards' }}>
              <p
                className="font-display"
                style={{
                  fontSize:      'clamp(2rem, 5vw, 4.5rem)',
                  fontWeight:    600,
                  letterSpacing: '-0.03em',
                  color:         '#EEE5E9',
                  lineHeight:    1,
                  marginBottom:  '16px',
                }}
              >
                We'll be in touch<span style={{ color: '#CF5C36' }}>.</span>
              </p>
              <p
                className="font-sans"
                style={{ fontSize: '13px', color: 'rgba(238,229,233,0.3)', letterSpacing: '0.01em' }}
              >
                Expect a reply within 24 hours.
              </p>
            </div>

          ) : (

            /* ── step ── */
            <div
              key={step}
              style={{
                opacity:    exiting ? 0 : 1,
                transform:  exiting ? 'translateX(-24px)' : 'translateX(0)',
                transition: exiting ? 'opacity 0.2s ease, transform 0.2s ease' : 'none',
                animation:  !exiting ? 'slide-in 0.25s ease forwards' : 'none',
              }}
            >
              {/* large input */}
              <input
                ref={inputRef}
                type={current.type}
                value={values[current.key] ?? ''}
                onChange={e => setValues(v => ({ ...v, [current.key]: e.target.value }))}
                onKeyDown={handleKey}
                placeholder={current.placeholder}
                className="contact-input font-display"
                style={{
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
                  caretColor:    '#CF5C36',
                  display:       'block',
                  marginBottom:  '20px',
                }}
              />

              {/* hint + next button */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                <p
                  className="font-sans"
                  style={{
                    fontSize:      '11px',
                    color:         'rgba(238,229,233,0.22)',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  {current.hint}
                </p>

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
                    <svg
                      width="10" height="10" viewBox="0 0 12 12"
                      fill="none" stroke="currentColor" strokeWidth="1.8"
                      strokeLinecap="round" strokeLinejoin="round"
                      style={{ color: filled ? '#fff' : 'rgba(238,229,233,0.18)' }}
                    >
                      {isLast
                        ? <><path d="M10.5 1.5 5 7M10.5 1.5H7M10.5 1.5V5"/><path d="M5.5 3H2v7h7V6.5"/></>
                        : <><line x1="2" y1="6" x2="10" y2="6"/><polyline points="7,3 10,6 7,9"/></>
                      }
                    </svg>
                  </span>
                </button>
              </div>

              {/* step dots */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '36px' }}>
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    style={{
                      width:        i === step ? '20px' : '5px',
                      height:       '5px',
                      borderRadius: '9999px',
                      background:   i === step ? '#CF5C36' : i < step ? 'rgba(207,92,54,0.35)' : 'rgba(238,229,233,0.08)',
                      transition:   'width 0.3s ease, background 0.3s ease',
                    }}
                  />
                ))}
              </div>

            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
