'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type Links = {
  instagram?: string
  tiktok?: string
  youtube?: string
  twitter?: string
  linkedin?: string
  email?: string
  phone?: string
  behance?: string
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.81 1.54V6.78a4.85 4.85 0 0 1-1.04-.09z" />
    </svg>
  )
}

function YouTubeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.95C5.12 20 12 20 12 20s6.88 0 8.59-.47a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function BehanceIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.5 11.5c1.38 0 2.5-1.12 2.5-2.5S8.88 6.5 7.5 6.5H3v5h4.5zm0 1H3V18h4.8c1.52 0 2.7-1.18 2.7-2.7 0-1.4-1.1-2.8-3-2.8zm9 .5h-4c0-1.1.9-2 2-2s2 .9 2 2zm-2-5c-2.76 0-5 2.24-5 5s2.24 5 5 5c2.03 0 3.76-1.22 4.57-2.98H18.4c-.54.68-1.35 1-2.4 1-1.38 0-2.5-.9-2.5-2H22c.03-.33.05-.5.05-.5-.05-2.76-2.29-5.02-5.05-5.02z" />
    </svg>
  )
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}

const SOCIAL_CONFIG: {
  key: keyof Links
  label: string
  icon: React.ReactNode
  hrefFn: (val: string) => string
}[] = [
  { key: 'instagram', label: 'Instagram', icon: <InstagramIcon />, hrefFn: (v) => v },
  { key: 'tiktok',    label: 'TikTok',    icon: <TikTokIcon />,    hrefFn: (v) => v },
  { key: 'youtube',   label: 'YouTube',   icon: <YouTubeIcon />,   hrefFn: (v) => v },
  { key: 'twitter',   label: 'X',         icon: <TwitterIcon />,   hrefFn: (v) => v },
  { key: 'linkedin',  label: 'LinkedIn',  icon: <LinkedInIcon />,  hrefFn: (v) => v },
  { key: 'behance',   label: 'Behance',   icon: <BehanceIcon />,   hrefFn: (v) => v },
  { key: 'email',     label: 'Email',     icon: <EmailIcon />,     hrefFn: (v) => v.startsWith('mailto:') ? v : `mailto:${v}` },
]

export function FooterSection() {
  const year = new Date().getFullYear()
  const [links, setLinks] = useState<Links>({})

  useEffect(() => {
    fetch('/api/links')
      .then((r) => r.json())
      .then(setLinks)
      .catch(() => {})
  }, [])

  const activeSocials = SOCIAL_CONFIG.filter(({ key }) => !!links[key])

  return (
    <footer className="w-full px-4 sm:px-8 pt-12 sm:pt-20 pb-8" style={{ borderTop: '1px solid rgba(238,229,233,0.07)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Top section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-16">

          {/* Left: CTA */}
          <div className="flex flex-col justify-between">
            <h2
              className="font-display font-bold leading-[1.0]"
              style={{ fontSize: 'clamp(1.6rem, 5vw, 5rem)', color: '#EEE5E9', letterSpacing: '-0.03em' }}
            >
              Ready to work<br />with us?
            </h2>
            <a
              href="/contact"
              className="self-start inline-flex items-center font-sans text-xs tracking-[0.08em] uppercase px-4 py-2 rounded-full mt-4 sm:mt-8 transition-all duration-200 hover:opacity-70"
              style={{ border: '1px solid rgba(238,229,233,0.25)', color: 'rgba(238,229,233,0.6)' }}
            >
              Get in touch →
            </a>
          </div>

          {/* Right: animated tagline */}
          <div className="flex flex-col justify-between items-start sm:items-end text-left sm:text-right">
            <h2
              className="font-display font-bold leading-[1.0]"
              style={{ fontSize: 'clamp(1.6rem, 5vw, 5rem)', color: '#EEE5E9', letterSpacing: '-0.03em' }}
            >
              Don&apos;t be<br />
              <span style={{ color: '#CF5C36' }}>boring.</span>
            </h2>
            <div className="flex gap-8 sm:gap-12 mt-4 sm:mt-8">
              <div className="text-left sm:text-right">
                <p className="font-sans text-sm font-medium mb-1" style={{ color: '#EEE5E9' }}>Motion</p>
                <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(238,229,233,0.35)' }}>
                  Film, ads, SaaS<br />brand videos.
                </p>
              </div>
              <div className="text-left sm:text-right">
                <p className="font-sans text-sm font-medium mb-1" style={{ color: '#EEE5E9' }}>Web</p>
                <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(238,229,233,0.35)' }}>
                  Minimal sites,<br />built fast.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="mb-6" style={{ borderTop: '1px solid rgba(238,229,233,0.07)' }} />

        {/* Middle row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {[
              { label: 'Work',    href: '/work' },
              { label: 'FAQ',     href: '/faq' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-xs tracking-[0.1em] uppercase transition-opacity duration-150 hover:opacity-60"
                style={{ color: 'rgba(238,229,233,0.4)' }}
              >
                • {label}
              </Link>
            ))}
          </div>

          {/* Social icons */}
          {activeSocials.length > 0 && (
            <div className="flex items-center gap-3">
              {activeSocials.map(({ key, label, icon, hrefFn }) => (
                <a
                  key={key}
                  href={hrefFn(links[key]!)}
                  target={key === 'email' ? undefined : '_blank'}
                  rel={key === 'email' ? undefined : 'noopener noreferrer'}
                  aria-label={label}
                  className="transition-opacity duration-150 hover:opacity-60"
                  style={{ color: 'rgba(238,229,233,0.4)' }}
                >
                  {icon}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.18)' }}>
            &copy; {year} Kulaire. All rights reserved.
          </p>
          <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.18)' }}>
            kulaire.com
          </p>
        </div>

      </div>
    </footer>
  )
}
