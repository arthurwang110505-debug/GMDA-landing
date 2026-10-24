import * as THREE from 'three'

/**
 * mascotCast — high-fidelity geometry, materials, and layout for the three.js
 * GMDA cast. Target: the look of the approved cinematic concept render —
 * soft-body collectible characters with glossy expressive eyes, matte silicone
 * vinyl, and studio lighting. Characters are decorative UI only; nothing here
 * implies live agent state.
 */

export type Kind = 'mori' | 'pip' | 'koda' | 'milo'

export const SCALES: Record<Kind, number> = { mori: 1.04, pip: 0.95, koda: 0.92, milo: 1.0 }

const INK = '#242849'
const WHITE = '#FBF7F2'

function vinyl(color: string, opts: THREE.MeshPhysicalMaterialParameters = {}) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness: 0.52,
    metalness: 0,
    sheen: 1,
    sheenRoughness: 0.72,
    sheenColor: new THREE.Color('#FFF2E2'),
    clearcoat: 0.35,
    clearcoatRoughness: 0.55,
    envMapIntensity: 0.55,
    ...opts,
  })
}

/* ---------- smooth blob geometry ---------- */

/** Displace a dense icosphere by a radial function of the direction — perfectly smooth soft bodies. */
function softBody(
  radiusFn: (d: THREE.Vector3) => number,
  anisotropic: { x: number; y: number; z: number } = { x: 1, y: 1, z: 1 },
  detail = 5,
) {
  const geo = new THREE.IcosahedronGeometry(1, detail)
  const pos = geo.attributes.position
  const d = new THREE.Vector3()
  for (let i = 0; i < pos.count; i++) {
    d.fromBufferAttribute(pos, i).normalize()
    const r = radiusFn(d)
    pos.setXYZ(i, d.x * r * anisotropic.x, d.y * r * anisotropic.y, d.z * r * anisotropic.z)
  }
  geo.computeVertexNormals()
  return geo
}

/** Puffy rounded star (Pip): 5 soft lobes, pillow-like in z. */
function starPillow(lobes: number, rBase: number, lobeAmp: number, thickness: number, phase = -Math.PI / 2) {
  return softBody(
    (d) => {
      const theta = Math.atan2(d.y, d.x)
      const lobe = 1 + lobeAmp * Math.pow(Math.max(0, Math.cos(lobes * (theta - phase))), 1.35)
      const r = rBase * lobe
      // superellipse blend so the front/back faces pillow out softly
      const zTerm = Math.pow(Math.abs(d.z) / thickness, 2.4)
      const xyTerm = 1
      return r * Math.pow(1 / (xyTerm + zTerm), 1 / 2.4)
    },
    { x: 1, y: 1, z: 1 },
    6,
  )
}

/** Pillow-rounded cube (Koda): superellipsoid. */
function pillowBox(w: number, h: number, dpt: number, n = 4.1) {
  return softBody(
    (d) => {
      const t =
        Math.pow(Math.abs(d.x) / w, n) + Math.pow(Math.abs(d.y) / h, n) + Math.pow(Math.abs(d.z) / dpt, n)
      return Math.pow(t, -1 / n)
    },
    { x: 1, y: 1, z: 1 },
    6,
  )
}

/** Lathe body from a smooth profile (Mori's pear, Milo's egg). */
function latheBody(profile: [number, number][]) {
  const curve = new THREE.CatmullRomCurve3(profile.map(([x, y]) => new THREE.Vector3(x, y, 0)))
  const pts = curve.getPoints(36).map((p) => new THREE.Vector2(Math.max(0, p.x), p.y))
  const geo = new THREE.LatheGeometry(pts, 72)
  geo.computeVertexNormals()
  return geo
}

/* ---------- soft painted details (gradient textures) ---------- */

function radialTexture(inner: [number, number, number, number], outer: [number, number, number, number], size = 96) {
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (x + 0.5) / size - 0.5
      const dy = (y + 0.5) / size - 0.5
      const t = Math.min(1, Math.hypot(dx, dy) * 2)
      const k = 1 - t * t * (3 - 2 * t) // smooth falloff
      const i = (y * size + x) * 4
      data[i] = outer[0] + (inner[0] - outer[0]) * k
      data[i + 1] = outer[1] + (inner[1] - outer[1]) * k
      data[i + 2] = outer[2] + (inner[2] - outer[2]) * k
      data[i + 3] = outer[3] + (inner[3] - outer[3]) * k
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.needsUpdate = true
  return tex
}

function blushTexture() {
  return radialTexture([232, 136, 156, 160], [232, 136, 156, 0])
}

function shadowTexture() {
  return radialTexture([18, 20, 34, 110], [18, 20, 34, 0])
}

function blushDisc(x: number, y: number, z: number, ry: number, tex: THREE.Texture) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.3),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }),
  )
  m.position.set(x, y, z)
  m.rotation.y = ry
  return m
}

/* ---------- face parts: cinematic eyes ---------- */

const irisMat = () => vinyl('#2B3260', { roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.8 })
const glintMat = () => new THREE.MeshBasicMaterial({ color: 0xffffff })
const scleraMat = () => vinyl(WHITE, { roughness: 0.22, clearcoat: 1, clearcoatRoughness: 0.15, envMapIntensity: 0.7 })
const inkMat = () => vinyl(INK, { roughness: 0.5, clearcoat: 0.3 })

/** Big glossy eye — sclera + iris + pupil + two catchlights. */
function glossyEye(x: number, y: number, z: number, scale = 1) {
  const g = new THREE.Group()
  const white = new THREE.Mesh(new THREE.SphereGeometry(0.185 * scale, 32, 24), scleraMat())
  white.scale.z = 0.72
  const iris = new THREE.Mesh(new THREE.SphereGeometry(0.128 * scale, 28, 20), irisMat())
  iris.scale.z = 0.5
  iris.position.z = 0.105 * scale
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.062 * scale, 20, 16), inkMat())
  pupil.scale.z = 0.42
  pupil.position.z = 0.145 * scale
  const glintA = new THREE.Mesh(new THREE.SphereGeometry(0.052 * scale, 16, 12), glintMat())
  glintA.position.set(-0.062 * scale, 0.07 * scale, 0.16 * scale)
  const glintB = new THREE.Mesh(
    new THREE.SphereGeometry(0.026 * scale, 12, 10),
    new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.6 }),
  )
  glintB.position.set(0.066 * scale, -0.055 * scale, 0.15 * scale)
  const inner = new THREE.Group()
  inner.add(iris, pupil, glintA, glintB)
  g.add(white, inner)
  g.position.set(x, y, z)
  return { group: g, inner }
}

/** Happy closed eye — soft rainbow arc. */
function happyEye(x: number, y: number, z: number, scale = 1) {
  const g = new THREE.Group()
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.135 * scale, 0.034 * scale, 12, 28, Math.PI), inkMat())
  g.add(arc)
  g.position.set(x, y, z)
  return g
}

function brow(x: number, y: number, z: number, rot: number, scale = 1) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(0.115 * scale, 0.024 * scale, 10, 20, Math.PI), inkMat())
  m.position.set(x, y, z)
  m.rotation.z = rot
  return m
}

function smile(radius: number, tube: number, x: number, y: number, z: number) {
  const m = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 10, 24, Math.PI), inkMat())
  m.rotation.z = Math.PI
  m.position.set(x, y, z)
  return m
}

function budBall(color: string, r: number) {
  return new THREE.Mesh(new THREE.SphereGeometry(r, 28, 20), vinyl(color, { roughness: 0.32, clearcoat: 0.6 }))
}

function stemBetween(a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a)
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 1.15, dir.length(), 14), mat)
  mesh.position.copy(a).addScaledVector(dir, 0.5)
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize())
  return mesh
}

function leafMesh(mat: THREE.Material) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0.42)
  shape.quadraticCurveTo(0.3, 0.12, 0, -0.42)
  shape.quadraticCurveTo(-0.3, 0.12, 0, 0.42)
  const mesh = new THREE.Mesh(
    new THREE.ExtrudeGeometry(shape, {
      depth: 0.07,
      bevelEnabled: true,
      bevelThickness: 0.045,
      bevelSize: 0.045,
      bevelSegments: 5,
      curveSegments: 18,
    }),
    mat,
  )
  mesh.geometry.center()
  return mesh
}

export type CharRig = {
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

/* ---------- the four characters ---------- */

function buildMori(blushTex: THREE.Texture, shadowTex: THREE.Texture): CharRig {
  const group = new THREE.Group()
  const body = new THREE.Mesh(
    latheBody([
      [0, 0],
      [0.5, 0.04],
      [0.74, 0.2],
      [0.86, 0.46],
      [0.88, 0.72],
      [0.8, 1.0],
      [0.66, 1.26],
      [0.47, 1.46],
      [0.26, 1.58],
      [0, 1.63],
    ]),
    vinyl('#F0E4CB', { sheenColor: new THREE.Color('#FFF8E8') }),
  )
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  // sprout
  const wiggle = new THREE.Group()
  const leafMat = vinyl('#8FB257', { roughness: 0.5, sheen: 0.5 })
  wiggle.add(stemBetween(new THREE.Vector3(0.03, 1.56, 0), new THREE.Vector3(-0.09, 1.98, 0.02), 0.04, leafMat))
  const sproutLeaf = leafMesh(leafMat)
  sproutLeaf.scale.setScalar(0.85)
  sproutLeaf.position.set(-0.4, 2.06, 0.03)
  sproutLeaf.rotation.z = 0.7
  const bud = budBall('#EBD9A8', 0.15)
  bud.position.set(-0.07, 2.12, 0.02)
  wiggle.add(sproutLeaf, bud)
  group.add(wiggle)

  // side leaf
  const sideLeaf = leafMesh(leafMat)
  sideLeaf.scale.setScalar(0.95)
  sideLeaf.position.set(-0.82, 0.92, 0.34)
  sideLeaf.rotation.set(0.25, 0.55, 1.1)
  group.add(sideLeaf)

  // face
  const eyeL = glossyEye(-0.24, 1.06, 0.78)
  const eyeR = glossyEye(0.24, 1.06, 0.78)
  const blinkParts = new THREE.Group()
  blinkParts.add(eyeL.group, eyeR.group)
  group.add(blinkParts)
  group.add(brow(0.27, 1.32, 0.76, -0.28), brow(-0.27, 1.32, 0.76, 0.28, 0.92))
  group.add(smile(0.115, 0.026, 0, 0.84, 0.82))
  group.add(blushDisc(-0.47, 0.92, 0.72, 0.55, blushTex), blushDisc(0.47, 0.92, 0.72, -0.55, blushTex))

  // magnifier accessory (research) floating beside the face
  const gold = vinyl('#DFAF5C', { metalness: 0.9, roughness: 0.28, clearcoat: 0.7, envMapIntensity: 1.1 })
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.21, 0.032, 14, 36), gold)
  ring.position.set(0.62, 1.18, 0.62)
  ring.rotation.set(0.15, -0.45, 0)
  const lens = new THREE.Mesh(
    new THREE.CircleGeometry(0.195, 28),
    new THREE.MeshPhysicalMaterial({
      color: '#CDBDF2',
      transparent: true,
      opacity: 0.32,
      roughness: 0.08,
      clearcoat: 1,
      envMapIntensity: 1.2,
    }),
  )
  lens.position.set(0.625, 1.18, 0.615)
  lens.rotation.set(0.15, -0.45, 0)
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.04, 0.3, 12), gold)
  handle.position.set(0.78, 0.94, 0.66)
  handle.rotation.set(0, 0, -0.65)
  group.add(ring, lens, handle)

  // soft contact shadow
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -0.06
  group.add(shadow)

  return {
    kind: 'mori',
    group,
    blinkParts,
    dartParts: [eyeL.inner, eyeR.inner],
    wiggle,
    phase: 0.3,
    bobSpeed: 1.05,
    bobAmp: 0.05,
    sway: 0.02,
    blinkRate: 4.1,
    blinkOffset: 0,
  }
}

function buildPip(blushTex: THREE.Texture, shadowTex: THREE.Texture): CharRig {
  const group = new THREE.Group()
  const body = new THREE.Mesh(
    starPillow(5, 1.02, 0.42, 0.62, -Math.PI / 2 + 0.12),
    vinyl('#EFBB3C', { sheenColor: new THREE.Color('#FFEFC2') }),
  )
  body.castShadow = true
  body.receiveShadow = true
  body.position.y = 1.06
  body.rotation.z = -0.1
  group.add(body)

  // laughing face
  const eyes = new THREE.Group()
  eyes.add(happyEye(-0.27, 1.24, 0.86), happyEye(0.27, 1.2, 0.86))
  group.add(eyes)
  group.add(brow(0.3, 1.42, 0.82, -0.4), brow(-0.3, 1.44, 0.82, 0.18))
  const mouth = new THREE.Mesh(new THREE.SphereGeometry(0.15, 24, 18), vinyl('#3A2436', { roughness: 0.35, clearcoat: 0.5 }))
  mouth.scale.set(1, 1.2, 0.55)
  mouth.position.set(0, 0.96, 0.88)
  const tongue = new THREE.Mesh(new THREE.SphereGeometry(0.085, 18, 12), vinyl('#E07470', { roughness: 0.4, clearcoat: 0.4 }))
  tongue.scale.set(1, 0.72, 0.5)
  tongue.position.set(0, 0.885, 0.95)
  group.add(mouth, tongue)
  group.add(blushDisc(-0.46, 1.04, 0.78, 0.55, blushTex), blushDisc(0.46, 1.02, 0.78, -0.55, blushTex))

  // writing sparks
  const sparkMat = vinyl('#E0AC36', { roughness: 0.3, clearcoat: 0.75, envMapIntensity: 0.9 })
  const spots: [number, number, number][] = [
    [-1.12, 1.95, 0.15],
    [-0.9, 2.22, 0.1],
    [-0.62, 1.94, 0.22],
  ]
  spots.forEach((p, i) => {
    const spark = new THREE.Mesh(new THREE.CapsuleGeometry(0.04, 0.17, 8, 12), sparkMat)
    spark.position.set(...p)
    spark.rotation.set(0.2 * i, 0, -0.7 + 0.35 * i)
    group.add(spark)
  })

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -0.1
  group.add(shadow)

  return {
    kind: 'pip',
    group,
    phase: 1.4,
    bobSpeed: 1.55,
    bobAmp: 0.075,
    sway: 0.032,
    blinkRate: 3.2,
    blinkOffset: 1.2,
  }
}

function buildKoda(blushTex: THREE.Texture, shadowTex: THREE.Texture): CharRig {
  const group = new THREE.Group()
  const bodyMat = vinyl('#7E9DC0', { sheenColor: new THREE.Color('#D8E6F8') })
  const body = new THREE.Mesh(pillowBox(1.02, 0.86, 0.78, 4.1), bodyMat)
  body.castShadow = true
  body.receiveShadow = true
  body.position.y = 1.02
  group.add(body)

  // feet
  const footGeo = new THREE.SphereGeometry(0.23, 24, 18)
  const footL = new THREE.Mesh(footGeo, bodyMat)
  footL.scale.set(1, 0.6, 1.15)
  footL.position.set(-0.36, 0.18, 0.3)
  const footR = footL.clone()
  footR.position.x = 0.36
  footL.castShadow = footR.castShadow = true
  group.add(footL, footR)

  // antenna + ball
  const wiggle = new THREE.Group()
  const antennaMat = vinyl('#6A87AC', { roughness: 0.5 })
  wiggle.add(stemBetween(new THREE.Vector3(0.2, 1.62, 0), new THREE.Vector3(0.32, 2.05, 0), 0.03, antennaMat))
  const ball = budBall('#8FE6A4', 0.1)
  ball.position.set(0.33, 2.12, 0)
  wiggle.add(ball)
  group.add(wiggle)

  // sleepy face
  const eyeL = glossyEye(-0.3, 1.1, 0.74, 0.92)
  const eyeR = glossyEye(0.3, 1.1, 0.74, 0.92)
  const lidL = new THREE.Mesh(new THREE.SphereGeometry(0.175, 24, 16), inkMat())
  lidL.scale.set(1.12, 0.58, 0.78)
  lidL.position.set(-0.3, 1.2, 0.74)
  const lidR = lidL.clone()
  lidR.position.x = 0.3
  const blinkParts = new THREE.Group()
  blinkParts.add(eyeL.group, eyeR.group, lidL, lidR)
  group.add(blinkParts)
  group.add(brow(0.32, 1.32, 0.72, -0.22, 0.9), brow(-0.32, 1.32, 0.72, 0.22, 0.9))
  group.add(smile(0.11, 0.025, 0, 0.86, 0.76))
  group.add(blushDisc(-0.52, 0.94, 0.66, 0.55, blushTex), blushDisc(0.52, 0.94, 0.66, -0.55, blushTex))

  // status light
  const glow = new THREE.Mesh(
    new THREE.SphereGeometry(0.105, 22, 16),
    new THREE.MeshPhysicalMaterial({
      color: '#8FE6A4',
      emissive: new THREE.Color('#8FE6A4'),
      emissiveIntensity: 1.1,
      roughness: 0.22,
      clearcoat: 1,
    }),
  )
  glow.scale.z = 0.5
  glow.position.set(0.6, 0.92, 0.66)
  group.add(glow)

  // laptop
  const laptop = new THREE.Group()
  const darkMat = vinyl('#232742', { roughness: 0.35, clearcoat: 0.8, clearcoatRoughness: 0.28, envMapIntensity: 0.9 })
  const base = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.07, 0.72), darkMat)
  const screen = new THREE.Mesh(new THREE.BoxGeometry(1.08, 0.7, 0.055), darkMat)
  screen.position.set(0, 0.36, -0.34)
  screen.rotation.x = -0.22
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.58), new THREE.MeshBasicMaterial({ color: 0x9ec8ff }))
  display.position.set(0, 0.37, -0.305)
  display.rotation.x = -0.22
  base.castShadow = screen.castShadow = true
  laptop.add(base, screen, display)
  laptop.position.set(0, 0.55, 1.02)
  laptop.rotation.x = 0.12
  group.add(laptop)

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 1.15), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -0.08
  group.add(shadow)

  return {
    kind: 'koda',
    group,
    blinkParts,
    dartParts: [eyeL.inner, eyeR.inner],
    wiggle,
    glow,
    phase: 2.6,
    bobSpeed: 0.85,
    bobAmp: 0.038,
    sway: 0.014,
    blinkRate: 5.2,
    blinkOffset: 2.4,
  }
}

function buildMilo(blushTex: THREE.Texture, shadowTex: THREE.Texture): CharRig {
  const group = new THREE.Group()
  const bodyMat = vinyl('#BE9CD8', { sheenColor: new THREE.Color('#EFDEFF') })
  const body = new THREE.Mesh(
    latheBody([
      [0, 0],
      [0.5, 0.04],
      [0.76, 0.22],
      [0.88, 0.5],
      [0.9, 0.82],
      [0.8, 1.12],
      [0.58, 1.38],
      [0.32, 1.54],
      [0, 1.6],
    ]),
    bodyMat,
  )
  body.castShadow = true
  body.receiveShadow = true
  group.add(body)

  // arm nubs
  const armGeo = new THREE.SphereGeometry(0.22, 22, 16)
  const armL = new THREE.Mesh(armGeo, bodyMat)
  armL.scale.set(0.85, 1.15, 0.85)
  armL.position.set(-0.88, 0.9, 0.22)
  const armR = armL.clone()
  armR.position.x = 0.88
  armL.castShadow = armR.castShadow = true
  group.add(armL, armR)

  // twin antennae with pink balls
  const wiggle = new THREE.Group()
  const antennaMat = vinyl('#A483C4', { roughness: 0.5 })
  const tips: THREE.Vector3[] = [new THREE.Vector3(-0.3, 2.08, 0.06), new THREE.Vector3(0.28, 2.12, 0.02)]
  tips.forEach((tip, i) => {
    wiggle.add(stemBetween(new THREE.Vector3(tip.x * 0.55, 1.56, 0), tip, 0.028, antennaMat))
    const ball = budBall(i === 0 ? '#E8A0C8' : '#F0B8D8', 0.095)
    ball.position.copy(tip)
    wiggle.add(ball)
  })
  group.add(wiggle)

  // headphones
  const phoneMat = vinyl('#4A3B66', { roughness: 0.4, clearcoat: 0.65, envMapIntensity: 0.85 })
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.64, 0.085, 16, 40, Math.PI), phoneMat)
  band.position.set(0, 1.34, 0)
  band.rotation.x = -0.1
  const cupGeo = new THREE.CylinderGeometry(0.24, 0.27, 0.2, 28)
  const cupL = new THREE.Mesh(cupGeo, phoneMat)
  cupL.rotation.z = Math.PI / 2
  cupL.position.set(-0.68, 1.32, 0)
  const cupR = cupL.clone()
  cupR.position.x = 0.68
  band.castShadow = cupL.castShadow = cupR.castShadow = true
  group.add(band, cupL, cupR)

  // alert glossy eyes + smile + blush
  const eyeL = glossyEye(-0.26, 1.08, 0.8, 1.02)
  const eyeR = glossyEye(0.26, 1.05, 0.8, 1.02)
  const blinkParts = new THREE.Group()
  blinkParts.add(eyeL.group, eyeR.group)
  group.add(blinkParts)
  group.add(brow(0.29, 1.34, 0.78, -0.3), brow(-0.29, 1.36, 0.78, 0.22))
  group.add(smile(0.11, 0.025, 0, 0.86, 0.82))
  group.add(blushDisc(-0.5, 0.96, 0.72, 0.55, blushTex), blushDisc(0.5, 0.94, 0.72, -0.55, blushTex))

  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.1), new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -0.06
  group.add(shadow)

  return {
    kind: 'milo',
    group,
    blinkParts,
    dartParts: [eyeL.inner, eyeR.inner],
    wiggle,
    phase: 3.8,
    bobSpeed: 1.3,
    bobAmp: 0.06,
    sway: 0.026,
    blinkRate: 3.9,
    blinkOffset: 3.1,
  }
}

/* ---------- scene assembly ---------- */

function sparkleShape() {
  const s = new THREE.Shape()
  s.moveTo(0, 1)
  s.quadraticCurveTo(0.14, 0.14, 1, 0)
  s.quadraticCurveTo(0.14, -0.14, 0, -1)
  s.quadraticCurveTo(-0.14, -0.14, -1, 0)
  s.quadraticCurveTo(-0.14, 0.14, 0, 1)
  return s
}

export function buildCast() {
  const blushTex = blushTexture()
  const shadowTex = shadowTexture()
  const root = new THREE.Group()
  const rigs: CharRig[] = [
    buildMori(blushTex, shadowTex),
    buildPip(blushTex, shadowTex),
    buildKoda(blushTex, shadowTex),
    buildMilo(blushTex, shadowTex),
  ]
  const layout: Record<Kind, { pos: [number, number, number]; rotY: number }> = {
    mori: { pos: [-3.2, 0.34, 0], rotY: 0.22 },
    pip: { pos: [-1.12, 0.3, 0.32], rotY: 0.1 },
    koda: { pos: [1.12, 0.3, 0.28], rotY: -0.1 },
    milo: { pos: [3.2, 0.34, 0], rotY: -0.22 },
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
    bevelSegments: 3,
    curveSegments: 12,
  })
  const spots: [number, number, number][] = [
    [-2.2, 2.5, 0.4],
    [0.15, 2.66, 0.2],
    [2.35, 2.46, 0.35],
    [-0.28, 1.3, 1.05],
  ]
  spots.forEach((p, i) => {
    const s = new THREE.Mesh(sparkleGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85 }))
    s.position.set(...p)
    s.scale.setScalar(0.12 + 0.03 * (i % 2))
    root.add(s)
    sparkles.push(s)
  })

  return { root, rigs, sparkles }
}

export function fitCamera(camera: THREE.PerspectiveCamera, aspect: number) {
  const worldWidth = 9.4
  const vFov = THREE.MathUtils.degToRad(camera.fov)
  const dist = worldWidth / 2 / (Math.tan(vFov / 2) * aspect)
  camera.position.set(0, 2.3, THREE.MathUtils.clamp(dist, 4.8, 12))
  camera.lookAt(0, 1.35, 0)
}
