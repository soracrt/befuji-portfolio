'use client'

import dynamic from 'next/dynamic'

const DarkVeil = dynamic(() => import('./DarkVeil'), { ssr: false })

export default function HeroBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <DarkVeil
        hueShift={0}
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
