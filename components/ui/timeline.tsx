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
    offset: ['start 10%', 'end 100%'],
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

  const edgeMask = 'linear-gradient(to bottom, transparent 0%, black 6%, black 94%, transparent 100%)'

  return (
    <div className="w-full" ref={containerRef}>
      <div ref={ref} className="relative max-w-[580px] mx-auto pb-40">

        {/* Lines rendered FIRST so dots paint on top */}

        {/* Static grey rail */}
        <div
          className="absolute top-0 w-[3px] pointer-events-none"
          style={{
            left: '30px',
            height: `${height}px`,
            background: '#2e2e2e',
            maskImage: edgeMask,
            WebkitMaskImage: edgeMask,
          }}
        />

        {/* Scroll-driven white fill */}
        <div
          className="absolute top-0 overflow-hidden w-[3px] pointer-events-none"
          style={{
            left: '30px',
            height: `${height}px`,
            maskImage: edgeMask,
            WebkitMaskImage: edgeMask,
          }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 w-[3px]"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background: '#fffffc',
            }}
          />
        </div>

        {/* Rows rendered AFTER lines — dots sit on top */}
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="flex justify-start pt-20 md:pt-36 md:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Left: dot + year label */}
            <div
              className="self-start flex items-center shrink-0 md:w-40"
              style={{ paddingLeft: '22px' }}
            >
              {/* Dot — sits above the line via DOM order */}
              <div
                ref={el => { dotRefs.current[index] = el }}
                className="h-5 w-5 rounded-full shrink-0"
                style={{
                  backgroundColor: passedDots[index] ? '#fffffc' : '#777777',
                  transition: 'background-color 0.5s ease',
                }}
              />
              {/* Year — desktop only */}
              <h3
                className="hidden md:block font-display text-xs tracking-[0.12em] uppercase font-bold leading-tight"
                style={{ color: '#fffffc', marginLeft: '16px' }}
              >
                {item.title}
              </h3>
            </div>

            {/* Content */}
            <div className="flex-1 pl-4 md:pl-0 pr-4">
              {/* Year — mobile */}
              <h3
                className="md:hidden font-display text-xs tracking-[0.1em] uppercase font-bold mb-4"
                style={{ color: '#fffffc' }}
              >
                {item.title}
              </h3>
              {item.content}
            </div>
          </motion.div>
        ))}

      </div>
    </div>
  )
}
