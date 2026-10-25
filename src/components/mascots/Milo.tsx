import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { makeBlush, makeEyes, makeFeet, makeSmile, miloBody, miloHeadphones, miloRadar } from './geometry'
import { makeMaterials } from './materials'
import { rememberLidOpenY, useMascotIdle, type MascotProps } from './useMascotIdle'

/** MILO — Monitoring. Soft lilac egg body, deep-purple headphones, a slowly sweeping radar dish. */
export function Milo({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, reduced = false }: MascotProps) {
  const root = useRef<THREE.Group>(null)
  const radar = useRef<THREE.Group>(null)

  const mats = useMemo(() => makeMaterials('#d9a9e0', '#7b5aa8', '#9d7fd0', '#9d7fd0'), [])
  const built = useMemo(() => {
    const body = miloBody(mats.body)
    const eyes = makeEyes({
      spacing: 0.3,
      radius: 0.175,
      y: 1.34,
      z: 0.56,
      tint: mats.eyeBall,
      dark: mats.pupil,
      irisMat: mats.iris,
      lidTint: mats.lid,
      glint: mats.glint,
    })
    rememberLidOpenY(eyes.blinkLids)
    const headphones = miloHeadphones(mats.accentA, mats.accentA, mats.accentB)
    const radarObj = miloRadar(mats.accentB, mats.accentB)
    const blushL = makeBlush(mats.blush, 0.115)
    blushL.position.set(-0.52, 1.12, 0.48)
    const blushR = makeBlush(mats.blush, 0.115)
    blushR.position.set(0.52, 1.12, 0.48)
    const mouth = makeSmile(mats.mouth, 0.062)
    mouth.position.set(0, 1.1, 0.58)
    const feet = makeFeet(mats.body, 2, 0.14)
    feet.position.set(0, 0.13, 0.18)
    return { body, eyes, headphones, radar: radarObj, blushL, blushR, mouth, feet }
  }, [mats])

  useMascotIdle(
    root,
    built.eyes,
    {
      phase: 5.4,
      bobSpeed: 0.62,
      bobAmp: 0.042,
      swayAmp: 0.05,
      breatheAmp: 0.013,
      blinkEvery: 3.2,
      lookAmount: 0.32,
      tiltAmount: 0.018,
    },
    reduced,
    (t) => {
      // radar sweeps slowly — always watching over the team
      if (radar.current) {
        radar.current.rotation.y = Math.sin(t * 0.24 + 0.8) * 0.55
      }
    },
  )

  return (
    <group ref={root} position={position} rotation={rotation} scale={scale}>
      <primitive object={built.body} />
      <primitive object={built.eyes.group} />
      <primitive object={built.headphones} />
      <group ref={radar}>
        <primitive object={built.radar} />
      </group>
      <primitive object={built.blushL} />
      <primitive object={built.blushR} />
      <primitive object={built.mouth} />
      <primitive object={built.feet} />
    </group>
  )
}
