'use client'

import { useState, useEffect, useRef } from 'react'

type StatsData = { views: number; likes: number; artists: number }

const BLOCKS: { key: keyof StatsData; label: string }[] = [
  { key: 'artists', label: 'Artists & Brands'   },
  { key: 'views',   label: 'Total Views'        },
  { key: 'likes',   label: 'Total Likes'        },
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
      // ease-out cubic
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
  label,
  target,
  delay,
  started,
}: {
  label: string
  target: number
  delay: number
  started: boolean
}) {
  const count = useCountUp(target, 1400 + delay, started)

  return (
    <div className="flex flex-col gap-3 items-center text-center">
      {/* Label — Inter bold, full white */}
      <span
        className="font-display font-bold text-[11px] tracking-[0.22em] uppercase"
        style={{ color: '#EEE5E9' }}
      >
        {label}
      </span>

      {/* Number */}
      <span
        className="font-display leading-none"
        style={{
          fontSize:      'clamp(2.2rem, 9vw, 5.5rem)',
          color:         '#CF5C36',
          fontWeight:    400,
          letterSpacing: '-0.04em',
        }}
      >
        {formatNum(count)}
      </span>
    </div>
  )
}

export default function StatsBar() {
  const [stats, setStats]   = useState<StatsData>({ views: 2500000, likes: 397000, artists: 17 })
  const [started, setStarted] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/admin/stats', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Partial<StatsData>) => setStats(s => ({ ...s, ...data })))
      .catch(() => {})
  }, [])

  // Trigger count-up when section scrolls into view
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
          {BLOCKS.map(({ key, label }, i) => (
            <StatBlock
              key={key}
              label={label}
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
