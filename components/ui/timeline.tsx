'use client'

import { useScroll, useTransform, motion } from 'motion/react'
import React, { useEffect, useRef, useState } from 'react'

interface TimelineEntry {
  title: string
  content: React.ReactNode
}

export function Timeline({ data }: { data: TimelineEntry[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.getBoundingClientRect().height)
    }
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 10%', 'end 50%'],
  })

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height])
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1])

  return (
    <div className="w-full" ref={containerRef}>
      <div ref={ref} className="relative max-w-3xl mx-auto pb-32">
        {data.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-start pt-12 md:pt-20 md:gap-10"
          >
            {/* Left sticky: dot + year label */}
            <div className="sticky top-32 self-start z-40 flex items-start max-w-[11rem] md:w-44 shrink-0">
              <div className="h-10 w-10 absolute left-3 flex items-center justify-center" style={{ backgroundColor: '#000000' }}>
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: '#a10702',
                    boxShadow: '0 0 8px #a10702, 0 0 20px rgba(161,7,2,0.6), 0 0 40px rgba(161,7,2,0.2)',
                  }}
                />
              </div>
              <h3
                className="hidden md:block font-sans text-[10px] tracking-[0.12em] uppercase font-medium leading-snug"
                style={{ color: '#a10702', paddingLeft: '52px', paddingTop: '12px' }}
              >
                {item.title}
              </h3>
            </div>

            {/* Content */}
            <div className="relative pl-20 pr-4 md:pl-0 flex-1">
              <h3
                className="md:hidden font-sans text-[10px] tracking-[0.12em] uppercase font-medium mb-3"
                style={{ color: '#a10702' }}
              >
                {item.title}
              </h3>
              {item.content}
            </div>
          </motion.div>
        ))}

        {/* Static faint background line */}
        <div
          className="absolute left-8 top-0 w-px pointer-events-none"
          style={{
            height: `${height}px`,
            background: 'linear-gradient(to bottom, transparent 0%, rgba(161,7,2,0.1) 8%, rgba(161,7,2,0.1) 92%, transparent 100%)',
          }}
        />

        {/* Scroll-driven glowing red line */}
        <div
          className="absolute left-8 top-0 overflow-hidden w-px pointer-events-none"
          style={{ height: `${height}px` }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 w-px rounded-full"
            style={{
              height: heightTransform,
              opacity: opacityTransform,
              background: 'linear-gradient(to bottom, #3d0100, #7a0301, #a10702, #d4160a, #e8220a)',
              boxShadow: '0 0 6px rgba(161,7,2,1), 0 0 16px rgba(161,7,2,0.6), 0 0 32px rgba(232,34,10,0.25)',
            }}
          />
        </div>
      </div>
    </div>
  )
}
