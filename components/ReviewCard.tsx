import { GlowCard } from './ui/spotlight-card'

type Review = {
  id: string
  name: string
  service: string
  company?: string
  text: string
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
