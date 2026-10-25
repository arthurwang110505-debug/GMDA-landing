import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  kodaAntennae,
  kodaBody,
  kodaLaptop,
  makeBlush,
  makeEyes,
  makeFeet,
  makeSmile,
} from './geometry'
import { makeMaterials } from './materials'
import { rememberLidOpenY, useMascotIdle, type MascotProps } from './useMascotIdle'

/** KODA — Coding. Sky-blue soft squircle body, twin antennae with a pulsing status tip, laptop at rest. */
export function Koda({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, reduced = false }: MascotProps) {
  const root = useRef<THREE.Group>(null)
  const antennae = useRef<THREE.Group>(null)

  const mats = useMemo(() => makeMaterials('#6faef8', '#7fd8c8', '#2e3a6e', '#4e8fd8'), [])
  const built = useMemo(() => {
    const body = kodaBody(mats.body)
    const eyes = makeEyes({
      spacing: 0.315,
      radius: 0.18,
      y: 1.28,
      z: 0.64,
      tint: mats.eyeBall,
      dark: mats.pupil,
      irisMat: mats.iris,
      lidTint: mats.lid,
      glint: mats.glint,
    })
    rememberLidOpenY(eyes.blinkLids)
    const antennaeObj = kodaAntennae(mats.accentC, mats.accentA, mats.accentB, mats.status)
    antennaeObj.group.position.set(0, 1.78, 0)
    const laptop = kodaLaptop(mats.accentB, mats.pupil, mats.status)
    laptop.position.set(0.06, 0.2, 0.78)
    laptop.rotation.y = -0.3
    const blushL = makeBlush(mats.blush, 0.115)
    blushL.position.set(-0.56, 1.05, 0.56)
    const blushR = makeBlush(mats.blush, 0.115)
    blushR.position.set(0.56, 1.05, 0.56)
    const mouth = makeSmile(mats.mouth, 0.068)
    mouth.position.set(0, 1.03, 0.72)
    const feet = makeFeet(mats.body, 2, 0.15)
    feet.position.set(0, 0.18, 0.18)
    return { body, eyes, antennae: antennaeObj, laptop, blushL, blushR, mouth, feet }
  }, [mats])

  useMascotIdle(
    root,
    built.eyes,
    {
      phase: 4.2,
      bobSpeed: 0.58,
      bobAmp: 0.038,
      swayAmp: 0.045,
      breatheAmp: 0.012,
      blinkEvery: 4.2,
      lookAmount: 0.24,
      tiltAmount: 0.014,
    },
    reduced,
    (t) => {
      // status tip breathes like a quiet engine light
      mats.status.emissiveIntensity = 1.05 + Math.sin(t * 1.4) * 0.55
      if (antennae.current) {
        antennae.current.rotation.z = Math.sin(t * 0.5 + 3.1) * 0.055
        antennae.current.rotation.x = Math.sin(t * 0.38 + 1.7) * 0.04
      }
    },
  )

  return (
    <group ref={root} position={position} rotation={rotation} scale={scale}>
      <primitive object={built.body} />
      <primitive object={built.eyes.group} />
      <group ref={antennae}>
        <primitive object={built.antennae.group} />
      </group>
      <primitive object={built.laptop} />
      <primitive object={built.blushL} />
      <primitive object={built.blushR} />
      <primitive object={built.mouth} />
      <primitive object={built.feet} />
    </group>
  )
}
