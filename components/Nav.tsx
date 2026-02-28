'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Link as ScrollLink } from 'react-scroll'

const linkClass = 'cursor-pointer font-sans text-xs tracking-[0.15em] uppercase text-ink hover:opacity-40 transition-opacity duration-200'

export default function Nav() {
  const pathname = usePathname()
  const isHome = pathname === '/'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5 bg-bg border-b border-divider">
      <Link
        href="/"
        className="hover:opacity-60 transition-opacity duration-200"
      >
        <img src="/icon.png" alt="befuji" className="h-12 w-auto" />
      </Link>

      <div className="flex items-center gap-7">
        {isHome ? (
          <ScrollLink to="work" smooth offset={-70} duration={500} className={linkClass}>
            work
          </ScrollLink>
        ) : (
          <Link href="/#work" className={linkClass}>work</Link>
        )}

        {isHome ? (
          <ScrollLink to="about" smooth offset={-70} duration={500} className={linkClass}>
            about
          </ScrollLink>
        ) : (
          <Link href="/#about" className={linkClass}>about</Link>
        )}

        <Link
          href="/contact"
          className="font-sans text-xs tracking-[0.15em] uppercase bg-ink text-bg px-5 py-2.5 rounded-full hover:opacity-70 transition-opacity duration-200"
        >
          contact
        </Link>
      </div>
    </nav>
  )
}
