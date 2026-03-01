'use client'

import { useState, useCallback } from 'react'
import type { ComponentProps } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

type TextDisperseProps = Omit<ComponentProps<'span'>, 'onMouseEnter' | 'onMouseLeave' | 'children'> & {
  children: string
  onHover?: (isActive: boolean) => void
}

interface LetterPos {
  x: number
  y: number
  r: number
}

// Generate random scatter positions then resolve overlaps so letters don't stack
function generateScattered(count: number): LetterPos[] {
  const pos: LetterPos[] = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 2.8,
    y: (Math.random() - 0.5) * 1.6,
    r: (Math.random() - 0.5) * 80,
  }))

  // Model each letter as a circle, push overlapping pairs apart
  const minDist = 0.72
  for (let iter = 0; iter < 20; iter++) {
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[j].x - pos[i].x
        const dy = pos[j].y - pos[i].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < minDist && dist > 0.001) {
          const push = (minDist - dist) / 2
          const nx = dx / dist
          const ny = dy / dist
          pos[i].x -= nx * push
          pos[i].y -= ny * push
          pos[j].x += nx * push
          pos[j].y += ny * push
        }
      }
    }
  }

  return pos
}

export function TextDisperse({ children, onHover, className, ...props }: TextDisperseProps) {
  const [scattered, setScattered] = useState<LetterPos[] | null>(null)

  const handleMouseEnter = useCallback(() => {
    onHover?.(true)
    setScattered(generateScattered(children.length))
  }, [children, onHover])

  const handleMouseLeave = useCallback(() => {
    onHover?.(false)
    setScattered(null)
  }, [onHover])

  return (
    <span
      className={cn('relative inline-flex cursor-pointer', className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children.split('').map((char, i) => (
        <motion.span
          key={i}
          animate={
            scattered
              ? { x: `${scattered[i].x}em`, y: `${scattered[i].y}em`, rotateZ: scattered[i].r }
              : { x: 0, y: 0, rotateZ: 0 }
          }
          transition={
            scattered
              ? { type: 'spring', stiffness: 160, damping: 11, mass: 0.9 }
              : { type: 'spring', stiffness: 320, damping: 30, mass: 0.5 }
          }
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}
