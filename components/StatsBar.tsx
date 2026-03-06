'use client'

import { useState, useEffect } from 'react'
import FadeIn from './FadeIn'

type StatsData = { projects: number; members: number; brands: number }

const BLOCKS: { key: keyof StatsData; label: string }[] = [
  { key: 'projects', label: 'Projects Delivered' },
  { key: 'members',  label: 'Community Members' },
  { key: 'brands',   label: 'Brands Worked With' },
]

function formatNum(n: number): string {
  return n.toLocaleString('en-US')
}

export default function StatsBar() {
  const [stats, setStats] = useState<StatsData>({ projects: 25, members: 2600, brands: 4 })

  useEffect(() => {
    fetch('/api/admin/stats', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Partial<StatsData>) => {
        setStats(s => ({ ...s, ...data }))
      })
      .catch(() => {})
  }, [])

  return (
    <div className="px-8 pb-28">
      <div className="max-w-5xl mx-auto">
        <FadeIn delay={100}>
          <div className="grid grid-cols-3 gap-8">
            {BLOCKS.map(({ key, label }, i) => (
              <div key={key} className="flex flex-col gap-2">
                {/* Label */}
                <span
                  className="font-sans font-extrabold text-[11px] tracking-[0.24em] uppercase"
                  style={{ color: 'rgba(238,229,233,0.35)' }}
                >
                  {label}
                </span>

                {/* Number */}
                <FadeIn delay={i * 80}>
                  <span
                    className="font-display leading-none"
                    style={{
                      fontSize:     'clamp(3rem, 6vw, 5.5rem)',
                      color:        '#CF5C36',
                      fontWeight:   400,
                      letterSpacing: '-0.04em',
                    }}
                  >
                    {formatNum(stats[key])}
                  </span>
                </FadeIn>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  )
}
