'use client'

import { useEffect, useRef } from 'react'

// ── types ─────────────────────────────────────────────────────────────────────
type LandPt   = { lat: number; lng: number }
type RingDatum = { lat: number; lng: number; maxR: number; propagationSpeed: number; repeatPeriod: number }

// ── constants ─────────────────────────────────────────────────────────────────
const INDONESIA_LAT = -2.5489
const INDONESIA_LNG = 118.0149

const RING_DATA: RingDatum[] = [
  { lat: INDONESIA_LAT, lng: INDONESIA_LNG, maxR: 5, propagationSpeed: 2, repeatPeriod: 1800 },
]
const POINT_DATA = [{ lat: INDONESIA_LAT, lng: INDONESIA_LNG }]

// ── landmass dot sampler ──────────────────────────────────────────────────────
// Samples the three-globe topology image (land = bright pixel) and returns
// a list of {lat, lng} for every land cell at the given step resolution.
function sampleLandmass(step = 3): Promise<LandPt[]> {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = 'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png'
    img.onload = () => {
      const W = 360, H = 180
      const canvas = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, W, H)
      const { data } = ctx.getImageData(0, 0, W, H)
      const pts: LandPt[] = []
      for (let y = 0; y < H; y += step) {
        for (let x = 0; x < W; x += step) {
          if (data[(y * W + x) * 4] > 60) {
            pts.push({
              lat: 90 - (y / H) * 180,
              lng: (x / W) * 360 - 180,
            })
          }
        }
      }
      resolve(pts)
    }
    img.onerror = () => resolve([])
  })
}

// ── component ─────────────────────────────────────────────────────────────────
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
      // globe.gl's TS types declare a constructor but the runtime API is a
      // factory function: Globe(config)(domElement). Cast through any.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const Globe = GlobeClass as any
      if (!alive || !el) return

      // Shared dot geometry + material (one draw call per mesh, shared geo)
      const dotGeo = new THREE.SphereGeometry(0.4, 4, 4)
      const dotMat = new THREE.MeshBasicMaterial({
        color:       new THREE.Color(0xeee5e9),
        transparent: true,
        opacity:     0.35,
      })

      const dim = el.offsetWidth

      g = Globe({ rendererConfig: { alpha: true, antialias: true } })(el)
        .width(dim)
        .height(dim)
        .backgroundColor('rgba(0,0,0,0)')
        .showAtmosphere(true)
        .atmosphereColor('#1a0a06')
        .atmosphereAltitude(0.12)
        .globeMaterial(new THREE.MeshBasicMaterial({ color: new THREE.Color(0x060606) }))
        // Indonesia pulse point
        .pointsData(POINT_DATA)
        .pointColor(() => '#CF5C36')
        .pointAltitude(0.02)
        .pointRadius(0.6)
        // Indonesia ring ripples
        .ringsData(RING_DATA)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .ringColor(() => (t: number) => `rgba(207,92,54,${((1 - t) * 0.85).toFixed(3)})`)
        .ringMaxRadius('maxR')
        .ringPropagationSpeed('propagationSpeed')
        .ringRepeatPeriod('repeatPeriod')

      // Controls
      const ctrl = g.controls()
      ctrl.autoRotate      = true
      ctrl.autoRotateSpeed = 0.45
      ctrl.enableZoom      = false
      ctrl.enablePan       = false
      ctrl.enableDamping   = true
      ctrl.dampingFactor   = 0.06

      // Start centered on Indonesia
      g.pointOfView({ lat: INDONESIA_LAT, lng: INDONESIA_LNG, altitude: 2.2 }, 0)

      // Load landmass dots — globe renders the orange pin immediately while
      // the topology image fetches in the background
      sampleLandmass(3).then(pts => {
        if (!alive) return
        g.customLayerData(pts)
          .customThreeObject(() => new THREE.Mesh(dotGeo, dotMat))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .customThreeObjectUpdate((obj: any, d: any) => {
            const pos = g.getCoords(d.lat, d.lng, 0.005)
            obj.position.set(pos.x, pos.y, pos.z)
          })
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
