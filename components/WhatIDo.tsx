import { cn } from '@/lib/utils'
import {
  IconBolt,
  IconWaveSine,
  IconFeather,
  IconPalette,
  IconMovie,
  IconDeviceLaptop,
} from '@tabler/icons-react'

const features = [
  {
    title: 'Motion Design',
    tagline: 'Frame-perfect movement.',
    description: 'Intentional easing and timing that makes every transition feel effortless.',
    icon: <IconFeather size={20} />,
  },
  {
    title: 'Brand Films',
    tagline: 'Your story in motion.',
    description: 'Cinematic visuals built from your identity — no templates, no shortcuts.',
    icon: <IconMovie size={20} />,
  },
  {
    title: 'SaaS Videos',
    tagline: 'Make the product feel alive.',
    description: 'Product explainers and demos that communicate value within seconds.',
    icon: <IconBolt size={20} />,
  },
  {
    title: 'Sound Design',
    tagline: 'Every frame has a pulse.',
    description: 'Audio mixed and timed to the motion. Not an afterthought.',
    icon: <IconWaveSine size={20} />,
  },
  {
    title: 'Web Development',
    tagline: 'Clean, fast, intentional.',
    description: 'Minimal sites built with precision — performant and visually sharp.',
    icon: <IconDeviceLaptop size={20} />,
  },
  {
    title: 'Creative Direction',
    tagline: 'The vision behind the work.',
    description: 'End-to-end creative strategy — from concept to final delivery.',
    icon: <IconPalette size={20} />,
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
        (index === 0 || index === 3) && 'border-l',
        index < 3 && 'border-b',
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
        <div className="grid grid-cols-2 md:grid-cols-3">
          {features.map((f, i) => (
            <Feature key={f.title} {...f} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
