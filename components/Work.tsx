'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import FadeIn from './FadeIn'

function LazyVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const glowRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.src = src
          video.load()
          if (glowRef.current) {
            glowRef.current.src = src
            glowRef.current.load()
          }
          observer.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [src])

  return (
    <div className="relative">
      <video
        ref={glowRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-2xl"
        style={{ filter: 'blur(32px)', opacity: 0.55, transform: 'scale(1.12)' }}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="w-full rounded-2xl overflow-hidden bg-[#111]">
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      </div>
    </div>
  )
}

type Project = {
  id: string
  title: string
  category: string
  client: string
  video: string
  isRecent: boolean
}

export default function Work() {
  const [featured, setFeatured] = useState<Project[]>([])

  useEffect(() => {
    const cached = sessionStorage.getItem('projects')
    if (cached) {
      const data = JSON.parse(cached)
      if (Array.isArray(data)) setFeatured(data.filter(p => p.isRecent))
      return
    }
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then((data: Project[]) => {
        if (Array.isArray(data)) {
          sessionStorage.setItem('projects', JSON.stringify(data))
          setFeatured(data.filter(p => p.isRecent))
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
                <LazyVideo src={project.video} />
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
            <LazyVideo src="/NSX.mp4" />
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
