'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import FadeIn from './FadeIn'
import ReviewCard from './ReviewCard'

type Review = {
  id: string
  name: string
  service: string
  company?: string
  text: string
  featured: boolean
}

export default function ReviewsSection() {
  const [featured, setFeatured] = useState<Review[]>([])

  useEffect(() => {
    fetch('/api/reviews')
      .then(r => r.json())
      .then((data: Review[]) => {
        if (Array.isArray(data)) {
          setFeatured(data.filter(r => r.featured).slice(0, 3))
        }
      })
      .catch(() => {})
  }, [])

  if (featured.length === 0) return null

  return (
    <section className="px-8 py-24">
      <div className="max-w-6xl mx-auto">

        <FadeIn>
          <h2
            className="font-sans font-medium text-ink tracking-[-0.02em] mb-14"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Reviews
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {featured.map((review, i) => (
            <FadeIn key={review.id} delay={i * 80}>
              <ReviewCard review={review} />
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={160}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/reviews"
              className="font-sans text-xs tracking-[0.15em] uppercase text-ink border-b border-ink pb-0.5 link-glow-red"
            >
              View all reviews →
            </Link>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
