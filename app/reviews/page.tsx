'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import FadeIn from '@/components/FadeIn'
import ReviewCard from '@/components/ReviewCard'

type Review = {
  id: string
  name: string
  service: string
  company?: string
  text: string
  featured: boolean
}

const PER_PAGE = 6
const SERVICES = ['ADs', 'SaaS', 'Film', 'Other']

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [page, setPage] = useState(0)

  // Form state
  const [name, setName] = useState('')
  const [service, setService] = useState('ADs')
  const [company, setCompany] = useState('')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then((data: Review[]) => { if (Array.isArray(data)) setReviews(data) })
      .catch(() => {})
  }, [])

  const totalPages = Math.max(1, Math.ceil(reviews.length / PER_PAGE))
  const pageReviews = reviews.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, service, company, text }),
      })
      if (res.ok) {
        const newReview = await res.json()
        setReviews(prev => [...prev, newReview])
        setName('')
        setService('ADs')
        setCompany('')
        setText('')
        setSubmitted(true)
        setTimeout(() => setSubmitted(false), 4000)
      }
    } catch {}
    setSubmitting(false)
  }

  return (
    <main>
      <Nav />

      <div className="pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto">

          {/* Back arrow */}
          <FadeIn>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.12em] uppercase text-ink/50 hover:text-ink transition-colors duration-200 mb-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              back
            </Link>
          </FadeIn>

          {/* Heading */}
          <FadeIn>
            <h1
              className="font-sans font-medium text-ink tracking-[-0.025em] mb-16"
              style={{
                fontSize: 'clamp(3rem, 7vw, 6rem)',
                textShadow: '0 0 40px rgba(161,7,2,0.35), 0 0 80px rgba(161,7,2,0.15)',
              }}
            >
              Reviews
            </h1>
          </FadeIn>

          {/* Reviews grid — outer wrapper always reserves height to prevent layout jump on load */}
          <div className="mb-12" style={{ minHeight: '420px' }}>
            {pageReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5" style={{ alignContent: 'start' }}>
                {pageReviews.map((review, i) => (
                  <FadeIn key={review.id} delay={i * 60}>
                    <ReviewCard review={review} />
                  </FadeIn>
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <FadeIn>
                <p className="font-sans text-sm" style={{ color: 'rgba(255,255,252,0.3)' }}>
                  No reviews yet. Be the first.
                </p>
              </FadeIn>
            ) : null}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <FadeIn>
              <div className="flex items-center justify-center gap-5 mb-20">

                {/* Left arrow */}
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="transition-colors disabled:opacity-20 hover:opacity-60"
                  style={{ color: 'rgba(255,255,252,0.6)' }}
                  aria-label="Previous page"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>

                {/* Segments */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className="h-[3px] rounded-full transition-all duration-300"
                      style={{
                        width: i === page ? '32px' : '16px',
                        background: i === page ? '#a10702' : 'rgba(255,255,252,0.2)',
                      }}
                      aria-label={`Page ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Right arrow */}
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page === totalPages - 1}
                  className="transition-colors disabled:opacity-20 hover:opacity-60"
                  style={{ color: 'rgba(255,255,252,0.6)' }}
                  aria-label="Next page"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

              </div>
            </FadeIn>
          )}

          {/* Divider */}
          <FadeIn>
            <div className="border-t mb-16" style={{ borderColor: 'rgba(255,255,252,0.08)' }} />
          </FadeIn>

          {/* Submit form */}
          <FadeIn>
            <h2
              className="font-sans font-medium text-ink tracking-[-0.02em] mb-10"
              style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}
            >
              Add your review
            </h2>
          </FadeIn>

          <FadeIn delay={60}>
            <form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-5">

              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs tracking-[0.1em] uppercase" style={{ color: 'rgba(255,255,252,0.35)' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="bg-transparent border rounded-lg px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/20 outline-none focus:border-ink/40 transition-colors"
                  style={{ borderColor: 'rgba(255,255,252,0.12)' }}
                />
              </div>

              {/* Service */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs tracking-[0.1em] uppercase" style={{ color: 'rgba(255,255,252,0.35)' }}>
                  Service
                </label>
                <select
                  value={service}
                  onChange={e => setService(e.target.value)}
                  className="bg-[#111] border rounded-lg px-4 py-3 font-sans text-sm text-ink outline-none focus:border-ink/40 transition-colors appearance-none cursor-pointer"
                  style={{ borderColor: 'rgba(255,255,252,0.12)' }}
                >
                  {SERVICES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Company (optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="font-sans text-xs tracking-[0.1em] uppercase" style={{ color: 'rgba(255,255,252,0.35)' }}>
                  Company <span style={{ color: 'rgba(255,255,252,0.2)' }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Your company or studio"
                  className="bg-transparent border rounded-lg px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/20 outline-none focus:border-ink/40 transition-colors"
                  style={{ borderColor: 'rgba(255,255,252,0.12)' }}
                />
              </div>

              {/* Review text + char counter */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-sans text-xs tracking-[0.1em] uppercase" style={{ color: 'rgba(255,255,252,0.35)' }}>
                    Review
                  </label>
                  <span
                    className="font-mono text-xs tabular-nums"
                    style={{ color: text.length >= 120 ? '#a10702' : 'rgba(255,255,252,0.25)' }}
                  >
                    {text.length}/120
                  </span>
                </div>
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value.slice(0, 120))}
                  required
                  placeholder="Tell us about your experience..."
                  rows={4}
                  className="bg-transparent border rounded-lg px-4 py-3 font-sans text-sm text-ink placeholder:text-ink/20 outline-none focus:border-ink/40 transition-colors resize-none"
                  style={{ borderColor: 'rgba(255,255,252,0.12)' }}
                />
              </div>

              {/* Submit */}
              <div className="flex items-center gap-5 mt-2">
                <button
                  type="submit"
                  disabled={submitting}
                  className="font-sans text-xs tracking-[0.15em] uppercase bg-ink text-bg px-6 py-3 rounded-full hover:opacity-70 transition-opacity disabled:opacity-40"
                >
                  {submitting ? 'Submitting...' : 'Submit review'}
                </button>
                {submitted && (
                  <span className="font-sans text-xs" style={{ color: 'rgba(255,255,252,0.4)' }}>
                    Review submitted.
                  </span>
                )}
              </div>

            </form>
          </FadeIn>

        </div>
      </div>
    </main>
  )
}
