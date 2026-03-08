'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'
import BackButton from '@/components/BackButton'

type Project = {
  id: string
  title: string
  category: string | null
  client: string
  video: string
}

let activeUnmute: { mute: () => void } | null = null

function fmt(t: number) {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// priority=true → load 500px before viewport (first 2 cards)
// priority=false → load 50px before viewport (rest)
function VideoCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const videoRef       = useRef<HTMLVideoElement>(null)
  const containerRef   = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const fillRef        = useRef<HTMLDivElement>(null)
  const draggingRef    = useRef(false)
  const rafRef         = useRef(0)
  const [playing, setPlaying]   = useState(true)
  const [muted, setMuted]       = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration]       = useState('0:00')
  const [loaded, setLoaded]           = useState(false)

  // Load src only when near viewport; pause/play based on visibility
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const loadMargin  = priority ? '500px' : '50px'
    const playMargin  = '0px'

    // Observer 1 — triggers src load when card is near viewport
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.src = project.video
          video.load()
          video.addEventListener('canplay', () => setLoaded(true), { once: true })
          loadObserver.disconnect()
        }
      },
      { rootMargin: loadMargin }
    )

    // Observer 2 — pauses when fully offscreen, plays when back
    const playObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: playMargin, threshold: 0.1 }
    )

    loadObserver.observe(video)
    playObserver.observe(video)
    return () => { loadObserver.disconnect(); playObserver.disconnect() }
  }, [project.video, priority])

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
      if (activeUnmute) activeUnmute.mute()
      v.muted = false
      v.volume = 0.5
      setMuted(false)
      activeUnmute = { mute: () => { if (videoRef.current) videoRef.current.muted = true; setMuted(true) } }
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
    if (!document.fullscreenElement) { el.requestFullscreen() }
    else { document.exitFullscreen() }
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
    const v   = videoRef.current
    const bar = progressBarRef.current
    if (!v || !bar || !v.duration) return
    const rect = bar.getBoundingClientRect()
    const pct  = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    if (fillRef.current) fillRef.current.style.width = `${pct * 100}%`
    setCurrentTime(fmt(pct * v.duration))
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (!videoRef.current) return
      videoRef.current.currentTime = pct * videoRef.current.duration
    })
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => { if (draggingRef.current) seekToX(e.clientX) }
    const onUp   = () => {
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
      <div ref={containerRef} className="relative rounded-2xl overflow-hidden bg-[#0a0a0a] group">

        {/* Skeleton shimmer — shown until video can play */}
        {!loaded && (
          <div
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(90deg, #0f0f0f 25%, #161616 50%, #0f0f0f 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.6s infinite',
            }}
          />
        )}

        {/* CSS glow — one element, no extra video stream */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{
            boxShadow:  'inset 0 0 0 1px rgba(238,229,233,0.04)',
            opacity:    loaded ? 1 : 0,
            transition: 'opacity 0.6s ease',
          }}
        />

        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover cursor-pointer"
            style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease' }}
            autoPlay muted loop playsInline preload="none"
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Controls */}
          <div className="absolute bottom-0 left-0 right-0 px-3 pt-8 pb-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div
              ref={progressBarRef}
              className="w-full h-[3px] bg-white/20 rounded-full mb-3 cursor-pointer relative"
              onMouseDown={(e) => { e.stopPropagation(); draggingRef.current = true; seekToX(e.clientX) }}
            >
              <div ref={fillRef} className="h-full rounded-full relative" style={{ width: `${progress}%`, background: '#CF5C36' }}>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full" style={{ background: '#CF5C36' }} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="text-white/70 hover:text-white transition-colors" aria-label={playing ? 'Pause' : 'Play'}>
                {playing ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1" /><rect x="15" y="4" width="4" height="16" rx="1" /></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                )}
              </button>
              <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors" aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                )}
              </button>
              <span className="ml-auto font-mono text-[11px] text-white/40 tabular-nums">{currentTime} / {duration}</span>
              <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors" aria-label="Fullscreen">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card meta */}
      <div className="mt-3 px-0.5 flex items-baseline justify-between gap-3">
        <span className="font-sans capitalize" style={{ fontSize: '14px', color: '#EEE5E9', letterSpacing: '-0.01em' }}>
          {project.title}
        </span>
        {project.category && (
          <span className="font-sans text-xs tracking-[0.1em] uppercase shrink-0" style={{ color: 'rgba(238,229,233,0.3)' }}>
            {project.category}
          </span>
        )}
      </div>
    </div>
  )
}

const TABS = ['Commercial', 'Artists', 'Digital']

function matchesTab(category: string | null, tab: string) {
  const cat = (category || '').toLowerCase()
  if (tab === 'Commercial') return ['ads', 'ad', 'film', 'saas', 'business', 'motion'].some(m => cat.includes(m))
  if (tab === 'Artists')    return ['artist', 'music', 'community'].some(m => cat.includes(m))
  if (tab === 'Digital')    return ['web', 'website', 'digital'].some(m => cat.includes(m))
  return false
}

export default function WorkPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [activeTab, setActiveTab] = useState('Commercial')

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then((data: Project[]) => { if (Array.isArray(data)) setProjects(data) })
      .catch(() => {})
  }, [])

  const filtered = projects.filter(p => matchesTab(p.category, activeTab))

  return (
    <main>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0 }
          100% { background-position: -200% 0 }
        }
      `}</style>

      <div className="pt-32 pb-16 px-8">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <FadeIn>
            <div className="mb-12">
              <BackButton href="/" />
            </div>
          </FadeIn>

          {/* Heading + tabs row */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <h1
                className="font-display font-bold"
                style={{
                  fontSize:      'clamp(3rem, 7vw, 6rem)',
                  color:         '#EEE5E9',
                  letterSpacing: '-0.04em',
                  lineHeight:    0.95,
                }}
              >
                Selected<br />
                <span style={{ color: '#CF5C36', fontWeight: 400 }}>Work</span>
                <span style={{ color: '#CF5C36' }}>.</span>
              </h1>

              {/* Filter tabs */}
              <div className="flex items-center gap-2">
                {TABS.map(tab => {
                  const active = activeTab === tab
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className="font-sans text-xs tracking-[0.1em] uppercase px-4 py-1.5 rounded-full transition-all duration-200"
                      style={{
                        background: active ? '#CF5C36' : 'rgba(238,229,233,0.05)',
                        color:      active ? '#fff'    : 'rgba(238,229,233,0.4)',
                        border:     `1px solid ${active ? 'transparent' : 'rgba(238,229,233,0.1)'}`,
                      }}
                    >
                      {tab}
                    </button>
                  )
                })}
              </div>
            </div>
          </FadeIn>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10">
            {filtered.map((project, i) => (
              <FadeIn key={project.id} delay={i * 60}>
                <VideoCard project={project} priority={i < 2} />
              </FadeIn>
            ))}
          </div>

          {filtered.length === 0 && projects.length > 0 && (
            <FadeIn>
              <p className="font-sans text-sm text-center py-20" style={{ color: 'rgba(238,229,233,0.2)' }}>
                No {activeTab.toLowerCase()} projects yet.
              </p>
            </FadeIn>
          )}

        </div>
      </div>
    </main>
  )
}
