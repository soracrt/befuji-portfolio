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

function VideoCard({ project, priority = false }: { project: Project; priority?: boolean }) {
  const videoRef       = useRef<HTMLVideoElement>(null)
  const containerRef   = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const fillRef        = useRef<HTMLDivElement>(null)
  const draggingRef    = useRef(false)
  const rafRef         = useRef(0)
  const [playing, setPlaying]     = useState(true)
  const [muted, setMuted]         = useState(true)
  const [progress, setProgress]   = useState(0)
  const [currentTime, setCurrentTime] = useState('0:00')
  const [duration, setDuration]       = useState('0:00')
  const [loaded, setLoaded]           = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Priority cards: load immediately on mount — no waiting for viewport
    if (priority) {
      video.src = project.video
      video.load()
      video.addEventListener('canplay', () => setLoaded(true), { once: true })
    } else {
      const loadObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          video.src = project.video
          video.load()
          video.addEventListener('canplay', () => setLoaded(true), { once: true })
          loadObserver.disconnect()
        }
      }, { rootMargin: '50px' })
      loadObserver.observe(video)
    }

    // Pause when off-screen, play when back in view
    const playObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) { video.play().catch(() => {}) }
      else { video.pause() }
    }, { rootMargin: '0px', threshold: 0.1 })

    playObserver.observe(video)
    return () => { playObserver.disconnect() }
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
      v.muted = false; v.volume = 0.5; setMuted(false)
      activeUnmute = { mute: () => { if (videoRef.current) videoRef.current.muted = true; setMuted(true) } }
    } else {
      v.muted = true; setMuted(true); activeUnmute = null
    }
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
    <div>
      <div ref={containerRef} className="relative rounded-2xl overflow-hidden bg-[#0a0a0a] group">
        {!loaded && (
          <div className="absolute inset-0 z-10" style={{
            background: 'linear-gradient(90deg,#0f0f0f 25%,#161616 50%,#0f0f0f 75%)',
            backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite',
          }} />
        )}
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
              <button onClick={toggleMute} className="text-white/70 hover:text-white transition-colors" aria-label={muted ? 'Unmute' : 'Mute'}>
                {muted
                  ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                  : <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>}
              </button>
              <span className="ml-auto font-mono text-[11px] text-white/40 tabular-nums">{currentTime} / {duration}</span>
              <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-colors" aria-label="Fullscreen">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9" /><polyline points="9 21 3 21 3 15" /><line x1="21" y1="3" x2="14" y2="10" /><line x1="3" y1="21" x2="10" y2="14" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
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
  Digital:    ['Stackline', 'Frameshifts', 'Loopkit', 'Web Studio', 'Digital Co'],
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

// ─── Submit review form ───────────────────────────────────────────────────────

function ReviewForm({ category }: { category: string }) {
  const [form, setForm]       = useState({ name: '', service: '', company: '', text: '' })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]             = useState(false)
  const [error, setError]           = useState('')

  const SERVICE_BY_CAT: Record<string, string[]> = {
    Commercial: ['Ads', 'SaaS', 'Film', 'Motion Graphics', 'Other'],
    Artists:    ['Artist Promo', 'Music Video', 'Film', 'Other'],
    Digital:    ['Web Development', 'SaaS', 'Other'],
  }
  const services = SERVICE_BY_CAT[category] ?? SERVICE_BY_CAT['Commercial']

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name || !form.service || !form.text) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, category: category.toLowerCase() }),
      })
      if (res.ok) { setDone(true) } else { setError('Something went wrong. Try again.') }
    } catch { setError('Something went wrong. Try again.') }
    setSubmitting(false)
  }

  const inputStyle = {
    background: 'rgba(238,229,233,0.03)',
    border: '1px solid rgba(238,229,233,0.08)',
    color: '#EEE5E9',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  }

  if (done) return (
    <div className="flex flex-col items-center justify-center py-10 text-center gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(207,92,54,0.12)', border: '1px solid rgba(207,92,54,0.3)' }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CF5C36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      </div>
      <p className="font-sans text-sm" style={{ color: 'rgba(238,229,233,0.5)' }}>
        Review submitted — pending approval.
      </p>
    </div>
  )

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="font-sans" style={{ fontSize: '11px', color: 'rgba(238,229,233,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Name *</label>
          <input style={inputStyle} placeholder="Your name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            onFocus={e => { e.currentTarget.style.border = '1px solid rgba(207,92,54,0.35)' }}
            onBlur={e => { e.currentTarget.style.border = '1px solid rgba(238,229,233,0.08)' }} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-sans" style={{ fontSize: '11px', color: 'rgba(238,229,233,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Service *</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.service} onChange={e => setForm(f => ({ ...f, service: e.target.value }))}
            onFocus={e => { e.currentTarget.style.border = '1px solid rgba(207,92,54,0.35)' }}
            onBlur={e => { e.currentTarget.style.border = '1px solid rgba(238,229,233,0.08)' }}>
            <option value="" disabled>Select service</option>
            {services.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-sans" style={{ fontSize: '11px', color: 'rgba(238,229,233,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Company / Brand <span style={{ opacity: 0.4 }}>(optional)</span></label>
        <input style={inputStyle} placeholder="Where you're from" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
          onFocus={e => { e.currentTarget.style.border = '1px solid rgba(207,92,54,0.35)' }}
          onBlur={e => { e.currentTarget.style.border = '1px solid rgba(238,229,233,0.08)' }} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label className="font-sans" style={{ fontSize: '11px', color: 'rgba(238,229,233,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your review *</label>
        <textarea rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: '1.6' }} placeholder="What was working with kulaire like?" value={form.text}
          onChange={e => setForm(f => ({ ...f, text: e.target.value }))}
          onFocus={e => { e.currentTarget.style.border = '1px solid rgba(207,92,54,0.35)' }}
          onBlur={e => { e.currentTarget.style.border = '1px solid rgba(238,229,233,0.08)' }} />
      </div>
      {error && <p className="font-sans text-xs" style={{ color: '#f87171' }}>{error}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={submitting || !form.name || !form.service || !form.text}
          className="font-sans text-xs tracking-[0.1em] uppercase px-6 py-2.5 rounded-full transition-all duration-200"
          style={{
            background: (!form.name || !form.service || !form.text) ? 'rgba(238,229,233,0.06)' : '#CF5C36',
            color:      (!form.name || !form.service || !form.text) ? 'rgba(238,229,233,0.2)' : '#fff',
            cursor:     (!form.name || !form.service || !form.text) ? 'not-allowed' : 'pointer',
          }}>
          {submitting ? '···' : 'Submit review'}
        </button>
      </div>
    </form>
  )
}

// ─── Tabs + routing ───────────────────────────────────────────────────────────

const TABS = ['Commercial', 'Artists', 'Digital']
const PER_PAGE = 4

function matchesTab(category: string | null, tab: string) {
  const cat = (category || '').toLowerCase()
  if (tab === 'Commercial') return ['ads', 'ad', 'film', 'saas', 'business', 'motion'].some(m => cat.includes(m))
  if (tab === 'Artists')    return ['artist', 'music', 'community'].some(m => cat.includes(m))
  if (tab === 'Digital')    return ['web', 'website', 'digital'].some(m => cat.includes(m))
  return false
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorkPage() {
  const [projects, setProjects]         = useState<Project[]>([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [reviews, setReviews]           = useState<Review[]>([])
  const [activeTab, setActiveTab]       = useState('Commercial')
  const [page, setPage]                 = useState(0)

  useEffect(() => {
    fetch('/api/admin/projects')
      .then(r => r.json())
      .then((data: Project[]) => { if (Array.isArray(data)) setProjects(data) })
      .catch(() => {})
      .finally(() => setProjectsLoading(false))
  }, [])

  // Reload approved reviews whenever tab changes
  useEffect(() => {
    fetch(`/api/reviews?category=${activeTab.toLowerCase()}&approved=true`)
      .then(r => r.json())
      .then((data: Review[]) => { if (Array.isArray(data)) setReviews(data) })
      .catch(() => setReviews([]))
  }, [activeTab])

  // Reset to page 0 when tab changes
  useEffect(() => { setPage(0) }, [activeTab])

  const filtered    = projects.filter(p => matchesTab(p.category, activeTab))
  const totalPages  = Math.ceil(filtered.length / PER_PAGE)
  const paginated   = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE)

  return (
    <main>
      <style>{`
        @keyframes shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
        @keyframes marquee { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }
      `}</style>

      <div className="pt-32 pb-16 px-8">
        <div className="max-w-5xl mx-auto">

          {/* Back */}
          <FadeIn>
            <div className="mb-12">
              <BackButton href="/" />
            </div>
          </FadeIn>

          {/* Heading + tabs */}
          <FadeIn>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
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

          {/* Grid — always 2×2 space reserved */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10">
            {projectsLoading
              ? Array.from({ length: PER_PAGE }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden" style={{ aspectRatio: '16/9', background: 'linear-gradient(90deg,#0f0f0f 25%,#161616 50%,#0f0f0f 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.6s infinite' }} />
                ))
              : paginated.map((project, i) => (
                  <FadeIn key={project.id} delay={i * 60}>
                    <VideoCard project={project} priority={i < 2} />
                  </FadeIn>
                ))
            }
          </div>

          {!projectsLoading && filtered.length === 0 && (
            <p className="font-sans text-sm text-center pt-6" style={{ color: 'rgba(238,229,233,0.2)' }}>
              No {activeTab.toLowerCase()} projects yet.
            </p>
          )}

          {/* Segmented pagination line */}
          <PaginationLine total={totalPages} current={page} onChange={setPage} />

        </div>
      </div>

      {/* ── Marquee ── */}
      <div className="max-w-5xl mx-auto px-0 overflow-hidden">
        <Marquee tab={activeTab} />
      </div>

      {/* ── Reviews ── */}
      <div className="px-8 py-20">
        <div className="max-w-5xl mx-auto">

          <FadeIn>
            <div className="mb-10">
              <p className="font-sans text-xs tracking-[0.14em] uppercase mb-2" style={{ color: 'rgba(207,92,54,0.7)' }}>
                What they say
              </p>
              <h2 className="font-display font-bold" style={{ fontSize: 'clamp(1.75rem,3.5vw,2.5rem)', color: '#EEE5E9', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
                From {activeTab.toLowerCase()} clients.
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
                Worked with kulaire on a {activeTab.toLowerCase()} project? Leave a note.
              </p>
            </div>
            <ReviewForm category={activeTab} />
          </FadeIn>

        </div>
      </div>

    </main>
  )
}
