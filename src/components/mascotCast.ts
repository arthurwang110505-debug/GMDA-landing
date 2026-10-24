/**
 * mascotCast — geometry, materials, and layout for the three.js GMDA cast.
 *
 * Design reference: soft-body collectible characters with props (Mori's
 * magnifier, Pip's sparks, Koda's laptop, Milo's headphones), matte vinyl
 * materials, and soft studio lighting. Characters are decorative UI only —
 * nothing here implies live agent state.
 */
import * as THREE from 'three'

export type Kind = 'mori' | 'pip' | 'koda' | 'milo'

const PALETTE = {
  cream: '#F2E7D0',
  leaf: '#93B860',
  bud: '#E8D6A6',
  honey: '#F5C64B',
  blue: '#8FA9CA',
  blueShade: '#6A87AC',
  lavender: '#C4A5DE',
  lavenderShade: '#A483C4',
  face: '#2B2F52',
  navy: '#232742',
  blush: '#E8889C',
  gold: '#DFAF5C',
  mint: '#8FE6A4',
}

export const SCALES: Record<Kind, number> = { mori: 1.06, pip: 0.92, koda: 0.9, milo: 1.0 }

function vinyl(color: string, opts: THREE.MeshPhysicalMaterialParameters = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.46,
    metalness: 0,
    clearcoat: 0.5,
    clearcoatRoughness: 0.42,
    sheen: 0.55,
    sheenRoughness: 0.9,
    sheenColor: new THREE.Color('#FFF1DD'),
    ...opts,
  })
}

function roundedRectShape(w: number, h: number, r: number) {
  const s = new THREE.Shape()
  s.moveTo(-w / 2 + r, -h / 2)
  s.lineTo(w / 2 - r, -h / 2)
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  s.lineTo(w / 2, h / 2 - r)
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  s.lineTo(-w / 2 + r, h / 2)
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  s.lineTo(-w / 2, -h / 2 + r)
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2)
  return s
}

function starShape(points: number, outer: number, inner: number) {
  const s = new THREE.Shape()
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2
    const x = Math.cos(a) * r
    const y = Math.sin(a) * r
    if (i === 0) s.moveTo(x, y)
    else s.lineTo(x, y)
  }
  s.closePath()
  return s
}

function sparkleShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 1)
  s.quadraticCurveTo(0.14, 0.14, 1, 0)
  s.quadraticCurveTo(0.14, -0.14, 0, -1)
  s.quadraticCurveTo(-0.14, -0.14, -1, 0)
  s.quadraticCurveTo(-0.14, 0.14, 0, 1)
  return s
}

function latheBody(profile: [number, number][], segments = 48) {
  const curve = new THREE.CatmullRomCurve3(profile.map(([x, y]) => new THREE.Vector3(x, y, 0)))
  const pts = curve.getPoints(28).map((p) => new THREE.Vector2(Math.max(0, p.x), p.y))
  const geo = new THREE.LatheGeometry(pts, segments)
  geo.computeVertexNormals()
  return geo
}

const faceInk = () => vinyl(PALETTE.face, { roughness: 0.55, clearcoat: 0.2 })

/** Simple navy dot eye with a glint — the cast's shared eye language. */
function dotEye(x: number, y: number, z: number, scale = 1) {
  const g = new THREE.Group()
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.095 * scale, 18, 14), faceInk())
  dot.scale.z = 0.55
  const glint = new THREE.Mesh(new THREE.SphereGeometry(0.028 * scale, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }))
  glint.position.set(-0.032 * scale, 0.038 * scale, 0.055 * scale)
  g.add(dot, glint)
  g.position.set(x, y, z)
  return g
}

/** Happy closed eye — rainbow arc (∩), per the reference art. */
function happyEye(x: number, y: number, z: number, scale = 1) {
  const g = new THREE.Group()
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.12 * scale, 0.03 * scale, 8, 20, Math.PI), faceInk())
  g.add(arc)
  g.position.set(x, y, z)
  return g
}

function smileArc(radius: number, tube: number, x: number, y: number, z: number) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 8, 20, Math.PI), faceInk())
  m.rotation.z = Math.PI
  m.position.set(x, y, z)
  return m
}

function blushDisc(x: number, y: number, z: number, ry = 0) {
  const m = new THREE.Mesh(
    new THREE.CircleGeometry(0.115, 20),
    new THREE.MeshBasicMaterial({ color: PALETTE.blush, transparent: true, opacity: 0.45 }),
  )
  m.position.set(x, y, z)
  m.rotation.y = ry
  return m
}

function budBall(color: string, r: number) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, 20, 16), vinyl(color, { roughness: 0.35 }))
}

function stemBetween(a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a)
  const len = dir.length()
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.15, len, 10), mat)
  mesh.position.copy(a).addScaledVector(dir, 0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  return mesh
}

function leafMesh(mat: THREE.Material) {
  const mesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(starShape(2, 0.3, 0.1), {
      depth: 0.04,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.03,
      bevelSegments: 3,
      curveSegments: 12,
    }),
    mat,
  )
  mesh.scale.set(1.35, 0.55, 1)
  return mesh
}

type CharRig = {
  kind: Kind
  group: THREE.Group
  blinkParts?: THREE.Group
  dartParts?: THREE.Group[]
  wiggle?: THREE.Group
  glow?: THREE.Mesh
  phase: number
  bobSpeed: number
  bobAmp: number
  sway: number
  blinkRate: number
  blinkOffset: number
}

function buildMori(): CharRig {
  const group = new THREE.Group()
  const body = new THREE.Mesh(
    latheBody([
      [0, 0],
      [0.44, 0.03],
      [0.68, 0.16],
      [0.8, 0.4],
      [0.83, 0.66],
      [0.76, 0.95],
      [0.62, 1.2],
      [0.44, 1.4],
      [0.24, 1.53],
      [0, 1.58],
    ]),
    vinyl(PALETTE.cream, { sheenColor: new THREE.Color('#FFF6E3') }),
  )
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  // sprout: stem + leaf + bud (wiggles)
  const wiggle = new THREE.Group()
  const stemMat = vinyl(PALETTE.leaf, { roughness: 0.5 })
  wiggle.add(stemBetween(new THREE.Vector3(0.02, 1.5, 0), new THREE.Vector3(-0.1, 1.9, 0.02), 0.035, stemMat))
  const sproutLeaf = leafMesh(stemMat)
  sproutLeaf.position.set(-0.42, 1.96, 0.02)
  sproutLeaf.rotation.z = 0.55
  const bud = budBall(PALETTE.bud, 0.14)
  bud.position.set(-0.08, 2.0, 0.02)
  wiggle.add(sproutLeaf, bud)
  group.add(wiggle)

  // side leaf on the flank
  const sideLeaf = leafMesh(stemMat)
  sideLeaf.position.set(-0.8, 0.92, 0.3)
  sideLeaf.rotation.set(0.2, 0.5, 1.05)
  group.add(sideLeaf)

  // face: dot eyes + glints, brow, smile, blush
  const eyeL = dotEye(-0.22, 1.04, 0.74)
  const eyeR = dotEye(0.22, 1.04, 0.74)
  const blinkParts = new THREE.Group()
  blinkParts.add(eyeL, eyeR)
  group.add(blinkParts)
  const brow = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.022, 8, 14, Math.PI), faceInk())
  brow.position.set(0.24, 1.24, 0.72)
  brow.rotation.z = -0.3
  group.add(brow, smileArc(0.1, 0.024, 0, 0.86, 0.78))
  group.add(blushDisc(-0.42, 0.92, 0.66, 0.5), blushDisc(0.42, 0.92, 0.66, -0.5))

  // magnifier over the right eye (research)
  const goldMat = vinyl(PALETTE.gold, { metalness: 0.85, roughness: 0.32, clearcoat: 0.6 })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.03, 10, 28), goldMat)
  ring.position.set(0.22, 1.04, 0.86)
  const lens = new THREE.Mesh(
    new THREE.CircleGeometry(0.185, 22),
    new THREE.MeshPhysicalMaterial({
      color: '#B9A4E8',
      transparent: true,
      opacity: 0.35,
      roughness: 0.12,
      clearcoat: 1,
    }),
  )
  lens.position.set(0.22, 1.04, 0.855)
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.038, 0.28, 10), goldMat)
  handle.position.set(0.4, 0.84, 0.88)
  handle.rotation.set(0, 0, -0.7)
  group.add(ring, lens, handle)

  return {
    kind: 'mori',
    group,
    blinkParts,
    dartParts: [eyeL, eyeR],
    wiggle,
    phase: 0.3,
    bobSpeed: 1.05,
    bobAmp: 0.05,
    sway: 0.022,
    blinkRate: 4.1,
    blinkOffset: 0,
  }
}

function buildPip(): CharRig {
  const group = new THREE.Group()
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(starShape(5, 0.95, 0.55), {
      depth: 0.5,
      bevelEnabled: true,
      bevelThickness: 0.34,
      bevelSize: 0.34,
      bevelSegments: 12,
      curveSegments: 12,
    }),
    vinyl(PALETTE.honey, { sheenColor: new THREE.Color('#FFEFC0') }),
  )
  body.geometry.center()
  body.castShadow = true
  body.receiveShadow = true
  body.position.y = 1.02
  body.rotation.z = -0.12
  group.add(body)

  // happy arcs + raised brow + joyful mouth + blush
  const eyes = new THREE.Group()
  eyes.add(happyEye(-0.26, 1.2, 0.74), happyEye(0.25, 1.15, 0.74))
  group.add(eyes)
  const brow = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.026, 8, 16, Math.PI), faceInk())
  brow.position.set(0.28, 1.38, 0.72)
  brow.rotation.z = -0.35
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.13, 18, 14), vinyl('#3A2436', { roughness: 0.4 }))
  mouth.scale.set(1, 1.15, 0.5)
  mouth.position.set(0, 0.94, 0.74)
  const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.075, 14, 10), vinyl('#E07470', { roughness: 0.45 }))
  tongue.scale.set(1, 0.75, 0.55)
  tongue.position.set(0, 0.875, 0.8)
  group.add(brow, mouth, tongue)
  group.add(blushDisc(-0.42, 1.02, 0.68, 0.5), blushDisc(0.42, 1.0, 0.68, -0.5))

  // writing sparks
  const sparkMat = vinyl(PALETTE.gold, { roughness: 0.35, clearcoat: 0.7 })
  const spots: THREE.Vector3[] = [
    new THREE.Vector3(-1.08, 1.82, 0.15),
    new THREE.Vector3(-0.88, 2.08, 0.1),
    new THREE.Vector3(-0.62, 1.8, 0.2),
  ]
  spots.forEach((p, i) => {
    const spark = new THREE.Mesh(new THREE.CapsuleGeometry(0.035, 0.16, 6, 10), sparkMat)
    spark.position.copy(p)
    spark.rotation.set(0.2 * i, 0, -0.7 + 0.35 * i)
    group.add(spark)
  })

  return {
    kind: 'pip',
    group,
    phase: 1.4,
    bobSpeed: 1.55,
    bobAmp: 0.075,
    sway: 0.035,
    blinkRate: 3.2,
    blinkOffset: 1.2,
  }
}

function buildKoda(): CharRig {
  const group = new THREE.Group()
  const bodyMat = vinyl(PALETTE.blue, { sheenColor: new THREE.Color('#D8E6F8') })
  const body = new THREE.Mesh(
    new THREE.ExtrudeGeometry(roundedRectShape(1.5, 1.15, 0.4), {
      depth: 0.72,
      bevelEnabled: true,
      bevelThickness: 0.26,
      bevelSize: 0.26,
      bevelSegments: 10,
      curveSegments: 12,
    }),
    bodyMat,
  )
  body.geometry.center()
  body.castShadow = true
  body.receiveShadow = true
  body.position.y = 1.02
  group.add(body)

  // feet peeking below the body
  const footGeo = new THREE.SphereGeometry(0.22, 18, 14)
  const footL = new THREE.Mesh(footGeo, bodyMat)
  footL.scale.set(1, 0.62, 1.15)
  footL.position.set(-0.34, 0.16, 0.28)
  const footR = footL.clone()
  footR.position.x = 0.34
  footL.castShadow = footR.castShadow = true
  group.add(footL, footR)

  // antenna + ball (wiggles)
  const wiggle = new THREE.Group()
  const antennaMat = vinyl(PALETTE.blueShade, { roughness: 0.5 })
  wiggle.add(stemBetween(new THREE.Vector3(0.18, 1.55, 0), new THREE.Vector3(0.3, 1.95, 0), 0.028, antennaMat))
  const ball = budBall(PALETTE.mint, 0.09)
  ball.position.set(0.31, 2.01, 0)
  wiggle.add(ball)
  group.add(wiggle)

  // sleepy dot eyes with lids + smile
  const eyeL = dotEye(-0.28, 1.12, 0.68, 0.95)
  const eyeR = dotEye(0.28, 1.12, 0.68, 0.95)
  const lidL = new THREE.Mesh(new THREE.SphereGeometry(0.125, 18, 12), faceInk())
  lidL.scale.set(1.15, 0.55, 0.7)
  lidL.position.set(-0.28, 1.185, 0.68)
  const lidR = lidL.clone()
  lidR.position.x = 0.28
  const blinkParts = new THREE.Group()
  blinkParts.add(eyeL, eyeR, lidL, lidR)
  group.add(blinkParts)
  group.add(smileArc(0.1, 0.023, 0, 0.9, 0.7))

  // status light on the cheek (pulses)
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.1, 18, 14),
    new THREE.MeshPhysicalMaterial({
      color: PALETTE.mint,
      emissive: new THREE.Color(PALETTE.mint),
      emissiveIntensity: 0.9,
      roughness: 0.25,
    }),
  )
  glow.scale.z = 0.55
  glow.position.set(0.56, 0.92, 0.62)
  group.add(glow)

  // laptop floating in front
  const laptop = new THREE.Group()
  const darkMat = vinyl(PALETTE.navy, { roughness: 0.38, clearcoat: 0.75, clearcoatRoughness: 0.3 })
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.06, 0.68), darkMat)
  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.66, 0.05), darkMat)
  screen.position.set(0, 0.34, -0.32)
  screen.rotation.x = -0.22
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.54), new THREE.MeshBasicMaterial({ color: 0x9ec0ff }))
  display.position.set(0, 0.35, -0.285)
  display.rotation.x = -0.22
  base.castShadow = screen.castShadow = true
  laptop.add(base, screen, display)
  laptop.position.set(0, 0.52, 1.0)
  laptop.rotation.x = 0.12
  group.add(laptop)

  return {
    kind: 'koda',
    group,
    blinkParts,
    dartParts: [eyeL, eyeR],
    wiggle,
    glow,
    phase: 2.6,
    bobSpeed: 0.85,
    bobAmp: 0.038,
    sway: 0.015,
    blinkRate: 5.2,
    blinkOffset: 2.4,
  }
}

function buildMilo(): CharRig {
  const group = new THREE.Group()
  const bodyMat = vinyl(PALETTE.lavender, { sheenColor: new THREE.Color('#EBDFF8') })
  const body = new THREE.Mesh(
    latheBody([
      [0, 0],
      [0.46, 0.03],
      [0.72, 0.18],
      [0.84, 0.46],
      [0.86, 0.78],
      [0.76, 1.08],
      [0.56, 1.32],
      [0.3, 1.48],
      [0, 1.54],
    ]),
    bodyMat,
  )
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  // arm nubs
  const armGeo = new THREE.SphereGeometry(0.2, 16, 12)
  const armL = new THREE.Mesh(armGeo, bodyMat)
  armL.scale.set(0.85, 1.1, 0.85)
  armL.position.set(-0.82, 0.86, 0.2)
  const armR = armL.clone()
  armR.position.x = 0.82
  armL.castShadow = armR.castShadow = true
  group.add(armL, armR)

  // twin antennae with pink balls (wiggles)
  const wiggle = new THREE.Group()
  const antennaMat = vinyl(PALETTE.lavenderShade, { roughness: 0.5 })
  const tips: THREE.Vector3[] = [new THREE.Vector3(-0.28, 1.98, 0.05), new THREE.Vector3(0.26, 2.02, 0.02)]
  tips.forEach((tip, i) => {
    wiggle.add(stemBetween(new THREE.Vector3(tip.x * 0.55, 1.48, 0), tip, 0.026, antennaMat))
    const ball = budBall(i === 0 ? '#E8A0C8' : '#F0B8D8', 0.085)
    ball.position.copy(tip)
    wiggle.add(ball)
  })
  group.add(wiggle)

  // headphones
  const phoneMat = vinyl('#4A3B66', { roughness: 0.42, clearcoat: 0.6 })
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.6, 0.075, 12, 32, Math.PI), phoneMat)
  band.position.set(0, 1.28, 0)
  band.rotation.x = -0.12
  const cupGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.18, 20)
  const cupL = new THREE.Mesh(cupGeo, phoneMat)
  cupL.rotation.z = Math.PI / 2
  cupL.position.set(-0.64, 1.26, 0)
  const cupR = cupL.clone()
  cupR.position.x = 0.64
  band.castShadow = cupL.castShadow = cupR.castShadow = true
  group.add(band, cupL, cupR)

  // happy arcs + smile + blush
  const eyes = new THREE.Group()
  eyes.add(happyEye(-0.24, 1.06, 0.74, 1.05), happyEye(0.24, 1.03, 0.74, 1.05))
  group.add(eyes)
  group.add(smileArc(0.1, 0.023, 0, 0.88, 0.76))
  group.add(blushDisc(-0.44, 0.94, 0.66, 0.5), blushDisc(0.44, 0.92, 0.66, -0.5))

  return {
    kind: 'milo',
    group,
    phase: 3.8,
    bobSpeed: 1.3,
    bobAmp: 0.06,
    sway: 0.028,
    blinkRate: 3.9,
    blinkOffset: 3.1,
  }
}

export function buildCast() {
  const root = new THREE.Group()
  const rigs: CharRig[] = [buildMori(), buildPip(), buildKoda(), buildMilo()]
  const layout: Record<Kind, { pos: [number, number, number]; rotY: number }> = {
    mori: { pos: [-3.15, 0.42, 0], rotY: 0.24 },
    pip: { pos: [-1.1, 0.38, 0.3], rotY: 0.12 },
    koda: { pos: [1.1, 0.38, 0.28], rotY: -0.12 },
    milo: { pos: [3.15, 0.42, 0], rotY: -0.24 },
  }
  rigs.forEach((rig) => {
    const l = layout[rig.kind]
    rig.group.position.set(...l.pos)
    rig.group.rotation.y = l.rotY
    rig.group.scale.setScalar(SCALES[rig.kind])
    rig.group.userData.baseX = l.pos[0]
    rig.group.userData.baseY = l.pos[1]
    rig.group.userData.baseRotY = l.rotY
    root.add(rig.group)
  })

  // floating sparkle accents
  const sparkles: THREE.Mesh[] = []
  const sparkleGeo = new THREE.ExtrudeGeometry(sparkleShape(), {
    depth: 0.05,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2,
    curveSegments: 10,
  })
  const spots: [number, number, number][] = [
    [-2.15, 2.35, 0.4],
    [0.15, 2.5, 0.2],
    [2.3, 2.3, 0.35],
    [-0.25, 1.25, 1.0],
  ]
  spots.forEach((p, i) => {
    const s = new THREE.Mesh(sparkleGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 }))
    s.position.set(...p)
    s.scale.setScalar(0.11 + 0.03 * (i % 2))
    root.add(s)
    sparkles.push(s)
  })

  return { root, rigs, sparkles }
}

export function fitCamera(camera: THREE.PerspectiveCamera, aspect: number) {
  const worldWidth = 9.2
  const vFov = THREE.MathUtils.degToRad(camera.fov)
  const dist = worldWidth / 2 / (Math.tan(vFov / 2) * aspect)
  camera.position.set(0, 2.35, THREE.MathUtils.clamp(dist, 4.8, 12))
  camera.lookAt(0, 1.35, 0)
}

