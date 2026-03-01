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

function generateScattered(count: number): LetterPos[] {
  // Small initial nudge — max ±8px
  const pos: LetterPos[] = Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 16,
    y: (Math.random() - 0.5) * 12,
    r: (Math.random() - 0.5) * 18,
  }))

  // Push overlapping letters apart (letter ~10px wide modelled as circle r=5)
  const minDist = 11
  for (let iter = 0; iter < 30; iter++) {
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

  // Clamp so nothing strays further than 14px from origin
  const maxDist = 14
  for (const p of pos) {
    const d = Math.sqrt(p.x * p.x + p.y * p.y)
    if (d > maxDist) {
      p.x = (p.x / d) * maxDist
      p.y = (p.y / d) * maxDist
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
              ? { x: scattered[i].x, y: scattered[i].y, rotateZ: scattered[i].r }
              : { x: 0, y: 0, rotateZ: 0 }
          }
          transition={
            scattered
              ? { type: 'spring', stiffness: 90, damping: 14, mass: 1 }
              : { type: 'spring', stiffness: 340, damping: 32, mass: 0.5 }
          }
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}
