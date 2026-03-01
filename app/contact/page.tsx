'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import Nav from '@/components/Nav'

const fieldClass =
  'font-sans text-sm text-white bg-transparent border-b border-white/20 py-3 outline-none focus:border-white transition-colors duration-200 w-full placeholder:text-[#888]'

const SERVICES = [
  { value: 'ads',   label: 'Ads' },
  { value: 'saas',  label: 'SaaS Film' },
  { value: 'other', label: 'Other' },
]

const ease = [0.16, 1, 0.3, 1] as const

function ServiceDropdown({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const selected = SERVICES.find((s) => s.value === value)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between border-b border-white/20 py-3 bg-transparent outline-none focus:border-white transition-colors duration-200"
        style={{ color: value ? '#ffffff' : 'rgba(255,255,255,0.35)' }}
      >
        <span className="font-sans text-sm">{selected?.label ?? 'Service'}</span>
        <svg
          width="11"
          height="11"
          viewBox="0 0 11 11"
          fill="none"
          className="shrink-0 transition-transform duration-200"
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            color: 'rgba(255,255,255,0.4)',
          }}
        >
          <path
            d="M1.5 3.5L5.5 7.5L9.5 3.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Options */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="absolute top-full left-0 right-0 z-20 bg-[#111] border border-[#333] rounded-[12px] overflow-hidden"
            style={{ marginTop: '4px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
          >
            {SERVICES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => { onChange(s.value); setOpen(false) }}
                className="w-full text-left px-4 py-3 font-sans text-sm text-white hover:bg-[#1a1a1a] transition-colors duration-150"
              >
                {s.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

type Errors = { firstName: string; lastName: string; service: string; email: string }

export default function ContactPage() {
  const [btnHover, setBtnHover] = useState(false)
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    service: '',
    email: '',
    description: '',
  })
  const [errors, setErrors] = useState<Errors>({ firstName: '', lastName: '', service: '', email: '' })
  const [status, setStatus] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Errors = { firstName: '', lastName: '', service: '', email: '' }
    if (!form.firstName.trim()) newErrors.firstName = 'this field is required'
    if (!form.lastName.trim()) newErrors.lastName = 'this field is required'
    if (!form.service) newErrors.service = 'this field is required'
    if (!form.email.trim()) {
      newErrors.email = 'this field is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'enter a valid email'
    }

    if (Object.values(newErrors).some(Boolean)) {
      setErrors(newErrors)
      return
    }
    setErrors({ firstName: '', lastName: '', service: '', email: '' })

    setStatus('sending')

    const formData = new FormData(e.target as HTMLFormElement)

    const res = await fetch('https://formspree.io/f/mnjbrobp', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
    })

    if (res.ok) {
      setStatus('success');
      (e.target as HTMLFormElement).reset()
      setForm({ firstName: '', lastName: '', service: '', email: '', description: '' })
    } else {
      setStatus('error')
    }
  }

  const fieldErr = 'font-sans text-xs mt-1.5' as const

  return (
    <main className="min-h-screen bg-bg">
      <Nav />

      <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen pt-[69px]">

        {/* ── Left column ── */}
        <div className="flex flex-col justify-between px-8 md:px-14 py-14 border-r border-divider overflow-hidden">
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="font-sans font-medium text-ink leading-[0.88] tracking-[-0.04em] whitespace-nowrap"
            style={{ fontSize: 'clamp(3.5rem, 7.5vw, 10rem)' }}
          >
            Contact me
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="flex flex-col gap-5 mt-auto pt-16 mb-3"
          >
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Jakarta, Indonesia
              </span>
              <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {new Date().getFullYear()}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Available for work
              </span>
              <span className="font-sans text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Mon – Fri / async
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Right column — form ── */}
        <div className="flex flex-col justify-center px-8 md:px-14 py-14">
          {status === 'success' ? (
            <p className="font-sans text-sm text-center" style={{ color: '#22c55e' }}>
              message sent.
            </p>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8 w-full max-w-md">

              {/* First + Last name */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1, ease }}
                className="grid grid-cols-2 gap-6"
              >
                <div>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={form.firstName}
                    onChange={(e) => {
                      setForm((d) => ({ ...d, firstName: e.target.value }))
                      if (errors.firstName) setErrors((d) => ({ ...d, firstName: '' }))
                    }}
                    className={fieldClass}
                  />
                  {errors.firstName && (
                    <p className={fieldErr} style={{ color: '#ef4444' }}>{errors.firstName}</p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={form.lastName}
                    onChange={(e) => {
                      setForm((d) => ({ ...d, lastName: e.target.value }))
                      if (errors.lastName) setErrors((d) => ({ ...d, lastName: '' }))
                    }}
                    className={fieldClass}
                  />
                  {errors.lastName && (
                    <p className={fieldErr} style={{ color: '#ef4444' }}>{errors.lastName}</p>
                  )}
                </div>
              </motion.div>

              {/* Service dropdown */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease }}
              >
                <ServiceDropdown
                  value={form.service}
                  onChange={(v) => {
                    setForm((d) => ({ ...d, service: v }))
                    if (errors.service) setErrors((d) => ({ ...d, service: '' }))
                  }}
                />
                <input type="hidden" name="service" value={form.service} />
                {errors.service && (
                  <p className={fieldErr} style={{ color: '#ef4444' }}>{errors.service}</p>
                )}
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => {
                    setForm((d) => ({ ...d, email: e.target.value }))
                    if (errors.email) setErrors((d) => ({ ...d, email: '' }))
                  }}
                  className={fieldClass}
                />
                {errors.email && (
                  <p className={fieldErr} style={{ color: '#ef4444' }}>{errors.email}</p>
                )}
              </motion.div>

              {/* Project description */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4, ease }}
              >
                <input
                  type="text"
                  name="projectDescription"
                  placeholder="Project description"
                  value={form.description}
                  onChange={(e) => setForm((d) => ({ ...d, description: e.target.value }))}
                  className={fieldClass}
                />
              </motion.div>

              {/* Submit */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5, ease }}
                className="flex flex-col items-start gap-3"
              >
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  onMouseEnter={() => setBtnHover(true)}
                  onMouseLeave={() => setBtnHover(false)}
                  className="font-sans text-xs tracking-[0.15em] uppercase disabled:opacity-50"
                  style={{
                    background: btnHover ? '#000' : '#fff',
                    color: btnHover ? '#fff' : '#000',
                    borderRadius: '999px',
                    padding: '12px 32px',
                    transition: 'all 0.3s ease',
                    boxShadow: btnHover
                      ? 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.2), 0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.25)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.8), inset 0 -1px 0 rgba(0,0,0,0.2), 0 0 12px rgba(255,255,255,0.3), 0 0 24px rgba(255,255,255,0.15)',
                  }}
                >
                  {status === 'sending' ? 'sending...' : 'Submit'}
                </button>
                {status === 'error' && (
                  <p className="font-sans text-sm text-center w-full" style={{ color: '#ef4444' }}>
                    something went wrong. try again.
                  </p>
                )}
              </motion.div>

            </form>
          )}
        </div>

      </div>
    </main>
  )
}
