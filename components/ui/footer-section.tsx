'use client'

import Link from 'next/link'

export function FooterSection() {
  const year = new Date().getFullYear()

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
        <div className="flex items-center justify-between mb-6">
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
