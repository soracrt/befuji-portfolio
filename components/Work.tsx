'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import FadeIn from './FadeIn'

// Shared across all LazyVideo instances — only one plays at a time
let activeGain: GainNode | null = null
let activeCtx: AudioContext | null = null

function fadeOut(gain: GainNode, ctx: AudioContext) {
  gain.gain.cancelScheduledValues(ctx.currentTime)
  gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime)
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)
}

function LazyVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const glowRef = useRef<HTMLVideoElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const gainRef = useRef<GainNode | null>(null)
  const audioReady = useRef(false)

  useEffect(() => {
    const video = videoRef.current
    const wrapper = wrapperRef.current
    if (!video || !wrapper) return

    // Lazy-load video src when near viewport
    const loadObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          video.src = src
          video.load()
          if (glowRef.current) {
            glowRef.current.src = src
            glowRef.current.load()
          }
          loadObserver.disconnect()
        }
      },
      { rootMargin: '300px' }
    )
    loadObserver.observe(video)

    // Audio fade in/out on scroll
    const audioObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries[0].isIntersecting

        // Set up Web Audio pipeline once on first visibility
        if (visible && !audioReady.current) {
          audioReady.current = true
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
          const ctx = new AudioCtx()
          audioCtxRef.current = ctx

          const source = ctx.createMediaElementSource(video)

          // Bass & Treble -100 treble → lowpass filter at 300 Hz
          const filter = ctx.createBiquadFilter()
          filter.type = 'lowpass'
          filter.frequency.value = 300
          filter.Q.value = 0.8

          const gain = ctx.createGain()
          gain.gain.value = 0
          gainRef.current = gain

          source.connect(filter)
          filter.connect(gain)
          gain.connect(ctx.destination)
        }

        const ctx = audioCtxRef.current
        const gain = gainRef.current
        if (!ctx || !gain) return

        ctx.resume()

        if (visible) {
          // Fade out whichever other card is currently active
          if (activeGain && activeGain !== gain && activeCtx) {
            fadeOut(activeGain, activeCtx)
          }
          activeGain = gain
          activeCtx = ctx
          gain.gain.cancelScheduledValues(ctx.currentTime)
          gain.gain.setValueAtTime(0, ctx.currentTime)
          gain.gain.linearRampToValueAtTime(1, ctx.currentTime + 1)
        } else {
          if (activeGain === gain) {
            activeGain = null
            activeCtx = null
          }
          fadeOut(gain, ctx)
        }
      },
      { threshold: 0.4 }
    )
    audioObserver.observe(wrapper)

    return () => {
      loadObserver.disconnect()
      audioObserver.disconnect()
      audioCtxRef.current?.close()
    }
  }, [src])

  return (
    <div ref={wrapperRef} className="relative">
      <video
        ref={glowRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none rounded-2xl"
        style={{ filter: 'blur(32px)', opacity: 0.55, transform: 'scale(1.12)' }}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="w-full rounded-2xl overflow-hidden bg-[#2e2e2d]">
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
