import { cn } from '@/lib/utils'
import {
  IconFeather,
  IconMovie,
  IconDeviceLaptop,
  IconLayout,
} from '@tabler/icons-react'

const features = [
  {
    title: 'Motion Design — for Artists',
    tagline: 'Your vision, animated.',
    description: 'Music videos, lyric videos, and visual content built around your sound.',
    icon: <IconFeather size={20} />,
  },
  {
    title: 'Motion Design — for Brands',
    tagline: 'Movement that sells.',
    description: 'Product ads, SaaS demos, and launch content that actually converts.',
    icon: <IconMovie size={20} />,
  },
  {
    title: 'Web Development — for Businesses',
    tagline: 'Clean, fast, intentional.',
    description: 'Minimal sites built with precision, performant and visually sharp.',
    icon: <IconDeviceLaptop size={20} />,
  },
  {
    title: 'Web Development — for SaaS',
    tagline: 'Interfaces that just work.',
    description: 'Fast, scalable web apps built for products that need to grow.',
    icon: <IconLayout size={20} />,
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
        (index === 0 || index === 2) && 'border-l',
        index < 2 && 'border-b',
      )}
      style={{ borderColor: '#1a1a1a' }}
    >
      {/* Hover gradient */}
      <div
        className="opacity-0 group-hover/feature:opacity-100 transition duration-300 absolute inset-0 w-full h-full pointer-events-none"
        style={{ background: 'linear-gradient(to top, rgba(207,92,54,0.06), transparent)' }}
      />

      {/* Icon */}
      <div
        className="mb-5 relative z-10 px-8"
        style={{ color: 'rgba(238,229,233,0.3)' }}
      >
        {icon}
      </div>

      {/* Title with accent bar */}
      <div className="font-sans font-semibold text-sm mb-1.5 relative z-10 px-8">
        <div
          className="absolute left-0 inset-y-0 h-5 group-hover/feature:h-7 w-[3px] rounded-tr-full rounded-br-full transition-all duration-200 origin-center"
          style={{
            background: 'linear-gradient(to bottom, transparent, #CF5C36, transparent)',
            opacity: 0.6,
          }}
        />
        <span
          className="group-hover/feature:translate-x-1.5 transition duration-200 inline-block"
          style={{ color: '#EEE5E9' }}
        >
          {title}
        </span>
      </div>

      {/* Tagline */}
      <p
        className="font-sans text-xs font-medium mb-1.5 relative z-10 px-8"
        style={{ color: 'rgba(238,229,233,0.45)' }}
      >
        {tagline}
      </p>

      {/* Description */}
      <p
        className="font-sans text-xs leading-relaxed relative z-10 px-8 max-w-[200px]"
        style={{ color: 'rgba(238,229,233,0.25)' }}
      >
        {description}
      </p>
    </div>
  )
}

export default function WhatIDo() {
  return (
    <section className="px-8 pb-24">
      <div className="max-w-5xl mx-auto border-t border-b" style={{ borderColor: '#1a1a1a' }}>
        <div className="grid grid-cols-2">
          {features.map((f, i) => (
            <Feature key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
