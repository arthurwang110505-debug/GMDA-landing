import * as THREE from 'three'

/**
 * Sculpted procedural geometry for the four GMDA characters.
 * Each character has its own deformation language — no shared base mesh.
 * Pure three.js (no DOM) so builders can be smoke-tested headlessly.
 */

/* ---------------- shared sculpting utilities ---------------- */

/** gentle handmade imperfection — a few smooth sines, tiny amplitude */
function surfaceNoise(x: number, y: number, z: number) {
  return (
    Math.sin(x * 7.3 + 1.7) * Math.sin(y * 6.1 + 2.4) * Math.sin(z * 8.2 + 0.6) * 0.6 +
    Math.sin(x * 13.7 + 4.1) * Math.sin(y * 11.9 + 0.9) * Math.sin(z * 12.4 + 3.3) * 0.4
  )
}

function displaced(
  geo: THREE.BufferGeometry,
  fn: (x: number, y: number, z: number) => [number, number, number],
): THREE.BufferGeometry {
  const pos = geo.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const [x, y, z] = fn(pos.getX(i), pos.getY(i), pos.getZ(i))
    pos.setXYZ(i, x, y, z)
  }
  pos.needsUpdate = true
  geo.computeVertexNormals()
  return geo
}

/** superellipse power blend — soft geometric rounding */
function softPow(v: number, n: number) {
  return Math.sign(v) * Math.pow(Math.abs(v), n)
}

/* ---------------- eyes (shared visual language, real depth) ---------------- */

export function makeEyes(opts: {
  spacing: number
  radius: number
  y: number
  z: number
  tint: THREE.Material
  dark: THREE.Material
  irisMat: THREE.Material
  lidTint: THREE.Material
  glint: THREE.Material
}) {
  const group = new THREE.Group()
  const blinkLids: THREE.Object3D[] = []
  const dartIrises: THREE.Object3D[] = []

  for (const side of [-1, 1]) {
    const eye = new THREE.Group()
    eye.position.set(side * opts.spacing, opts.y, opts.z)

    // socket rim — soft body-toned seat so the eye feels embedded
    const socket = new THREE.Mesh(new THREE.TorusGeometry(opts.radius * 1.16, opts.radius * 0.22, 12, 32), opts.lidTint)
    socket.position.z = -opts.radius * 0.28

    // eyeball — deep, slightly egg-shaped dome
    const ball = new THREE.Mesh(new THREE.SphereGeometry(opts.radius, 40, 32), opts.tint)
    ball.scale.set(1, 1.12, 0.92)

    // iris + pupil layers give the eyeball real depth
    const irisPivot = new THREE.Group()
    irisPivot.position.z = opts.radius * 0.52
    const iris = new THREE.Mesh(new THREE.SphereGeometry(opts.radius * 0.74, 32, 24), opts.irisMat)
    iris.scale.set(1, 1.06, 0.42)
    const pupil = new THREE.Mesh(new THREE.SphereGeometry(opts.radius * 0.36, 24, 18), opts.dark)
    pupil.position.z = opts.radius * 0.16
    pupil.scale.z = 0.5
    irisPivot.add(iris, pupil)

    // two catchlights — one soft large, one sharp tiny (key-light language)
    const glintA = new THREE.Mesh(new THREE.SphereGeometry(opts.radius * 0.27, 16, 12), opts.glint)
    glintA.position.set(-opts.radius * 0.34, opts.radius * 0.38, opts.radius * 0.72)
    const glintB = new THREE.Mesh(new THREE.SphereGeometry(opts.radius * 0.13, 12, 10), opts.glint)
    glintB.position.set(opts.radius * 0.38, -opts.radius * 0.3, opts.radius * 0.78)

    // eyelid — body-toned cap that slides down to blink
    const lid = new THREE.Mesh(new THREE.SphereGeometry(opts.radius * 1.06, 28, 20, 0, Math.PI * 2, 0, Math.PI * 0.52), opts.lidTint)
    lid.position.y = opts.radius * 0.42
    lid.rotation.x = -0.22

    // brow ridge — quiet shaping above the socket
    const brow = new THREE.Mesh(new THREE.SphereGeometry(opts.radius * 1.05, 20, 14), opts.lidTint)
    brow.scale.set(1.35, 0.42, 0.62)
    brow.position.set(0, opts.radius * 1.28, -opts.radius * 0.32)

    eye.add(socket, ball, irisPivot, glintA, glintB, lid, brow)
    blinkLids.push(lid)
    dartIrises.push(irisPivot)
    group.add(eye)
  }

  return { group, blinkLids, dartIrises }
}

/* ---------------- shared small parts ---------------- */

export function makeBlush(material: THREE.Material, radius: number) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 18), material)
  mesh.scale.set(1, 0.58, 0.32)
  return mesh
}

export function makeSmile(material: THREE.Material, radius: number, arc = Math.PI * 0.82) {
  const geo = new THREE.TorusGeometry(radius, radius * 0.2, 10, 24, arc)
  const mesh = new THREE.Mesh(geo, material)
  mesh.rotation.z = Math.PI + (Math.PI - arc) * 0.5
  return mesh
}

export function makeFeet(material: THREE.Material, count: number, radius: number) {
  const group = new THREE.Group()
  for (let i = 0; i < count; i++) {
    const foot = new THREE.Mesh(new THREE.SphereGeometry(radius, 20, 14), material)
    foot.scale.set(1.15, 0.62, 1.45)
    foot.position.x = count === 1 ? 0 : (i === 0 ? -1 : 1) * radius * 1.35
    group.add(foot)
  }
  return group
}

/* ---------------- MORI — warm ivory, pear-organic, botanical sprout ---------------- */

export function moriBody(material: THREE.Material) {
  const geo = new THREE.SphereGeometry(0.82, 72, 54)
  displaced(geo, (x, y, z) => {
    // pear: wider low belly, gentle taper to crown
    const t = y / 0.82
    const widen = 1 + 0.16 * Math.max(0, -t) - 0.1 * Math.pow(Math.max(0, t), 1.6)
    // intentional asymmetry: left-front shoulder bulge (the magnifier arm side)
    const bulge = 1 + 0.05 * Math.max(0, -x) * Math.max(0, 0.4 - Math.abs(y - 0.1))
    const n = surfaceNoise(x, y, z) * 0.014
    return [x * widen * bulge + n, y * 1.06 + n * 0.6, z * widen * 0.92 + n]
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.y = 1.0
  return mesh
}

export function moriSprout(stalkMat: THREE.Material, ballMat: THREE.Material, swirlMat: THREE.Material) {
  const group = new THREE.Group()
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0.03, 0.16, 0.02),
    new THREE.Vector3(0.11, 0.3, 0.03),
    new THREE.Vector3(0.16, 0.42, 0.0),
  ])
  const stalk = new THREE.Mesh(new THREE.TubeGeometry(curve, 16, 0.024, 10), stalkMat)
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 18), ballMat)
  ball.position.set(0.16, 0.5, 0)
  // spiral swirl wrapped on the ball — the signature sprout mark
  const helixPts: THREE.Vector3[] = []
  for (let i = 0; i <= 40; i++) {
    const u = i / 40
    const ang = u * Math.PI * 4.2
    const r = 0.128 * Math.cos((u - 0.5) * Math.PI * 0.92)
    helixPts.push(new THREE.Vector3(0.16 + Math.cos(ang) * r, 0.5 + Math.sin(ang) * r, 0.02 + (u - 0.5) * 0.1))
  }
  const swirl = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPts), 48, 0.02, 8), swirlMat)
  group.add(stalk, ball, swirl)
  return group
}

export function moriMagnifier(rimMat: THREE.Material, handleMat: THREE.Material, glassMat: THREE.Material) {
  const group = new THREE.Group()
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.055, 16, 48), rimMat)
  const glass = new THREE.Mesh(new THREE.CylinderGeometry(0.315, 0.315, 0.035, 40), glassMat)
  glass.rotation.x = Math.PI / 2
  const handle = new THREE.Mesh(new THREE.CapsuleGeometry(0.055, 0.34, 8, 16), handleMat)
  handle.position.set(-0.3, -0.34, -0.01)
  handle.rotation.z = Math.PI * 0.28
  group.add(rim, glass, handle)
  return group
}

/* ---------------- PIP — honey star, folded soft pillow ---------------- */

export function pipBody(material: THREE.Material) {
  const geo = new THREE.SphereGeometry(0.8, 96, 72)
  displaced(geo, (x, y, z) => {
    // three playful points (top strongest, two side arms), soft rounded belly
    const theta = Math.atan2(y, x)
    const top = Math.pow(Math.max(0, Math.cos(theta - Math.PI / 2)), 1.7)
    const left = Math.pow(Math.max(0, Math.cos(theta - Math.PI)), 2.6)
    const right = Math.pow(Math.max(0, Math.cos(theta)), 2.6)
    const star = 1 + 0.38 * top + 0.3 * left + 0.3 * right
    // pillow thickness in z with pinched seams near the points
    const pinch = 1 - 0.16 * top * top
    const n = surfaceNoise(x, y, z) * 0.012
    return [x * star + n * 0.7, y * star + n, z * 0.58 * pinch + n]
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.y = 0.98
  return mesh
}

export function pipFoldMarks(material: THREE.Material) {
  const group = new THREE.Group()
  for (let i = 0; i < 2; i++) {
    const arc = new THREE.Mesh(new THREE.TorusGeometry(0.13 + i * 0.05, 0.018, 8, 20, Math.PI * 0.55), material)
    arc.position.set(0.16 - i * 0.06, 1.62 - i * 0.1, 0.5 - i * 0.04)
    arc.rotation.z = -0.5 - i * 0.25
    group.add(arc)
  }
  return group
}

/* ---------------- KODA — sky-blue soft geometry, quiet engineer ---------------- */

export function kodaBody(material: THREE.Material) {
  const geo = new THREE.SphereGeometry(0.85, 72, 54)
  displaced(geo, (x, y, z) => {
    // superellipsoid squircle — structured but organic
    const nx = softPow(x / 0.85, 0.72) * 0.85
    const ny = softPow(y / 0.85, 0.74) * 0.85
    const nz = softPow(z / 0.85, 0.7) * 0.85
    const n = surfaceNoise(x, y, z) * 0.012
    return [nx * 1.06 + n, ny * 0.96 + n * 0.5, nz * 0.88 + n]
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.y = 1.02
  return mesh
}

export function kodaAntennae(stalkMat: THREE.Material, tipA: THREE.Material, tipB: THREE.Material, statusMat: THREE.Material) {
  const group = new THREE.Group()
  const defs = [
    { x: -0.22, lean: -0.5, tip: tipA, status: true },
    { x: 0.2, lean: 0.42, tip: tipB, status: false },
  ]
  const statusParts: THREE.Object3D[] = []
  for (const d of defs) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(d.x, 0, 0),
      new THREE.Vector3(d.x + d.lean * 0.1, 0.18, 0),
      new THREE.Vector3(d.x + d.lean * 0.22, 0.34, 0.01),
    ])
    const stalk = new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.022, 8), stalkMat)
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.075, 20, 14), d.tip)
    tip.position.set(d.x + d.lean * 0.24, 0.4, 0.01)
    group.add(stalk, tip)
    if (d.status) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.032, 12, 10), statusMat)
      dot.position.copy(tip.position).add(new THREE.Vector3(0, 0, 0.07))
      group.add(dot)
      statusParts.push(dot)
    }
  }
  return { group, statusParts }
}

export function kodaLaptop(shellMat: THREE.Material, screenMat: THREE.Material, dotMat: THREE.Material) {
  const group = new THREE.Group()
  const base = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.035, 0.36), shellMat)
  base.position.set(0, 0.02, 0.05)
  const screen = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.34, 0.028), shellMat)
  screen.position.set(0, 0.19, -0.11)
  screen.rotation.x = -0.22
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.28), screenMat)
  panel.position.set(0, 0.19, -0.095)
  panel.rotation.x = -0.22
  const dot = new THREE.Mesh(new THREE.SphereGeometry(0.022, 10, 8), dotMat)
  dot.position.set(0.19, 0.19, -0.088)
  group.add(base, screen, panel, dot)
  return group
}

/* ---------------- MILO — soft lilac, watchful, radar + headphones ---------------- */

export function miloBody(material: THREE.Material) {
  const geo = new THREE.SphereGeometry(0.78, 72, 54)
  displaced(geo, (x, y, z) => {
    // gently elongated egg — narrower crown, calm stance
    const t = y / 0.78
    const taper = 1 - 0.14 * Math.pow(Math.max(0, t), 1.5) + 0.06 * Math.max(0, -t)
    const n = surfaceNoise(x, y, z) * 0.012
    return [x * taper + n, y * 1.14 + n * 0.5, z * taper * 0.94 + n]
  })
  const mesh = new THREE.Mesh(geo, material)
  mesh.position.y = 1.06
  return mesh
}

export function miloHeadphones(bandMat: THREE.Material, cupMat: THREE.Material, padMat: THREE.Material) {
  const group = new THREE.Group()
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.06, 12, 36, Math.PI), bandMat)
  band.position.y = 1.3
  for (const side of [-1, 1]) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.25, 0.14, 28), cupMat)
    cup.rotation.z = Math.PI / 2
    cup.position.set(side * 0.74, 1.28, 0)
    const pad = new THREE.Mesh(new THREE.TorusGeometry(0.17, 0.055, 10, 24), padMat)
    pad.rotation.y = Math.PI / 2
    pad.position.set(side * 0.82, 1.28, 0)
    group.add(cup, pad)
  }
  group.add(band)
  return group
}

export function miloRadar(stalkMat: THREE.Material, dishMat: THREE.Material) {
  const group = new THREE.Group()
  const stalk = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.034, 0.26, 10), stalkMat)
  stalk.position.set(-0.12, 2.02, 0.04)
  stalk.rotation.z = 0.24
  const dish = new THREE.Mesh(new THREE.SphereGeometry(0.17, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), dishMat)
  dish.rotation.x = Math.PI / 2.6
  dish.position.set(-0.18, 2.18, 0.08)
  const pip = new THREE.Mesh(new THREE.SphereGeometry(0.035, 10, 8), dishMat)
  pip.position.set(-0.18, 2.2, 0.16)
  group.add(stalk, dish, pip)
  return group
}
