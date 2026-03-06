'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ─── Types ────────────────────────────────────────────────────────────────────

type Project = {
  id: string
  title: string
  category: string
  client: string
  video: string
  isRecent: boolean
}

type Review = {
  id: string
  name: string
  service: string
  company?: string
  text: string
  featured: boolean
  createdAt: string
}

type ClientLog = {
  id: string
  clientName: string
  service: string
  projectName: string
  amount: number
  currency: 'USD' | 'IDR'
  status: 'Paid' | 'Pending' | 'Unpaid'
  date: string
  notes: string
}

type Section = 'overview' | 'projects' | 'recent' | 'reviews' | 'clients' | 'finance'
type EditKey = 'title' | 'category' | 'client'
type DisplayCurrency = 'USD' | 'IDR'

// ─── Helpers ──────────────────────────────────────────────────────────────────

const IDR_RATE = 16500

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatCurrency(amount: number, currency: DisplayCurrency) {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount)
}

function toDisplay(amount: number, logCurrency: 'USD' | 'IDR', display: DisplayCurrency): number {
  if (logCurrency === display) return amount
  if (logCurrency === 'USD' && display === 'IDR') return amount * IDR_RATE
  return amount / IDR_RATE
}

// ─── Animated Counter ─────────────────────────────────────────────────────────

function useAnimatedCounter(target: number, duration = 900) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    setVal(0)
    if (target === 0) return
    const start = performance.now()
    let raf: number
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setVal(Math.round(eased * target))
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])
  return val
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconGrid() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function IconFilm() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" /><line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconMessage() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconDragHandle() {
  return (
    <svg width="12" height="16" viewBox="0 0 10 14" fill="currentColor">
      <circle cx="2.5" cy="2" r="1.2" /><circle cx="2.5" cy="7" r="1.2" /><circle cx="2.5" cy="12" r="1.2" />
      <circle cx="7.5" cy="2" r="1.2" /><circle cx="7.5" cy="7" r="1.2" /><circle cx="7.5" cy="12" r="1.2" />
    </svg>
  )
}

function IconSignOut() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

function IconPerson() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconDollar() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconGlobe() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconExternalLink() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

// ─── Password Gate ────────────────────────────────────────────────────────────

function PasswordGate({ onAuth }: { onAuth: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!value) return
    setLoading(true)
    setError(false)
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      body: JSON.stringify({ password: value }),
      headers: { 'Content-Type': 'application/json' },
    })
    setLoading(false)
    if (res.ok) {
      sessionStorage.setItem('admin_authed', 'true')
      onAuth()
    } else {
      setError(true)
      setValue('')
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{ background: 'radial-gradient(ellipse at 50% 36%, #353534 0%, #000000 64%)' }}
    >
      <div className="absolute top-6 left-7">
        <Link
          href="/"
          className="font-sans text-[#606060] hover:text-[#909090] transition-colors inline-flex items-center gap-1.5"
          style={{ fontSize: '15px', letterSpacing: '-0.01em' }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-[296px]">
          <div className="flex justify-center mb-8">
            <Image src="/logo.png" alt="Logo" width={40} height={40} style={{ objectFit: 'contain' }} />
          </div>

          <h1
            className="font-sans text-white font-medium text-center mb-1.5"
            style={{ fontSize: '24px', letterSpacing: '-0.03em', lineHeight: '1.25' }}
          >
            Welcome back, Ghazi.
          </h1>
          <p
            className="font-sans text-center mb-8"
            style={{ fontSize: '17px', color: '#707070', letterSpacing: '-0.01em' }}
          >
            Enter your password to continue.
          </p>

          <form onSubmit={submit} className="flex flex-col gap-2.5">
            <input
              type="password"
              value={value}
              onChange={e => { setValue(e.target.value); setError(false) }}
              placeholder="Password"
              autoFocus
              className={`w-full bg-[#2c2c2b] rounded-xl px-4 py-3 font-sans text-sm text-white/90 placeholder-[#272727] outline-none transition-all ring-1 ${
                error ? 'ring-red-500/20' : 'ring-[#3a3a3a] focus:ring-[#484848]'
              }`}
              style={{ letterSpacing: '-0.01em' }}
            />
            {error && (
              <p className="font-sans text-red-400/50 text-center -mt-0.5" style={{ fontSize: '16px' }}>
                Incorrect password. Try again.
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !value}
              className="w-full bg-white hover:bg-white/90 text-[#0a0a0a] font-sans font-medium py-3.5 rounded-xl transition-all disabled:opacity-20 mt-0.5"
              style={{ fontSize: '15px', letterSpacing: '-0.01em' }}
            >
              {loading ? '···' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Dock ─────────────────────────────────────────────────────────────────────

const NAV: { id: Section; label: string; icon: React.ReactNode; shortcut: string }[] = [
  { id: 'overview', label: 'Overview', icon: <IconGrid />,    shortcut: '1' },
  { id: 'projects', label: 'Projects', icon: <IconFilm />,    shortcut: '2' },
  { id: 'recent',   label: 'Featured', icon: <IconStar />,    shortcut: '3' },
  { id: 'reviews',  label: 'Reviews',  icon: <IconMessage />, shortcut: '4' },
  { id: 'clients',  label: 'Clients',  icon: <IconPerson />,  shortcut: '5' },
  { id: 'finance',  label: 'Finance',  icon: <IconDollar />,  shortcut: '6' },
]

function DockItem({
  children,
  tooltip,
  shortcut,
  active,
  onClick,
  danger,
}: {
  children: React.ReactNode
  tooltip: string
  shortcut?: string
  active?: boolean
  onClick: () => void
  danger?: boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="relative flex flex-col items-center">
      {hovered && (
        <div
          className="absolute bottom-full mb-3 px-2.5 py-1.5 rounded-lg font-sans whitespace-nowrap pointer-events-none flex items-center gap-2"
          style={{
            fontSize: '16px',
            letterSpacing: '-0.01em',
            background: 'rgba(20,20,20,0.97)',
            color: 'rgba(255,255,255,0.65)',
            boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 4px 12px rgba(0,0,0,0.6)',
          }}
        >
          {tooltip}
          {shortcut && (
            <kbd
              className="font-mono rounded"
              style={{ fontSize: '10px', padding: '1px 5px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {shortcut}
            </kbd>
          )}
        </div>
      )}
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-150"
        style={{
          background: active ? 'rgba(255,255,255,0.09)' : 'transparent',
          color: danger
            ? hovered ? '#f87171' : '#585858'
            : active
              ? 'rgba(255,255,255,0.9)'
              : hovered ? 'rgba(255,255,255,0.65)' : '#585858',
        }}
      >
        {children}
        {active && (
          <span
            className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
            style={{ background: 'rgba(255,255,255,0.45)' }}
          />
        )}
      </button>
    </div>
  )
}

function Dock({ active, setActive }: { active: Section; setActive: (s: Section) => void }) {
  function signOut() {
    sessionStorage.removeItem('admin_authed')
    window.location.reload()
  }

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 px-3 py-2"
      style={{
        background: 'rgba(10,10,10,0.92)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderRadius: '18px',
        boxShadow: '0 0 0 1px rgba(255,255,255,0.07), 0 8px 40px rgba(0,0,0,0.8)',
      }}
    >
      <div className="flex items-center justify-center w-10 h-10 mr-0.5">
        <img src="/icon.png" alt="kulaire" className="w-6 h-6 object-contain opacity-40" />
      </div>

      <div className="w-px h-5 mx-0.5" style={{ background: 'rgba(255,255,255,0.07)' }} />

      {NAV.map(({ id, label, icon, shortcut }) => (
        <DockItem key={id} active={active === id} onClick={() => setActive(id)} tooltip={label} shortcut={shortcut}>
          {icon}
        </DockItem>
      ))}

      <div className="w-px h-5 mx-0.5" style={{ background: 'rgba(255,255,255,0.07)' }} />

      <DockItem onClick={signOut} tooltip="Sign out" danger>
        <IconSignOut />
      </DockItem>
    </div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, onClick }: { label: string; value: number; sub?: string; onClick?: () => void }) {
  const animated = useAnimatedCounter(value)
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-3 ${onClick ? 'cursor-pointer' : ''}`}
      style={{ background: '#181818', boxShadow: '0 0 0 1px #282828' }}
      onClick={onClick}
    >
      <div className="font-sans" style={{ fontSize: '15px', letterSpacing: '0.13em', color: '#888888' }}>
        {label}
      </div>
      <div
        className="font-sans text-white font-medium tabular-nums flex items-baseline gap-1"
        style={{ fontSize: '48px', letterSpacing: '-0.04em', lineHeight: 1 }}
      >
        {animated}
        {sub && <span style={{ fontSize: '24px', color: '#707070' }}>{sub}</span>}
      </div>
    </div>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewSection({
  projects,
  reviews,
  clients,
  currency,
  onNavigate,
}: {
  projects: Project[]
  reviews: Review[]
  clients: ClientLog[]
  currency: DisplayCurrency
  onNavigate: (s: Section) => void
}) {
  const [showPreview, setShowPreview] = useState(false)
  const now = new Date()
  const thisMonth = now.getMonth()
  const thisYear = now.getFullYear()

  const recent = projects.filter(p => p.isRecent)
  const paidClients = clients.filter(c => c.status === 'Paid')

  const monthRevenue = paidClients
    .filter(c => { const d = new Date(c.date); return d.getMonth() === thisMonth && d.getFullYear() === thisYear })
    .reduce((sum, c) => sum + toDisplay(c.amount, c.currency, currency), 0)

  const yearRevenue = paidClients
    .filter(c => new Date(c.date).getFullYear() === thisYear)
    .reduce((sum, c) => sum + toDisplay(c.amount, c.currency, currency), 0)

  const latestClients = [...clients]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4)

  return (
    <div className="w-full px-8 py-10 max-w-7xl mx-auto">
      {/* Greeting row */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1
            className="font-sans text-white font-medium"
            style={{ fontSize: '40px', letterSpacing: '-0.04em', lineHeight: 1.1 }}
          >
            {getGreeting()}, Ghazi.
          </h1>
          <p className="font-sans mt-1.5" style={{ fontSize: '16px', color: '#888888', letterSpacing: '-0.01em' }}>
            {now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <button
          onClick={() => setShowPreview(v => !v)}
          className="flex items-center gap-2 font-sans transition-all"
          style={{
            fontSize: '15px',
            letterSpacing: '-0.01em',
            color: showPreview ? 'rgba(255,255,255,0.65)' : '#585858',
            padding: '8px 14px',
            borderRadius: '10px',
            background: showPreview ? '#161616' : 'transparent',
            border: '1px solid',
            borderColor: showPreview ? '#252525' : 'transparent',
          }}
        >
          <IconGlobe />
          {showPreview ? 'Hide preview' : 'Live preview'}
        </button>
      </div>

      {/* Live preview */}
      {showPreview && (
        <div
          className="mb-8 rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 0 0 1px #282828', height: '500px' }}
        >
          <div
            className="flex items-center gap-3 px-4 py-2.5"
            style={{ background: '#181818', borderBottom: '1px solid #181818' }}
          >
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full" style={{ background: '#252525' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#252525' }} />
              <div className="w-3 h-3 rounded-full" style={{ background: '#252525' }} />
            </div>
            <div
              className="flex-1 mx-4 rounded-md px-3 py-1 font-sans text-center"
              style={{ background: '#1e1e1e', fontSize: '16px', color: '#787878' }}
            >
              {typeof window !== 'undefined' ? window.location.origin : ''}
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#484848] hover:text-[#787878] transition-colors"
            >
              <IconExternalLink />
            </a>
          </div>
          <iframe
            src="/"
            className="w-full"
            style={{ height: 'calc(500px - 41px)', border: 'none', background: '#000' }}
            title="Live site preview"
          />
        </div>
      )}

      {/* Stat cards */}
      <div className="grid gap-3 mb-8" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        <StatCard label="PROJECTS" value={projects.length} onClick={() => onNavigate('projects')} />
        <StatCard label="FEATURED" value={recent.length} sub="/3" onClick={() => onNavigate('recent')} />
        <StatCard label="REVIEWS" value={reviews.length} onClick={() => onNavigate('reviews')} />
        <StatCard label="CLIENTS" value={clients.length} onClick={() => onNavigate('clients')} />

        {/* Revenue card */}
        <div
          className="rounded-2xl p-5 flex flex-col gap-2 cursor-pointer"
          style={{ background: '#181818', boxShadow: '0 0 0 1px #282828' }}
          onClick={() => onNavigate('finance')}
        >
          <div className="flex items-center justify-between">
            <span className="font-sans" style={{ fontSize: '15px', letterSpacing: '0.13em', color: '#888888' }}>
              REVENUE
            </span>
            <span className="font-sans" style={{ fontSize: '12px', letterSpacing: '0.1em', color: '#383838' }}>
              {thisYear}
            </span>
          </div>
          <div
            className="font-sans text-white font-medium"
            style={{ fontSize: '24px', letterSpacing: '-0.03em', lineHeight: 1.1, marginTop: '4px' }}
          >
            {formatCurrency(yearRevenue, currency)}
          </div>
          <div className="font-sans" style={{ fontSize: '16px', color: '#787878', letterSpacing: '-0.01em' }}>
            {formatCurrency(monthRevenue, currency)} this month
          </div>
        </div>
      </div>

      {/* Two column lower section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Featured on homepage */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans" style={{ fontSize: '15px', letterSpacing: '0.13em', color: '#888888' }}>
              FEATURED ON HOMEPAGE
            </span>
            <button
              onClick={() => onNavigate('recent')}
              className="font-sans hover:text-[#909090] transition-colors"
              style={{ fontSize: '16px', color: '#787878' }}
            >
              Manage →
            </button>
          </div>

          {recent.length === 0 ? (
            <div
              className="rounded-xl px-5 py-5"
              style={{ background: '#181818', boxShadow: '0 0 0 1px #282828' }}
            >
              <p className="font-sans text-[#484848]" style={{ fontSize: '15px' }}>No featured projects yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {recent.map((p, i) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3.5 rounded-xl px-5 py-3.5"
                  style={{ background: '#181818', boxShadow: '0 0 0 1px #282828' }}
                >
                  <span
                    className="font-sans tabular-nums shrink-0"
                    style={{ fontSize: '16px', color: '#707070', width: '14px' }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="font-sans text-white/90 flex-1 truncate"
                    style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
                  >
                    {p.title || 'Untitled'}
                  </span>
                  {p.category && (
                    <span
                      className="font-sans shrink-0"
                      style={{ fontSize: '15px', letterSpacing: '0.1em', color: '#909090' }}
                    >
                      {p.category.toUpperCase()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest clients */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-sans" style={{ fontSize: '15px', letterSpacing: '0.13em', color: '#888888' }}>
              LATEST CLIENTS
            </span>
            <button
              onClick={() => onNavigate('clients')}
              className="font-sans hover:text-[#909090] transition-colors"
              style={{ fontSize: '16px', color: '#787878' }}
            >
              View all →
            </button>
          </div>

          {latestClients.length === 0 ? (
            <div
              className="rounded-xl px-5 py-5"
              style={{ background: '#181818', boxShadow: '0 0 0 1px #282828' }}
            >
              <p className="font-sans text-[#484848]" style={{ fontSize: '15px' }}>No clients logged yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {latestClients.map(c => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 rounded-xl px-5 py-3.5"
                  style={{ background: '#181818', boxShadow: '0 0 0 1px #282828' }}
                >
                  <span
                    className="font-sans text-white/90 flex-1 truncate"
                    style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
                  >
                    {c.clientName}
                  </span>
                  <span className="font-sans shrink-0" style={{ fontSize: '16px', color: '#909090' }}>
                    {c.service}
                  </span>
                  <span
                    className="font-sans shrink-0 px-2 py-0.5 rounded-md"
                    style={{
                      fontSize: '15px',
                      letterSpacing: '0.06em',
                      background:
                        c.status === 'Paid' ? 'rgba(34,197,94,0.08)' :
                        c.status === 'Pending' ? 'rgba(234,179,8,0.08)' : 'rgba(239,68,68,0.08)',
                      color:
                        c.status === 'Paid' ? '#4ade80' :
                        c.status === 'Pending' ? '#facc15' : '#f87171',
                    }}
                  >
                    {c.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Keyboard shortcuts */}
      <div className="flex items-center gap-5 mt-10 justify-center">
        {NAV.map(n => (
          <div key={n.id} className="flex items-center gap-1.5">
            <kbd
              className="font-mono rounded"
              style={{ fontSize: '10px', padding: '2px 6px', background: '#181818', color: '#707070', border: '1px solid #1e1e1e' }}
            >
              {n.shortcut}
            </kbd>
            <span className="font-sans" style={{ fontSize: '15px', color: '#363636' }}>{n.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Editable Cell ────────────────────────────────────────────────────────────

function EditableCell({
  value,
  editValue,
  placeholder,
  isEditing,
  onStart,
  onChange,
  onCommit,
  onCancel,
}: {
  value: string
  editValue: string
  placeholder: string
  isEditing: boolean
  onStart: () => void
  onChange: (v: string) => void
  onCommit: () => void
  onCancel: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={e => onChange(e.target.value)}
        onBlur={onCommit}
        onKeyDown={e => {
          if (e.key === 'Enter') onCommit()
          if (e.key === 'Escape') onCancel()
        }}
        placeholder={placeholder}
        className="bg-[#1e1e1e] rounded-md px-2 py-1 text-white/90 outline-none w-full font-sans ring-1 ring-[#343434]"
        style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
      />
    )
  }

  return (
    <span
      onClick={onStart}
      title="Click to edit"
      className="cursor-pointer font-sans text-white/85 hover:text-white/95 transition-colors truncate block"
      style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
    >
      {value || <span className="text-[#404040]">{placeholder}</span>}
    </span>
  )
}

// ─── Category Select ──────────────────────────────────────────────────────────

function CategorySelect({
  value,
  onChange,
  options = ['Ads', 'SaaS', 'Others'],
}: {
  value: string
  onChange: (v: string) => void
  options?: string[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full bg-[#161616] rounded-xl px-4 py-3 font-sans text-white/90 outline-none ring-1 ring-[#222] hover:ring-[#2e2e2e] transition-all text-left flex items-center justify-between"
        style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
      >
        {value || <span style={{ color: '#707070' }}>—</span>}
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-[#404040] shrink-0 transition-transform"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 right-0 z-10 rounded-xl overflow-hidden"
          style={{
            top: 'calc(100% + 4px)',
            background: '#1e1e1e',
            boxShadow: '0 0 0 1px #2e2e2e, 0 8px 24px rgba(0,0,0,0.7)',
          }}
        >
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-4 py-3 font-sans transition-colors ${
                opt === value
                  ? 'bg-[#2a2a2a] text-white/90'
                  : 'text-white/50 hover:bg-[#252525] hover:text-white/85'
              }`}
              style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Upload Modal ─────────────────────────────────────────────────────────────

function UploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (project: Project) => void }) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Ads')
  const [client, setClient] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  function acceptFile(f: File) {
    if (f.type === 'video/mp4' || f.type === 'video/quicktime') setFile(f)
  }

  function formatSize(bytes: number) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!file) return
    setUploading(true)
    setProgress(0)
    setError('')
    try {
      const urlRes = await fetch(`/api/admin/upload-url?filename=${encodeURIComponent(file.name)}`)
      if (!urlRes.ok) throw new Error('Failed to get upload URL')
      const { url, key, publicUrl, contentType } = await urlRes.json()

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', url)
        xhr.setRequestHeader('Content-Type', contentType)
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100))
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else reject(new Error(`Upload failed (${xhr.status})`))
        }
        xhr.onerror = () => reject(new Error('Network error during upload'))
        xhr.send(file)
      })

      const baseName = key.replace(/\.[^/.]+$/, '')
      const project: Project = {
        id: key,
        title: title || baseName.replace(/[-_]/g, ' '),
        category,
        client,
        video: publicUrl,
        isRecent: false,
      }
      await fetch('/api/admin/projects', {
        method: 'POST',
        body: JSON.stringify(project),
        headers: { 'Content-Type': 'application/json' },
      })
      onSuccess(project)
    } catch (err) {
      console.error('[upload]', err)
      setError(err instanceof Error ? err.message : 'Upload failed')
      setUploading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={uploading ? undefined : onClose}
    >
      <div
        className="relative rounded-2xl w-full max-w-[480px] mx-4"
        style={{ background: '#181818', boxShadow: '0 0 0 1px #222, 0 24px 64px rgba(0,0,0,0.8)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <span className="font-sans text-white/90 font-medium" style={{ fontSize: '15px', letterSpacing: '-0.02em' }}>
              Upload video
            </span>
            <button
              type="button"
              onClick={uploading ? undefined : onClose}
              disabled={uploading}
              className="text-[#686868] hover:text-[#a0a0a0] transition-colors p-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <IconClose />
            </button>
          </div>

          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => {
              e.preventDefault()
              setDragging(false)
              const f = e.dataTransfer.files[0]
              if (f) acceptFile(f)
            }}
            onClick={() => { if (!file) fileInputRef.current?.click() }}
            className="rounded-xl mb-4 transition-all"
            style={{
              border: `1.5px dashed ${dragging ? '#3a3a3a' : '#272727'}`,
              background: dragging ? '#161616' : '#111111',
              cursor: file ? 'default' : 'pointer',
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".mp4,.mov,video/mp4,video/quicktime"
              className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) acceptFile(f) }}
            />
            {file ? (
              <div className="px-4 py-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#1a1a1a' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#606060" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-white/70 truncate" style={{ fontSize: '16px', letterSpacing: '-0.01em' }}>{file.name}</div>
                  <div className="font-sans mt-0.5" style={{ fontSize: '15px', color: '#888888' }}>{formatSize(file.size)}</div>
                </div>
                <button type="button" onClick={e => { e.stopPropagation(); setFile(null) }} className="text-[#404040] hover:text-[#686868] transition-colors shrink-0">
                  <IconClose />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e2e2e" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="font-sans text-center" style={{ fontSize: '15px', color: '#707070', letterSpacing: '-0.01em' }}>
                  Drop mp4 or mov, or <span style={{ color: '#c8c8c8' }}>browse</span>
                </span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-[#111111] rounded-xl px-4 py-3 font-sans text-white/90 placeholder-[#303030] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#282828] transition-all"
              style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
            />
            <CategorySelect value={category} onChange={setCategory} />
            <input
              value={client}
              onChange={e => setClient(e.target.value)}
              placeholder="Client"
              className="w-full bg-[#111111] rounded-xl px-4 py-3 font-sans text-white/90 placeholder-[#303030] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#282828] transition-all"
              style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
            />

            {uploading ? (
              <div className="mt-1">
                <div className="w-full rounded-full overflow-hidden" style={{ height: '3px', background: '#1e1e1e' }}>
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{ width: `${progress}%`, background: 'rgba(255,255,255,0.6)' }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="font-sans text-[#585858]" style={{ fontSize: '16px' }}>Uploading to R2</span>
                  <span className="font-sans text-[#585858] tabular-nums" style={{ fontSize: '16px' }}>{progress}%</span>
                </div>
              </div>
            ) : (
              <>
                {error && <p className="font-sans text-red-400/60 text-center" style={{ fontSize: '16px' }}>{error}</p>}
                <button
                  type="submit"
                  disabled={!file}
                  className="mt-1 w-full bg-white hover:bg-white/90 text-[#0a0a0a] font-sans font-medium py-3.5 rounded-xl transition-all disabled:opacity-20"
                  style={{ fontSize: '15px', letterSpacing: '-0.01em' }}
                >
                  Upload
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Projects Section ─────────────────────────────────────────────────────────

function ProjectsSection({
  projects,
  setProjects,
}: {
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}) {
  const [showUpload, setShowUpload] = useState(false)
  const [editingCell, setEditingCell] = useState<{ id: string; field: EditKey } | null>(null)
  const [editValue, setEditValue] = useState('')
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)
  const dragIndex = useRef<number | null>(null)

  function startEdit(project: Project, field: EditKey) {
    setEditingCell({ id: project.id, field })
    setEditValue(project[field])
  }

  function commitEdit() {
    if (!editingCell) return
    const { id, field } = editingCell
    const value = editValue
    setEditingCell(null)
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
    fetch('/api/admin/projects', {
      method: 'PUT',
      body: JSON.stringify({ id, [field]: value }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }

  function cancelEdit() { setEditingCell(null) }

  function deleteProject(id: string) {
    setProjects(prev => prev.filter(p => p.id !== id))
    fetch('/api/admin/projects', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }

  function reorderProjects(fromIdx: number, toIdx: number) {
    const next = [...projects]
    const [item] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, item)
    setProjects(next)
    fetch('/api/admin/projects', {
      method: 'PUT',
      body: JSON.stringify({ order: next.map(p => p.id) }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-end mb-5">
        <button
          onClick={() => setShowUpload(true)}
          className="font-sans text-[#686868] hover:text-[#a0a0a0] transition-colors"
          style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
        >
          + Upload video
        </button>
      </div>

      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSuccess={project => {
            setProjects(prev => [...prev, project])
            setShowUpload(false)
          }}
        />
      )}

      {projects.length === 0 ? (
        <p className="font-sans text-[#585858] text-sm">No projects yet. Upload a video to get started.</p>
      ) : (
        <div>
          <div className="grid gap-4 px-5 pb-2 mb-1" style={{ gridTemplateColumns: '20px 96px 1fr 1fr 1fr 32px' }}>
            {(['', '', 'Title', 'Category', 'Client', ''] as const).map((col, i) => (
              <div key={i} className="font-sans" style={{ fontSize: '15px', letterSpacing: '0.11em', color: '#888888' }}>
                {col}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            {projects.map((p, idx) => {
              const isEditing = (field: EditKey) => editingCell?.id === p.id && editingCell.field === field
              const cellProps = (field: EditKey) => ({
                value: p[field],
                editValue: isEditing(field) ? editValue : p[field],
                isEditing: isEditing(field),
                onStart: () => startEdit(p, field),
                onChange: setEditValue,
                onCommit: commitEdit,
                onCancel: cancelEdit,
              })

              return (
                <div
                  key={p.id}
                  draggable
                  onDragStart={() => { dragIndex.current = idx }}
                  onDragEnd={() => { dragIndex.current = null; setDragOverIdx(null) }}
                  onDragOver={e => { e.preventDefault(); setDragOverIdx(idx) }}
                  onDragLeave={() => setDragOverIdx(null)}
                  onDrop={() => {
                    setDragOverIdx(null)
                    if (dragIndex.current !== null && dragIndex.current !== idx) {
                      reorderProjects(dragIndex.current, idx)
                    }
                    dragIndex.current = null
                  }}
                  className="grid gap-4 items-center px-5 py-4 rounded-xl group transition-colors"
                  style={{
                    gridTemplateColumns: '20px 96px 1fr 1fr 1fr 32px',
                    background: dragOverIdx === idx ? '#1a1a1a' : '#0f0f0f',
                    boxShadow: dragOverIdx === idx ? '0 0 0 1px #2e2e2e' : '0 0 0 1px #1c1c1c',
                  }}
                >
                  <div className="flex items-center justify-center text-[#202020] group-hover:text-[#404040] transition-colors cursor-grab active:cursor-grabbing">
                    <IconDragHandle />
                  </div>

                  <div className="w-[96px] h-[54px] rounded-lg overflow-hidden bg-[#1a1a1a] shrink-0">
                    <video
                      src={p.video}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                      onLoadedMetadata={e => { ;(e.target as HTMLVideoElement).currentTime = 0.5 }}
                    />
                  </div>

                  <EditableCell {...cellProps('title')} placeholder="Untitled" />
                  <CategorySelect
                    value={p.category}
                    onChange={v => {
                      setProjects(prev => prev.map(proj => proj.id === p.id ? { ...proj, category: v } : proj))
                      fetch('/api/admin/projects', {
                        method: 'PUT',
                        body: JSON.stringify({ id: p.id, category: v }),
                        headers: { 'Content-Type': 'application/json' },
                      }).catch(console.error)
                    }}
                  />
                  <EditableCell {...cellProps('client')} placeholder="—" />

                  <button
                    onClick={() => deleteProject(p.id)}
                    title="Delete"
                    className="flex items-center justify-center text-[#404040] hover:text-red-400/70 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                    </svg>
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Recent Projects Section ──────────────────────────────────────────────────

function RecentSection({
  projects,
  setProjects,
}: {
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}) {
  const featuredCount = projects.filter(p => p.isRecent).length

  function toggle(id: string) {
    const project = projects.find(p => p.id === id)
    if (!project) return
    const newValue = !project.isRecent
    if (newValue && featuredCount >= 3) return
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, isRecent: newValue } : p)))
    fetch('/api/admin/projects', {
      method: 'PUT',
      body: JSON.stringify({ id, isRecent: newValue }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <p className="font-sans" style={{ fontSize: '16px', color: '#c0c0c0', letterSpacing: '-0.01em' }}>
          Select up to 3 projects to feature on the homepage.
        </p>
        <span className="font-sans ml-auto" style={{ fontSize: '15px', color: '#909090' }}>
          {featuredCount}/3
        </span>
      </div>

      {projects.length === 0 ? (
        <p className="font-sans text-[#585858] text-sm">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map(p => {
            const maxed = !p.isRecent && featuredCount >= 3
            return (
              <div
                key={p.id}
                onClick={() => !maxed && toggle(p.id)}
                className={`relative rounded-xl overflow-hidden select-none transition-all ${maxed ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'}`}
                style={{ boxShadow: p.isRecent ? '0 0 0 1px rgba(255,255,255,0.12)' : '0 0 0 1px #161616' }}
              >
                <div className="aspect-video bg-[#141414]">
                  <video
                    src={p.video}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                    onLoadedMetadata={e => { ;(e.target as HTMLVideoElement).currentTime = 0.5 }}
                  />
                </div>

                <div className="px-3.5 py-3 flex items-center justify-between gap-3" style={{ background: '#181818' }}>
                  <div className="min-w-0">
                    <div className="font-sans text-white/90 truncate" style={{ fontSize: '17px', letterSpacing: '-0.01em' }}>
                      {p.title || 'Untitled'}
                    </div>
                    {p.category && (
                      <div className="font-sans mt-0.5 truncate" style={{ fontSize: '15px', letterSpacing: '0.1em', color: '#c0c0c0' }}>
                        {p.category.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div
                    className="shrink-0 relative rounded-full transition-colors duration-200"
                    style={{ width: '30px', height: '17px', background: p.isRecent ? '#a10702' : '#252525' }}
                  >
                    <div
                      className="absolute top-[3px] w-[11px] h-[11px] rounded-full bg-[#000000] transition-all duration-200"
                      style={{ left: p.isRecent ? '16px' : '3px' }}
                    />
                  </div>
                </div>

                {p.isRecent && (
                  <div
                    className="absolute top-2 left-2 rounded-md px-1.5 py-[3px]"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
                  >
                    <span className="font-sans text-white/70" style={{ fontSize: '12px', letterSpacing: '0.12em' }}>
                      FEATURED
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Add Review Modal ─────────────────────────────────────────────────────────

const REVIEW_SERVICES = ['Ads', 'SaaS', 'Film', 'Other']

function AddReviewModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (review: Review) => void }) {
  const [name, setName] = useState('')
  const [service, setService] = useState('Ads')
  const [company, setCompany] = useState('')
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: JSON.stringify({ name, service, company, text }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to add review')
      const review = await res.json()
      onSuccess(review)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl w-full max-w-[480px] mx-4"
        style={{ background: '#181818', boxShadow: '0 0 0 1px #222, 0 24px 64px rgba(0,0,0,0.8)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <span className="font-sans text-white/90 font-medium" style={{ fontSize: '15px', letterSpacing: '-0.02em' }}>
              Add review
            </span>
            <button type="button" onClick={onClose} className="text-[#686868] hover:text-[#a0a0a0] transition-colors p-0.5">
              <IconClose />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Name"
              required
              className="w-full bg-[#111111] rounded-xl px-4 py-3 font-sans text-white/90 placeholder-[#383838] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#2a2a2a] transition-all"
              style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
            />
            <CategorySelect value={service} onChange={setService} options={REVIEW_SERVICES} />
            <input
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="Company (optional)"
              className="w-full bg-[#111111] rounded-xl px-4 py-3 font-sans text-white/90 placeholder-[#383838] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#2a2a2a] transition-all"
              style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
            />
            <div className="relative">
              <textarea
                value={text}
                onChange={e => setText(e.target.value.slice(0, 120))}
                placeholder="Review text (max 120 chars)"
                required
                rows={3}
                className="w-full bg-[#111111] rounded-xl px-4 py-3 font-sans text-white/90 placeholder-[#383838] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#2a2a2a] transition-all resize-none"
                style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
              />
              <span
                className="absolute bottom-2.5 right-3.5 font-mono tabular-nums pointer-events-none"
                style={{ fontSize: '15px', color: text.length >= 120 ? '#a10702' : '#404040' }}
              >
                {text.length}/120
              </span>
            </div>

            {error && <p className="font-sans text-red-400/60 text-center" style={{ fontSize: '16px' }}>{error}</p>}

            <button
              type="submit"
              disabled={submitting || !name.trim() || !text.trim()}
              className="mt-1 w-full bg-white hover:bg-white/90 text-[#0a0a0a] font-sans font-medium py-3.5 rounded-xl transition-all disabled:opacity-20"
              style={{ fontSize: '15px', letterSpacing: '-0.01em' }}
            >
              {submitting ? '···' : 'Add review'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Reviews Section ──────────────────────────────────────────────────────────

function ReviewsAdminSection({
  reviews,
  setReviews,
}: {
  reviews: Review[]
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>
}) {
  const [showAdd, setShowAdd] = useState(false)
  const featuredCount = reviews.filter(r => r.featured).length

  function toggleFeatured(id: string) {
    const review = reviews.find(r => r.id === id)
    if (!review) return
    const newValue = !review.featured
    if (newValue && featuredCount >= 3) return
    setReviews(prev => prev.map(r => r.id === id ? { ...r, featured: newValue } : r))
    fetch('/api/reviews', {
      method: 'PUT',
      body: JSON.stringify({ id, featured: newValue }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }

  function deleteReview(id: string) {
    setReviews(prev => prev.filter(r => r.id !== id))
    fetch('/api/reviews', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }

  function moveReview(idx: number, dir: -1 | 1) {
    const next = [...reviews]
    const target = idx + dir
    if (target < 0 || target >= next.length) return
    ;[next[idx], next[target]] = [next[target], next[idx]]
    setReviews(next)
    fetch('/api/reviews', {
      method: 'PATCH',
      body: JSON.stringify({ order: next.map(r => r.id) }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      {showAdd && (
        <AddReviewModal
          onClose={() => setShowAdd(false)}
          onSuccess={review => { setReviews(prev => [...prev, review]); setShowAdd(false) }}
        />
      )}

      <div className="flex items-center gap-3 mb-6">
        <p className="font-sans" style={{ fontSize: '16px', color: '#c0c0c0', letterSpacing: '-0.01em' }}>
          Select up to 3 reviews to feature on the homepage.
        </p>
        <span className="font-sans" style={{ fontSize: '15px', color: '#909090' }}>{featuredCount}/3</span>
        <button
          onClick={() => setShowAdd(true)}
          className="font-sans text-[#686868] hover:text-[#a0a0a0] transition-colors ml-4"
          style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
        >
          + Add review
        </button>
      </div>

      {reviews.length === 0 ? (
        <p className="font-sans text-[#585858] text-sm">No reviews yet.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          <div className="grid gap-4 px-5 pb-2 mb-1" style={{ gridTemplateColumns: '28px 1fr 80px 1fr 60px 28px' }}>
            {(['', 'Name', 'Service', 'Review', '', ''] as const).map((col, i) => (
              <div key={i} className="font-sans" style={{ fontSize: '15px', letterSpacing: '0.11em', color: '#888888' }}>
                {col}
              </div>
            ))}
          </div>

          {reviews.map((r, idx) => {
            const maxed = !r.featured && featuredCount >= 3
            return (
              <div
                key={r.id}
                className="grid gap-4 items-center px-5 py-4 rounded-xl group"
                style={{
                  gridTemplateColumns: '28px 1fr 80px 1fr 60px 28px',
                  background: '#181818',
                  boxShadow: '0 0 0 1px #282828',
                }}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <button
                    onClick={() => moveReview(idx, -1)}
                    disabled={idx === 0}
                    className="text-[#404040] hover:text-[#b0b0b0] disabled:text-[#202020] disabled:cursor-default transition-colors"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveReview(idx, 1)}
                    disabled={idx === reviews.length - 1}
                    className="text-[#404040] hover:text-[#b0b0b0] disabled:text-[#202020] disabled:cursor-default transition-colors"
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>

                <div className="min-w-0">
                  <div className="font-sans text-white/90 truncate" style={{ fontSize: '17px', letterSpacing: '-0.01em' }}>{r.name}</div>
                  {r.company && (
                    <div className="font-sans truncate mt-0.5" style={{ fontSize: '15px', color: '#909090' }}>{r.company}</div>
                  )}
                </div>

                <span className="font-sans" style={{ fontSize: '15px', letterSpacing: '0.1em', color: '#c0c0c0' }}>
                  {r.service.toUpperCase()}
                </span>

                <span className="font-sans truncate" style={{ fontSize: '15px', color: '#909090', letterSpacing: '-0.01em' }} title={r.text}>
                  {r.text}
                </span>

                <div className="flex items-center justify-center">
                  <button
                    onClick={() => !maxed && toggleFeatured(r.id)}
                    disabled={maxed}
                    title={r.featured ? 'Unfeature' : maxed ? 'Max 3 featured' : 'Feature on homepage'}
                    className="shrink-0 relative rounded-full transition-colors duration-200 disabled:opacity-30"
                    style={{ width: '30px', height: '17px', background: r.featured ? '#a10702' : '#252525' }}
                  >
                    <div
                      className="absolute top-[3px] w-[11px] h-[11px] rounded-full bg-[#000000] transition-all duration-200"
                      style={{ left: r.featured ? '16px' : '3px' }}
                    />
                  </button>
                </div>

                <button
                  onClick={() => deleteReview(r.id)}
                  title="Delete"
                  className="flex items-center justify-center text-[#404040] hover:text-red-400/70 transition-colors"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Add Client Modal ─────────────────────────────────────────────────────────

const CLIENT_SERVICES = ['Ads', 'SaaS', 'Film', 'Motion Graphics', 'Social Media', 'Branding', 'Other']
const CLIENT_STATUSES: ClientLog['status'][] = ['Paid', 'Pending', 'Unpaid']

const STATUS_COLORS: Record<ClientLog['status'], { bg: string; text: string; border: string }> = {
  Paid:    { bg: 'rgba(34,197,94,0.09)',   text: '#4ade80', border: 'rgba(34,197,94,0.2)' },
  Pending: { bg: 'rgba(234,179,8,0.09)',   text: '#facc15', border: 'rgba(234,179,8,0.2)' },
  Unpaid:  { bg: 'rgba(239,68,68,0.09)',   text: '#f87171', border: 'rgba(239,68,68,0.2)' },
}

function AddClientModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (c: ClientLog) => void }) {
  const [clientName, setClientName] = useState('')
  const [service, setService] = useState('Ads')
  const [projectName, setProjectName] = useState('')
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<'USD' | 'IDR'>('USD')
  const [status, setStatus] = useState<ClientLog['status']>('Paid')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!clientName.trim()) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/admin/clients', {
        method: 'POST',
        body: JSON.stringify({
          clientName: clientName.trim(),
          service,
          projectName: projectName.trim(),
          amount: parseFloat(amount) || 0,
          currency,
          status,
          date,
          notes: notes.trim(),
        }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('Failed to log client')
      const client = await res.json()
      onSuccess(client)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl w-full max-w-[520px] mx-4"
        style={{ background: '#181818', boxShadow: '0 0 0 1px #1e1e1e, 0 24px 64px rgba(0,0,0,0.85)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <span className="font-sans text-white/90 font-medium" style={{ fontSize: '15px', letterSpacing: '-0.02em' }}>
              Log client
            </span>
            <button type="button" onClick={onClose} className="text-[#686868] hover:text-[#a0a0a0] transition-colors p-0.5">
              <IconClose />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <input
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                placeholder="Client name"
                required
                className="w-full bg-[#111111] rounded-xl px-4 py-3 font-sans text-white/90 placeholder-[#353535] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#2a2a2a] transition-all"
                style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
              />
              <CategorySelect value={service} onChange={setService} options={CLIENT_SERVICES} />
            </div>

            <input
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="Project name"
              className="w-full bg-[#111111] rounded-xl px-4 py-3 font-sans text-white/90 placeholder-[#353535] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#2a2a2a] transition-all"
              style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
            />

            <div className="flex gap-2.5">
              <input
                value={amount}
                onChange={e => setAmount(e.target.value)}
                placeholder="Amount"
                type="number"
                min="0"
                step="any"
                className="flex-1 bg-[#111111] rounded-xl px-4 py-3 font-sans text-white/90 placeholder-[#353535] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#2a2a2a] transition-all"
                style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
              />
              <div className="flex rounded-xl overflow-hidden" style={{ boxShadow: '0 0 0 1px #2e2e2e' }}>
                {(['USD', 'IDR'] as const).map(cur => (
                  <button
                    key={cur}
                    type="button"
                    onClick={() => setCurrency(cur)}
                    className="px-4 font-sans transition-colors"
                    style={{
                      fontSize: '15px',
                      background: currency === cur ? '#1e1e1e' : '#111111',
                      color: currency === cur ? 'rgba(255,255,255,0.75)' : '#484848',
                    }}
                  >
                    {cur}
                  </button>
                ))}
              </div>
              <input
                value={date}
                onChange={e => setDate(e.target.value)}
                type="date"
                className="bg-[#111111] rounded-xl px-4 py-3 font-sans text-white/70 outline-none ring-1 ring-[#1e1e1e] focus:ring-[#2a2a2a] transition-all"
                style={{ fontSize: '16px', letterSpacing: '-0.01em', colorScheme: 'dark', minWidth: '150px' }}
              />
            </div>

            <div className="flex gap-2">
              {CLIENT_STATUSES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStatus(s)}
                  className="flex-1 py-2.5 rounded-xl font-sans transition-all"
                  style={{
                    fontSize: '15px',
                    letterSpacing: '-0.01em',
                    background: status === s ? STATUS_COLORS[s].bg : '#111111',
                    color: status === s ? STATUS_COLORS[s].text : '#484848',
                    border: '1px solid',
                    borderColor: status === s ? STATUS_COLORS[s].border : '#1e1e1e',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>

            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              rows={2}
              className="w-full bg-[#111111] rounded-xl px-4 py-3 font-sans text-white/90 placeholder-[#353535] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#2a2a2a] transition-all resize-none"
              style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
            />

            {error && <p className="font-sans text-red-400/60 text-center" style={{ fontSize: '16px' }}>{error}</p>}

            <button
              type="submit"
              disabled={submitting || !clientName.trim()}
              className="mt-1 w-full bg-white hover:bg-white/90 text-[#0a0a0a] font-sans font-medium py-3.5 rounded-xl transition-all disabled:opacity-20"
              style={{ fontSize: '15px', letterSpacing: '-0.01em' }}
            >
              {submitting ? '···' : 'Log client'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Clients Section ──────────────────────────────────────────────────────────

function ClientsSection({
  clients,
  setClients,
}: {
  clients: ClientLog[]
  setClients: React.Dispatch<React.SetStateAction<ClientLog[]>>
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState<'All' | ClientLog['status']>('All')

  function deleteClient(id: string) {
    setClients(prev => prev.filter(c => c.id !== id))
    fetch('/api/admin/clients', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(console.error)
  }

  const filtered = filter === 'All' ? clients : clients.filter(c => c.status === filter)
  const sorted = [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      {showAdd && (
        <AddClientModal
          onClose={() => setShowAdd(false)}
          onSuccess={client => { setClients(prev => [client, ...prev]); setShowAdd(false) }}
        />
      )}

      <div className="flex items-center gap-3 mb-6">
        <div className="flex gap-1 rounded-xl p-1" style={{ background: '#181818', boxShadow: '0 0 0 1px #282828' }}>
          {(['All', 'Paid', 'Pending', 'Unpaid'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="font-sans px-3 py-1.5 rounded-lg transition-all"
              style={{
                fontSize: '16px',
                letterSpacing: '-0.01em',
                background: filter === f ? '#1c1c1c' : 'transparent',
                color: filter === f
                  ? f === 'All' ? 'rgba(255,255,255,0.7)' : STATUS_COLORS[f as ClientLog['status']].text
                  : '#505050',
              }}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="font-sans ml-1" style={{ fontSize: '15px', color: '#707070' }}>
          {sorted.length} {sorted.length === 1 ? 'client' : 'clients'}
        </span>
        <button
          onClick={() => setShowAdd(true)}
          className="ml-auto font-sans text-[#686868] hover:text-[#a0a0a0] transition-colors"
          style={{ fontSize: '16px', letterSpacing: '-0.01em' }}
        >
          + Log client
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-20">
          <p className="font-sans text-[#404040]" style={{ fontSize: '16px' }}>
            {filter === 'All' ? 'No clients logged yet.' : `No ${filter.toLowerCase()} clients.`}
          </p>
        </div>
      ) : (
        <div>
          <div
            className="grid gap-4 px-5 pb-2 mb-1"
            style={{ gridTemplateColumns: '1fr 110px 130px 120px 90px 32px' }}
          >
            {(['Client', 'Service', 'Project', 'Amount', 'Status', ''] as const).map((col, i) => (
              <div key={i} className="font-sans" style={{ fontSize: '15px', letterSpacing: '0.11em', color: '#888888' }}>
                {col}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-1.5">
            {sorted.map(c => (
              <div
                key={c.id}
                className="grid gap-4 items-center px-5 py-4 rounded-xl group"
                style={{
                  gridTemplateColumns: '1fr 110px 130px 120px 90px 32px',
                  background: '#181818',
                  boxShadow: '0 0 0 1px #282828',
                }}
              >
                <div>
                  <div className="font-sans text-white/90 truncate" style={{ fontSize: '17px', letterSpacing: '-0.01em' }}>
                    {c.clientName}
                  </div>
                  <div className="font-sans mt-0.5" style={{ fontSize: '15px', color: '#787878' }}>
                    {new Date(c.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  {c.notes && (
                    <div className="font-sans mt-0.5 truncate" style={{ fontSize: '15px', color: '#707070' }} title={c.notes}>
                      {c.notes}
                    </div>
                  )}
                </div>

                <span className="font-sans" style={{ fontSize: '15px', letterSpacing: '0.1em', color: '#909090' }}>
                  {c.service.toUpperCase()}
                </span>

                <span className="font-sans truncate" style={{ fontSize: '15px', color: '#909090', letterSpacing: '-0.01em' }}>
                  {c.projectName || '—'}
                </span>

                <span className="font-sans font-medium tabular-nums" style={{ fontSize: '16px', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.75)' }}>
                  {c.currency === 'USD' ? '$' : 'Rp '}{c.amount.toLocaleString()}
                </span>

                <span
                  className="font-sans px-2 py-0.5 rounded-md text-center inline-block"
                  style={{
                    fontSize: '15px',
                    letterSpacing: '0.06em',
                    background: STATUS_COLORS[c.status].bg,
                    color: STATUS_COLORS[c.status].text,
                  }}
                >
                  {c.status.toUpperCase()}
                </span>

                <button
                  onClick={() => deleteClient(c.id)}
                  title="Delete"
                  className="flex items-center justify-center text-[#404040] hover:text-red-400/70 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Finance Section ──────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function FinanceSection({
  clients,
  currency,
  setCurrency,
}: {
  clients: ClientLog[]
  currency: DisplayCurrency
  setCurrency: (c: DisplayCurrency) => void
}) {
  const [chartMode, setChartMode] = useState<'bar' | 'line'>('bar')
  const now = new Date()
  const thisYear = now.getFullYear()
  const thisMonth = now.getMonth()

  const paidClients = clients.filter(c => c.status === 'Paid')

  const allRevenue = paidClients.reduce((sum, c) => sum + toDisplay(c.amount, c.currency, currency), 0)
  const yearRevenue = paidClients
    .filter(c => new Date(c.date).getFullYear() === thisYear)
    .reduce((sum, c) => sum + toDisplay(c.amount, c.currency, currency), 0)
  const monthRevenue = paidClients
    .filter(c => { const d = new Date(c.date); return d.getFullYear() === thisYear && d.getMonth() === thisMonth })
    .reduce((sum, c) => sum + toDisplay(c.amount, c.currency, currency), 0)

  const monthlyData = MONTHS.map((label, i) => ({
    label,
    value: paidClients
      .filter(c => { const d = new Date(c.date); return d.getFullYear() === thisYear && d.getMonth() === i })
      .reduce((sum, c) => sum + toDisplay(c.amount, c.currency, currency), 0),
    isCurrent: i === thisMonth,
  }))

  const maxVal = Math.max(...monthlyData.map(d => d.value), 1)

  const recentPaid = [...paidClients].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-sans text-white font-medium" style={{ fontSize: '20px', letterSpacing: '-0.03em' }}>
          Finance
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl overflow-hidden" style={{ boxShadow: '0 0 0 1px #282828' }}>
            {(['USD', 'IDR'] as DisplayCurrency[]).map(cur => (
              <button
                key={cur}
                onClick={() => setCurrency(cur)}
                className="px-4 py-2 font-sans transition-colors"
                style={{
                  fontSize: '15px',
                  background: currency === cur ? '#1c1c1c' : '#0f0f0f',
                  color: currency === cur ? 'rgba(255,255,255,0.75)' : '#484848',
                }}
              >
                {cur}
              </button>
            ))}
          </div>
          <div className="flex rounded-xl overflow-hidden" style={{ boxShadow: '0 0 0 1px #282828' }}>
            {([['bar', 'Bar'], ['line', 'Line']] as const).map(([mode, label]) => (
              <button
                key={mode}
                onClick={() => setChartMode(mode)}
                className="px-4 py-2 font-sans transition-colors"
                style={{
                  fontSize: '15px',
                  background: chartMode === mode ? '#1c1c1c' : '#0f0f0f',
                  color: chartMode === mode ? 'rgba(255,255,255,0.75)' : '#484848',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'THIS MONTH', value: monthRevenue },
          { label: `${thisYear} TOTAL`, value: yearRevenue },
          { label: 'ALL TIME', value: allRevenue },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-2xl p-6" style={{ background: '#181818', boxShadow: '0 0 0 1px #282828' }}>
            <div className="font-sans mb-3" style={{ fontSize: '15px', letterSpacing: '0.13em', color: '#888888' }}>{label}</div>
            <div className="font-sans text-white font-medium" style={{ fontSize: '32px', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {formatCurrency(value, currency)}
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: '#181818', boxShadow: '0 0 0 1px #282828' }}>
        <div className="font-sans mb-5" style={{ fontSize: '15px', letterSpacing: '0.13em', color: '#888888' }}>
          MONTHLY REVENUE — {thisYear}
        </div>

        {chartMode === 'bar' ? (
          <div className="flex items-end gap-1.5" style={{ height: '160px' }}>
            {monthlyData.map(({ label, value, isCurrent }) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center gap-2 group"
                style={{ height: '100%' }}
                title={`${label}: ${formatCurrency(value, currency)}`}
              >
                <div className="flex-1 flex items-end w-full">
                  <div
                    className="w-full rounded-t-sm transition-all duration-700"
                    style={{
                      height: value === 0 ? '2px' : `${Math.max((value / maxVal) * 100, 5)}%`,
                      background: isCurrent
                        ? 'rgba(255,255,255,0.65)'
                        : value > 0 ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.04)',
                    }}
                  />
                </div>
                <span className="font-sans" style={{ fontSize: '12px', color: isCurrent ? '#686868' : '#303030' }}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <svg
              width="100%"
              height="140"
              viewBox={`0 0 ${MONTHS.length * 60} 140`}
              preserveAspectRatio="none"
              style={{ overflow: 'visible', display: 'block' }}
            >
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              {(() => {
                const pts = monthlyData.map((d, i) => ({
                  x: i * 60 + 30,
                  y: d.value === 0 ? 130 : 10 + (1 - d.value / maxVal) * 115,
                }))
                const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
                const area = `${line} L${pts[pts.length - 1].x},140 L${pts[0].x},140 Z`
                return (
                  <>
                    <path d={area} fill="url(#areaGrad)" />
                    <path d={line} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinejoin="round" />
                    {pts.map((p, i) => (
                      <circle
                        key={i}
                        cx={p.x}
                        cy={p.y}
                        r="3"
                        fill={monthlyData[i].isCurrent ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)'}
                      >
                        <title>{`${monthlyData[i].label}: ${formatCurrency(monthlyData[i].value, currency)}`}</title>
                      </circle>
                    ))}
                  </>
                )
              })()}
            </svg>
            <div className="flex mt-2">
              {monthlyData.map(({ label, isCurrent }) => (
                <div key={label} className="flex-1 text-center">
                  <span className="font-sans" style={{ fontSize: '12px', color: isCurrent ? '#686868' : '#303030' }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Paid clients list */}
      {recentPaid.length > 0 && (
        <div>
          <div className="font-sans mb-3" style={{ fontSize: '15px', letterSpacing: '0.13em', color: '#888888' }}>
            PAID CLIENTS
          </div>
          <div className="flex flex-col gap-1.5">
            {recentPaid.map(c => (
              <div
                key={c.id}
                className="flex items-center gap-4 rounded-xl px-5 py-3.5"
                style={{ background: '#181818', boxShadow: '0 0 0 1px #282828' }}
              >
                <span className="font-sans text-white/85 flex-1 truncate" style={{ fontSize: '16px', letterSpacing: '-0.01em' }}>
                  {c.clientName}
                </span>
                {c.projectName && (
                  <span className="font-sans truncate" style={{ fontSize: '16px', color: '#909090', maxWidth: '200px' }}>
                    {c.projectName}
                  </span>
                )}
                <span className="font-sans shrink-0" style={{ fontSize: '16px', color: '#787878' }}>
                  {c.service}
                </span>
                <span className="font-sans shrink-0" style={{ fontSize: '16px', color: '#707070' }}>
                  {new Date(c.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span
                  className="font-sans font-medium tabular-nums shrink-0"
                  style={{ fontSize: '16px', letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.8)' }}
                >
                  {formatCurrency(toDisplay(c.amount, c.currency, currency), currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {paidClients.length === 0 && (
        <div className="text-center py-10">
          <p className="font-sans text-[#404040]" style={{ fontSize: '16px' }}>No paid clients yet. Log your first client to see revenue here.</p>
        </div>
      )}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const [section, setSection] = useState<Section>('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [reviews, setReviews] = useState<Review[]>([])
  const [clients, setClients] = useState<ClientLog[]>([])
  const [loading, setLoading] = useState(true)
  const [currency, setCurrency] = useState<DisplayCurrency>('USD')

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/projects', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/reviews', { cache: 'no-store' }).then(r => r.json()),
      fetch('/api/admin/clients', { cache: 'no-store' }).then(r => r.json()),
    ]).then(([projectData, reviewData, clientData]) => {
      setProjects(Array.isArray(projectData) ? projectData : [])
      setReviews(Array.isArray(reviewData) ? reviewData : [])
      setClients(Array.isArray(clientData) ? clientData : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const order: Section[] = ['overview', 'projects', 'recent', 'reviews', 'clients', 'finance']
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      const idx = parseInt(e.key) - 1
      if (idx >= 0 && idx < order.length) setSection(order[idx])
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      <main className="min-h-screen overflow-auto pb-28">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <span className="font-sans text-[#585858] text-base">Loading···</span>
          </div>
        ) : section === 'overview' ? (
          <OverviewSection
            projects={projects}
            reviews={reviews}
            clients={clients}
            currency={currency}
            onNavigate={setSection}
          />
        ) : section === 'projects' ? (
          <ProjectsSection projects={projects} setProjects={setProjects} />
        ) : section === 'recent' ? (
          <RecentSection projects={projects} setProjects={setProjects} />
        ) : section === 'reviews' ? (
          <ReviewsAdminSection reviews={reviews} setReviews={setReviews} />
        ) : section === 'clients' ? (
          <ClientsSection clients={clients} setClients={setClients} />
        ) : (
          <FinanceSection clients={clients} currency={currency} setCurrency={setCurrency} />
        )}
      </main>
      <Dock active={section} setActive={setSection} />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    setAuthed(sessionStorage.getItem('admin_authed') === 'true')
  }, [])

  if (authed === null) {
    return <div className="min-h-screen" style={{ background: '#0a0a0a' }} />
  }

  if (!authed) {
    return <PasswordGate onAuth={() => setAuthed(true)} />
  }

  return <Dashboard />
}
