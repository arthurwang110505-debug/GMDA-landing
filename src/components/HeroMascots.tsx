import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import type { Group, Mesh, Vector3 } from 'three'

type CreatureKind = 'mori' | 'pip' | 'koda' | 'milo'

type MascotConfig = {
  kind: CreatureKind
  name: string
  color: string
  position: [number, number, number]
  scale: [number, number, number]
  rotation: [number, number, number]
}

const mascots: MascotConfig[] = [
  { name: 'Mori', kind: 'mori', color: '#F5F0E6', position: [-2.25, 0.55, 0], scale: [1.03, 0.88, 0.86], rotation: [-0.08, -0.18, -0.12] },
  { name: 'Pip', kind: 'pip', color: '#FFD56B', position: [-0.75, 0.8, 0.1], scale: [0.88, 1.02, 0.86], rotation: [0.02, 0.1, 0.12] },
  { name: 'Koda', kind: 'koda', color: '#8BC5FF', position: [0.75, 0.72, 0.05], scale: [0.94, 0.94, 0.82], rotation: [0, -0.08, -0.08] },
  { name: 'Milo', kind: 'milo', color: '#C6A7FF', position: [2.25, 0.55, -0.02], scale: [0.94, 0.94, 0.9], rotation: [-0.03, 0.14, 0.1] },
]

function seededNoise(x: number, y: number, z: number) {
  return Math.sin(x * 7.31 + y * 13.17 + z * 19.73) * 0.5 + Math.sin(x * 17.13 - y * 5.41 + z * 11.27) * 0.25
}

function makeBlobGeometry(kind: CreatureKind) {
  const geometry = new THREE.SphereGeometry(1, 64, 48)
  const position = geometry.attributes.position
  const v = new THREE.Vector3()

  for (let i = 0; i < position.count; i += 1) {
    v.fromBufferAttribute(position, i)
    const n = seededNoise(v.x, v.y, v.z)
    let deformation = 1 + n * 0.018

    if (kind === 'mori') deformation += Math.max(0, v.y) * 0.025
    if (kind === 'pip') deformation += Math.max(0, -v.y) * 0.035
    if (kind === 'koda') deformation += Math.sin(v.y * 8) * 0.008
    if (kind === 'milo') deformation += Math.cos(v.x * 7) * 0.01

    v.multiplyScalar(deformation)
    position.setXYZ(i, v.x, v.y, v.z)
  }

  position.needsUpdate = true
  geometry.computeVertexNormals()
  return geometry
}

function BodyMaterial({ color }: { color: string }) {
  return (
    <meshPhysicalMaterial
      color={color}
      roughness={0.34}
      metalness={0.02}
      clearcoat={0.42}
      clearcoatRoughness={0.2}
      sheen={0.16}
      sheenRoughness={0.38}
    />
  )
}

function Eye({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} scale={[0.105, 0.15, 0.075]}>
      <sphereGeometry args={[1, 32, 24]} />
      <meshPhysicalMaterial color="#29233E" roughness={0.2} clearcoat={0.75} clearcoatRoughness={0.08} />
    </mesh>
  )
}

function EyeHighlight({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.026, 16, 12]} />
      <meshBasicMaterial color="#FFFFFF" />
    </mesh>
  )
}

function Mouth({ kind }: { kind: CreatureKind }) {
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i <= 10; i += 1) {
      const t = i / 10
      const x = (t - 0.5) * 0.32
      const y = kind === 'koda' ? -0.18 + Math.sin(t * Math.PI) * 0.035 : -0.18 - Math.sin(t * Math.PI) * 0.055
      points.push(new THREE.Vector3(x, y, 0.955))
    }
    return new THREE.CatmullRomCurve3(points)
  }, [kind])

  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 16, 0.018, 8, false), [curve])

  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color="#44324B" />
    </mesh>
  )
}

function Blush({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} scale={[0.17, 0.075, 0.02]}>
      <sphereGeometry args={[1, 24, 16]} />
      <meshBasicMaterial color="#F29DA6" transparent opacity={0.42} />
    </mesh>
  )
}

function Antenna({ kind }: { kind: CreatureKind }) {
  const color = kind === 'mori' ? '#6FA956' : '#8067B2'
  const tip = kind === 'mori' ? '#B8E98E' : '#EEE3FF'
  const curve = useMemo(() => {
    const points = kind === 'mori'
      ? [new THREE.Vector3(0, 0.62, 0), new THREE.Vector3(-0.12, 0.88, 0), new THREE.Vector3(-0.02, 1.08, 0)]
      : [new THREE.Vector3(0, 0.64, 0), new THREE.Vector3(0.02, 0.9, 0), new THREE.Vector3(0.02, 1.06, 0)]
    return new THREE.CatmullRomCurve3(points)
  }, [kind])
  const geometry = useMemo(() => new THREE.TubeGeometry(curve, 24, 0.045, 12, false), [curve])

  return (
    <group>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color={color} roughness={0.42} clearcoat={0.3} />
      </mesh>
      <mesh position={kind === 'mori' ? [-0.02, 1.08, 0] : [0.02, 1.06, 0]}>
        <sphereGeometry args={[0.11, 32, 24]} />
        <meshPhysicalMaterial color={tip} roughness={0.26} clearcoat={0.5} />
      </mesh>
      <mesh position={kind === 'mori' ? [-0.055, 1.12, 0.075] : [-0.015, 1.1, 0.075]}>
        <sphereGeometry args={[0.028, 16, 12]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
    </group>
  )
}

function KodaDetail() {
  return (
    <>
      <mesh position={[0, -0.42, 0.82]} scale={[0.28, 0.055, 0.035]}>
        <sphereGeometry args={[1, 24, 16]} />
        <meshPhysicalMaterial color="#376DA8" roughness={0.4} />
      </mesh>
      <mesh position={[0.55, 0.42, 0.58]}>
        <sphereGeometry args={[0.07, 24, 16]} />
        <meshBasicMaterial color="#D8FF78" />
      </mesh>
    </>
  )
}

function MiloDetail() {
  return (
    <group position={[0, 0.12, 0.83]}>
      <mesh rotation={[0, 0, Math.PI / 4]} scale={[0.13, 0.035, 0.025]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[0, 0, -Math.PI / 4]} scale={[0.13, 0.035, 0.025]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.8} />
      </mesh>
    </group>
  )
}

function Mascot({ config, pointer }: { config: MascotConfig; pointer: React.RefObject<Vector3> }) {
  const group = useRef<Group>(null)
  const mesh = useRef<Mesh>(null)
  const geometry = useMemo(() => makeBlobGeometry(config.kind), [config.kind])

  useFrame((state, delta) => {
    if (!group.current) return
    const targetX = pointer.current.x * 0.16
    const targetY = pointer.current.y * 0.11
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, config.rotation[1] + targetX, 4, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, config.rotation[0] - targetY, 4, delta)
    group.current.rotation.z = THREE.MathUtils.damp(group.current.rotation.z, config.rotation[2] - targetX * 0.35, 4, delta)
    group.current.position.y = THREE.MathUtils.damp(
      group.current.position.y,
      config.position[1] + Math.sin(state.clock.elapsedTime * (config.kind === 'pip' ? 2.4 : 1.55) + config.position[0]) * (config.kind === 'pip' ? 0.07 : 0.035),
      5,
      delta,
    )

    if (mesh.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.2 + config.position[0]) * 0.008
      mesh.current.scale.setScalar(pulse)
    }
  })

  const isSquare = config.kind === 'koda'
  const isRound = config.kind === 'milo'
  const eyeY = isRound || isSquare ? 0.08 : 0.03

  return (
    <group ref={group} position={config.position} rotation={config.rotation} scale={config.scale}>
      <group ref={mesh}>
        <mesh geometry={geometry} scale={isSquare ? [1.03, 0.93, 0.92] : undefined}>
          <BodyMaterial color={config.color} />
        </mesh>
        {config.kind === 'mori' || config.kind === 'milo' ? <Antenna kind={config.kind} /> : null}
        <Eye position={[-0.24, eyeY, 0.91]} />
        <Eye position={[0.24, eyeY, 0.91]} />
        <EyeHighlight position={[-0.265, eyeY + 0.035, 0.974]} />
        <EyeHighlight position={[0.215, eyeY + 0.035, 0.974]} />
        <Mouth kind={config.kind} />
        <Blush position={[-0.49, -0.08, 0.83]} />
        <Blush position={[0.49, -0.08, 0.83]} />
        {config.kind === 'koda' ? <KodaDetail /> : null}
        {config.kind === 'milo' ? <MiloDetail /> : null}
      </group>
    </group>
  )
}

function MascotStage({ pointer }: { pointer: React.RefObject<Vector3> }) {
  return (
    <>
      <ambientLight intensity={1.25} />
      <hemisphereLight args={['#FFFFFF', '#17152C', 1.6]} />
      <directionalLight position={[-4, 5, 5]} intensity={4.8} color="#FFF8ED" castShadow />
      <directionalLight position={[4, 2, 2]} intensity={2.2} color="#C8D9FF" />
      <spotLight position={[0, 5, 4]} intensity={3.5} angle={0.55} penumbra={0.85} color="#FFFFFF" />
      {mascots.map((config) => <Mascot key={config.kind} config={config} pointer={pointer} />)}
      <ContactShadows position={[0, -0.43, 0]} opacity={0.34} scale={7.2} blur={2.8} far={3.2} resolution={512} />
    </>
  )
}

export function HeroMascots() {
  const pointer = useRef(new THREE.Vector3())

  useEffect(() => {
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      pointer.current.x = THREE.MathUtils.clamp((event.clientX / window.innerWidth) * 2 - 1, -1, 1)
      pointer.current.y = THREE.MathUtils.clamp(-((event.clientY / window.innerHeight) * 2 - 1), -1, 1)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [])

  return (
    <span className="hero-mascot-cluster" aria-hidden="true">
      <Canvas
        className="hero-mascot-canvas"
        dpr={[1, 1.75]}
        camera={{ position: [0, 0.7, 7.2], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <MascotStage pointer={pointer} />
      </Canvas>
    </span>
  )
}
