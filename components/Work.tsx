'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import FadeIn from './FadeIn'

type Project = {
  id: string
  title: string
  category: string
  client: string
  video: string
  isRecent: boolean
  isFeatured: boolean
}

export default function Work() {
  const [featured, setFeatured] = useState<Project[]>([])

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then((data: Project[]) => {
        if (Array.isArray(data)) {
          setFeatured(data.filter(p => p.isFeatured))
        }
      })
      .catch(() => {})
  }, [])

  return (
    <section id="work" className="px-8 py-24" style={{ scrollMarginTop: '250px' }}>
      <div className="max-w-4xl mx-auto">

        {/* Heading */}
        <FadeIn>
          <h2
            className="font-sans font-medium text-ink tracking-[-0.02em] mb-14"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Recent Projects
          </h2>
        </FadeIn>

        {/* Featured videos */}
        {featured.length > 0 && (
          <div className="flex flex-col gap-6">
            {featured.map((project, i) => (
              <FadeIn key={project.id} delay={i * 80}>
                <div className="w-full rounded-2xl overflow-hidden bg-[#111]">
                  <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <video
                      className="absolute inset-0 w-full h-full object-cover"
                      src={project.video}
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  </div>
                </div>
                <div className="mt-3 px-0.5 flex items-baseline justify-between gap-3">
                  <span className="font-sans text-sm text-ink capitalize">{project.title}</span>
                  {project.category && (
                    <span className="font-sans text-xs tracking-[0.12em] uppercase text-ink/40 shrink-0">
                      {project.category}
                    </span>
                  )}
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {/* Fallback while loading / if no featured projects configured */}
        {featured.length === 0 && (
          <FadeIn delay={80}>
            <div className="w-full rounded-2xl overflow-hidden bg-[#111]">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/NSX.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            </div>
          </FadeIn>
        )}

        {/* See more link */}
        <FadeIn delay={160}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/work"
              className="font-sans text-xs tracking-[0.15em] uppercase text-ink border-b border-ink pb-0.5 hover:opacity-40 transition-opacity duration-200"
            >
              View More →
            </Link>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
