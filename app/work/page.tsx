'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import FadeIn from '@/components/FadeIn'

type Project = {
  id: string
  title: string
  category: string | null
  video: string
}

function VideoCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [unmuted, setUnmuted] = useState(false)

  const handleVideoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (videoRef.current && !unmuted) {
      videoRef.current.muted = false
      videoRef.current.play()
      setUnmuted(true)
    }
  }

  return (
    <div>
      {/* Video area — click to unmute */}
      <div
        className="rounded-2xl overflow-hidden bg-[#111] cursor-pointer"
        onClick={handleVideoClick}
      >
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={project.video}
            autoPlay
            muted
            loop
            playsInline
            controls={unmuted}
          />
          {/* Muted indicator */}
          {!unmuted && (
            <div className="absolute bottom-3 right-3 pointer-events-none">
              <div className="bg-black/40 backdrop-blur-sm rounded-full p-2">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                  <line x1="23" y1="9" x2="17" y2="15" />
                  <line x1="17" y1="9" x2="23" y2="15" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Title + category */}
      <div className="mt-3 px-0.5 flex items-baseline justify-between gap-3">
        <span className="font-sans text-sm text-ink capitalize">{project.title}</span>
        {project.category && (
          <span className="font-sans text-xs tracking-[0.12em] uppercase text-ink/40 shrink-0">
            {project.category}
          </span>
        )}
      </div>
    </div>
  )
}

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load projects')
        return res.json()
      })
      .then((data) => {
        setProjects(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  return (
    <main>
      <Nav />

      <div className="pt-32 pb-24 px-8">
        <div className="max-w-6xl mx-auto">

          {/* Back arrow */}
          <FadeIn>
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.12em] uppercase text-ink/50 hover:text-ink transition-colors duration-200 mb-10"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              back
            </Link>
          </FadeIn>

          {/* Heading */}
          <FadeIn>
            <h1
              className="font-sans font-medium text-ink tracking-[-0.025em] mb-12 text-center"
              style={{ fontSize: 'clamp(3rem, 7vw, 6rem)' }}
            >
              Projects
            </h1>
          </FadeIn>

          {/* Video grid — 2 columns */}
          {loading && (
            <p className="font-sans text-sm text-ink/40 text-center">Loading…</p>
          )}
          {error && (
            <p className="font-sans text-sm text-red-400 text-center">{error}</p>
          )}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
              {projects.map((project, i) => (
                <FadeIn key={project.id} delay={i * 60}>
                  <VideoCard project={project} />
                </FadeIn>
              ))}
            </div>
          )}

        </div>
      </div>
    </main>
  )
}
