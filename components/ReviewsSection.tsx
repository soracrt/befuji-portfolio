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

export default function ReviewsSection({ reviews }: { reviews: Review[] }) {
  const top3 = reviews.slice(0, 3)

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

        {top3.length === 0 ? (
          <FadeIn>
            <p
              className="font-sans"
              style={{ fontSize: '1rem', color: 'rgba(255,255,252,0.25)', letterSpacing: '-0.01em' }}
            >
              No reviews at the moment — check back soon.
            </p>
          </FadeIn>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {top3.map((review, i) => (
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
          </>
        )}

      </div>
    </section>
  )
}
