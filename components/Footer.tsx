'use client'

import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="px-8 pt-8 pb-10">
      <div
        className="max-w-5xl mx-auto rounded-3xl px-10 py-8"
        style={{ background: '#0a0a0a', border: '1px solid rgba(238,229,233,0.06)' }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs" style={{ color: 'rgba(238,229,233,0.2)' }}>
            &copy; {year} Kulaire. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { label: 'Work',    href: '/work' },
              { label: 'Reviews', href: '/reviews' },
              { label: 'FAQ',     href: '/faq' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-sans text-xs tracking-[0.08em] uppercase transition-opacity duration-150 hover:opacity-60"
                style={{ color: 'rgba(238,229,233,0.3)' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
