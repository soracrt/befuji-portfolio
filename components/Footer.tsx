import Link from 'next/link'
import Image from 'next/image'
import { LinkedinIcon, InstagramIcon } from 'lucide-react'

const pages = [
  { title: 'Work',     href: '/work' },
  { title: 'About',   href: '/about' },
  { title: 'Reviews', href: '/reviews' },
  { title: 'Contact', href: '/contact' },
]


export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t mt-16" style={{ borderColor: '#1a1a1a' }}>
      <div className="mx-auto max-w-6xl px-8">

        {/* Main row */}
        <div className="flex flex-col md:flex-row md:justify-between gap-10 py-16">

          {/* Left — brand block */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="w-max opacity-80 hover:opacity-100 transition-opacity duration-200">
              <Image src="/logo.png" alt="Kulaire" height={28} width={120} className="h-7 w-auto" />
            </Link>
            <p
              className="font-sans font-medium text-sm max-w-xs leading-relaxed"
              style={{ color: 'rgba(255,255,252,0.4)' }}
            >
              Motion design for brands that refuse to conform.
            </p>
            {/* Social icons */}
            <div className="flex gap-2">
              <a
                href="https://linkedin.com/in/ataullis"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border p-1.5 transition-colors duration-200 hover:bg-white/5"
                style={{ borderColor: '#1a1a1a' }}
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="size-4" />
              </a>
              <a
                href="https://instagram.com/fws0ra"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border p-1.5 transition-colors duration-200 hover:bg-white/5"
                style={{ borderColor: '#1a1a1a' }}
                aria-label="Instagram"
              >
                <InstagramIcon className="size-4" />
              </a>
            </div>
          </div>

          {/* Right — Pages */}
          <div>
            <span
              className="font-sans text-xs mb-3 block"
              style={{ color: 'rgba(255,255,252,0.3)' }}
            >
              Pages
            </span>
            <div className="flex flex-col gap-1">
              {pages.map(({ href, title }) => (
                <Link
                  key={title}
                  href={href}
                  className="font-sans text-sm py-1 w-max transition-opacity duration-200 hover:opacity-60"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>


</div>

        {/* Bottom bar */}
        <div
          className="border-t py-5"
          style={{ borderColor: '#1a1a1a' }}
        >
          <p
            className="font-sans text-xs text-center"
            style={{ color: 'rgba(255,255,252,0.2)' }}
          >
            &copy; {year} Kulaire. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  )
}
