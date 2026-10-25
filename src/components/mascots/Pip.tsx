import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { makeBlush, makeEyes, makeFeet, makeSmile, pipBody, pipFoldMarks } from './geometry'
import { makeMaterials } from './materials'
import { rememberLidOpenY, useMascotIdle, type MascotProps } from './useMascotIdle'

/** PIP — Writing. Honey-gold star pillow body with folded seams and an energetic bounce. */
export function Pip({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, reduced = false }: MascotProps) {
  const root = useRef<THREE.Group>(null)

  const mats = useMemo(() => makeMaterials('#f3c74e', '#e0a93e', '#e8b84e'), [])
  const built = useMemo(() => {
    const body = pipBody(mats.body)
    const eyes = makeEyes({
      spacing: 0.3,
      radius: 0.205,
      y: 1.16,
      z: 0.42,
      tint: mats.eyeBall,
      dark: mats.pupil,
      irisMat: mats.iris,
      lidTint: mats.lid,
      glint: mats.glint,
    })
    rememberLidOpenY(eyes.blinkLids)
    const folds = pipFoldMarks(mats.accentA)
    const blushL = makeBlush(mats.blush, 0.13)
    blushL.position.set(-0.56, 0.92, 0.34)
    const blushR = makeBlush(mats.blush, 0.13)
    blushR.position.set(0.56, 0.92, 0.34)
    const mouth = makeSmile(mats.mouth, 0.085)
    mouth.position.set(0, 0.9, 0.42)
    const feet = makeFeet(mats.body, 2, 0.14)
    feet.position.set(0, 0.12, 0.16)
    return { body, eyes, folds, blushL, blushR, mouth, feet }
  }, [mats])

  useMascotIdle(
    root,
    built.eyes,
    {
      phase: 2.1,
      bobSpeed: 1.15,
      bobAmp: 0.085,
      swayAmp: 0.09,
      breatheAmp: 0.02,
      blinkEvery: 2.8,
      lookAmount: 0.38,
      tiltAmount: 0.035,
    },
    reduced,
  )

  return (
    <group ref={root} position={position} rotation={rotation} scale={scale}>
      <primitive object={built.body} />
      <primitive object={built.eyes.group} />
      <primitive object={built.folds} />
      <primitive object={built.blushL} />
      <primitive object={built.blushR} />
      <primitive object={built.mouth} />
      <primitive object={built.feet} />
    </group>
  )
}
