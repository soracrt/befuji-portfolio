'use client'

import { useState, useEffect, useRef } from 'react'

type StatsData = {
  clientLoyalty: number
  projectMastery: number
  marketReach: number
}

const BLOCKS: { key: keyof StatsData; headline: string; suffix: string; subtitle: string }[] = [
  { key: 'clientLoyalty',   headline: 'Client Loyalty',   suffix: '%', subtitle: 'Recurring Partners'      },
  { key: 'projectMastery',  headline: 'Project Mastery',  suffix: '+', subtitle: 'Deliverables Completed'  },
  { key: 'marketReach',     headline: 'Market Reach',     suffix: '',  subtitle: 'Monthly Impact'           },
]

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!started || target === 0) return
    let startTime: number | null = null
    let raf: number

    function step(ts: number) {
      if (!startTime) startTime = ts
      const progress = Math.min((ts - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.round(eased * target))
      if (progress < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, started])

  return count
}

function formatNum(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(0) + 'K'
  return n.toString()
}

function StatBlock({
  headline,
  suffix,
  subtitle,
  target,
  delay,
  started,
}: {
  headline: string
  suffix: string
  subtitle: string
  target: number
  delay: number
  started: boolean
}) {
  const count = useCountUp(target, 1400 + delay, started)

  return (
    <div className="flex flex-col items-center text-center gap-4">
      {/* Headline — white, bold, larger */}
      <span
        className="font-display font-bold text-lg tracking-[0.12em] uppercase"
        style={{ color: '#FFFFFF' }}
      >
        {headline}
      </span>

      {/* Stat */}
      <span
        className="font-display leading-none"
        style={{
          fontSize:      'clamp(2.2rem, 9vw, 5.5rem)',
          color:         '#CF5C36',
          fontWeight:    400,
          letterSpacing: '-0.04em',
        }}
      >
        {formatNum(count)}{suffix}
      </span>

      {/* Subtitle — muted, smaller */}
      <span
        className="font-display font-medium text-xs tracking-[0.14em] uppercase"
        style={{ color: 'rgba(238,229,233,0.4)' }}
      >
        {subtitle}
      </span>
    </div>
  )
}

export default function StatsBar() {
  const [stats, setStats] = useState<StatsData>({ clientLoyalty: 85, projectMastery: 150, marketReach: 5900000 })
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/stats', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Partial<StatsData>) => setStats(s => ({ ...s, ...data })))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="px-4 sm:px-8 pb-16 sm:pb-24">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {BLOCKS.map(({ key, headline, suffix, subtitle }, i) => (
            <StatBlock
              key={key}
              headline={headline}
              suffix={suffix}
              subtitle={subtitle}
              target={stats[key]}
              delay={i * 200}
              started={started}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
