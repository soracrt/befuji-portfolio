'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

type Project = {
  id: string
  title: string
  category: string
  client: string
  video: string
  isRecent: boolean
  isFeatured: boolean
}

type Section = 'overview' | 'projects' | 'recent' | 'featured'
type EditKey = 'title' | 'category' | 'client'

// ─── Icons ────────────────────────────────────────────────────────────────────

function IconGrid() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  )
}

function IconFilm() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="2" />
      <line x1="7" y1="2" x2="7" y2="22" />
      <line x1="17" y1="2" x2="17" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="2" y1="7" x2="7" y2="7" />
      <line x1="2" y1="17" x2="7" y2="17" />
      <line x1="17" y1="7" x2="22" y2="7" />
      <line x1="17" y1="17" x2="22" y2="17" />
    </svg>
  )
}

function IconStar() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function IconBookmark() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function IconDragHandle() {
  return (
    <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
      <circle cx="2.5" cy="2"  r="1.2" />
      <circle cx="2.5" cy="7"  r="1.2" />
      <circle cx="2.5" cy="12" r="1.2" />
      <circle cx="7.5" cy="2"  r="1.2" />
      <circle cx="7.5" cy="7"  r="1.2" />
      <circle cx="7.5" cy="12" r="1.2" />
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
      style={{ background: 'radial-gradient(ellipse at 50% 36%, #191919 0%, #080808 64%)' }}
    >
      <div className="absolute top-6 left-7">
        <Link
          href="/"
          className="font-sans text-[#606060] hover:text-[#909090] transition-colors inline-flex items-center gap-1.5"
          style={{ fontSize: '13px', letterSpacing: '-0.01em' }}
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
            <div
              className="w-9 h-9 rounded-[10px] flex items-center justify-center"
              style={{ background: 'linear-gradient(160deg, #1e1e1e 0%, #131313 100%)', boxShadow: '0 0 0 1px #242424' }}
            >
              <span className="font-sans text-white/50 font-medium" style={{ fontSize: '13px', letterSpacing: '-0.02em' }}>B</span>
            </div>
          </div>

          <h1
            className="font-sans text-white font-medium text-center mb-1.5"
            style={{ fontSize: '21px', letterSpacing: '-0.03em', lineHeight: '1.25' }}
          >
            Welcome back, Ghazi.
          </h1>
          <p
            className="font-sans text-center mb-8"
            style={{ fontSize: '13px', color: '#707070', letterSpacing: '-0.01em' }}
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
              className={`w-full bg-[#101010] rounded-xl px-4 py-3 font-sans text-sm text-white/80 placeholder-[#272727] outline-none transition-all ring-1 ${
                error ? 'ring-red-500/20' : 'ring-[#1e1e1e] focus:ring-[#2c2c2c]'
              }`}
              style={{ letterSpacing: '-0.01em' }}
            />
            {error && (
              <p className="font-sans text-red-400/50 text-center -mt-0.5" style={{ fontSize: '12px' }}>
                Incorrect password. Try again.
              </p>
            )}
            <button
              type="submit"
              disabled={loading || !value}
              className="w-full bg-white hover:bg-white/90 text-[#0a0a0a] font-sans font-medium py-[11px] rounded-xl transition-all disabled:opacity-20 mt-0.5"
              style={{ fontSize: '13.5px', letterSpacing: '-0.01em' }}
            >
              {loading ? '···' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  { id: 'overview',  label: 'Overview',        icon: <IconGrid /> },
  { id: 'projects',  label: 'Projects',         icon: <IconFilm /> },
  { id: 'recent',    label: 'Recent Projects',  icon: <IconStar /> },
  { id: 'featured',  label: 'Featured',         icon: <IconBookmark /> },
]

function Sidebar({ active, setActive }: { active: Section; setActive: (s: Section) => void }) {
  function signOut() {
    sessionStorage.removeItem('admin_authed')
    window.location.reload()
  }

  return (
    <aside
      className="w-[220px] shrink-0 h-screen sticky top-0 flex flex-col"
      style={{ background: '#0a0a0a', borderRight: '1px solid #141414' }}
    >
      <div className="px-5 pt-[22px] pb-[18px]" style={{ borderBottom: '1px solid #131313' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-[22px] h-[22px] rounded-md flex items-center justify-center shrink-0"
            style={{ background: '#181818', boxShadow: '0 0 0 1px #222' }}
          >
            <span className="font-sans text-white/40 font-medium" style={{ fontSize: '9.5px' }}>B</span>
          </div>
          <span className="font-sans text-white/70 font-medium" style={{ fontSize: '13px', letterSpacing: '-0.02em' }}>
            befuji
          </span>
          <span
            className="font-sans text-[#505050] ml-0.5"
            style={{ fontSize: '9px', letterSpacing: '0.14em', marginTop: '1px' }}
          >
            ADMIN
          </span>
        </div>
      </div>

      <nav className="flex-1 px-2.5 pt-2.5 flex flex-col gap-0.5">
        {NAV.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActive(id)}
            className="w-full text-left px-3 py-[7px] rounded-lg flex items-center gap-2.5 font-sans transition-colors"
            style={{
              fontSize: '13px',
              letterSpacing: '-0.01em',
              background: active === id ? '#ffffff07' : 'transparent',
              color: active === id ? 'rgba(255,255,255,0.92)' : '#909090',
            }}
          >
            <span style={{ color: active === id ? 'rgba(255,255,255,0.5)' : '#686868' }}>
              {icon}
            </span>
            {label}
          </button>
        ))}
      </nav>

      <div className="px-5 pb-6 flex flex-col gap-3">
        <Link
          href="/"
          target="_blank"
          className="font-sans text-[#585858] hover:text-[#909090] transition-colors inline-flex items-center gap-1.5"
          style={{ fontSize: '12px', letterSpacing: '-0.005em' }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          View website
        </Link>
        <button
          onClick={signOut}
          className="font-sans text-[#585858] hover:text-[#909090] transition-colors text-left"
          style={{ fontSize: '12px', letterSpacing: '-0.005em' }}
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}

// ─── Top Bar ──────────────────────────────────────────────────────────────────

const SECTION_LABELS: Record<Section, string> = {
  overview:  'Overview',
  projects:  'Projects',
  recent:    'Recent Projects',
  featured:  'Featured',
}

function TopBar({ section, updatedAt }: { section: Section; updatedAt: string }) {
  return (
    <div
      className="flex items-center justify-between px-8 shrink-0"
      style={{ height: '50px', borderBottom: '1px solid #131313', background: '#080808' }}
    >
      <h1
        className="font-sans text-white/80 font-medium"
        style={{ fontSize: '13.5px', letterSpacing: '-0.02em' }}
      >
        {SECTION_LABELS[section]}
      </h1>
      {updatedAt && (
        <span className="font-sans text-[#686868]" style={{ fontSize: '12px' }}>
          Updated {updatedAt}
        </span>
      )}
    </div>
  )
}

// ─── Overview ─────────────────────────────────────────────────────────────────

function OverviewSection({ projects }: { projects: Project[] }) {
  const featured = projects.filter(p => p.isFeatured)

  return (
    <div className="p-8 max-w-xl mx-auto w-full">
      <div className="grid grid-cols-2 gap-2.5 mb-8">
        <div className="rounded-xl p-5" style={{ background: '#0d0d0d', boxShadow: '0 0 0 1px #171717' }}>
          <div className="font-sans mb-3" style={{ fontSize: '10.5px', letterSpacing: '0.12em', color: '#a0a0a0' }}>
            TOTAL PROJECTS
          </div>
          <div
            className="font-sans text-white font-medium tabular-nums"
            style={{ fontSize: '38px', letterSpacing: '-0.035em', lineHeight: 1 }}
          >
            {projects.length}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: '#0d0d0d', boxShadow: '0 0 0 1px #171717' }}>
          <div className="font-sans mb-3" style={{ fontSize: '10.5px', letterSpacing: '0.12em', color: '#a0a0a0' }}>
            FEATURED
          </div>
          <div
            className="font-sans text-white font-medium tabular-nums flex items-baseline gap-1"
            style={{ fontSize: '38px', letterSpacing: '-0.035em', lineHeight: 1 }}
          >
            {featured.length}
            <span style={{ fontSize: '22px', color: '#686868' }}>/3</span>
          </div>
        </div>
      </div>

      <div className="font-sans mb-3" style={{ fontSize: '10.5px', letterSpacing: '0.12em', color: '#a0a0a0' }}>
        FEATURED ON HOMEPAGE
      </div>

      {featured.length === 0 ? (
        <p className="font-sans text-[#686868] text-sm">No projects featured yet.</p>
      ) : (
        <div className="flex flex-col gap-1.5">
          {featured.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-xl px-4 py-3"
              style={{ background: '#0d0d0d', boxShadow: '0 0 0 1px #161616' }}
            >
              <span className="font-sans tabular-nums shrink-0" style={{ fontSize: '11px', color: '#686868', width: '14px' }}>
                {i + 1}
              </span>
              <span className="font-sans text-white/85 flex-1 truncate" style={{ fontSize: '13px', letterSpacing: '-0.01em' }}>
                {p.title || 'Untitled'}
              </span>
              {p.category && (
                <span className="font-sans shrink-0" style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#a0a0a0' }}>
                  {p.category.toUpperCase()}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
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
        className="bg-[#181818] rounded-md px-2 py-1 text-white/80 outline-none w-full font-sans ring-1 ring-[#2a2a2a]"
        style={{ fontSize: '13px', letterSpacing: '-0.01em' }}
      />
    )
  }

  return (
    <span
      onClick={onStart}
      title="Click to edit"
      className="cursor-pointer font-sans text-white/75 hover:text-white/95 transition-colors truncate block"
      style={{ fontSize: '13px', letterSpacing: '-0.01em' }}
    >
      {value || <span className="text-[#505050]">{placeholder}</span>}
    </span>
  )
}

// ─── Category Select ──────────────────────────────────────────────────────────

function CategorySelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const options = ['SaaS', 'Ads']

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
        className="w-full bg-[#0a0a0a] rounded-xl px-3.5 py-2.5 font-sans text-white/80 outline-none ring-1 ring-[#1e1e1e] hover:ring-[#252525] transition-all text-left flex items-center justify-between"
        style={{ fontSize: '13px', letterSpacing: '-0.01em' }}
      >
        {value}
        <svg
          width="10" height="10" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
          className="text-[#505050] shrink-0 transition-transform"
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
            background: '#1a1a1a',
            boxShadow: '0 0 0 1px #282828, 0 8px 24px rgba(0,0,0,0.5)',
          }}
        >
          {options.map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-3.5 py-2.5 font-sans transition-colors ${
                opt === value
                  ? 'bg-[#252525] text-white/90'
                  : 'text-white/55 hover:bg-[#212121] hover:text-white/80'
              }`}
              style={{ fontSize: '13px', letterSpacing: '-0.01em' }}
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

function UploadModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void
  onSuccess: (project: Project) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [dragging, setDragging] = useState(false)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('SaaS')
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
      // 1. Get presigned URL from server
      const urlRes = await fetch(`/api/admin/upload-url?filename=${encodeURIComponent(file.name)}`)
      if (!urlRes.ok) throw new Error('Failed to get upload URL')
      const { url, key, publicUrl, contentType } = await urlRes.json()

      // 2. Upload directly to R2 via XHR for progress tracking
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

      // 3. Save project metadata
      const baseName = key.replace(/\.[^/.]+$/, '')
      const project: Project = {
        id: key,
        title: title || baseName.replace(/[-_]/g, ' '),
        category,
        client,
        video: publicUrl,
        isRecent: false,
        isFeatured: false,
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
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(2px)' }}
      onClick={uploading ? undefined : onClose}
    >
      <div
        className="relative rounded-2xl w-full max-w-[420px] mx-4"
        style={{ background: '#0f0f0f', boxShadow: '0 0 0 1px #1e1e1e, 0 24px 64px rgba(0,0,0,0.7)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <span
              className="font-sans text-white/80 font-medium"
              style={{ fontSize: '13.5px', letterSpacing: '-0.02em' }}
            >
              Upload video
            </span>
            <button
              type="button"
              onClick={uploading ? undefined : onClose}
              disabled={uploading}
              className="text-[#686868] hover:text-[#a0a0a0] transition-colors p-0.5 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Drop zone */}
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
              border: `1.5px dashed ${dragging ? '#383838' : '#1e1e1e'}`,
              background: dragging ? '#131313' : '#0a0a0a',
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
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: '#181818' }}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#707070" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-sans text-white/70 truncate" style={{ fontSize: '12.5px', letterSpacing: '-0.01em' }}>
                    {file.name}
                  </div>
                  <div className="font-sans mt-0.5" style={{ fontSize: '11px', color: '#606060' }}>
                    {formatSize(file.size)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={e => { e.stopPropagation(); setFile(null) }}
                  className="text-[#484848] hover:text-[#787878] transition-colors shrink-0"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center py-8 gap-2.5">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#363636" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                <span className="font-sans text-center" style={{ fontSize: '12px', color: '#505050', letterSpacing: '-0.01em' }}>
                  Drop mp4 or mov, or <span style={{ color: '#787878' }}>browse</span>
                </span>
              </div>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full bg-[#0a0a0a] rounded-xl px-3.5 py-2.5 font-sans text-white/80 placeholder-[#383838] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#282828] transition-all"
              style={{ fontSize: '13px', letterSpacing: '-0.01em' }}
            />

            <CategorySelect value={category} onChange={setCategory} />

            <input
              value={client}
              onChange={e => setClient(e.target.value)}
              placeholder="Client"
              className="w-full bg-[#0a0a0a] rounded-xl px-3.5 py-2.5 font-sans text-white/80 placeholder-[#383838] outline-none ring-1 ring-[#1e1e1e] focus:ring-[#282828] transition-all"
              style={{ fontSize: '13px', letterSpacing: '-0.01em' }}
            />

            {uploading ? (
              <div className="mt-1">
                <div className="w-full rounded-full overflow-hidden" style={{ height: '3px', background: '#1a1a1a' }}>
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{ width: `${progress}%`, background: 'rgba(255,255,255,0.7)' }}
                  />
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="font-sans text-[#686868]" style={{ fontSize: '11px' }}>Uploading to R2</span>
                  <span className="font-sans text-[#686868] tabular-nums" style={{ fontSize: '11px' }}>{progress}%</span>
                </div>
              </div>
            ) : (
              <>
                {error && (
                  <p className="font-sans text-red-400/60 text-center" style={{ fontSize: '12px' }}>{error}</p>
                )}
                <button
                  type="submit"
                  disabled={!file}
                  className="mt-1 w-full bg-white hover:bg-white/90 text-[#0a0a0a] font-sans font-medium py-[11px] rounded-xl transition-all disabled:opacity-20"
                  style={{ fontSize: '13.5px', letterSpacing: '-0.01em' }}
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

  async function commitEdit() {
    if (!editingCell) return
    const { id, field } = editingCell
    const value = editValue
    setEditingCell(null)
    await fetch('/api/admin/projects', {
      method: 'PUT',
      body: JSON.stringify({ id, [field]: value }),
      headers: { 'Content-Type': 'application/json' },
    })
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  function cancelEdit() {
    setEditingCell(null)
  }

  async function deleteProject(id: string) {
    await fetch('/api/admin/projects', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    })
    setProjects(prev => prev.filter(p => p.id !== id))
  }

  async function reorderProjects(fromIdx: number, toIdx: number) {
    const next = [...projects]
    const [item] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, item)
    setProjects(next)
    await fetch('/api/admin/projects', {
      method: 'PUT',
      body: JSON.stringify({ order: next.map(p => p.id) }),
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-end mb-5">
        <button
          onClick={() => setShowUpload(true)}
          className="font-sans text-[#686868] hover:text-[#a0a0a0] transition-colors"
          style={{ fontSize: '12.5px', letterSpacing: '-0.01em' }}
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
        <p className="font-sans text-[#686868] text-sm">No projects yet. Upload a video to get started.</p>
      ) : (
        <div>
          {/* Table header */}
          <div
            className="grid gap-4 px-4 pb-2 mb-1"
            style={{ gridTemplateColumns: '16px 82px 1fr 1fr 1fr 28px' }}
          >
            {(['', '', 'Title', 'Category', 'Client', ''] as const).map((col, i) => (
              <div
                key={i}
                className="font-sans"
                style={{ fontSize: '10px', letterSpacing: '0.11em', color: '#707070' }}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Rows */}
          <div className="flex flex-col gap-1.5">
            {projects.map((p, idx) => {
              const isEditing = (field: EditKey) =>
                editingCell?.id === p.id && editingCell.field === field

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
                  className="grid gap-4 items-center px-4 py-3 rounded-xl group transition-colors"
                  style={{
                    gridTemplateColumns: '16px 82px 1fr 1fr 1fr 28px',
                    background: dragOverIdx === idx ? '#111111' : '#0d0d0d',
                    boxShadow: dragOverIdx === idx ? '0 0 0 1px #232323' : '0 0 0 1px #161616',
                  }}
                >
                  {/* Drag handle */}
                  <div className="flex items-center justify-center text-[#2a2a2a] group-hover:text-[#484848] transition-colors cursor-grab active:cursor-grabbing">
                    <IconDragHandle />
                  </div>

                  {/* Thumbnail */}
                  <div className="w-[82px] h-[46px] rounded-lg overflow-hidden bg-[#141414] shrink-0">
                    <video
                      src={p.video}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                      onLoadedMetadata={e => {
                        ;(e.target as HTMLVideoElement).currentTime = 0.5
                      }}
                    />
                  </div>

                  <EditableCell {...cellProps('title')}    placeholder="Untitled" />
                  <EditableCell {...cellProps('category')} placeholder="—" />
                  <EditableCell {...cellProps('client')}   placeholder="—" />

                  <button
                    onClick={() => deleteProject(p.id)}
                    title="Delete"
                    className="flex items-center justify-center text-[#505050] hover:text-red-400/70 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
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

  async function toggle(id: string) {
    const project = projects.find(p => p.id === id)
    if (!project) return
    const newValue = !project.isRecent
    if (newValue && featuredCount >= 3) return
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, isRecent: newValue } : p)))
    await fetch('/api/admin/projects', {
      method: 'PUT',
      body: JSON.stringify({ id, isRecent: newValue }),
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <p className="font-sans" style={{ fontSize: '12.5px', color: '#a0a0a0', letterSpacing: '-0.01em' }}>
          Select up to 3 projects to feature on the homepage.
        </p>
        <span className="font-sans ml-auto" style={{ fontSize: '12px', color: '#686868' }}>
          {featuredCount}/3
        </span>
      </div>

      {projects.length === 0 ? (
        <p className="font-sans text-[#686868] text-sm">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map(p => {
            const maxed = !p.isRecent && featuredCount >= 3
            return (
              <div
                key={p.id}
                onClick={() => !maxed && toggle(p.id)}
                className={`relative rounded-xl overflow-hidden select-none transition-all ${
                  maxed ? 'opacity-25 cursor-not-allowed' : 'cursor-pointer'
                }`}
                style={{ boxShadow: p.isRecent ? '0 0 0 1px rgba(255,255,255,0.14)' : '0 0 0 1px #161616' }}
              >
                <div className="aspect-video bg-[#0f0f0f]">
                  <video
                    src={p.video}
                    className="w-full h-full object-cover"
                    muted
                    preload="metadata"
                    onLoadedMetadata={e => {
                      ;(e.target as HTMLVideoElement).currentTime = 0.5
                    }}
                  />
                </div>

                <div className="px-3.5 py-3 flex items-center justify-between gap-3" style={{ background: '#0d0d0d' }}>
                  <div className="min-w-0">
                    <div className="font-sans text-white/85 truncate" style={{ fontSize: '13px', letterSpacing: '-0.01em' }}>
                      {p.title || 'Untitled'}
                    </div>
                    {p.category && (
                      <div className="font-sans mt-0.5 truncate" style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0a0' }}>
                        {p.category.toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div
                    className="shrink-0 relative rounded-full transition-colors duration-200"
                    style={{ width: '30px', height: '17px', background: p.isRecent ? 'rgba(255,255,255,0.72)' : '#1c1c1c' }}
                  >
                    <div
                      className="absolute top-[3px] w-[11px] h-[11px] rounded-full bg-[#080808] transition-all duration-200"
                      style={{ left: p.isRecent ? '16px' : '3px' }}
                    />
                  </div>
                </div>

                {p.isRecent && (
                  <div
                    className="absolute top-2 left-2 rounded-md px-1.5 py-[3px]"
                    style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
                  >
                    <span className="font-sans text-white/75" style={{ fontSize: '9.5px', letterSpacing: '0.12em' }}>
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

// ─── Featured Section ─────────────────────────────────────────────────────────

function FeaturedSection({
  projects,
  setProjects,
}: {
  projects: Project[]
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>
}) {
  const featuredCount = projects.filter(p => p.isFeatured).length

  async function toggle(id: string) {
    const project = projects.find(p => p.id === id)
    if (!project) return
    const newValue = !project.isFeatured
    setProjects(prev => prev.map(p => (p.id === id ? { ...p, isFeatured: newValue } : p)))
    try {
      const res = await fetch('/api/admin/projects', {
        method: 'PUT',
        body: JSON.stringify({ id, isFeatured: newValue }),
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('save failed')
    } catch {
      setProjects(prev => prev.map(p => (p.id === id ? { ...p, isFeatured: !newValue } : p)))
    }
  }

  return (
    <div className="p-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <p className="font-sans" style={{ fontSize: '12.5px', color: '#a0a0a0', letterSpacing: '-0.01em' }}>
          Select projects to mark as featured.
        </p>
        <span className="font-sans ml-auto" style={{ fontSize: '12px', color: '#686868' }}>
          {featuredCount} selected
        </span>
      </div>

      {projects.length === 0 ? (
        <p className="font-sans text-[#686868] text-sm">No projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {projects.map(p => (
            <div
              key={p.id}
              onClick={() => toggle(p.id)}
              className="relative rounded-xl overflow-hidden select-none cursor-pointer transition-all"
              style={{ boxShadow: p.isFeatured ? '0 0 0 1px rgba(255,255,255,0.14)' : '0 0 0 1px #161616' }}
            >
              <div className="aspect-video bg-[#0f0f0f]">
                <video
                  src={p.video}
                  className="w-full h-full object-cover"
                  muted
                  preload="metadata"
                  onLoadedMetadata={e => {
                    ;(e.target as HTMLVideoElement).currentTime = 0.5
                  }}
                />
              </div>

              <div className="px-3.5 py-3 flex items-center justify-between gap-3" style={{ background: '#0d0d0d' }}>
                <div className="min-w-0">
                  <div className="font-sans text-white/85 truncate" style={{ fontSize: '13px', letterSpacing: '-0.01em' }}>
                    {p.title || 'Untitled'}
                  </div>
                  {p.category && (
                    <div className="font-sans mt-0.5 truncate" style={{ fontSize: '10px', letterSpacing: '0.1em', color: '#a0a0a0' }}>
                      {p.category.toUpperCase()}
                    </div>
                  )}
                </div>

                <div
                  className="shrink-0 relative rounded-full transition-colors duration-200"
                  style={{ width: '30px', height: '17px', background: p.isFeatured ? 'rgba(255,255,255,0.72)' : '#1c1c1c' }}
                >
                  <div
                    className="absolute top-[3px] w-[11px] h-[11px] rounded-full bg-[#080808] transition-all duration-200"
                    style={{ left: p.isFeatured ? '16px' : '3px' }}
                  />
                </div>
              </div>

              {p.isFeatured && (
                <div
                  className="absolute top-2 left-2 rounded-md px-1.5 py-[3px]"
                  style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
                >
                  <span className="font-sans text-white/75" style={{ fontSize: '9.5px', letterSpacing: '0.12em' }}>
                    FEATURED
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const [section, setSection] = useState<Section>('overview')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [updatedAt, setUpdatedAt] = useState('')

  useEffect(() => {
    fetch('/api/admin/projects', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => {
        setProjects(Array.isArray(data) ? data : [])
        setUpdatedAt(
          new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="flex min-h-screen" style={{ background: '#080808' }}>
      <Sidebar active={section} setActive={setSection} />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <TopBar section={section} updatedAt={updatedAt} />
        <main className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <span className="font-sans text-[#686868] text-sm">Loading···</span>
            </div>
          ) : section === 'overview' ? (
            <OverviewSection projects={projects} />
          ) : section === 'projects' ? (
            <ProjectsSection projects={projects} setProjects={setProjects} />
          ) : section === 'recent' ? (
            <RecentSection projects={projects} setProjects={setProjects} />
          ) : (
            <FeaturedSection projects={projects} setProjects={setProjects} />
          )}
        </main>
      </div>
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
    return <div className="min-h-screen" style={{ background: '#080808' }} />
  }

  if (!authed) {
    return <PasswordGate onAuth={() => setAuthed(true)} />
  }

  return <Dashboard />
}
