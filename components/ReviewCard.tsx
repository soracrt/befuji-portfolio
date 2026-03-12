import { GlowCard } from './ui/spotlight-card'

type Review = {
  id: string
  name: string
  service: string
  company?: string
  text: string
  rating?: number
}

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <GlowCard customSize glowColor="red" className="w-full h-[200px] flex flex-col p-5">
      {/* Top row: name left, service right */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="font-sans text-sm font-medium text-ink leading-tight">{review.name}</span>
        <span
          className="font-sans text-xs tracking-[0.12em] uppercase shrink-0"
          style={{ color: 'rgba(255,255,252,0.35)' }}
        >
          {review.service}
        </span>
      </div>

      {/* Stars */}
      {review.rating && (
        <div className="flex items-center gap-0.5 mb-3">
          {[1, 2, 3, 4, 5].map(star => (
            <svg key={star} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="none">
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
                fill={review.rating! >= star ? '#CF5C36' : 'rgba(255,255,252,0.1)'}
              />
            </svg>
          ))}
        </div>
      )}

      {/* Review text */}
      <p
        className="font-sans text-sm leading-[1.75] flex-1"
        style={{ color: 'rgba(255,255,252,0.65)' }}
      >
        {review.text}
      </p>

      {/* Company footer */}
      {review.company && (
        <p
          className="font-sans text-xs mt-auto pt-3"
          style={{ color: 'rgba(255,255,252,0.25)' }}
        >
          {review.company}
        </p>
      )}
    </GlowCard>
  )
}
