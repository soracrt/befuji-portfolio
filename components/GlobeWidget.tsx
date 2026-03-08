'use client'

import { useEffect, useRef } from 'react'

// ── constants ─────────────────────────────────────────────────────────────────
const GLOBE_R       = 100
const INDONESIA_LAT = -2.5489
const INDONESIA_LNG = 118.0149

// ── helpers ───────────────────────────────────────────────────────────────────

/** Convert lat/lng to a 3D point on a sphere of radius r. */
function ll2xyz(lat: number, lng: number, r: number) {
  const phi   = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return {
    x: -r * Math.sin(phi) * Math.cos(theta),
    y:  r * Math.cos(phi),
    z:  r * Math.sin(phi) * Math.sin(theta),
  }
}

/** Create a circular sprite texture so dots render as circles, not squares. */
function makeCircleTex(): HTMLCanvasElement {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')!
  ctx.beginPath()
  ctx.arc(32, 32, 30, 0, Math.PI * 2)
  ctx.fillStyle = '#ffffff'
  ctx.fill()
  return c
}

/** Load topology image, sample land pixels, return packed Float32Array of xyz. */
function buildLandPositions(): Promise<Float32Array> {
  return new Promise(resolve => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = 'https://unpkg.com/three-globe@2.31.1/example/img/earth-topology.png'
    img.onload = () => {
      const W = 360, H = 180, STEP = 2
      const canvas = document.createElement('canvas')
      canvas.width = W; canvas.height = H
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, W, H)
      const { data } = ctx.getImageData(0, 0, W, H)
      const pos: number[] = []
      for (let y = 0; y < H; y += STEP) {
        for (let x = 0; x < W; x += STEP) {
          if (data[(y * W + x) * 4] > 60) {
            const { x: vx, y: vy, z: vz } = ll2xyz(
              90 - (y / H) * 180,
              (x / W) * 360 - 180,
              GLOBE_R * 1.001,  // fractionally above sphere surface
            )
            pos.push(vx, vy, vz)
          }
        }
      }
      resolve(new Float32Array(pos))
    }
    img.onerror = () => resolve(new Float32Array())
  })
}

// ── component ─────────────────────────────────────────────────────────────────
export default function GlobeWidget() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return

    let alive = true
    let rafId = 0

    ;(async () => {
      const [THREE, { OrbitControls }] = await Promise.all([
        import('three'),
        import('three/examples/jsm/controls/OrbitControls.js'),
      ])
      if (!alive) return

      const size = el.offsetWidth

      // ── renderer ────────────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(size, size)
      renderer.setClearColor(0x000000, 0)
      el.appendChild(renderer.domElement)

      // ── scene / camera ───────────────────────────────────────────────────────
      const scene  = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(42, 1, 1, 2000)

      // Position camera so Indonesia is front-and-center on load
      const idDir = ll2xyz(INDONESIA_LAT, INDONESIA_LNG, 1)
      camera.position.set(
        idDir.x * GLOBE_R * 2.5,
        idDir.y * GLOBE_R * 2.5,
        idDir.z * GLOBE_R * 2.5,
      )
      camera.lookAt(0, 0, 0)

      // ── globe sphere (dark, almost black) ───────────────────────────────────
      scene.add(new THREE.Mesh(
        new THREE.SphereGeometry(GLOBE_R, 64, 64),
        new THREE.MeshBasicMaterial({ color: 0x060606 }),
      ))

      // ── land dots ────────────────────────────────────────────────────────────
      // Start with empty geometry; filled async once the topology image loads.
      const dotTex = new THREE.CanvasTexture(makeCircleTex())
      const dotGeo = new THREE.BufferGeometry()
      const dotMat = new THREE.PointsMaterial({
        map:             dotTex,
        alphaTest:       0.4,
        color:           new THREE.Color(0xeee5e9),
        size:            2.6,
        sizeAttenuation: true,
        transparent:     true,
        opacity:         0.65,
      })
      scene.add(new THREE.Points(dotGeo, dotMat))

      buildLandPositions().then(positions => {
        if (!alive) return
        dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
      })

      // ── Indonesia pin ────────────────────────────────────────────────────────
      const idPos = ll2xyz(INDONESIA_LAT, INDONESIA_LNG, GLOBE_R * 1.015)
      const idVec = new THREE.Vector3(idPos.x, idPos.y, idPos.z)

      const pin = new THREE.Mesh(
        new THREE.SphereGeometry(1.3, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xcf5c36 }),
      )
      pin.position.copy(idVec)
      scene.add(pin)

      // ── pulse rings (3 staggered) ────────────────────────────────────────────
      const idNormal  = idVec.clone().normalize()
      const MAX_RING  = 8
      const NUM_RINGS = 3

      const rings = Array.from({ length: NUM_RINGS }, (_, i) => {
        const mat = new THREE.MeshBasicMaterial({
          color:       0xcf5c36,
          transparent: true,
          opacity:     0,
          side:        THREE.DoubleSide,
        })
        const mesh = new THREE.Mesh(new THREE.RingGeometry(0.82, 1, 48), mat)
        mesh.position.copy(idVec)
        // Orient ring so its normal faces outward from the sphere at Indonesia
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), idNormal)
        scene.add(mesh)
        return { mesh, mat, phase: i / NUM_RINGS }
      })

      // ── controls ─────────────────────────────────────────────────────────────
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableZoom      = false
      controls.enablePan       = false
      controls.autoRotate      = true
      controls.autoRotateSpeed = 0.5
      controls.enableDamping   = true
      controls.dampingFactor   = 0.06
      controls.update()

      // ── render loop ──────────────────────────────────────────────────────────
      let frame = 0
      function tick() {
        if (!alive) return
        rafId = requestAnimationFrame(tick)
        frame++

        rings.forEach(({ mesh, mat, phase }) => {
          const t = ((frame * 0.007 + phase) % 1)
          mesh.scale.setScalar(t * MAX_RING)
          mat.opacity = (1 - t) * 0.9
        })

        controls.update()
        renderer.render(scene, camera)
      }
      tick()
    })()

    return () => {
      alive = false
      cancelAnimationFrame(rafId)
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
