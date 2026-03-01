'use client'

import { useState } from 'react'
import FadeIn from './FadeIn'

const inputClass =
  'font-sans text-sm text-white bg-transparent placeholder:text-[#888] border-b border-white/20 py-2.5 outline-none focus:border-white transition-colors duration-200 w-full'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: wire to your backend — Formspree, Resend, etc.
    setSent(true)
  }

  return (
    <section id="contact" className="px-8 py-32 border-t border-divider">
      <div className="max-w-6xl mx-auto flex flex-col items-center text-center">
        <FadeIn>
          <h2
            className="font-display font-black text-ink tracking-[-0.02em] mb-14"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5.5rem)' }}
          >
            Let's talk.
          </h2>
        </FadeIn>

        {/* Links */}
        <FadeIn delay={100}>
          <div className="flex flex-col items-center gap-5 mb-20">
            <a
              href="mailto:hello@befuji.com"
              className="font-sans text-xs tracking-[0.2em] uppercase text-ink hover:opacity-40 transition-opacity duration-200"
            >
              hello@befuji.com
            </a>

            <span className="block w-px h-7 bg-divider" />

            <a
              href="https://linkedin.com/in/befuji"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs tracking-[0.2em] uppercase text-ink hover:opacity-40 transition-opacity duration-200"
            >
              LinkedIn
            </a>

            <span className="block w-px h-7 bg-divider" />

            {/* Book a call */}
            <a
              href="https://cal.com/befuji"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs tracking-[0.2em] uppercase text-ink border border-ink px-6 py-3 hover:bg-ink hover:text-bg transition-colors duration-200"
            >
              Book a call
            </a>
          </div>
        </FadeIn>

        {/* Contact form */}
        <FadeIn delay={200}>
          <div className="w-full max-w-md text-left">
            {sent ? (
              <p
                className="font-sans text-sm tracking-wide text-center"
                style={{ color: 'rgba(255,255,255,0.4)' }}
              >
                Message received.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                <input
                  type="text"
                  placeholder="Name"
                  required
                  value={form.name}
                  onChange={(e) => setForm((d) => ({ ...d, name: e.target.value }))}
                  className={inputClass}
                />
                <input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((d) => ({ ...d, email: e.target.value }))}
                  className={inputClass}
                />
                <textarea
                  placeholder="Message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm((d) => ({ ...d, message: e.target.value }))}
                  className={`${inputClass} resize-none`}
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="font-sans text-xs tracking-[0.2em] uppercase text-ink border border-ink px-6 py-3 hover:bg-ink hover:text-bg transition-colors duration-200"
                  >
                    Send
                  </button>
                </div>
              </form>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={320}>
          <p
            className="font-sans text-xs tracking-widest mt-24"
            style={{ color: 'rgba(255,255,255,0.2)' }}
          >
            &copy; {new Date().getFullYear()} befuji
          </p>
        </FadeIn>
      </div>
    </section>
  )
}
