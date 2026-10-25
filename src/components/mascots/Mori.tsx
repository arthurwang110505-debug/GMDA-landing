import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  makeBlush,
  makeEyes,
  makeFeet,
  moriBody,
  moriMagnifier,
  moriSprout,
} from './geometry'
import { makeMaterials } from './materials'
import { rememberLidOpenY, useMascotIdle, type MascotProps } from './useMascotIdle'

/** MORI — Research. Warm ivory pear body, botanical spiral sprout, gold magnifier raised to the face. */
export function Mori({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, reduced = false }: MascotProps) {
  const root = useRef<THREE.Group>(null)
  const sprout = useRef<THREE.Group>(null)

  const mats = useMemo(() => makeMaterials('#f5efe4', '#a8d8c0', '#b9d8f0', '#b08856'), [])
  const built = useMemo(() => {
    const body = moriBody(mats.body)
    const eyes = makeEyes({
      spacing: 0.335,
      radius: 0.185,
      y: 1.3,
      z: 0.6,
      tint: mats.eyeBall,
      dark: mats.pupil,
      irisMat: mats.iris,
      lidTint: mats.lid,
      glint: mats.glint,
    })
    rememberLidOpenY(eyes.blinkLids)
    const sproutObj = moriSprout(mats.accentA, mats.accentA, mats.accentB)
    sproutObj.position.set(0.05, 1.82, 0)
    const magnifier = moriMagnifier(mats.accentDark, mats.accentC, mats.glass)
    magnifier.position.set(-0.38, 1.32, 0.82)
    magnifier.rotation.set(0.06, 0.14, -0.08)
    const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.085, 0.3, 8, 16), mats.body)
    arm.position.set(-0.66, 1.02, 0.5)
    arm.rotation.set(-0.4, 0, 0.72)
    const blushL = makeBlush(mats.blush, 0.12)
    blushL.position.set(-0.56, 1.08, 0.58)
    const blushR = makeBlush(mats.blush, 0.12)
    blushR.position.set(0.56, 1.08, 0.58)
    const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 12), mats.mouth)
    mouth.position.set(0.12, 1.02, 0.74)
    mouth.scale.set(0.85, 1.15, 0.5)
    const feet = makeFeet(mats.body, 2, 0.15)
    feet.position.set(0, 0.17, 0.2)
    return { body, eyes, sprout: sproutObj, magnifier, arm, blushL, blushR, mouth, feet }
  }, [mats])

  useMascotIdle(
    root,
    built.eyes,
    {
      phase: 0.6,
      bobSpeed: 0.72,
      bobAmp: 0.05,
      swayAmp: 0.06,
      breatheAmp: 0.014,
      blinkEvery: 3.6,
      lookAmount: 0.3,
      tiltAmount: 0.02,
    },
    reduced,
    (t) => {
      // curious sprout lag — gentle follow-through
      if (sprout.current) {
        sprout.current.rotation.z = Math.sin(t * 0.55 + 1.2) * 0.12
        sprout.current.rotation.x = Math.sin(t * 0.42 + 0.4) * 0.07
      }
    },
  )

  return (
    <group ref={root} position={position} rotation={rotation} scale={scale}>
      <primitive object={built.body} />
      <primitive object={built.eyes.group} />
      <primitive object={built.magnifier} />
      <primitive object={built.arm} />
      <primitive object={built.blushL} />
      <primitive object={built.blushR} />
      <primitive object={built.mouth} />
      <primitive object={built.feet} />
      <group ref={sprout}>
        <primitive object={built.sprout} />
      </group>
    </group>
  )
}
