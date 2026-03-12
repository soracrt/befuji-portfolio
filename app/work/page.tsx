'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import FadeIn from '@/components/FadeIn'
import BackButton from '@/components/BackButton'

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = {
  id: string
  title: string
  category: string | null
  client: string
  video: string
  image?: string
  description?: string
  websiteUrl?: string
  caseStudyUrl?: string
  subcategory?: 'featured' | 'client' | 'personal'
  artistName?: string
  monthlyListeners?: number
  videoLink?: string
  artistLink?: string
}

type Review = {
  id: string
  name: string
  service: string
  company?: string
  text: string
}

// ─── Video card ───────────────────────────────────────────────────────────────

let activeUnmute: { mute: () => void } | null = null

function fmt(t: number) {
  const m = Math.floor(t / 60)
  const s = Math.floor(t % 60).toString().padStart(2, '0')
  return `${m}:${s}`
}

// paddingBottom: '56.25%' = 16:9, '100%' = 1:1
function CustomVideoPlayer({ src, paddingBottom = '56.25%', priority = false }: {
  src: string
  paddingBottom?: string
  priority?: boolean
}) {
  const videoRef       = useRef<HTMLVideoElement>(null)
  const containerRef   = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const fillRef        = useRef<HTMLDivElement>(null)
  const draggingRef    = useRef(false)
  const rafRef         = useRef(0)
  const [playing, setPlaying]         = useState(true)
  const [muted, setMuted]             = useState(true)
  const [volume, setVolume]           = useState(0.75)
  const [showVol, setShowVol]         = useState(false)
  const [progress, setProgress]       = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration]       = useState('0:00')
  const [loaded, setLoaded]           = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.volume = 0.75

    if (priority) {
      video.src = src
      video.load()
      video.addEventListener('canplay', () => setLoaded(true), { once: true })
    } else {
      const loadObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          video.src = src
          video.load()
          video.addEventListener('canplay', () => setLoaded(true), { once: true })
          loadObserver.disconnect()
        }
      }, { rootMargin: '50px' })
      loadObserver.observe(video)
    }

    const playObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { video.play().catch(() => {}) }
      else { video.pause() }
    }, { rootMargin: '0px', threshold: 0.1 })

    playObserver.observe(video)
    return () => { playObserver.disconnect() }
  }, [src, priority])

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
      v.muted = false; v.volume = volume; setMuted(false)
      activeUnmute = { mute: () => { if (videoRef.current) videoRef.current.muted = true; setMuted(true) } }
    } else {
      v.muted = true; setMuted(true); activeUnmute = null
    }
  }

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const v = videoRef.current
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (v) { v.volume = val; v.muted = val === 0; setMuted(val === 0) }
  }

  const toggleFullscreen = (e: React.MouseEvent) => {
    e.stopPropagation()
    const el = containerRef.current
    if (!el) return
    if (!document.fullscreenElement) { el.requestFullscreen() } else { document.exitFullscreen() }
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
    const v = videoRef.current, bar = progressBarRef.current
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
    return () => { document.removeEventListener('mousemove', onMove); document.removeEventListener('mouseup', onUp) }
  }, [seekToX])

  return (
    <div ref={containerRef} className="relative rounded-2xl overflow-hidden bg-[#0a0a0a] group">
      {!loaded && (
        <div className="absolute inset-0 z-10" style={{
          background: 'linear-gradient(90deg,#0f0f0f 25%,#161616 50%,#0f0f0f 75%)',
          backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite',
        }} />
      )}
      <div className="relative w-full" style={{ paddingBottom }}>
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
        <div className="absolute bottom-0 left-0 right-0 px-3 pt-8 pb-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div ref={progressBarRef} className="w-full h-[3px] bg-white/20 rounded-full mb-3 cursor-pointer relative"
            onMouseDown={(e) => { e.stopPropagation(); draggingRef.current = true; seekToX(e.clientX) }}>
            <div ref={fillRef} className="h-full rounded-full relative" style={{ width: `${progress}%`, background: '#CF5C36' }}>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 rounded-full" style={{ background: '#CF5C36' }} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="text-white/70 hover:text-white transition-colors" aria-label={playing ? 'Pause' : 'Play'}>
              {playing
                ? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="5" y="4" width="4" height="16" rx="1" /><rect x="15" y="4" width="4" height="16" rx="1" /></svg>
                : <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>}
            </button>
            <div
              className="flex items-center gap-1.5"
              onMouseEnter={() => setShowVol(true)}
              onMouseLeave={() => setShowVol(false)}
            >
              <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors" aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted || volume === 0
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>}
              </button>
              <div style={{ width: showVol ? '58px' : '0px', overflow: 'hidden', transition: 'width 0.2s ease' }}>
                <input
                  type="range"
                  min="0" max="1" step="0.01"
                  value={muted ? 0 : volume}
                  onChange={handleVolume}
                  onClick={e => e.stopPropagation()}
                  className="vol-slider"
                  style={{ width: '58px', '--pct': `${(muted ? 0 : volume) * 100}%` } as React.CSSProperties}
                />
              </div>
            </div>
            <span className="ml-auto font-mono text-[11px] text-white/40 tabular-nums">{currentTime} / {duration}</span>
            <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors" aria-label="Fullscreen">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function VideoCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  return (
    <div>
      <CustomVideoPlayer src={project.video} priority={priority} />
      <div className="mt-3 px-0.5 flex items-baseline justify-between gap-3">
        <span className="font-sans capitalize" style={{ fontSize: '14px', color: '#EEE5E9', letterSpacing: '-0.01em' }}>{project.title}</span>
        {project.category && (
          <span className="font-sans text-xs tracking-[0.1em] uppercase shrink-0" style={{ color: 'rgba(238,229,233,0.3)' }}>{project.category}</span>
        )}
      </div>
    </div>
  )
}

// ─── Segmented pagination line ────────────────────────────────────────────────

function PaginationLine({ total, current, onChange }: { total: number; current: number; onChange: (p: number) => void }) {
  if (total <= 1) return null
  return (
    <div className="flex gap-1.5 mt-10">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onChange(i)}
          aria-label={`Page ${i + 1}`}
          className="flex-1 h-[2px] rounded-full transition-all duration-300"
          style={{ background: i === current ? '#CF5C36' : 'rgba(238,229,233,0.15)' }}
        />
      ))}
    </div>
  )
}

// ─── Marquee ──────────────────────────────────────────────────────────────────

const MARQUEE_BRANDS: Record<string, string[]> = {
  Commercial: ['Apex Motors', 'Loopkit', 'Volta Brand', 'Frameshifts', 'Kura Studio', 'Stackline'],
  Artists:    ['Nocturne Visuals', 'Independent Artists', 'Film Collective', 'Visual Studio', 'Sound & Vision'],
  Websites:   ['Stackline', 'Frameshifts', 'Loopkit', 'Web Studio', 'Digital Co'],
}

function Marquee({ tab }: { tab: string }) {
  const brands = [...(MARQUEE_BRANDS[tab] ?? []), ...(MARQUEE_BRANDS[tab] ?? [])]
  return (
    <div className="relative overflow-hidden py-8 mt-16" style={{ borderTop: '1px solid rgba(238,229,233,0.06)', borderBottom: '1px solid rgba(238,229,233,0.06)' }}>
      {/* Fade edges */}
      <div className="absolute inset-y-0 left-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #000, transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-20 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #000, transparent)' }} />

      <div className="flex" style={{ animation: 'marquee 28s linear infinite', width: 'max-content' }}>
        {brands.map((brand, i) => (
          <span key={i} className="font-display font-bold uppercase mx-10 whitespace-nowrap" style={{ fontSize: 'clamp(1rem, 2vw, 1.4rem)', color: 'rgba(238,229,233,0.12)', letterSpacing: '0.08em' }}>
            {brand}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─── Review card (inline, no GlowCard dep) ───────────────────────────────────

function WorkReviewCard({ review }: { review: Review }) {
  return (
    <div className="flex flex-col p-5 rounded-2xl h-full" style={{ background: '#0d0d0d', border: '1px solid rgba(238,229,233,0.07)' }}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <span className="font-sans text-sm font-medium" style={{ color: '#EEE5E9' }}>{review.name}</span>
        <span className="font-sans text-xs tracking-[0.12em] uppercase shrink-0" style={{ color: 'rgba(238,229,233,0.3)' }}>{review.service}</span>
      </div>
      <p className="font-sans text-sm leading-[1.75] flex-1" style={{ color: 'rgba(238,229,233,0.6)' }}>
        &ldquo;{review.text}&rdquo;
      </p>
      {review.company && (
        <p className="font-sans text-xs mt-4" style={{ color: 'rgba(238,229,233,0.22)' }}>{review.company}</p>
      )}
    </div>
  )
}

// ─── Custom dropdown ──────────────────────────────────────────────────────────

function ServiceDropdown({ value, options, onChange }: { value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between font-sans transition-all duration-150"
        style={{
          height: '46px',
          padding: '0 14px',
          background: 'rgba(238,229,233,0.04)',
          border: `1px solid ${open ? 'rgba(207,92,54,0.4)' : 'rgba(238,229,233,0.1)'}`,
          borderRadius: '12px',
          color: value ? '#EEE5E9' : 'rgba(238,229,233,0.3)',
          fontSize: '14px',
          cursor: 'pointer',
        }}
      >
        <span>{value || 'Select service'}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ opacity: 0.4, flexShrink: 0, transition: 'transform 0.2s ease', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 w-full mt-1.5 overflow-hidden"
          style={{
            background: '#141414',
            border: '1px solid rgba(238,229,233,0.1)',
            borderRadius: '12px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
          }}
        >
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className="w-full text-left font-sans transition-colors duration-100"
              style={{
                padding: '11px 14px',
                fontSize: '14px',
                color: opt === value ? '#EEE5E9' : 'rgba(238,229,233,0.5)',
                background: opt === value ? 'rgba(207,92,54,0.1)' : 'transparent',
                borderBottom: '1px solid rgba(238,229,233,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onMouseEnter={e => { if (opt !== value) e.currentTarget.style.background = 'rgba(238,229,233,0.04)' }}
              onMouseLeave={e => { if (opt !== value) e.currentTarget.style.background = 'transparent' }}
            >
              {opt}
              {opt === value && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CF5C36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Submit review form ───────────────────────────────────────────────────────

const LABEL_STYLE: React.CSSProperties = {
  fontSize: '11px',
  color: 'rgba(238,229,233,0.35)',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  fontFamily: 'inherit',
  marginBottom: '6px',
  display: 'block',
}

const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  height: '46px',
  padding: '0 14px',
  background: 'rgba(238,229,233,0.04)',
  border: '1px solid rgba(238,229,233,0.1)',
  borderRadius: '12px',
  color: '#EEE5E9',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
  transition: 'border-color 0.15s ease',
}

function ReviewForm({ category }: { category: string }) {
  const EMPTY = { name: '', service: '', company: '', text: '' }
  const [form, setForm]             = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]             = useState(false)
  const [error, setError]           = useState('')

  const SERVICE_BY_CAT: Record<string, string[]> = {
    Commercial: ['Ads', 'SaaS', 'Motion Graphics'],
    Artists:    ['Artist Promo', 'Music Video', 'Other'],
    Websites:   ['Front-end', 'Back-end', 'Full Website'],
  }
  const services = SERVICE_BY_CAT[category] ?? SERVICE_BY_CAT['Commercial']

  // Reset service if category changes and current service isn't valid
  useEffect(() => {
    if (form.service && !services.includes(form.service)) {
      setForm(f => ({ ...f, service: '' }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.service || !form.text) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, category: tabToCategory(category) }),
      })
      if (res.ok) { setDone(true) } else { setError('Something went wrong. Try again.') }
    } catch { setError('Something went wrong. Try again.') }
    setSubmitting(false)
  }

  const canSubmit = !!form.name && !!form.service && !!form.text

  // ── Success state ──
  if (done) return (
    <div
      className="rounded-2xl p-8 flex flex-col items-center text-center gap-5"
      style={{ background: 'rgba(207,92,54,0.05)', border: '1px solid rgba(207,92,54,0.15)' }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: 'rgba(207,92,54,0.12)', border: '1px solid rgba(207,92,54,0.3)' }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#CF5C36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <p className="font-display font-bold mb-1" style={{ fontSize: '1.1rem', color: '#EEE5E9', letterSpacing: '-0.02em' }}>
          Review sent.
        </p>
        <p className="font-sans text-sm" style={{ color: 'rgba(238,229,233,0.4)' }}>
          It&apos;ll go live once approved. Thanks for the kind words.
        </p>
      </div>
      <button
        type="button"
        onClick={() => { setForm(EMPTY); setDone(false) }}
        className="font-sans text-xs tracking-[0.1em] uppercase px-5 py-2 rounded-full transition-all duration-200"
        style={{
          background: 'rgba(238,229,233,0.06)',
          border: '1px solid rgba(238,229,233,0.12)',
          color: 'rgba(238,229,233,0.55)',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#EEE5E9'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.25)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(238,229,233,0.55)'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.12)' }}
      >
        Add another review
      </button>
    </div>
  )

  // ── Form ──
  return (
    <form onSubmit={submit} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <div>
          <label style={LABEL_STYLE}>Name <span style={{ color: '#CF5C36' }}>*</span></label>
          <input
            style={INPUT_STYLE}
            placeholder="Your name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            onFocus={e => { e.currentTarget.style.borderColor = 'rgba(207,92,54,0.4)' }}
            onBlur={e => { e.currentTarget.style.borderColor = 'rgba(238,229,233,0.1)' }}
          />
        </div>

        {/* Service — custom dropdown */}
        <div>
          <label style={LABEL_STYLE}>Service <span style={{ color: '#CF5C36' }}>*</span></label>
          <ServiceDropdown
            value={form.service}
            options={services}
            onChange={v => setForm(f => ({ ...f, service: v }))}
          />
        </div>
      </div>

      {/* Company */}
      <div>
        <label style={LABEL_STYLE}>
          Company / Brand&nbsp;
          <span style={{ color: 'rgba(238,229,233,0.25)', textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>(optional)</span>
        </label>
        <input
          style={INPUT_STYLE}
          placeholder="Where you're from"
          value={form.company}
          onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(207,92,54,0.4)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(238,229,233,0.1)' }}
        />
      </div>

      {/* Review text */}
      <div>
        <label style={LABEL_STYLE}>Your review <span style={{ color: '#CF5C36' }}>*</span></label>
        <textarea
          rows={4}
          placeholder="What was it like working with kulaire?"
          value={form.text}
          onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
          onFocus={e => { e.currentTarget.style.borderColor = 'rgba(207,92,54,0.4)' }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(238,229,233,0.1)' }}
          style={{
            ...INPUT_STYLE,
            height: 'auto',
            padding: '12px 14px',
            resize: 'none',
            lineHeight: '1.65',
          }}
        />
      </div>

      {error && (
        <p className="font-sans text-xs" style={{ color: '#f87171' }}>{error}</p>
      )}

      <div className="flex items-center justify-between gap-4">
        <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.2)' }}>
          Reviews are approved before going live.
        </p>
        <button
          type="submit"
          disabled={submitting || !canSubmit}
          className="font-sans text-xs tracking-[0.1em] uppercase px-7 py-3 rounded-full transition-all duration-200 shrink-0"
          style={{
            background: canSubmit ? '#CF5C36' : 'rgba(238,229,233,0.06)',
            color:      canSubmit ? '#fff'    : 'rgba(238,229,233,0.2)',
            cursor:     canSubmit && !submitting ? 'pointer' : 'not-allowed',
            boxShadow:  canSubmit ? '0 0 20px rgba(207,92,54,0.35)' : 'none',
          }}
        >
          {submitting ? '···' : 'Submit'}
        </button>
      </div>
    </form>
  )
}

// ─── Process timeline ─────────────────────────────────────────────────────────

type Step = { side: 'client' | 'kulaire'; title: string; desc: string }

const PROCESS_STEPS_BY_TAB: Record<string, Step[]> = {
  Commercial: [
    { side: 'client',  title: 'Brand quiz & identity intake', desc: 'Complete our brand quiz so we know exactly who we\'re making this for.' },
    { side: 'kulaire', title: 'Storyboard & concept',          desc: 'We build the creative direction based on your script and brand details.' },
    { side: 'client',  title: 'Storyboard review',             desc: 'Unlimited revisions here until the concept is locked.' },
    { side: 'kulaire', title: 'Production',                    desc: 'We build the full video once you\'ve signed off.' },
    { side: 'client',  title: 'Final review',                  desc: 'Last look before we wrap. Revisions accepted here too.' },
    { side: 'kulaire', title: 'Delivery',                      desc: 'Final files, formatted for every platform you need.' },
  ],
  Artists: [
    { side: 'client',  title: 'Song selection',    desc: 'Drop the track and timestamp. We\'ll take it from there.' },
    { side: 'kulaire', title: 'Quote + invoice',   desc: 'We send the quote. You cover 50% to lock it in.' },
    { side: 'client',  title: 'Deposit confirmed', desc: 'Once the deposit clears, we start immediately.' },
    { side: 'kulaire', title: 'Production',        desc: 'Same-day delivery for most projects.' },
    { side: 'client',  title: 'Revisions',         desc: 'Up to 2 revision rounds included.' },
    { side: 'kulaire', title: 'Final delivery',    desc: 'Project is yours. Posting available as an add-on.' },
  ],
  Websites: [
    { side: 'client',  title: 'Brand details & references', desc: 'Send everything — colors, fonts, inspo, the works.' },
    { side: 'kulaire', title: 'Design direction',           desc: 'We confirm whether we\'re building from your design or starting fresh.' },
    { side: 'kulaire', title: 'Wireframe & concept',        desc: 'We map the structure and get your sign-off before building.' },
    { side: 'kulaire', title: 'Build',                      desc: 'Full development begins once concept is approved.' },
    { side: 'client',  title: 'Revisions',                  desc: 'Test it, break it, tell us what\'s off.' },
    { side: 'kulaire', title: 'Launch',                     desc: 'We hand it off live and ready.' },
  ],
}

function TimelineContent({ steps }: { steps: Step[] }) {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block relative">
        <div className="relative" style={{ paddingBottom: '8px' }}>

          {/* Top row — client steps */}
          <div className="flex">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 px-2" style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center' }}>
                {step.side === 'client' && (
                  <div className="text-center flex flex-col items-center" style={{ width: '100%' }}>
                    <div className="inline-block font-sans text-[10px] tracking-[0.12em] uppercase mb-2 px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(238,229,233,0.05)', border: '1px solid rgba(238,229,233,0.1)', color: 'rgba(238,229,233,0.35)' }}>
                      You
                    </div>
                    <p className="font-display font-bold text-sm mb-2" style={{ color: '#EEE5E9', letterSpacing: '-0.02em' }}>{step.title}</p>
                    <p className="font-sans text-xs leading-[1.6]" style={{ color: 'rgba(238,229,233,0.35)', maxWidth: '130px' }}>{step.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Center line with step dots */}
          <div className="relative flex items-center" style={{ height: '32px' }}>
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2" style={{ height: '1px', background: 'linear-gradient(to right, transparent, rgba(238,229,233,0.12) 8%, rgba(238,229,233,0.12) 92%, transparent)' }} />
            <div className="relative flex w-full">
              {steps.map((step, i) => (
                <div key={i} className="flex-1 flex justify-center items-center" style={{ height: '32px' }}>
                  <div className="relative z-10 flex items-center justify-center rounded-full font-mono text-[10px] font-bold"
                    style={{
                      width: '26px', height: '26px',
                      background: step.side === 'kulaire' ? 'rgba(207,92,54,0.15)' : 'rgba(238,229,233,0.06)',
                      border: `1px solid ${step.side === 'kulaire' ? 'rgba(207,92,54,0.4)' : 'rgba(238,229,233,0.15)'}`,
                      color: step.side === 'kulaire' ? '#CF5C36' : 'rgba(238,229,233,0.45)',
                    }}>
                    {i + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom row — kulaire steps */}
          <div className="flex">
            {steps.map((step, i) => (
              <div key={i} className="flex-1 px-2" style={{ minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'center', paddingTop: '20px' }}>
                {step.side === 'kulaire' && (
                  <div className="text-center flex flex-col items-center" style={{ width: '100%' }}>
                    <div className="inline-block font-sans text-[10px] tracking-[0.12em] uppercase mb-2 px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(207,92,54,0.08)', border: '1px solid rgba(207,92,54,0.25)', color: 'rgba(207,92,54,0.7)' }}>
                      kulaire
                    </div>
                    <p className="font-display font-bold text-sm mb-2" style={{ color: '#EEE5E9', letterSpacing: '-0.02em' }}>{step.title}</p>
                    <p className="font-sans text-xs leading-[1.6]" style={{ color: 'rgba(238,229,233,0.35)', maxWidth: '130px' }}>{step.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Mobile — vertical stacked */}
      <div className="flex flex-col gap-0 md:hidden relative">
        <div className="absolute left-[18px] top-0 bottom-0 w-px" style={{ background: 'linear-gradient(to bottom, transparent, rgba(238,229,233,0.1) 5%, rgba(238,229,233,0.1) 95%, transparent)' }} />
        {steps.map((step, i) => (
          <div key={i} className="flex gap-5 pb-8 relative">
            <div className="relative z-10 flex-shrink-0 flex items-center justify-center rounded-full font-mono text-[10px] font-bold"
              style={{
                width: '36px', height: '36px',
                background: step.side === 'kulaire' ? 'rgba(207,92,54,0.15)' : 'rgba(238,229,233,0.06)',
                border: `1px solid ${step.side === 'kulaire' ? 'rgba(207,92,54,0.4)' : 'rgba(238,229,233,0.15)'}`,
                color: step.side === 'kulaire' ? '#CF5C36' : 'rgba(238,229,233,0.45)',
                marginTop: '2px',
              }}>
              {i + 1}
            </div>
            <div className="pt-1">
              <div className="inline-block font-sans text-[10px] tracking-[0.12em] uppercase mb-1.5 px-2 py-0.5 rounded-full"
                style={step.side === 'kulaire'
                  ? { background: 'rgba(207,92,54,0.08)', border: '1px solid rgba(207,92,54,0.25)', color: 'rgba(207,92,54,0.7)' }
                  : { background: 'rgba(238,229,233,0.05)', border: '1px solid rgba(238,229,233,0.1)', color: 'rgba(238,229,233,0.35)' }
                }>
                {step.side === 'kulaire' ? 'kulaire' : 'You'}
              </div>
              <p className="font-display font-bold text-sm mb-1" style={{ color: '#EEE5E9', letterSpacing: '-0.02em' }}>{step.title}</p>
              <p className="font-sans text-xs leading-[1.65]" style={{ color: 'rgba(238,229,233,0.35)' }}>{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function ProcessTimeline({ tab }: { tab: string }) {
  const [visibleTab, setVisibleTab] = useState(tab)
  const [opacity, setOpacity]       = useState(1)

  useEffect(() => {
    setOpacity(0)
    const t = setTimeout(() => {
      setVisibleTab(tab)
      setOpacity(1)
    }, 180)
    return () => clearTimeout(t)
  }, [tab])

  const steps = PROCESS_STEPS_BY_TAB[visibleTab] ?? PROCESS_STEPS_BY_TAB['Commercial']

  return (
    <div className="px-4 sm:px-8 py-12 sm:py-20">
      <div className="max-w-5xl mx-auto">

        <FadeIn>
          <p className="font-sans text-xs tracking-[0.14em] uppercase mb-2" style={{ color: 'rgba(207,92,54,0.7)' }}>
            How it works
          </p>
          <h2 className="font-display font-bold mb-14" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', color: '#EEE5E9', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
            The process.
          </h2>
        </FadeIn>

        <div style={{ opacity, transition: 'opacity 0.18s ease' }}>
          <TimelineContent steps={steps} />
        </div>

      </div>
    </div>
  )
}

// ─── Artist conveyor card ─────────────────────────────────────────────────────

function ArtistCard({ project, onSelect }: { project: Project; onSelect: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.src = project.video
    v.load()
  }, [project.video])

  return (
    <div
      className="relative shrink-0 overflow-hidden cursor-pointer group"
      style={{
        width: 'clamp(200px, 26vw, 290px)',
        aspectRatio: '1/1',
        background: '#111',
        borderRadius: '20px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
      }}
      onClick={onSelect}
    >
      {!loaded && (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg,#0f0f0f 25%,#161616 50%,#0f0f0f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }} />
      )}
      <video
        ref={videoRef}
        muted
        autoPlay
        loop
        playsInline
        onLoadedData={() => setLoaded(true)}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ pointerEvents: 'none' }}
      />
      {/* Subtle dark overlay on hover */}
      <div className="absolute inset-0 transition-all duration-300 group-hover:bg-black/25" />
    </div>
  )
}

// ─── Conveyor reel ────────────────────────────────────────────────────────────

function ConveyorReel({ projects, onSelect }: { projects: Project[]; onSelect: (p: Project) => void }) {
  const scrollRef   = useRef<HTMLDivElement>(null)
  const isDragging  = useRef(false)
  const didDrag     = useRef(false)
  const startX      = useRef(0)
  const startScroll = useRef(0)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(true)

  function updateArrows() {
    const el = scrollRef.current
    if (!el) return
    setCanLeft(el.scrollLeft > 4)
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4)
  }

  useEffect(() => { updateArrows() }, [projects])

  function nudge(dir: 1 | -1) {
    scrollRef.current?.scrollBy({ left: dir * (290 + 16) * 2, behavior: 'smooth' })
  }

  function onMouseDown(e: React.MouseEvent) {
    isDragging.current  = true
    didDrag.current     = false
    startX.current      = e.clientX
    startScroll.current = scrollRef.current?.scrollLeft ?? 0
  }
  function onMouseMove(e: React.MouseEvent) {
    if (!isDragging.current) return
    const dx = e.clientX - startX.current
    if (Math.abs(dx) > 5) didDrag.current = true
    if (scrollRef.current) scrollRef.current.scrollLeft = startScroll.current - dx
  }
  function stopDrag() { isDragging.current = false }

  function onTouchStart(e: React.TouchEvent) {
    isDragging.current  = true
    didDrag.current     = false
    startX.current      = e.touches[0].clientX
    startScroll.current = scrollRef.current?.scrollLeft ?? 0
  }
  function onTouchMove(e: React.TouchEvent) {
    const dx = e.touches[0].clientX - startX.current
    if (Math.abs(dx) > 5) didDrag.current = true
    if (scrollRef.current) scrollRef.current.scrollLeft = startScroll.current - dx
  }

  if (projects.length === 0) return (
    <p className="font-sans text-sm py-6" style={{ color: 'rgba(238,229,233,0.2)' }}>No projects here yet.</p>
  )

  const ArrowBtn = ({ dir }: { dir: -1 | 1 }) => {
    const visible = dir === -1 ? canLeft : canRight
    return (
      <button
        onClick={() => nudge(dir)}
        className="absolute top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200"
        style={{
          [dir === -1 ? 'left' : 'right']: '-18px',
          background:   'rgba(14,14,14,0.9)',
          border:       '1px solid rgba(238,229,233,0.12)',
          backdropFilter: 'blur(10px)',
          color:        'rgba(238,229,233,0.7)',
          opacity:      visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          boxShadow:    '0 4px 16px rgba(0,0,0,0.5)',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#EEE5E9'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.25)' }}
        onMouseLeave={e => { e.currentTarget.style.color = 'rgba(238,229,233,0.7)'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.12)' }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          {dir === -1
            ? <polyline points="15 18 9 12 15 6" />
            : <polyline points="9 18 15 12 9 6" />
          }
        </svg>
      </button>
    )
  }

  return (
    <div className="relative">
      <ArrowBtn dir={-1} />
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none', cursor: 'grab' }}
        onScroll={updateArrows}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={stopDrag}
      >
        {projects.map(p => (
          <ArtistCard key={p.id} project={p} onSelect={() => { if (!didDrag.current) onSelect(p) }} />
        ))}
      </div>
      <ArrowBtn dir={1} />
    </div>
  )
}

// ─── Artist modal ─────────────────────────────────────────────────────────────

function ArtistModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
  }, [onClose])

  function videoLabel(url: string) {
    if (url.includes('tiktok'))    return 'Watch on TikTok'
    if (url.includes('instagram')) return 'Watch on Instagram'
    return 'Watch on YouTube'
  }

  const ArrowIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
    </svg>
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(20px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="relative w-full" style={{ maxWidth: '480px' }}>

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-150"
          style={{ background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(238,229,233,0.12)', color: 'rgba(238,229,233,0.5)' }}
          onMouseEnter={e => { e.currentTarget.style.color = '#EEE5E9'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.28)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(238,229,233,0.5)'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.12)' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Video card */}
        <CustomVideoPlayer src={project.video} paddingBottom="100%" priority />

        {/* Title + pill below video */}
        <div className="flex items-center justify-between gap-4 mt-4 px-1">
          <div>
            <p className="font-display font-bold" style={{ fontSize: 'clamp(1rem,2.5vw,1.25rem)', color: '#EEE5E9', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {project.title}
            </p>
            {project.artistName && (
              <p className="font-sans text-xs mt-0.5" style={{ color: 'rgba(238,229,233,0.35)' }}>{project.artistName}</p>
            )}
          </div>

          {project.videoLink ? (
            <a
              href={project.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 flex items-center gap-1.5 font-sans text-xs tracking-[0.08em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
              style={{
                background: 'linear-gradient(180deg, rgba(224,100,58,0.95) 0%, #CF5C36 100%)',
                color: '#fff',
                boxShadow: '0 0 0 1px rgba(207,92,54,0.5), 0 0 18px rgba(207,92,54,0.55), 0 0 40px rgba(207,92,54,0.25), inset 0 1px 0 rgba(255,255,255,0.18)',
              }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(207,92,54,0.7), 0 0 28px rgba(207,92,54,0.75), 0 0 56px rgba(207,92,54,0.38), inset 0 1px 0 rgba(255,255,255,0.22)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 0 1px rgba(207,92,54,0.5), 0 0 18px rgba(207,92,54,0.55), 0 0 40px rgba(207,92,54,0.25), inset 0 1px 0 rgba(255,255,255,0.18)'; e.currentTarget.style.transform = 'translateY(0)' }}
            >
              {videoLabel(project.videoLink)} <ArrowIcon />
            </a>
          ) : (
            <Link
              href="/contact"
              onClick={onClose}
              className="shrink-0 flex items-center gap-1.5 font-sans text-xs tracking-[0.08em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
              style={{ background: 'transparent', color: 'rgba(238,229,233,0.5)', border: '1px solid rgba(238,229,233,0.16)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#EEE5E9'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.32)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(238,229,233,0.5)'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.16)' }}
            >
              Get Yours Now <ArrowIcon />
            </Link>
          )}
        </div>

      </div>
    </div>
  )
}

// ─── Featured artist video section ────────────────────────────────────────────

function FeaturedVideoSection({ project, onExpand }: { project: Project; onExpand: () => void }) {
  return (
    <div>
      {/* Editorial heading */}
      <h2
        className="font-display font-bold"
        style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', color: '#EEE5E9', letterSpacing: '-0.04em', lineHeight: 0.95 }}
      >
        Featured
      </h2>
      <p className="font-sans text-sm mt-1.5 mb-8" style={{ color: 'rgba(238,229,233,0.3)', fontStyle: 'italic' }}>
        Handpicked favorites from my portfolio
      </p>

      {/* Video card with badge overlay */}
      <div className="relative">
        <VideoCard project={project} priority />
        {/* Featured badge — top-left */}
        <div
          className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full pointer-events-none"
          style={{
            background:     'rgba(207,92,54,0.88)',
            backdropFilter: 'blur(10px)',
            border:         '1px solid rgba(207,92,54,0.5)',
            boxShadow:      '0 2px 12px rgba(207,92,54,0.35)',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="#fff" stroke="none">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span className="font-sans text-xs font-medium text-white" style={{ letterSpacing: '0.04em' }}>Featured</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <h2
          className="font-display font-bold"
          style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', color: '#EEE5E9', letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          {project.title}
        </h2>
        {(project.artistName || project.monthlyListeners) && (
          <div className="flex items-center gap-2 flex-wrap">
            {project.artistName && (
              <span className="font-sans text-sm font-medium" style={{ color: 'rgba(238,229,233,0.65)' }}>{project.artistName}</span>
            )}
            {project.artistName && project.monthlyListeners && (
              <span style={{ color: 'rgba(238,229,233,0.2)' }}>·</span>
            )}
            {project.monthlyListeners && (
              <span className="font-sans text-sm" style={{ color: 'rgba(238,229,233,0.35)' }}>
                {project.monthlyListeners.toLocaleString()} monthly listeners
              </span>
            )}
          </div>
        )}
        {project.description && (
          <p className="font-sans text-sm leading-[1.75]" style={{ color: 'rgba(238,229,233,0.5)', maxWidth: '55ch' }}>
            {project.description}
          </p>
        )}
        <div className="flex items-center gap-3 mt-1 flex-wrap">
          {project.videoLink ? (
            <a
              href={project.videoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs tracking-[0.08em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
              style={{ background: '#CF5C36', color: '#fff', boxShadow: '0 0 18px rgba(207,92,54,0.5)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(207,92,54,0.7)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 18px rgba(207,92,54,0.5)' }}
            >
              Watch video
            </a>
          ) : (
            <button
              onClick={onExpand}
              className="font-sans text-xs tracking-[0.08em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
              style={{ background: '#CF5C36', color: '#fff', boxShadow: '0 0 18px rgba(207,92,54,0.5)' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 28px rgba(207,92,54,0.7)' }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 18px rgba(207,92,54,0.5)' }}
            >
              Watch video
            </button>
          )}
          {project.artistLink && (
            <a
              href={project.artistLink}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs tracking-[0.08em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
              style={{ background: 'transparent', color: 'rgba(238,229,233,0.65)', border: '1px solid rgba(238,229,233,0.2)' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#EEE5E9'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.35)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(238,229,233,0.65)'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.2)' }}
            >
              Artist profile
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Website card ─────────────────────────────────────────────────────────────

function WebsiteCard({ project }: { project: Project }) {
  return (
    <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">

      {/* Screenshot — 16:9 */}
      <div
        className="w-full md:w-[58%] shrink-0 rounded-2xl overflow-hidden"
        style={{ aspectRatio: '16/9', background: '#111' }}
      >
        {project.image ? (
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)' }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="rgba(238,229,233,0.12)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18" />
              <circle cx="7" cy="6" r="0.5" fill="rgba(238,229,233,0.12)" />
              <circle cx="10" cy="6" r="0.5" fill="rgba(238,229,233,0.12)" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 pt-1">
        <h2
          className="font-display font-bold"
          style={{ fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)', color: '#EEE5E9', letterSpacing: '-0.03em', lineHeight: 1.1 }}
        >
          {project.title}
        </h2>

        {project.client && (
          <p className="font-sans text-xs tracking-[0.1em] uppercase" style={{ color: 'rgba(207,92,54,0.7)' }}>
            {project.client}
          </p>
        )}

        {project.description && (
          <p className="font-sans text-sm leading-[1.75]" style={{ color: 'rgba(238,229,233,0.5)', maxWidth: '38ch' }}>
            {project.description}
          </p>
        )}

        {/* Buttons */}
        <div className="flex items-center gap-3 mt-2 flex-wrap">
          <a
            href={project.websiteUrl || '#'}
            target={project.websiteUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="font-sans text-xs tracking-[0.08em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
            style={{
              background:  '#CF5C36',
              color:       '#fff',
              boxShadow:   '0 0 18px rgba(207,92,54,0.5), 0 4px 14px rgba(207,92,54,0.28)',
              cursor:      project.websiteUrl ? 'pointer' : 'default',
              opacity:     project.websiteUrl ? 1 : 0.45,
            }}
            onMouseEnter={e => { if (project.websiteUrl) e.currentTarget.style.boxShadow = '0 0 28px rgba(207,92,54,0.7), 0 6px 20px rgba(207,92,54,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 0 18px rgba(207,92,54,0.5), 0 4px 14px rgba(207,92,54,0.28)' }}
          >
            View website
          </a>

          <a
            href={project.caseStudyUrl || '#'}
            target={project.caseStudyUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="font-sans text-xs tracking-[0.08em] uppercase px-5 py-2.5 rounded-full transition-all duration-200"
            style={{
              background:   'transparent',
              color:        project.caseStudyUrl ? 'rgba(238,229,233,0.65)' : 'rgba(238,229,233,0.25)',
              border:       '1px solid rgba(238,229,233,0.18)',
              cursor:       project.caseStudyUrl ? 'pointer' : 'default',
            }}
            onMouseEnter={e => { if (project.caseStudyUrl) { e.currentTarget.style.color = '#EEE5E9'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.35)' } }}
            onMouseLeave={e => { e.currentTarget.style.color = project.caseStudyUrl ? 'rgba(238,229,233,0.65)' : 'rgba(238,229,233,0.25)'; e.currentTarget.style.borderColor = 'rgba(238,229,233,0.18)' }}
          >
            Case study
          </a>
        </div>
      </div>

    </div>
  )
}

// ─── Tabs + routing ───────────────────────────────────────────────────────────

const TABS = ['Commercial', 'Artists', 'Websites']
const PER_PAGE = 4

function matchesTab(category: string | null, tab: string) {
  const cat = (category || '').toLowerCase()
  if (tab === 'Commercial') return ['ads', 'ad', 'film', 'saas', 'business', 'motion'].some(m => cat.includes(m))
  if (tab === 'Artists')    return ['artist', 'music', 'community'].some(m => cat.includes(m))
  if (tab === 'Websites')   return ['web', 'website', 'digital'].some(m => cat.includes(m))
  return false
}

// Map tab label to API category string
function tabToCategory(tab: string) {
  if (tab === 'Websites') return 'digital'
  return tab.toLowerCase()
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TAB_ICONS: Record<string, React.ReactNode> = {
  Commercial: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  ),
  Artists: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
    </svg>
  ),
  Websites: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" />
    </svg>
  ),
}

export default function WorkPage() {
  const [projects, setProjects]               = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [reviews, setReviews]                 = useState<Review[]>([])
  const [activeTab, setActiveTab]             = useState('Commercial')
  const [page, setPage]                       = useState(0)
  const [showHotbar, setShowHotbar]           = useState(false)
  const [modalProject, setModalProject]       = useState<Project | null>(null)
  const tabsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then((data: Project[]) => { if (Array.isArray(data)) setProjects(data) })
      .catch(() => {})
      .finally(() => setProjectsLoading(false))
  }, [])

  // Reload approved reviews whenever tab changes
  useEffect(() => {
    fetch(`/api/reviews?category=${tabToCategory(activeTab)}&approved=true`)
      .then(r => r.json())
      .then((data: Review[]) => { if (Array.isArray(data)) setReviews(data) })
      .catch(() => setReviews([]))
  }, [activeTab])

  // Reset to page 0 when tab changes
  useEffect(() => { setPage(0) }, [activeTab])

  // Show hotbar once tabs section scrolls out of view
  useEffect(() => {
    const el = tabsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setShowHotbar(!entry.isIntersecting),
      { threshold: 0, rootMargin: '0px' }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const filtered    = projects.filter(p => matchesTab(p.category, activeTab))
  const totalPages  = Math.ceil(filtered.length / PER_PAGE)
  const paginated   = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <main>
      <style>{`
        @keyframes shimmer        { 0%   { background-position: 200% 0 }    100% { background-position: -200% 0 } }
        @keyframes marquee        { 0%   { transform: translateX(0) }        100% { transform: translateX(-50%) } }
        @keyframes liquid-shimmer { 0%   { transform: translateX(-100%) }    100% { transform: translateX(100%) } }
      `}</style>

      <div className="pt-28 sm:pt-32 pb-16 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <FadeIn>
            <div className="mb-12">
              <BackButton href="/" />
            </div>
          </FadeIn>

          {/* Heading + tabs */}
          <FadeIn>
            <div ref={tabsRef} className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <h1 className="font-display font-bold" style={{ fontSize: 'clamp(3rem,7vw,6rem)', color: '#EEE5E9', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
                Selected<br />
                <span style={{ color: '#CF5C36', fontWeight: 400 }}>work</span>
                <span style={{ color: '#CF5C36' }}>.</span>
              </h1>

              <div className="flex items-center gap-2">
                {TABS.map(tab => {
                  const active = activeTab === tab
                  return (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                      className="font-sans text-xs tracking-[0.1em] uppercase px-4 py-1.5 rounded-full transition-all duration-200"
                      style={{
                        background: active ? '#CF5C36' : 'rgba(238,229,233,0.05)',
                        color:      active ? '#fff'    : 'rgba(238,229,233,0.4)',
                        border:     `1px solid ${active ? 'transparent' : 'rgba(238,229,233,0.1)'}`,
                      }}>
                      {tab}
                    </button>
                  )
                })}
              </div>
            </div>
          </FadeIn>

          {/* Projects */}
          {activeTab === 'Websites' ? (

            /* ── Website cards: image-left, content-right, stacked list ── */
            <div className="flex flex-col gap-16">
              {projectsLoading
                ? Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-8">
                      <div className="w-full md:w-[58%] rounded-2xl shrink-0" style={{ aspectRatio: '16/9', background: 'linear-gradient(90deg,#0f0f0f 25%,#161616 50%,#0f0f0f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }} />
                      <div className="flex-1 flex flex-col gap-3 pt-1">
                        <div className="h-9 w-48 rounded-xl" style={{ background: '#161616' }} />
                        <div className="h-4 w-full rounded" style={{ background: '#0f0f0f' }} />
                        <div className="h-4 w-3/4 rounded" style={{ background: '#0f0f0f' }} />
                        <div className="flex gap-3 mt-2">
                          <div className="h-9 w-32 rounded-full" style={{ background: '#1a0e09' }} />
                          <div className="h-9 w-28 rounded-full" style={{ background: '#111' }} />
                        </div>
                      </div>
                    </div>
                  ))
                : paginated.map((project, i) => (
                    <FadeIn key={project.id} delay={i * 80}>
                      <WebsiteCard project={project} />
                    </FadeIn>
                  ))
              }
              {!projectsLoading && filtered.length === 0 && (
                <p className="font-sans text-sm" style={{ color: 'rgba(238,229,233,0.2)' }}>No website projects yet.</p>
              )}
            </div>

          ) : activeTab === 'Artists' ? (

            /* ── Artists: featured hero + two conveyor reels ── */
            (() => {
              const featured  = filtered.find(p => p.subcategory === 'featured')
              const clients   = filtered.filter(p => p.subcategory === 'client')
              const personal  = filtered.filter(p => p.subcategory === 'personal')
              const untagged  = filtered.filter(p => !p.subcategory)

              return (
                <div className="flex flex-col gap-16">
                  {/* Featured */}
                  {projectsLoading ? (
                    <div>
                      <div className="h-4 w-32 rounded mb-5" style={{ background: '#161616' }} />
                      <div className="rounded-2xl" style={{ aspectRatio: '16/9', background: 'linear-gradient(90deg,#0f0f0f 25%,#161616 50%,#0f0f0f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }} />
                    </div>
                  ) : featured ? (
                    <FadeIn>
                      <FeaturedVideoSection project={featured} onExpand={() => setModalProject(featured)} />
                    </FadeIn>
                  ) : null}

                  {/* Artist Projects */}
                  <FadeIn>
                    <div>
                      <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#EEE5E9', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
                        Artist Projects
                      </h2>
                      <p className="font-sans text-sm mt-1.5 mb-7" style={{ color: 'rgba(238,229,233,0.3)', fontStyle: 'italic' }}>
                        Motion design work for music artists
                      </p>
                      {projectsLoading ? (
                        <div className="flex gap-4 overflow-hidden">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="shrink-0 rounded-[20px]" style={{ width: 'clamp(200px, 26vw, 290px)', aspectRatio: '1/1', background: 'linear-gradient(90deg,#0f0f0f 25%,#161616 50%,#0f0f0f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }} />
                          ))}
                        </div>
                      ) : (
                        <ConveyorReel projects={[...clients, ...untagged]} onSelect={setModalProject} />
                      )}
                    </div>
                  </FadeIn>

                  {/* Personal Projects */}
                  <FadeIn>
                    <div>
                      <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: '#EEE5E9', letterSpacing: '-0.04em', lineHeight: 0.95 }}>
                        Personal Projects
                      </h2>
                      <p className="font-sans text-sm mt-1.5 mb-7" style={{ color: 'rgba(238,229,233,0.3)', fontStyle: 'italic' }}>
                        Edits made for the love of it
                      </p>
                      {projectsLoading ? (
                        <div className="flex gap-4 overflow-hidden">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="shrink-0 rounded-[20px]" style={{ width: 'clamp(200px, 26vw, 290px)', aspectRatio: '1/1', background: 'linear-gradient(90deg,#0f0f0f 25%,#161616 50%,#0f0f0f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }} />
                          ))}
                        </div>
                      ) : (
                        <ConveyorReel projects={personal} onSelect={setModalProject} />
                      )}
                    </div>
                  </FadeIn>
                </div>
              )
            })()

          ) : (

            /* ── Video grid: 2-col (Commercial) ── */
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10">
                {projectsLoading
                  ? Array.from({ length: PER_PAGE }).map((_, i) => (
                      <div key={i} className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', background: 'linear-gradient(90deg,#0f0f0f 25%,#161616 50%,#0f0f0f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }} />
                    ))
                  : [
                      ...paginated.map((project, i) => (
                        <FadeIn key={project.id} delay={i * 60}>
                          <VideoCard project={project} priority={i < 2} />
                        </FadeIn>
                      )),
                      ...Array.from({ length: Math.max(0, PER_PAGE - paginated.length) }).map((_, i) => (
                        <div key={`ph-${i}`} style={{ aspectRatio: '16/9' }} />
                      )),
                    ]
                }
              </div>
              {!projectsLoading && filtered.length === 0 && (
                <p className="font-sans text-sm text-center pt-6" style={{ color: 'rgba(238,229,233,0.2)' }}>
                  No commercial projects yet.
                </p>
              )}
              <PaginationLine total={totalPages} current={page} onChange={setPage} />
            </>

          )}

        </div>
      </div>

      {/* ── Process timeline ── */}
      <ProcessTimeline tab={activeTab} />

      {/* ── CTA pill — 3D glass ── */}
      <div className="flex justify-center pb-20">
        <Link
          href="/quote"
          className="relative overflow-hidden font-sans uppercase"
          style={{
            fontSize:             '13px',
            fontWeight:           500,
            letterSpacing:        '0.07em',
            padding:              '14px 40px',
            borderRadius:         '9999px',
            backdropFilter:       'blur(16px) saturate(180%)',
            background:           'linear-gradient(180deg, rgba(238,229,233,0.13) 0%, rgba(238,229,233,0.05) 55%, rgba(207,92,54,0.07) 100%)',
            border:               '1px solid rgba(238,229,233,0.16)',
            boxShadow:            [
              'inset 0 2px 0 rgba(255,255,255,0.22)',
              'inset 0 -1px 0 rgba(207,92,54,0.4)',
              '0 1px 0 rgba(207,92,54,0.25)',
              '0 8px 24px rgba(0,0,0,0.55)',
              '0 20px 48px rgba(207,92,54,0.14)',
            ].join(', '),
            color:                'rgba(238,229,233,0.92)',
            transition:           'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
          }}
          onMouseEnter={e => {
            const s = e.currentTarget.style as unknown as Record<string, string>
            s['background']  = 'linear-gradient(180deg, rgba(238,229,233,0.18) 0%, rgba(238,229,233,0.08) 55%, rgba(207,92,54,0.11) 100%)'
            s['boxShadow']   = [
              'inset 0 2px 0 rgba(255,255,255,0.32)',
              'inset 0 -1px 0 rgba(207,92,54,0.55)',
              '0 1px 0 rgba(207,92,54,0.35)',
              '0 12px 32px rgba(0,0,0,0.6)',
              '0 28px 56px rgba(207,92,54,0.22)',
            ].join(', ')
            s['transform']   = 'translateY(-1px)'
            s['color']       = '#EEE5E9'
          }}
          onMouseLeave={e => {
            const s = e.currentTarget.style as unknown as Record<string, string>
            s['background']  = 'linear-gradient(180deg, rgba(238,229,233,0.13) 0%, rgba(238,229,233,0.05) 55%, rgba(207,92,54,0.07) 100%)'
            s['boxShadow']   = [
              'inset 0 2px 0 rgba(255,255,255,0.22)',
              'inset 0 -1px 0 rgba(207,92,54,0.4)',
              '0 1px 0 rgba(207,92,54,0.25)',
              '0 8px 24px rgba(0,0,0,0.55)',
              '0 20px 48px rgba(207,92,54,0.14)',
            ].join(', ')
            s['transform']   = 'translateY(0)'
            s['color']       = 'rgba(238,229,233,0.92)'
          }}
        >
          get a quote →
        </Link>
      </div>

      {/* ── Reviews ── */}
      <div className="px-4 sm:px-8 py-12 sm:py-20">
        <div className="max-w-5xl mx-auto">

          <FadeIn>
            <div className="mb-10">
              <p className="font-sans text-xs tracking-[0.14em] uppercase mb-2" style={{ color: 'rgba(207,92,54,0.7)' }}>
                What they say
              </p>
              <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', color: '#EEE5E9', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                From {activeTab === 'Websites' ? 'web' : activeTab.toLowerCase()} clients.
              </h2>
            </div>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-16" style={{ minHeight: '220px' }}>
            {reviews.map((r, i) => (
              <FadeIn key={r.id} delay={i * 50}>
                <WorkReviewCard review={r} />
              </FadeIn>
            ))}
            {reviews.length === 0 && (
              <p className="font-sans text-sm col-span-full self-center" style={{ color: 'rgba(238,229,233,0.18)' }}>
                No reviews for this category yet — be the first.
              </p>
            )}
          </div>

          {/* Divider */}
          <div className="mb-10" style={{ borderTop: '1px solid rgba(238,229,233,0.06)' }} />

          {/* Add review */}
          <FadeIn>
            <div className="mb-6">
              <p className="font-sans text-xs tracking-[0.14em] uppercase mb-1" style={{ color: 'rgba(207,92,54,0.7)' }}>
                Add your review
              </p>
              <p className="font-sans text-sm" style={{ color: 'rgba(238,229,233,0.35)' }}>
                Worked with kulaire on a {activeTab === 'Websites' ? 'web' : activeTab.toLowerCase()} project? Leave a note.
              </p>
            </div>
            <ReviewForm category={activeTab} />
          </FadeIn>

        </div>
      </div>

      {/* ── Floating category hotbar ── */}
      <div
        className="fixed bottom-6 left-0 right-0 z-50 flex justify-center pointer-events-none"
        style={{
          transform:  showHotbar ? 'translateY(0)' : 'translateY(calc(100% + 24px))',
          transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <div
          className="flex items-center gap-1 pointer-events-auto"
          style={{
            padding:              '6px',
            borderRadius:         '9999px',
            backdropFilter:       'blur(28px) saturate(180%)',
            WebkitBackdropFilter: 'blur(28px) saturate(180%)',
            background:           'rgba(12,12,12,0.75)',
            border:               '1px solid rgba(238,229,233,0.1)',
            boxShadow:            '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
          }}
        >
          {TABS.map(tab => {
            const active = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex items-center gap-2 font-sans text-xs tracking-[0.08em] uppercase transition-all duration-200"
                style={{
                  height:       '36px',
                  paddingLeft:  '12px',
                  paddingRight: '12px',
                  borderRadius: '9999px',
                  background:   active ? '#CF5C36' : 'transparent',
                  color:        active ? '#fff' : 'rgba(238,229,233,0.45)',
                  border:       'none',
                  cursor:       'pointer',
                  whiteSpace:   'nowrap',
                }}
              >
                <span style={{ opacity: active ? 1 : 0.7 }}>{TAB_ICONS[tab]}</span>
                <span className="hidden sm:inline">{tab}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Artist modal ── */}
      {modalProject && (
        <ArtistModal project={modalProject} onClose={() => setModalProject(null)} />
      )}

    </main>
  )
}
