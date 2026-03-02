import { cn } from '@/lib/utils'
import {
  IconBolt,
  IconWaveSine,
  IconFeather,
  IconPalette,
} from '@tabler/icons-react'
import FadeIn from './FadeIn'

const features = [
  {
    title: 'Fast Turnaround',
    tagline: 'Delivered before you expected it.',
    description: 'High-quality motion without the wait. Most projects done within 24–48 hours.',
    icon: <IconBolt size={22} />,
  },
  {
    title: 'Sound Design',
    tagline: 'Every frame has a pulse.',
    description: 'Audio mixed and timed to the motion. Not an afterthought.',
    icon: <IconWaveSine size={22} />,
  },
  {
    title: 'Fluid Motion',
    tagline: 'Smooth by design.',
    description: 'Intentional easing and timing that makes every transition feel effortless.',
    icon: <IconFeather size={22} />,
  },
  {
    title: 'Brand-Tailored Visuals',
    tagline: 'Your brand, in motion.',
    description: 'Colors, type, and style built from scratch. No templates, no shortcuts.',
    icon: <IconPalette size={22} />,
  },
]

function Feature({
  title,
  tagline,
  description,
  icon,
  index,
}: {
  title: string
  tagline: string
  description: string
  icon: React.ReactNode
  index: number
}) {
  return (
    <div
      className={cn(
        'flex flex-col py-10 relative group/feature border-r',
        index === 0 && 'border-l',
        index < 4 && 'border-b lg:border-b-0',
      )}
      style={{ borderColor: '#1a1a1a' }}
    >
      {/* Hover gradient */}
      <div
        className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 w-full h-full pointer-events-none"
        style={{ background: 'linear-gradient(to top, #111111, transparent)' }}
      />

      {/* Icon */}
      <div
        className="mb-5 relative z-10 px-8"
        style={{ color: 'rgba(255,255,252,0.35)' }}
      >
        {icon}
      </div>

      {/* Title with accent bar */}
      <div className="font-sans font-semibold text-base mb-1.5 relative z-10 px-8">
        <div
          className="absolute left-0 inset-y-0 h-5 group-hover/feature:h-7 w-[3px] rounded-tr-full rounded-br-full transition-all duration-200 origin-center"
          style={{ backgroundColor: 'rgba(255,255,252,0.15)' }}
        />
        <span
          className="group-hover/feature:translate-x-1.5 transition duration-200 inline-block text-ink"
          style={{ color: '#fffffc' }}
        >
          {title}
        </span>
      </div>

      {/* Tagline */}
      <p
        className="font-sans text-sm font-medium mb-2 relative z-10 px-8"
        style={{ color: 'rgba(255,255,252,0.55)' }}
      >
        {tagline}
      </p>

      {/* Description */}
      <p
        className="font-sans text-xs leading-relaxed relative z-10 px-8 max-w-[220px]"
        style={{ color: 'rgba(255,255,252,0.3)' }}
      >
        {description}
      </p>
    </div>
  )
}

export default function WhatIDo() {
  return (
    <section className="px-8 py-24">
      <div className="max-w-6xl mx-auto">

        <FadeIn>
          <h2
            className="font-sans font-medium text-ink tracking-[-0.02em] mb-12"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            What I do.
          </h2>
        </FadeIn>

        <FadeIn delay={100}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-b" style={{ borderColor: '#1a1a1a' }}>
            {features.map((f, i) => (
              <Feature key={f.title} {...f} index={i} />
            ))}
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
