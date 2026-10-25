import * as THREE from 'three'

/**
 * Physically based material set for the GMDA cast.
 * Soft-touch premium vinyl: mid roughness with a whisper of sheen and
 * clearcoat, plus a tiny procedural roughness map so highlights feel handmade.
 */

function roughnessNoise(size = 64) {
  const data = new Uint8Array(size * size)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const n =
        Math.sin(x * 0.31 + 1.2) * Math.sin(y * 0.27 + 2.8) * 0.5 +
        Math.sin(x * 0.11 + 4.1) * Math.sin(y * 0.13 + 0.7) * 0.5
      data[y * size + x] = 148 + n * 26
    }
  }
  const tex = new THREE.DataTexture(data, size, size, THREE.RedFormat)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.repeat.set(3, 3)
  tex.needsUpdate = true
  return tex
}

function vinyl(color: THREE.ColorRepresentation, roughness = 0.52) {
  return new THREE.MeshPhysicalMaterial({
    color,
    roughness,
    roughnessMap: roughnessNoise(),
    metalness: 0,
    sheen: 0.55,
    sheenRoughness: 0.65,
    sheenColor: new THREE.Color('#fff2e2'),
    clearcoat: 0.28,
    clearcoatRoughness: 0.55,
    envMapIntensity: 0.55,
  })
}

export type MascotMaterials = {
  body: THREE.MeshPhysicalMaterial
  lid: THREE.MeshPhysicalMaterial
  blush: THREE.MeshPhysicalMaterial
  eyeBall: THREE.MeshPhysicalMaterial
  iris: THREE.MeshPhysicalMaterial
  pupil: THREE.MeshPhysicalMaterial
  glint: THREE.MeshBasicMaterial
  mouth: THREE.MeshPhysicalMaterial
  accentA: THREE.MeshPhysicalMaterial
  accentB: THREE.MeshPhysicalMaterial
  accentC: THREE.MeshPhysicalMaterial
  accentDark: THREE.MeshPhysicalMaterial
  glass: THREE.MeshPhysicalMaterial
  status: THREE.MeshStandardMaterial
}

export function makeMaterials(bodyColor: string, accentA: string, accentB: string, accentC = '#b08856'): MascotMaterials {
  const body = vinyl(bodyColor, 0.52)
  const lid = vinyl(bodyColor, 0.5)
  return {
    body,
    lid,
    blush: new THREE.MeshPhysicalMaterial({
      color: '#f2a0b4',
      roughness: 0.92,
      metalness: 0,
      transparent: true,
      opacity: 0.82,
    }),
    eyeBall: new THREE.MeshPhysicalMaterial({
      color: '#181b30',
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      metalness: 0,
      envMapIntensity: 0.9,
    }),
    iris: new THREE.MeshPhysicalMaterial({
      color: '#2c3358',
      roughness: 0.22,
      clearcoat: 0.9,
      clearcoatRoughness: 0.18,
      metalness: 0,
      envMapIntensity: 0.8,
    }),
    pupil: new THREE.MeshPhysicalMaterial({
      color: '#0a0c18',
      roughness: 0.24,
      clearcoat: 0.8,
      metalness: 0,
    }),
    glint: new THREE.MeshBasicMaterial({ color: '#ffffff', toneMapped: false }),
    mouth: new THREE.MeshPhysicalMaterial({ color: '#3c2430', roughness: 0.6, metalness: 0 }),
    accentA: vinyl(accentA, 0.5),
    accentB: vinyl(accentB, 0.48),
    accentC: vinyl(accentC, 0.52),
    accentDark: vinyl('#4b3b2e', 0.56),
    glass: new THREE.MeshPhysicalMaterial({
      color: '#dce8f2',
      roughness: 0.08,
      metalness: 0,
      transparent: true,
      opacity: 0.42,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1,
    }),
    status: new THREE.MeshStandardMaterial({
      color: '#8fe6a4',
      emissive: '#8fe6a4',
      emissiveIntensity: 1.2,
      roughness: 0.4,
      metalness: 0,
    }),
  }
}
