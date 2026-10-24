import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { buildCast, fitCamera, SCALES } from './mascotCast'

export function HeroMascots() {
  const wrapRef = useRef<HTMLSpanElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)')

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    } catch {
      canvas.style.display = 'none'
      return
    }
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, 4, 0.1, 60)
    fitCamera(camera, 4)

    // three-point studio lighting
    const hemi = new THREE.HemisphereLight(0xfff2e0, 0x2a2a40, 0.55)
    const key = new THREE.DirectionalLight(0xffe6c4, 1.7)
    key.position.set(-4.5, 6, 5.5)
    key.castShadow = true
    key.shadow.mapSize.set(2048, 2048)
    key.shadow.camera.left = -6
    key.shadow.camera.right = 6
    key.shadow.camera.top = 5
    key.shadow.camera.bottom = -2
    key.shadow.camera.near = 1
    key.shadow.camera.far = 20
    key.shadow.bias = -0.0004
    const fill = new THREE.DirectionalLight(0xb8c8ff, 0.5)
    fill.position.set(5, 2.5, 4)
    const rim = new THREE.DirectionalLight(0xffffff, 0.85)
    rim.position.set(0, 5, -6)
    const ambient = new THREE.AmbientLight(0xffffff, 0.16)
    scene.add(hemi, key, fill, rim, ambient)

    const { root, rigs, sparkles } = buildCast()
    scene.add(root)

    // shadow catcher below the cast
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(30, 12), new THREE.ShadowMaterial({ opacity: 0.15 }))
    ground.rotation.x = -Math.PI / 2
    ground.position.y = 0.28
    ground.receiveShadow = true
    scene.add(ground)

    const resize = () => {
      const w = wrap.clientWidth
      const h = wrap.clientHeight
      if (!w || !h) return
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      fitCamera(camera, camera.aspect)
    }
    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(wrap)

    // pointer proximity reactions (fine pointers only)
    const pointer = { x: -1e4, y: -1e4 }
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const rect = wrap.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
    }
    const onPointerLeave = () => {
      pointer.x = -1e4
      pointer.y = -1e4
    }
    const interactive = precisePointer.matches && !reducedMotion.matches
    if (interactive) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      window.addEventListener('blur', onPointerLeave)
    }

    const clock = new THREE.Clock()
    const worldPos = new THREE.Vector3()
    const projected = new THREE.Vector3()
    let frame = 0
    let disposed = false

    const tick = () => {
      if (disposed) return
      frame = window.requestAnimationFrame(tick)
      const t = clock.getElapsedTime()
      const still = reducedMotion.matches

      rigs.forEach((rig) => {
        const g = rig.group
        const baseY = g.userData.baseY as number
        const baseX = g.userData.baseX as number
        const baseRotY = g.userData.baseRotY as number
        const idle = still ? 0 : Math.sin(t * rig.bobSpeed + rig.phase)

        g.position.y = baseY + idle * rig.bobAmp
        g.rotation.z = (still ? 0 : Math.sin(t * rig.bobSpeed * 0.8 + rig.phase + 1.2)) * rig.sway

        if (rig.blinkParts && !still) {
          const cycle = (t + rig.blinkOffset) % rig.blinkRate
          const blink = cycle < 0.13 ? Math.sin((cycle / 0.13) * Math.PI) : 0
          rig.blinkParts.scale.y = 1 - blink * 0.88
        }

        if (rig.dartParts && !still) {
          const glance = Math.sin(t * 0.55 + rig.phase) * 0.022
          rig.dartParts.forEach((p) => {
            p.position.x = p.userData.baseX ?? (p.userData.baseX = p.position.x)
            p.position.x += glance
          })
        }

        if (rig.wiggle && !still) {
          rig.wiggle.rotation.z = Math.sin(t * 1.4 + rig.phase) * 0.07
        }

        if (rig.glow && !still) {
          const mat = rig.glow.material as THREE.MeshPhysicalMaterial
          mat.emissiveIntensity = 0.75 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2.2))
        }

        if (interactive) {
          worldPos.set(0, 1, 0)
          g.localToWorld(worldPos)
          projected.copy(worldPos).project(camera)
          const rect = wrap.getBoundingClientRect()
          const sx = (projected.x * 0.5 + 0.5) * rect.width
          const sy = (-projected.y * 0.5 + 0.5) * rect.height
          const dx = pointer.x - sx
          const dy = pointer.y - sy
          const dist = Math.hypot(dx, dy)
          const reach = Math.max(rect.width * 0.14, 130)
          const strength = Math.max(0, 1 - dist / reach)
          const eased = strength * strength * (3 - 2 * strength)

          const leanX = (dx / (rect.width || 1)) * eased * 0.45
          const targetRotY = baseRotY + eased * Math.sign(dx || 1) * 0.2
          g.position.x = THREE.MathUtils.lerp(g.position.x, baseX + leanX, 0.1)
          g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, targetRotY, 0.1)
          const targetScale = SCALES[rig.kind] * (1 + eased * 0.06)
          g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, targetScale, 0.1))
        } else {
          g.position.x = THREE.MathUtils.lerp(g.position.x, baseX, 0.1)
          g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, baseRotY, 0.1)
          g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, SCALES[rig.kind], 0.1))
        }
      })

      if (!still) {
        sparkles.forEach((s, i) => {
          const mat = s.material as THREE.MeshBasicMaterial
          s.rotation.y = t * 0.5 + i
          const tw = 0.65 + 0.35 * Math.sin(t * 1.3 + i * 1.7)
          mat.opacity = 0.35 + 0.5 * tw
          const base = 0.11 + 0.03 * (i % 2)
          s.scale.setScalar(base * (0.85 + 0.3 * tw))
        })
      }

      renderer.render(scene, camera)
    }

    tick()

    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('blur', onPointerLeave)
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh
        if (mesh.geometry) mesh.geometry.dispose()
        const material = mesh.material as THREE.Material | THREE.Material[] | undefined
        if (Array.isArray(material)) material.forEach((m) => m.dispose())
        else material?.dispose()
      })
      renderer.dispose()
    }
  }, [])

  return (
    <span ref={wrapRef} className="hero-mascot-cluster" aria-hidden="true">
      <span className="hero-mascot-surge" />
      <canvas ref={canvasRef} className="hero-mascot-canvas" />
    </span>
  )
}
