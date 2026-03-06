'use client'

import Link from 'next/link'
import { InstagramIcon } from 'lucide-react'

export function FooterSection() {
  const year = new Date().getFullYear()

  return (
    <footer className="w-full px-10 pt-20 pb-8" style={{ borderTop: '1px solid rgba(238,229,233,0.07)' }}>

      {/* Top section — two large text blocks */}
      <div className="flex flex-col md:flex-row gap-16 md:gap-24 mb-16">

        {/* Left: CTA */}
        <div className="flex-1">
          <h2
            className="font-display font-bold leading-[1.0] mb-8"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#EEE5E9', letterSpacing: '-0.03em' }}
          >
            Ready to work<br />with us?
          </h2>
          <a
            href="/contact"
            className="inline-flex items-center font-sans text-xs tracking-[0.08em] uppercase px-4 py-2 rounded-full transition-all duration-200 hover:opacity-70"
            style={{ border: '1px solid rgba(238,229,233,0.25)', color: 'rgba(238,229,233,0.6)' }}
          >
            Get in touch →
          </a>
        </div>

        {/* Right: tagline + info */}
        <div className="flex-1">
          <h2
            className="font-display font-bold leading-[1.0] mb-8"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', color: '#EEE5E9', letterSpacing: '-0.03em' }}
          >
            Don&apos;t<br />be boring.
          </h2>
          <div className="flex gap-12">
            <div>
              <p className="font-sans text-sm font-medium mb-1" style={{ color: '#EEE5E9' }}>Motion</p>
              <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(238,229,233,0.35)' }}>
                Film, ads, SaaS<br />brand videos.
              </p>
            </div>
            <div>
              <p className="font-sans text-sm font-medium mb-1" style={{ color: '#EEE5E9' }}>Web</p>
              <p className="font-sans text-xs leading-relaxed" style={{ color: 'rgba(238,229,233,0.35)' }}>
                Minimal sites,<br />built fast.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(238,229,233,0.07)', marginBottom: '20px' }} />

      {/* Middle row — nav left, socials right */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-8">
          {[
            { label: 'Work',    href: '/work' },
            { label: 'Reviews', href: '/reviews' },
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

        <div className="flex items-center gap-5">
          <a
            href="https://instagram.com/soracrt"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity duration-150 hover:opacity-60"
            style={{ color: 'rgba(238,229,233,0.4)' }}
            aria-label="Instagram"
          >
            <InstagramIcon className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Bottom row — copyright */}
      <div className="flex items-center justify-between">
        <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.18)' }}>
          &copy; {year} Kulaire. All rights reserved.
        </p>
        <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.18)' }}>
          kulaire.com
        </p>
      </div>

    </footer>
  )
}
