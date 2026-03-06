'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'

const WORDS = ['boring.', 'average.', 'forgettable.', 'ordinary.', 'predictable.']

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex(i => (i + 1) % WORDS.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <h1
        className="font-display font-bold leading-[1.0] tracking-[-0.04em]"
        style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)', color: '#EEE5E9' }}
      >
        <span className="block">Don&apos;t be</span>

        {/* Cycling animated word */}
        <span className="block relative" style={{ minHeight: '1.05em' }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: '60%', opacity: 0, filter: 'blur(8px)' }}
              animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
              exit={{ y: '-60%', opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="block"
              style={{ color: index === 0 ? '#EEE5E9' : '#CF5C36' }}
            >
              {WORDS[index]}
            </motion.span>
          </AnimatePresence>
        </span>
      </h1>
    </section>
  )
}
