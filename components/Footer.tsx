import Link from 'next/link'
import FadeIn from './FadeIn'

export default function Footer() {
  return (
    <footer className="px-8 pb-16">
      <div className="max-w-6xl mx-auto">

        {/* Divider */}
        <div className="border-t mb-12" style={{ borderColor: '#1a1a1a' }} />

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-10">

          {/* Left — identity */}
          <FadeIn>
            <div className="flex flex-col gap-2.5">
              <span className="font-sans font-medium text-ink text-sm">Ghazi</span>
              <a
                href="mailto:hello@befuji.com"
                className="font-sans text-xs transition-opacity duration-200 hover:opacity-100"
                style={{ color: 'rgba(255,255,252,0.4)' }}
              >
                hello@befuji.com
              </a>
              <a
                href="https://linkedin.com/in/ataullis"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs transition-opacity duration-200 hover:opacity-100"
                style={{ color: 'rgba(255,255,252,0.4)' }}
              >
                LinkedIn: @ataullis
              </a>
            </div>
          </FadeIn>

          {/* Right — CTA */}
          <FadeIn delay={120}>
            <Link
              href="/contact"
              className="font-sans text-xs tracking-[0.15em] uppercase text-ink border-b border-ink pb-0.5 link-glow-red inline-block"
            >
              Let's work together →
            </Link>
          </FadeIn>

        </div>

        {/* Copyright */}
        <FadeIn delay={200}>
          <p
            className="font-sans text-xs mt-16"
            style={{ color: 'rgba(255,255,252,0.2)' }}
          >
            &copy; 2026 Befuji
          </p>
        </FadeIn>

      </div>
    </footer>
  )
}
