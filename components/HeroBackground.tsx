'use client'

import dynamic from 'next/dynamic'
import { useState, useEffect } from 'react'

const DarkVeil = dynamic(() => import('./DarkVeil'), { ssr: false })

export default function HeroBackground() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Double rAF ensures the browser paints translateY(-100%) before the transition begins
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(r2)
    })
    return () => cancelAnimationFrame(r1)
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 1.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <DarkVeil
        hueShift={-10}
        noiseIntensity={0}
        scanlineIntensity={0}
        speed={0.5}
        scanlineFrequency={0}
        warpAmount={0}
        resolutionScale={1}
      />
      {/* fade to site background at the bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '55%',
          background: 'linear-gradient(to bottom, transparent 0%, #000000 75%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
