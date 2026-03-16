'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'motion/react'

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionType = 'bento' | 'fullbleed' | 'text'

type CaseStudySection = {
  type: SectionType
  heading: string
  subheading?: string
  body: string
  images?: string[]
  caption?: string
}

type Contributor = {
  name: string
  role: string
  avatar?: string
}

type CaseStudy = {
  slug: string
  title: string
  client?: string
  websiteUrl?: string
  coverImage?: string
  tagline?: string
  sections: CaseStudySection[]
  stats?: { label: string; value: string }[]
  tags?: string[]
  contributors?: Contributor[]
  published: boolean
  createdAt: string
}

// ─── Floating image ───────────────────────────────────────────────────────────

function FloatImage({ src, rotate = 0, delay = 0, span2 = false }: {
  src: string
  rotate?: number
  delay?: number
  span2?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
      whileHover={{ y: -6, boxShadow: '0 40px 100px rgba(0,0,0,0.9), 0 8px 32px rgba(0,0,0,0.7)' }}
      style={{
        rotate,
        gridColumn: span2 ? 'span 2' : 'span 1',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.5)',
        transition: 'box-shadow 0.4s ease',
        background: '#111',
      }}
    >
      <img
        src={src}
        alt=""
        draggable={false}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
      />
    </motion.div>
  )
}

// ─── Bento section ────────────────────────────────────────────────────────────

function BentoSection({ section }: { section: CaseStudySection }) {
  const images = section.images ?? []
  const primary = images[0]
  const supporting = images.slice(1)

  return (
    <section className="w-full py-20 md:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">

          {/* Left — screenshot(s) */}
          <div className="w-full md:w-[55%] shrink-0">
            {images.length === 1 && primary && (
              <FloatImage src={primary} rotate={-1} />
            )}
            {images.length > 1 && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                {primary && <FloatImage src={primary} rotate={-1} span2 delay={0} />}
                {supporting.map((img, i) => (
                  <FloatImage key={i} src={img} rotate={i % 2 === 0 ? 1.5 : -1.5} delay={0.1 + i * 0.08} />
                ))}
              </div>
            )}
            {section.caption && (
              <p className="font-sans text-xs mt-3 tracking-[0.06em] uppercase" style={{ color: 'rgba(238,229,233,0.25)' }}>
                {section.caption}
              </p>
            )}
          </div>

          {/* Right — narrative */}
          <div className="md:sticky md:top-28 flex flex-col gap-4 md:w-[45%]">
            {section.heading && (
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="font-display font-bold"
                style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)', color: '#EEE5E9', letterSpacing: '-0.03em', lineHeight: 1.05 }}
              >
                {section.heading}
              </motion.h2>
            )}
            {section.subheading && (
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
                className="font-display font-bold"
                style={{ fontSize: 'clamp(1rem, 1.6vw, 1.2rem)', color: '#CF5C36', letterSpacing: '-0.01em' }}
              >
                {section.subheading}
              </motion.p>
            )}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
              className="font-sans leading-relaxed"
              style={{ color: 'rgba(238,229,233,0.6)', fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}
            >
              {section.body.split('\n').map((line, i) => (
                <p key={i} className={i > 0 ? 'mt-3' : ''}>{line}</p>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  )
}

// ─── Full-bleed section ───────────────────────────────────────────────────────

function FullBleedSection({ section }: { section: CaseStudySection }) {
  const img = section.images?.[0]
  return (
    <section className="w-full py-10">
      {img && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxHeight: '80vh', overflow: 'hidden', boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}
        >
          <img src={img} alt={section.heading} style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
        </motion.div>
      )}
      {(section.heading || section.body) && (
        <div className="max-w-[1200px] mx-auto px-6 md:px-12 mt-12 flex flex-col gap-4">
          {section.heading && (
            <h2
              className="font-display font-bold"
              style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.6rem)', color: '#EEE5E9', letterSpacing: '-0.03em', lineHeight: 1.05 }}
            >
              {section.heading}
            </h2>
          )}
          {section.subheading && (
            <p className="font-display font-bold" style={{ color: '#CF5C36', fontSize: 'clamp(1rem, 1.6vw, 1.2rem)' }}>
              {section.subheading}
            </p>
          )}
          {section.body && (
            <p className="font-sans leading-relaxed" style={{ color: 'rgba(238,229,233,0.6)', fontSize: 'clamp(0.875rem, 1.2vw, 1rem)', maxWidth: 680 }}>
              {section.body}
            </p>
          )}
        </div>
      )}
    </section>
  )
}

// ─── Text-only section ────────────────────────────────────────────────────────

function TextSection({ section }: { section: CaseStudySection }) {
  return (
    <section className="w-full py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-12" style={{ maxWidth: 760 }}>
        {section.heading && (
          <h2
            className="font-display font-bold mb-4"
            style={{ fontSize: 'clamp(1.4rem, 2.6vw, 2.2rem)', color: '#EEE5E9', letterSpacing: '-0.03em', lineHeight: 1.05 }}
          >
            {section.heading}
          </h2>
        )}
        {section.subheading && (
          <p className="font-display font-bold mb-3" style={{ color: '#CF5C36', fontSize: 'clamp(0.9rem, 1.4vw, 1.1rem)' }}>
            {section.subheading}
          </p>
        )}
        {section.body && (
          <div className="font-sans leading-relaxed" style={{ color: 'rgba(238,229,233,0.6)', fontSize: 'clamp(0.875rem, 1.2vw, 1rem)' }}>
            {section.body.split('\n').map((line, i) => (
              <p key={i} className={i > 0 ? 'mt-3' : ''}>{line}</p>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ study }: { study: CaseStudy }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])

  return (
    <div ref={ref} className="relative w-full overflow-hidden" style={{ minHeight: '70vh' }}>
      {study.coverImage && (
        <motion.div style={{ y }} className="absolute inset-0">
          <img src={study.coverImage} alt={study.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.85) 100%)' }} />
        </motion.div>
      )}
      {!study.coverImage && (
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111 100%)' }} />
      )}

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 pt-32 pb-20 flex flex-col gap-5">
        <div className="flex items-center gap-3 flex-wrap">
          {study.client && (
            <span className="font-sans text-xs tracking-[0.12em] uppercase px-3 py-1 rounded-full" style={{ background: 'rgba(207,92,54,0.15)', color: '#CF5C36', border: '1px solid rgba(207,92,54,0.3)' }}>
              {study.client}
            </span>
          )}
          {study.tags?.map(tag => (
            <span key={tag} className="font-sans text-xs tracking-[0.08em] uppercase px-3 py-1 rounded-full" style={{ background: 'rgba(238,229,233,0.05)', color: 'rgba(238,229,233,0.4)', border: '1px solid rgba(238,229,233,0.08)' }}>
              {tag}
            </span>
          ))}
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-bold"
          style={{ fontSize: 'clamp(2.8rem, 7vw, 6rem)', color: '#EEE5E9', letterSpacing: '-0.04em', lineHeight: 0.95, maxWidth: 900 }}
        >
          {study.title}
        </motion.h1>

        {study.tagline && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="font-sans"
            style={{ color: 'rgba(238,229,233,0.55)', fontSize: 'clamp(1rem, 1.6vw, 1.2rem)', maxWidth: 600, lineHeight: 1.6 }}
          >
            {study.tagline}
          </motion.p>
        )}

        {study.stats && study.stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="flex flex-wrap gap-6 mt-4"
          >
            {study.stats.map((s, i) => (
              <div key={i} className="flex flex-col gap-0.5">
                <span className="font-display font-bold" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: '#EEE5E9', letterSpacing: '-0.03em', lineHeight: 1 }}>
                  {s.value}
                </span>
                <span className="font-sans text-xs tracking-[0.1em] uppercase" style={{ color: 'rgba(238,229,233,0.35)' }}>
                  {s.label}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

// ─── Contributors ─────────────────────────────────────────────────────────────

function Contributors({ contributors }: { contributors: Contributor[] }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-16 border-t" style={{ borderColor: '#1a1a1a' }}>
      <p className="font-sans text-xs tracking-[0.14em] uppercase mb-6" style={{ color: 'rgba(238,229,233,0.25)' }}>
        Team
      </p>
      <div className="flex flex-wrap gap-6">
        {contributors.map((c, i) => (
          <div key={i} className="flex items-center gap-3">
            {c.avatar ? (
              <img src={c.avatar} alt={c.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(238,229,233,0.1)' }} />
            ) : (
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#1a1a1a', border: '1px solid rgba(238,229,233,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-display font-bold text-xs" style={{ color: '#CF5C36' }}>
                  {c.name.charAt(0)}
                </span>
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-sans text-sm font-bold" style={{ color: '#EEE5E9', letterSpacing: '-0.01em' }}>{c.name}</span>
              <span className="font-sans text-xs tracking-[0.06em] uppercase" style={{ color: 'rgba(238,229,233,0.3)' }}>{c.role}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Divider ──────────────────────────────────────────────────────────────────

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex items-center gap-4 py-4">
      <span className="font-sans text-[10px] tracking-[0.18em] uppercase shrink-0" style={{ color: 'rgba(207,92,54,0.5)' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: '#1a1a1a' }} />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CaseStudyPage() {
  const params = useParams()
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : ''
  const [study, setStudy] = useState<CaseStudy | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    fetch('/api/casestudies')
      .then(r => r.json())
      .then((data: CaseStudy[]) => {
        const match = data.find(s => s.slug === slug && s.published)
        if (match) setStudy(match)
        else setNotFound(true)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#CF5C36', animation: 'pulse 1.2s ease-in-out infinite' }} />
      </div>
    )
  }

  if (notFound || !study) {
    return (
      <div style={{ minHeight: '100vh', background: '#000', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <p className="font-display font-bold" style={{ fontSize: '2rem', color: '#EEE5E9', letterSpacing: '-0.03em' }}>Case study not found.</p>
        <Link href="/work" className="font-sans text-sm" style={{ color: '#CF5C36' }}>Back to work</Link>
      </div>
    )
  }

  const sectionLabels = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E', 'Section F']

  return (
    <div style={{ background: '#000', minHeight: '100vh' }}>
      <Hero study={study} />

      <div style={{ borderTop: '1px solid #1a1a1a' }} />

      {study.sections.map((section, i) => (
        <div key={i}>
          <SectionDivider label={sectionLabels[i] ?? `Section ${String.fromCharCode(65 + i)}`} />
          {section.type === 'bento' && <BentoSection section={section} />}
          {section.type === 'fullbleed' && <FullBleedSection section={section} />}
          {section.type === 'text' && <TextSection section={section} />}
        </div>
      ))}

      {study.contributors && study.contributors.length > 0 && (
        <Contributors contributors={study.contributors} />
      )}

      <div className="max-w-[1200px] mx-auto px-6 md:px-12 py-12 flex items-center justify-between" style={{ borderTop: '1px solid #1a1a1a' }}>
        <Link href="/work" className="font-sans text-sm flex items-center gap-2 group" style={{ color: 'rgba(238,229,233,0.35)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Back to work
        </Link>
        {study.websiteUrl && (
          <a
            href={study.websiteUrl.startsWith('http') ? study.websiteUrl : `https://${study.websiteUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-sans text-sm px-5 py-2.5 rounded-full transition-all"
            style={{ background: '#CF5C36', color: '#fff', fontWeight: 700, letterSpacing: '0.02em' }}
          >
            View live site
          </a>
        )}
      </div>
    </div>
  )
}
