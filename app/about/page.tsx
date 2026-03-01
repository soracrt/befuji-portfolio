import type { Metadata } from 'next'
import Nav from '@/components/Nav'
import { Timeline } from '@/components/ui/timeline'

export const metadata: Metadata = {
  title: 'About — Befuji',
  description: 'Motion designer working with brands, labels, and startups.',
}

const timelineData = [
  {
    title: '2018',
    content: (
      <div className="pb-2">
        <p className="font-sans text-sm font-medium mb-2" style={{ color: '#fffffc' }}>
          The Start
        </p>
        <p className="font-sans text-sm leading-[1.85]" style={{ color: 'rgba(255,255,252,0.45)' }}>
          began editing on mobile using CapCut, making anime edits.
        </p>
      </div>
    ),
  },
  {
    title: '2019',
    content: (
      <div className="pb-2">
        <p className="font-sans text-sm font-medium mb-2" style={{ color: '#fffffc' }}>
          First Steps into Motion
        </p>
        <p className="font-sans text-sm leading-[1.85]" style={{ color: 'rgba(255,255,252,0.45)' }}>
          moved to Light Motion, started learning camera movements.
        </p>
      </div>
    ),
  },
  {
    title: '2020',
    content: (
      <div className="pb-2">
        <p className="font-sans text-sm font-medium mb-2" style={{ color: '#fffffc' }}>
          First Laptop, First After Effects
        </p>
        <p className="font-sans text-sm leading-[1.85]" style={{ color: 'rgba(255,255,252,0.45)' }}>
          got a proper setup, jumped into AE, spent the next 5 years deep in AMVs.
        </p>
      </div>
    ),
  },
  {
    title: '2025',
    content: (
      <div className="pb-2">
        <p className="font-sans text-sm font-medium mb-2" style={{ color: '#fffffc' }}>
          Motion Graphics
        </p>
        <p className="font-sans text-sm leading-[1.85]" style={{ color: 'rgba(255,255,252,0.45)' }}>
          shifted focus to motion graphics, learned more in one year than the previous seven combined.
        </p>
      </div>
    ),
  },
  {
    title: 'September 2025',
    content: (
      <div className="pb-2">
        <p className="font-sans text-sm font-medium mb-2" style={{ color: '#fffffc' }}>
          Sora CRT
        </p>
        <p className="font-sans text-sm leading-[1.85]" style={{ color: 'rgba(255,255,252,0.45)' }}>
          launched Sora CRT, started working with music artists worldwide.
        </p>
      </div>
    ),
  },
  {
    title: 'December 2025',
    content: (
      <div className="pb-2">
        <p className="font-sans text-sm font-medium mb-2" style={{ color: '#fffffc' }}>
          The Business Side
        </p>
        <p className="font-sans text-sm leading-[1.85]" style={{ color: 'rgba(255,255,252,0.45)' }}>
          pivoted into motion graphics for SaaS and startups.
        </p>
      </div>
    ),
  },
  {
    title: '2026',
    content: (
      <div className="pb-2">
        <p className="font-sans text-sm font-medium mb-2" style={{ color: '#fffffc' }}>
          Now
        </p>
        <p className="font-sans text-sm leading-[1.85]" style={{ color: 'rgba(255,255,252,0.45)' }}>
          befuji. motion design for brands that refuse to blend in.
        </p>
      </div>
    ),
  },
]

export default function AboutPage() {
  return (
    <main>
      <Nav />

      {/* Page heading */}
      <div className="pt-32 pb-4 px-8">
        <div className="max-w-3xl mx-auto mb-16">
          <p
            className="font-sans text-[10px] tracking-[0.2em] uppercase mb-4"
            style={{ color: 'rgba(255,255,252,0.3)' }}
          >
            origin story
          </p>
          <h1
            className="font-sans font-medium text-ink tracking-[-0.025em]"
            style={{ fontSize: 'clamp(2.75rem, 6vw, 4.5rem)' }}
          >
            the journey.
          </h1>
          <p
            className="font-sans text-sm mt-4"
            style={{ color: 'rgba(255,255,252,0.3)' }}
          >
            seven years in the making.
          </p>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-8">
        <Timeline data={timelineData} />
      </div>

      {/* Skills section — placeholder for later */}
      <div className="px-8 pb-32">
        <div className="max-w-3xl mx-auto" />
      </div>
    </main>
  )
}
