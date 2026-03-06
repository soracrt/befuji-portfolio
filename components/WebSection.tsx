import Image from 'next/image'
import FadeIn from './FadeIn'

export default function WebSection() {
  return (
    <section className="px-8 py-24">
      <div className="max-w-4xl mx-auto">

        <FadeIn>
          <h2
            className="font-sans font-medium text-ink tracking-[-0.02em] mb-14"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Web
          </h2>
        </FadeIn>

        <FadeIn delay={80}>
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: '1px solid #1a1a1a',
              boxShadow: '0 0 0 1px #1a1a1a, 0 40px 100px rgba(0,0,0,0.7)',
            }}
          >
            {/* Browser chrome bar */}
            <div
              className="flex items-center px-4 gap-3"
              style={{ height: '42px', background: '#111', borderBottom: '1px solid #1a1a1a' }}
            >
              {/* Traffic light dots */}
              <div className="flex items-center gap-[6px] shrink-0">
                <div className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                <div className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
              </div>

              {/* URL bar — centered in the remaining space */}
              <div className="flex-1 flex items-center justify-center">
                <div
                  className="flex items-center gap-1.5 px-3 rounded-md"
                  style={{
                    background: '#1a1a1a',
                    height: '26px',
                    maxWidth: '340px',
                    width: '100%',
                  }}
                >
                  {/* Lock icon */}
                  <svg
                    width="9" height="9" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="2.5"
                    strokeLinecap="round" strokeLinejoin="round"
                    style={{ color: 'rgba(255,255,252,0.28)', flexShrink: 0 }}
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <span
                    className="font-sans w-full text-center"
                    style={{ fontSize: '11px', letterSpacing: '0.01em', color: 'rgba(255,255,252,0.4)' }}
                  >
                    supremeautospa.co.uk
                  </span>
                </div>
              </div>

              {/* Balance spacer — same width as the dots group */}
              <div className="shrink-0" style={{ width: '54px' }} />
            </div>

            {/* Screenshot */}
            <a
              href="https://supremeautospa.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="block relative group"
            >
              <Image
                src="/screenshots/supremeautospa.png"
                alt="Supreme Auto Spa — website"
                width={1280}
                height={800}
                className="w-full h-auto block"
                priority={false}
              />

              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'rgba(0,0,0,0.4)' }}
              >
                <span className="font-sans text-xs tracking-[0.15em] uppercase text-ink border-b border-ink pb-0.5 link-glow-red">
                  Visit site →
                </span>
              </div>
            </a>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
