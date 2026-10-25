import { useEffect, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export type MascotProps = {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  reduced?: boolean
}

export type IdleSpec = {
  phase: number
  bobSpeed: number
  bobAmp: number
  swayAmp: number
  breatheAmp: number
  blinkEvery: number
  lookAmount: number
  tiltAmount: number
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return reduced
}

/**
 * Shared personality engine: breathing, bobbing, swaying, blinking and
 * cursor-aware eye darts. Each character tunes the same language differently.
 */
export function useMascotIdle(
  rootRef: React.RefObject<THREE.Group | null>,
  parts: { blinkLids: THREE.Object3D[]; dartIrises: THREE.Object3D[] },
  spec: IdleSpec,
  reduced: boolean,
  onFrame?: (t: number, root: THREE.Group) => void,
) {
  const blink = useRef({ next: 1.2 + Math.random() * spec.blinkEvery, closing: -1 })
  const settled = useRef(false)

  useFrame((state, delta) => {
    const root = rootRef.current
    if (!root) return
    const t = state.clock.elapsedTime

    if (root.userData.baseY === undefined) {
      root.userData.baseY = root.position.y
      root.userData.baseRotY = root.rotation.y
      root.userData.baseScale = root.scale.x
    }

    if (reduced) {
      if (!settled.current) {
        settled.current = true
        root.position.y = root.userData.baseY as number
        root.rotation.y = root.userData.baseRotY as number
        root.scale.setScalar(root.userData.baseScale as number)
        for (const lid of parts.blinkLids) lid.position.y = (lid.userData.openY as number) ?? lid.position.y
        for (const iris of parts.dartIrises) iris.rotation.set(0, 0, 0)
      }
      return
    }

    const baseY = root.userData.baseY as number
    const baseRotY = root.userData.baseRotY as number
    const baseScale = root.userData.baseScale as number

    // breathing + bobbing + sway — layered sines, never in lockstep
    const breath = 1 + Math.sin(t * spec.bobSpeed * 1.7 + spec.phase) * spec.breatheAmp
    root.scale.set(baseScale * (1 - (breath - 1) * 0.4), baseScale * breath, baseScale * (1 - (breath - 1) * 0.4))
    root.position.y = baseY + Math.sin(t * spec.bobSpeed + spec.phase) * spec.bobAmp
    root.rotation.y = baseRotY + Math.sin(t * 0.33 + spec.phase * 1.7) * spec.swayAmp
    root.rotation.z = Math.sin(t * 0.26 + spec.phase) * spec.tiltAmount

    // blinking — quick lid close/open with irregular schedule
    const b = blink.current
    if (b.closing < 0 && t > b.next) b.closing = 0
    if (b.closing >= 0) {
      b.closing += delta
      const k = b.closing / 0.13
      const lidDrop = k < 1 ? (k < 0.5 ? k * 2 : (1 - k) * 2) : 0
      for (const lid of parts.blinkLids) {
        const openY = (lid.userData.openY as number) ?? lid.position.y
        lid.position.y = openY - lidDrop * 0.17
      }
      if (k >= 1) {
        b.closing = -1
        b.next = t + spec.blinkEvery * (0.7 + Math.random() * 0.8)
      }
    }

    // eye darts — gently track the cursor, with lazy idle drift
    const px = state.pointer.x
    const py = state.pointer.y
    for (let i = 0; i < parts.dartIrises.length; i++) {
      const iris = parts.dartIrises[i]
      const drift = Math.sin(t * 0.31 + spec.phase * 2.2 + i * 0.7) * 0.05
      const targetY = THREE.MathUtils.clamp(px * spec.lookAmount + drift, -0.32, 0.32)
      const targetX = THREE.MathUtils.clamp(-py * spec.lookAmount * 0.7, -0.22, 0.22)
      iris.rotation.y = THREE.MathUtils.lerp(iris.rotation.y, targetY, 0.07)
      iris.rotation.x = THREE.MathUtils.lerp(iris.rotation.x, targetX, 0.07)
    }

    onFrame?.(t, root)
  })
}

/** store the lid rest position once so blink code can return to it */
export function rememberLidOpenY(lids: THREE.Object3D[]) {
  for (const lid of lids) lid.userData.openY = lid.position.y
}
