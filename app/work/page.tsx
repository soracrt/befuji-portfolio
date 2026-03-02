'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Nav from '@/components/Nav'
import FadeIn from '@/components/FadeIn'

type Project = {
  id: string
  title: string
  category: string | null
  video: string
}


// Tracks the currently unmuted card so we can mute it when another is unmuted
let activeUnmute: { mute: () => void } | null = null

function fmt(t: number) {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

function VideoCard({ project }: { project: Project }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const fillRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)
  const rafRef = useRef(0)
  const [playing, setPlaying] = useState(true)
  const [muted, setMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration] = useState('0:00')

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.src = project.video
          video.load()
          observer.disconnect()
        }
      },
      { rootMargin: '50px' }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [project.video])

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    if (v.paused) { v.play() } else { v.pause() }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const v = videoRef.current
    if (!v) return
    if (v.muted) {
      // Unmuting — silence whoever was active before
      if (activeUnmute) activeUnmute.mute()
      v.muted = false
      v.volume = 0.5
      setMuted(false)
      activeUnmute = {
        mute: () => { if (videoRef.current) videoRef.current.muted = true; setMuted(true) },
      }
    } else {
      v.muted = true
      setMuted(true)
      activeUnmute = null
    }
  }

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleTimeUpdate = () => {
    if (draggingRef.current) return
    const v = videoRef.current
    if (!v || !v.duration) return
    setProgress((v.currentTime / v.duration) * 100)
    setCurrentTime(fmt(v.currentTime))
  }

  const handleLoadedMetadata = () => {
    const v = videoRef.current
    if (!v) return
    setDuration(fmt(v.duration))
  }

  const seekToX = useCallback((clientX: number) => {
    const v = videoRef.current
    const bar = progressBarRef.current
    if (!v || !bar || !v.duration) return
    const rect = bar.getBoundingClientRect()
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    // Directly mutate DOM — no React re-render during drag
    if (fillRef.current) fillRef.current.style.width = `${pct * 100}%`
    setCurrentTime(fmt(pct * v.duration))
    // Throttle actual seek to one per animation frame
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (!videoRef.current) return
      videoRef.current.currentTime = pct * videoRef.current.duration
      if (glowRef.current) glowRef.current.currentTime = videoRef.current.currentTime
    })
  }, [])

  // Register drag listeners once
  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (draggingRef.current) seekToX(e.clientX) }
    const onUp = () => {
      if (!draggingRef.current) return
      draggingRef.current = false
      const v = videoRef.current
      if (v?.duration) setProgress((v.currentTime / v.duration) * 100)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
    }
  }, [seekToX])

  return (
    <div>
      <div className="relative">
        <div ref={containerRef} className="relative rounded-2xl overflow-hidden bg-[#111] group" style={{ boxShadow: '0 8px 48px rgba(0,0,0,0.7)' }}>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            autoPlay
            muted
            loop
            playsInline
            preload="none"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Controls overlay — hidden until hover */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pt-8 pb-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {/* Progress bar */}
            <div
              ref={progressBarRef}
              className="w-full h-[4px] bg-white/20 rounded-full mb-3 cursor-pointer relative"
              onMouseDown={(e) => { e.stopPropagation(); draggingRef.current = true; seekToX(e.clientX) }}
            >
              <div
                ref={fillRef}
                className="h-full bg-white/80 rounded-full relative"
                style={{ width: `${progress}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-md" />
              </div>
            </div>

            {/* Button row */}
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="text-white/70 hover:text-white transition-colors"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="5" y="4" width="4" height="16" rx="1" />
                    <rect x="15" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                )}
              </button>

              {/* Mute / Unmute */}
              <button
                onClick={toggleMute}
                className="text-white/70 hover:text-white transition-colors"
                aria-label={muted ? 'Unmute' : 'Mute'}
              >
                {muted ? (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                )}
              </button>

              {/* Time */}
              <span className="ml-auto font-mono text-[11px] text-white/40 tabular-nums">
                {currentTime} / {duration}
              </span>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-white/70 hover:text-white transition-colors"
                aria-label="Fullscreen"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </button>
            </div>
          </div>
        </div>
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

const CATEGORIES = ['All', 'Ads', 'SaaS', 'Others']

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then((data: Project[]) => { setProjects(data) })
      .catch(() => {})
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

          {/* Heading row — title left, categories centered */}
          <FadeIn>
            <div className="relative flex items-center mb-12">
              <h1
                className="font-sans font-medium text-ink tracking-[-0.025em]"
                style={{ fontSize: 'clamp(3rem, 7vw, 6rem)', textShadow: '0 0 48px rgba(255,255,255,0.25)' }}
              >
                Projects
              </h1>

              {/* Category pills — pinned to center of the row */}
              <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                {CATEGORIES.map(cat => {
                  const active = activeCategory === cat
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className="font-sans text-xs tracking-[0.12em] uppercase px-4 py-1.5 rounded-full border transition-all duration-500 ease-in-out"
                      style={{
                        borderColor: active ? '#a10702' : 'rgba(255,255,252,0.15)',
                        color: active ? '#fffffc' : 'rgba(255,255,252,0.45)',
                        background: active ? '#a10702' : 'rgba(255,255,252,0)',
                      }}
                    >
                      {cat}
                    </button>
                  )
                })}
              </div>
            </div>
          </FadeIn>

          {/* Video grid — 2 columns. All cards stay mounted; category switch is a CSS toggle. */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
            {projects.map((project, i) => {
              const visible =
                activeCategory === 'All' ||
                (activeCategory === 'Others'
                  ? !['ads', 'saas'].includes((project.category ?? '').toLowerCase())
                  : (project.category ?? '').toLowerCase() === activeCategory.toLowerCase())
              return (
                <div key={project.id} style={{ display: visible ? '' : 'none' }}>
                  <FadeIn delay={i * 60}>
                    <VideoCard project={project} />
                  </FadeIn>
                </div>
              )
            })}
          </div>

        </div>
      </div>
    </main>
  )
}
