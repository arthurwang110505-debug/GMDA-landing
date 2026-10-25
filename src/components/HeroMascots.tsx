import { Component, useEffect, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdaptiveDpr, ContactShadows, Preload } from '@react-three/drei'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { Koda, Milo, Mori, Pip, usePrefersReducedMotion } from './mascots'

/** camera + WebGL resilience wrap */

class MascotBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const size = useThree((s) => s.size)
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height)
    camera.fov = 32
    camera.aspect = aspect
    const vFov = (camera.fov * Math.PI) / 180
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect)
    const dist = THREE.MathUtils.clamp(9.4 / 2 / Math.tan(hFov / 2), 4.8, 12)
    camera.position.set(0, 2.3, dist)
    camera.lookAt(0, 1.35, 0)
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

/** soft studio IBL — room reflections give the vinyl its sheen */
function StudioEnvironment() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    scene.environmentIntensity = 0.5
    return () => {
      scene.environment = null
      env.dispose()
      pmrem.dispose()
    }
  }, [gl, scene])
  return null
}

/** the whole team leans a hair toward the cursor — alive, never distracting */
function CastTilt({ reduced, children }: { reduced: boolean; children: ReactNode }) {
  const group = useRef<THREE.Group>(null)
  useFrame((state) => {
    if (!group.current || reduced) return
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, state.pointer.x * 0.045, 0.04)
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -state.pointer.y * 0.028, 0.04)
  })
  return <group ref={group}>{children}</group>
}

function StudioLights() {
  return (
    <>
      <hemisphereLight args={[0xfff2e0, 0x22303a, 0.28]} />
      <directionalLight
        position={[-4.5, 6, 5.5]}
        intensity={1.35}
        color="#ffe6c4"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={5}
        shadow-camera-bottom={-2}
        shadow-camera-near={1}
        shadow-camera-far={20}
      />
      <directionalLight position={[5, 2.5, 4]} intensity={0.42} color="#b8c8ff" />
      <directionalLight position={[0, 5, -6]} intensity={0.75} color="#ffffff" />
      <ambientLight intensity={0.12} />
    </>
  )
}

function Cast({ reduced }: { reduced: boolean }) {
  return (
    <CastTilt reduced={reduced}>
      <Mori position={[-3.2, 0.34, 0.22]} rotation={[0, 0.22, 0]} scale={1.04} reduced={reduced} />
      <Pip position={[-1.12, 0.3, 0.1]} rotation={[0, 0.1, 0]} scale={0.95} reduced={reduced} />
      <Koda position={[1.12, 0.3, -0.1]} rotation={[0, -0.1, 0]} scale={0.92} reduced={reduced} />
      <Milo position={[3.2, 0.34, -0.22]} rotation={[0, -0.22, 0]} scale={1} reduced={reduced} />
    </CastTilt>
  )
}

export function HeroMascots() {
  const reduced = usePrefersReducedMotion()
  return (
    <span className="hero-mascot-cluster" aria-hidden="true">
      <span className="hero-mascot-surge" />
      <MascotBoundary>
        <Canvas
          className="hero-mascot-canvas"
          dpr={[1, 2]}
          shadows="soft"
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          camera={{ fov: 32, position: [0, 2.3, 8] }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0)
            gl.toneMapping = THREE.ACESFilmicToneMapping
            gl.toneMappingExposure = 1.05
          }}
        >
          <CameraRig />
          <StudioEnvironment />
          <StudioLights />
          <Cast reduced={reduced} />
          <ContactShadows position={[0, 0.16, 0]} opacity={0.5} scale={13} blur={2.7} far={3.4} color="#0a1c22" />
          <AdaptiveDpr />
          <Preload all />
        </Canvas>
      </MascotBoundary>
    </span>
  )
}
