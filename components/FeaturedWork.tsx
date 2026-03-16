'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import FadeIn from './FadeIn'

type Project = {
  id: string
  title: string
  category: string
  client: string
  video: string
  isRecent: boolean
}

function WorkCard({ project, index }: { project: Project; index: number }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.src = project.video
    video.load()
  }, [project.video])

  const subtitle = project.client || project.category || ''

  return (
    <FadeIn delay={index * 100}>
      {/*
        Border radius rule: outer = inner + padding
        Inner video: rounded-xl (12px), padding: p-3 (12px) → outer: rounded-[24px]
      */}
      <Link
        href="/work"
        className="group block transition-transform duration-500 ease-out hover:scale-[1.02]"
        style={{
          background:   '#0a0a0a',
          border:       '1px solid rgba(238,229,233,0.06)',
          borderRadius: '24px',
          padding:      '12px',
        }}
      >
        {/* Video thumbnail */}
        <div
          className="relative w-full overflow-hidden"
          style={{ borderRadius: '12px', paddingBottom: '56.25%' }}
        >
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          />
        </div>

        {/* Card content */}
        <div className="flex items-end justify-between mt-3 px-1 pb-1">
          <div className="flex flex-col gap-0.5">
            <span
              className="font-sans font-medium capitalize"
              style={{ fontSize: '15px', color: '#EEE5E9', letterSpacing: '-0.01em' }}
            >
              {project.title}
            </span>
            {subtitle && (
              <span
                className="font-sans text-xs"
                style={{ color: 'rgba(238,229,233,0.35)', letterSpacing: '0.02em' }}
              >
                {subtitle}
              </span>
            )}
          </div>

          {/* Arrow */}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 group-hover:scale-110"
            style={{
              background: 'rgba(207,92,54,0.1)',
              color: '#CF5C36',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </div>
        </div>
      </Link>
    </FadeIn>
  )
}

export default function FeaturedWork() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    // Always fetch fresh — sessionStorage can hold stale isRecent values
    // if the admin toggled a project since the last visit.
    fetch('/api/projects', { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Project[]) => {
        if (Array.isArray(data)) {
          setProjects(data.filter(p => p.isRecent === true).slice(0, 3))
        }
      })
      .catch(() => {})
  }, [])

  if (projects.length === 0) return null

  return (
    <section className="px-4 sm:px-8 pb-12 sm:pb-24">
      <div className="max-w-5xl mx-auto">

        {/* Section label */}
        <FadeIn>
          <div className="flex items-center justify-between mb-10">
            <span
              className="font-display font-bold tracking-[-0.02em]"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: '#EEE5E9' }}
            >
              Featured Work
            </span>
            <Link
              href="/work"
              className="font-sans text-xs tracking-[0.12em] uppercase transition-colors duration-200"
              style={{ color: 'rgba(238,229,233,0.4)' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#CF5C36')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(238,229,233,0.4)')}
            >
              View all →
            </Link>
          </div>
        </FadeIn>

        {/* Cards */}
        <div className="flex flex-col gap-5">
          {projects.map((project, i) => (
            <WorkCard key={project.id} project={project} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}
