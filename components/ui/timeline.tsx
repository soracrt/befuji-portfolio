'use client'

import { useScroll, useTransform, useMotionValueEvent, motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'

interface TimelineEntry {
  title: string
  content: React.ReactNode
}

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const [passedDots, setPassedDots] = useState<boolean[]>(data.map(() => false))

  // Refs for each dot container (not sticky — measured at natural scroll position)
  const dotRefs = useRef<(HTMLDivElement | null)[]>([])
  const dotOffsets = useRef<number[]>([])

  useEffect(() => {
    if (!ref.current) return
    const containerRect = ref.current.getBoundingClientRect()
    setHeight(containerRect.height)
    dotOffsets.current = dotRefs.current.map(el => {
      if (!el) return 0
      return el.getBoundingClientRect().top - containerRect.top
    })
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 5%', 'end 55%'],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  useMotionValueEvent(heightTransform, 'change', (latest) => {
    setPassedDots(prev => {
      const next = dotOffsets.current.map(offset => latest >= offset - 8)
      if (next.every((v, i) => v === prev[i])) return prev
      return next
    })
  })

  return (
    <div className="w-full" ref={containerRef}>
      <div ref={ref} className="relative max-w-4xl mx-auto pb-40">
        {data.map((item, index) => (
          // Outer div NOT animated — needed for accurate dot position measurement
          <div
            key={index}
            className="flex justify-start pt-20 md:pt-36 md:gap-12"
          >
            {/* Left sticky: dot + year label */}
            <div className="sticky top-32 self-start z-40 flex items-start md:w-56 shrink-0">
              {/* Dot — referenced for scroll tracking */}
              <div
                ref={el => { dotRefs.current[index] = el }}
                className="h-10 w-10 absolute left-3 top-2 flex items-center justify-center"
                style={{ backgroundColor: '#000000' }}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: passedDots[index] ? '#fffffc' : 'rgba(255,255,252,0.2)',
                    boxShadow: passedDots[index]
                      ? '0 0 10px rgba(255,255,252,0.45), 0 0 24px rgba(255,255,252,0.15)'
                      : 'none',
                    transition: 'background-color 0.5s ease, box-shadow 0.5s ease',
                  }}
                />
              </div>
              {/* Year — desktop */}
              <h3
                className="hidden md:block font-sans text-xs tracking-[0.12em] uppercase font-semibold leading-tight"
                style={{ color: '#a10702', paddingLeft: '58px', paddingTop: '16px' }}
              >
                {item.title}
              </h3>
            </div>

            {/* Content — animated */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 pl-20 md:pl-0 pr-4"
            >
              {/* Year — mobile */}
              <h3
                className="md:hidden font-sans text-xs tracking-[0.1em] uppercase font-semibold mb-4"
                style={{ color: '#a10702' }}
              >
                {item.title}
              </h3>
              {item.content}
            </motion.div>
          </div>
        ))}

        {/* Static faint background line */}
        <div
          className="absolute left-8 top-0 w-px pointer-events-none"
          style={{
            height: `${height}px`,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,252,0.08) 8%, rgba(255,255,252,0.08) 92%, transparent 100%)',
          }}
        />

        {/* Scroll-driven glowing red fill */}
        <div
          className="absolute left-8 top-0 overflow-hidden w-px pointer-events-none"
          style={{ height: `${height}px` }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 w-px"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background: 'linear-gradient(to bottom, rgba(255,255,252,0.4), #fffffc)',
              boxShadow: '0 0 6px rgba(255,255,252,0.6), 0 0 16px rgba(255,255,252,0.2)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
