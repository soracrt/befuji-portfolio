'use client'

import { useState } from 'react'
import FadeIn from './FadeIn'

const FILTERS = ['ALL', 'ADS', 'SAAS', 'MUSIC'] as const
type Filter = typeof FILTERS[number]

const projects = [
  {
    name: 'Aether',
    filter: 'ADS' as Filter,
    displayCategory: 'Brand Campaign',
    description: 'A full-scale motion campaign for a consumer brand entering new markets. Identity in movement.',
    placeholderBg: '#0A0A0A',
  },
  {
    name: 'Flux',
    filter: 'SAAS' as Filter,
    displayCategory: 'SaaS Film',
    description: 'Product storytelling for a B2B platform — clarity over complexity, silence over noise.',
    placeholderBg: '#1A1A1A',
  },
  {
    name: 'Solstice',
    filter: 'MUSIC' as Filter,
    displayCategory: 'Artist Content',
    description: 'Visual identity in motion for an emerging musical artist. Colour, rhythm, restraint.',
    placeholderBg: '#2C2C2C',
  },
  {
    name: 'Meridian',
    filter: 'ADS' as Filter,
    displayCategory: 'Motion Design',
    description: 'An abstract motion series exploring form, light, and the tension between stillness and speed.',
    placeholderBg: '#141414',
  },
  {
    name: 'Cascade',
    filter: 'SAAS' as Filter,
    displayCategory: 'Video Edit',
    description: 'Documentary-style edit for a short film. Pacing and silence as primary tools.',
    placeholderBg: '#222222',
  },
  {
    name: 'Prism',
    filter: 'MUSIC' as Filter,
    displayCategory: 'Creative Direction',
    description: "End-to-end creative direction for a fashion label's seasonal campaign — concept to delivery.",
    placeholderBg: '#383838',
  },
]

export default function Work() {
  const [activeFilter, setActiveFilter] = useState<Filter>('ALL')

  const filtered =
    activeFilter === 'ALL' ? projects : projects.filter((p) => p.filter === activeFilter)

  return (
    <section id="work" className="px-8 py-24">
      <div className="max-w-6xl mx-auto">

        {/* Header + filter tabs */}
        <FadeIn>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-14">
            <h2
              className="font-serif text-white tracking-[-0.02em]"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              Work
            </h2>
            <div className="flex items-center gap-7">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className="font-sans text-xs tracking-[0.14em] uppercase pb-1 transition-all duration-200"
                  style={{
                    color: '#F5F5F0',
                    opacity: activeFilter === f ? 1 : 0.28,
                    borderBottom: activeFilter === f ? '1px solid #F5F5F0' : '1px solid transparent',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-divider border border-divider">
          {filtered.map((project, i) => (
            <FadeIn
              key={`${project.name}-${activeFilter}`}
              delay={i * 55}
              className="bg-[#141414]"
            >
              <div className="group cursor-pointer bg-[#141414] h-full">
                <div
                  className="relative w-full overflow-hidden"
                  style={{ aspectRatio: '16 / 10', backgroundColor: project.placeholderBg }}
                >
                  <div
                    className="absolute inset-0 flex items-center justify-center px-7 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
                    style={{ backgroundColor: 'rgba(10,10,10,0.93)' }}
                  >
                    <p
                      className="font-sans text-sm leading-relaxed text-center"
                      style={{ color: 'rgba(245,245,240,0.75)' }}
                    >
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-4 border-t border-divider">
                  <h3 className="font-serif text-xl text-white tracking-tight leading-tight">
                    {project.name}
                  </h3>
                  <span
                    className="font-sans text-[0.65rem] tracking-[0.14em] uppercase mt-1.5 inline-block"
                    style={{ color: 'rgba(245,245,240,0.38)' }}
                  >
                    {project.displayCategory}
                  </span>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
