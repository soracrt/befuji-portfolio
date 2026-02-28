'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import FadeIn from './FadeIn'

const YOUTUBE_EMBED = 'https://www.youtube.com/embed/BoR6L2oM-x8?modestbranding=1&rel=0'

export default function Work() {
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [failed, setFailed] = useState(false)
  const blobRef = useRef<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/api/video')
      .then((res) => {
        if (!res.ok) throw new Error('fetch failed')
        return res.blob()
      })
      .then((blob) => {
        if (cancelled) return
        const url = URL.createObjectURL(blob)
        blobRef.current = url
        setBlobUrl(url)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => {
      cancelled = true
      if (blobRef.current) URL.revokeObjectURL(blobRef.current)
    }
  }, [])

  return (
    <section id="work" className="px-8 py-24">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <FadeIn>
          <h2
            className="font-serif text-ink tracking-[-0.02em] mb-14"
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
          >
            Work
          </h2>
        </FadeIn>

        {/* Featured video card */}
        <FadeIn delay={80}>
          <div className="w-full rounded-2xl overflow-hidden" style={{ backgroundColor: '#F2F2EF' }}>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>

              {blobUrl ? (
                <video
                  className="absolute inset-0 w-full h-full object-cover"
                  src={blobUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              ) : failed ? (
                <iframe
                  src={YOUTUBE_EMBED}
                  title="Featured work"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                  style={{ border: 'none' }}
                />
              ) : null}

            </div>
          </div>
        </FadeIn>

        {/* See more link */}
        <FadeIn delay={120}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/work"
              className="font-sans text-xs tracking-[0.15em] uppercase text-ink border-b border-ink pb-0.5 hover:opacity-40 transition-opacity duration-200"
            >
              See more of my work →
            </Link>
          </div>
        </FadeIn>

      </div>
    </section>
  )
}
