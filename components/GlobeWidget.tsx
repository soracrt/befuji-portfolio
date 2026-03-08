'use client'

import { useEffect, useRef } from 'react'

type LandPt    = { lat: number; lng: number }
type RingDatum = { lat: number; lng: number; maxR: number; propagationSpeed: number; repeatPeriod: number }

const INDONESIA_LAT = -2.5489
const INDONESIA_LNG = 118.0149

const RING_DATA: RingDatum[] = [
  { lat: INDONESIA_LAT, lng: INDONESIA_LNG, maxR: 4, propagationSpeed: 2, repeatPeriod: 1800 },
]
const POINT_DATA = [{ lat: INDONESIA_LAT, lng: INDONESIA_LNG }]

// Sample the three-globe topology image. Land pixels are bright; ocean is dark.
function sampleLandmass(step = 2): Promise<LandPt[]> {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = 'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png'
    img.onload = () => {
      const W = 360, H = 180
      const canvas = document.createElement('canvas')
      canvas.width = W; canvas.height = H
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, W, H)
      const { data } = ctx.getImageData(0, 0, W, H)
      const pts: LandPt[] = []
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4] > 60) {
            pts.push({ lat: 90 - (y / H) * 180, lng: (x / W) * 360 - 180 })
          }
        }
      }
      resolve(pts)
    }
    img.onerror = () => resolve([])
  })
}

export default function GlobeWidget() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let alive = true
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let g: any = null

    ;(async () => {
      const [{ default: GlobeClass }, THREE] = await Promise.all([
        import('globe.gl'),
        import('three'),
      ])
      // globe.gl TS types declare a constructor; the JS runtime API is a factory.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Globe = GlobeClass as any
      if (!alive || !el) return

      const dim = el.offsetWidth

      g = Globe({ rendererConfig: { alpha: true, antialias: true } })(el)
        .width(dim)
        .height(dim)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('#1a0a06')
        .atmosphereAltitude(0.14)
        .globeMaterial(new THREE.MeshBasicMaterial({ color: new THREE.Color(0x060606) }))
        // Indonesia pulse point
        .pointsData(POINT_DATA)
        .pointColor(() => '#CF5C36')
        .pointAltitude(0.02)
        .pointRadius(1.0)
        // Indonesia expanding rings
        .ringsData(RING_DATA)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .ringColor(() => (t: number) => `rgba(207,92,54,${((1 - t) * 0.9).toFixed(3)})`)
        .ringMaxRadius('maxR')
        .ringPropagationSpeed('propagationSpeed')
        .ringRepeatPeriod('repeatPeriod')

      // Controls — slow rotation, no zoom/pan
      const ctrl = g.controls()
      ctrl.autoRotate      = true
      ctrl.autoRotateSpeed = 0.45
      ctrl.enableZoom      = false
      ctrl.enablePan       = false
      ctrl.enableDamping   = true
      ctrl.dampingFactor   = 0.06

      // Zoom in and center on Indonesia
      g.pointOfView({ lat: INDONESIA_LAT, lng: INDONESIA_LNG, altitude: 1.5 }, 0)

      // ── landmass dots ──────────────────────────────────────────────────────
      // Use a single THREE.Points object (one draw call) instead of individual
      // meshes — far more performant and lets us use bigger, cleaner dot sizes.
      sampleLandmass(2).then(pts => {
        if (!alive) return

        const positions = new Float32Array(pts.length * 3)
        pts.forEach(({ lat, lng }, i) => {
          // Use globe.gl's own converter so coordinates match exactly
          const { x, y, z } = g.getCoords(lat, lng, 0)
          positions[i * 3]     = x
          positions[i * 3 + 1] = y
          positions[i * 3 + 2] = z
        })

        const geo = new THREE.BufferGeometry()
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

        const mat = new THREE.PointsMaterial({
          color:           new THREE.Color(0xeee5e9),
          size:            2.8,
          sizeAttenuation: true,   // dots shrink with distance (perspective)
          transparent:     true,
          opacity:         0.65,
        })

        g.scene().add(new THREE.Points(geo, mat))
      })
    })()

    return () => {
      alive = false
      try {
        if (g) {
          g.pauseAnimation()
          g.renderer()?.dispose()
        }
      } catch { /* ignore disposal errors */ }
      el.innerHTML = ''
    }
  }, [])

  return (
    <div
      ref={mountRef}
      style={{ width: '100%', aspectRatio: '1 / 1', cursor: 'grab' }}
    />
  )
}
