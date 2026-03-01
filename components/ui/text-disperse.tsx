'use client'

import { useState } from 'react'
import type { JSX, ComponentProps } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface Transform {
  x: number
  y: number
  rotationZ: number
}

const transforms: Transform[] = [
  { x: -0.8, y: -0.6, rotationZ: -29 },
  { x: -0.2, y: -0.4, rotationZ: -6 },
  { x: -0.05, y: 0.1, rotationZ: 12 },
  { x: -0.05, y: -0.1, rotationZ: -9 },
  { x: -0.1, y: 0.55, rotationZ: 3 },
  { x: 0, y: -0.1, rotationZ: 9 },
  { x: 0, y: 0.15, rotationZ: -12 },
  { x: 0, y: 0.15, rotationZ: -17 },
  { x: 0, y: -0.65, rotationZ: 9 },
  { x: 0.1, y: 0.4, rotationZ: 12 },
  { x: 0, y: -0.15, rotationZ: -9 },
  { x: 0.2, y: 0.15, rotationZ: 12 },
  { x: 0.8, y: 0.6, rotationZ: 20 },
]

type TextDisperseProps = Omit<ComponentProps<'span'>, 'onMouseEnter' | 'onMouseLeave' | 'children'> & {
  children: string
  onHover?: (isActive: boolean) => void
}

export function TextDisperse({ children, onHover, className, ...props }: TextDisperseProps) {
  const [isAnimated, setIsAnimated] = useState(false)

  const splitWord = (word: string) => {
    const chars: JSX.Element[] = []
    word.split('').forEach((char, i) => {
      chars.push(
        <motion.span
          custom={i}
          variants={{
            open: (i: number) => ({
              x: transforms[i].x + 'em',
              y: transforms[i].y + 'em',
              rotateZ: transforms[i].rotationZ,
              transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
              zIndex: 1,
            }),
            closed: {
              x: 0,
              y: 0,
              rotateZ: 0,
              transition: { duration: 0.75, ease: [0.33, 1, 0.68, 1] },
              zIndex: 0,
            },
          }}
          animate={isAnimated ? 'open' : 'closed'}
          key={char + i}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>,
      )
    })
    return chars
  }

  return (
    <span
      className={cn('relative inline-flex cursor-pointer', className)}
      onMouseEnter={() => { onHover?.(true); setIsAnimated(true) }}
      onMouseLeave={() => { onHover?.(false); setIsAnimated(false) }}
      {...props}
    >
      {splitWord(children)}
    </span>
  )
}
