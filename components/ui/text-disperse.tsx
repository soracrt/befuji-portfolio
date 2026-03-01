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
  return Array.from({ length: count }, () => ({
    x: (Math.random() - 0.5) * 6,   // ±3px — keeps left-to-right order
    y: (Math.random() - 0.5) * 18,  // ±9px — main dispersion axis
    r: (Math.random() - 0.5) * 36,  // ±18deg — adds character
  }))
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
              ? { type: 'spring', stiffness: 100, damping: 15, mass: 0.8 }
              : { type: 'spring', stiffness: 380, damping: 34, mass: 0.4 }
          }
          style={{ display: 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}
