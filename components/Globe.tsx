"use client";

import React, { Suspense, useRef, useMemo } from "react"; import { Canvas, useFrame, useThree } from "@react-three/fiber"; import * as THREE from "three"; import { OrbitControls, Stars, Html, useTexture, } from "@react-three/drei"; import { EffectComposer, Bloom, DepthOfField, ChromaticAberration, Vignette, } from "@react-three/postprocessing"; import { BlendFunction } from "postprocessing";

// ----------------------------------------------------------------------------- // GlobeCinematic.tsx — Ultra cinematic, high-fidelity 3D header component // Goals: realistic, smooth, cinematic, production-ready (no external assets) // Dependencies: three, @react-three/fiber, @react-three/drei, @react-three/postprocessing, postprocessing // -----------------------------------------------------------------------------

// --- Camera subtle cinematic motion --- function CameraSway({ speed = 0.035, amp = 0.55 }: { speed?: number; amp?: number }) { const { camera } = useThree(); const t = useRef(0); useFrame((_, delta) => { t.current += delta * speed; const x = Math.sin(t.current * 0.6) * amp * 0.18; const y = Math.sin(t.current * 0.37) * amp * 0.08 + 0.06; const z = 10 + Math.sin(t.current * 0.13) * 0.18; camera.position.set(x, y, z); camera.lookAt(0, 0, 0); }); return null; }

// --- High-detail core using layered shader-ish material (approximation with standard material + normal noise) --- function HighCore({ radius = 1 }: { radius?: number }) { const ref = useRef<THREE.Mesh>(null!);

// subtle displacement normals using a pseudo-noise in vertex colors is complex without a texture; we animate rotation and emissive map feel useFrame((_, delta) => { ref.current.rotation.y += delta * 0.12; ref.current.rotation.x += delta * 0.02; });

return ( <mesh ref={ref} castShadow receiveShadow> <icosahedronGeometry args={[radius, 6]} /> <meshStandardMaterial
color="#7ef0ff"
emissive="#2bd8ff"
emissiveIntensity={1.6}
metalness={0.45}
roughness={0.14}
envMapIntensity={0.6}
toneMapped={false}
/>

{/* inner glassy shell to create subsurface glow */}
</mesh>

); }

// --- Glassy inner shell for subsurface scatter look --- function GlassShell({ radius = 1.12 }: { radius?: number }) { const ref = useRef<THREE.Mesh>(null!); useFrame((_, delta) => (ref.current.rotation.y += delta * 0.04)); return ( <mesh ref={ref}> <sphereGeometry args={[radius, 64, 64]} /> <meshPhysicalMaterial
transmission={0.9}
thickness={0.6}
roughness={0.05}
metalness={0}
clearcoat={0.4}
clearcoatRoughness={0.1}
reflectivity={0.3}
envMapIntensity={0.7}
color="#b7f7ff"
toneMapped={false}
/> </mesh> ); }

// --- Animated volumetric points cloud (GPU-friendly) --- function VolumetricCloud({ count = 9000, inner = 3, outer = 24 }: { count?: number; inner?: number; outer?: number }) { const ref = useRef<THREE.Points>(null!); const positions = useMemo(() => { const arr = new Float32Array(count * 3); for (let i = 0; i < count; i++) { // bias toward the inner radius for depth const r = THREE.MathUtils.lerp(inner, outer, Math.pow(Math.random(), 0.7)); const theta = Math.random() * Math.PI * 2; const phi = Math.acos(2 * Math.random() - 1); const x = r * Math.sin(phi) * Math.cos(theta); const y = r * Math.sin(phi) * Math.sin(theta); const z = r * Math.cos(phi); arr[i * 3] = x; arr[i * 3 + 1] = y; arr[i * 3 + 2] = z; } return arr; }, [count, inner, outer]);

// subtle pulsation useFrame((state, delta) => { if (!ref.current) return; ref.current.rotation.y -= delta * 0.012; const t = state.clock.elapsedTime * 0.6; ref.current.material.size = 0.045 + Math.sin(t) * 0.006; });

return ( <points ref={ref} frustumCulled={false}> <bufferGeometry> <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} /> </bufferGeometry> <pointsMaterial transparent opacity={0.45} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation size={0.045} color={new THREE.Color("#7ef0ff")} /> </points> ); }

// --- Energy rings and filament details --- function Filaments() { const group = useRef<THREE.Group>(null!); useFrame((_, delta) => (group.current.rotation.y += delta * 0.18)); const rings = [2.35, 3.05, 3.85]; return ( <group ref={group}> {rings.map((r, i) => ( <mesh key={i} rotation={[Math.PI / 2, i * 0.18, 0]}> <torusGeometry args={[r, 0.02 + i * 0.004, 12, 240]} /> <meshBasicMaterial color={i === 1 ? "#ffd1ff" : "#aef0ff"} transparent opacity={0.28 + i * 0.06} blending={THREE.AdditiveBlending} depthWrite={false} /> </mesh> ))}

{/* thin glowing filaments across orbits */}
  <mesh rotation={[0.35, 0.1, 0]}>
    <torusGeometry args={[4.6, 0.005, 6, 480]} />
    <meshBasicMaterial color="#cbefff" transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
  </mesh>
</group>

); }

// --- Loader UI --- function Loader() { return ( <Html center> <div style={{ padding: 10, background: "rgba(0,0,0,0.6)", color: "#fff", borderRadius: 8, fontSize: 13 }}>Loading 3D…</div> </Html> ); }

export default function GlobeCinematic({ className = "absolute inset-0 -z-10" }: { className?: string }) { return ( <div className={className}> <Canvas camera={{ position: [0, 0, 10], fov: 50 }} gl={{ antialias: true, powerPreference: "high-performance" }} dpr={typeof window !== "undefined" ? Math.min(2, window.devicePixelRatio || 1) : 1} > <color attach="background" args={["#05030a"]} />

{/* Ambient cinematic lights */}
    <ambientLight intensity={0.28} />
    <directionalLight position={[6, 6, 6]} intensity={1.1} color={new THREE.Color("#e7f8ff")} />
    <pointLight position={[-6, -4, -6]} intensity={0.6} color={new THREE.Color("#ffd6ff")} />

    <CameraSway speed={0.06} amp={0.7} />

    <Suspense fallback={<Loader />}>
      <VolumetricCloud count={9000} inner={3} outer={26} />

      <HighCore radius={1} />
      <GlassShell radius={1.14} />
      <Filaments />

      <Stars radius={140} depth={120} count={7000} factor={6} saturation={0.4} fade />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.14}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.85}
        makeDefault
      />

      <EffectComposer multisampling={4} disableNormalPass>
        <Bloom luminanceThreshold={0.12} luminanceSmoothing={0.95} height={300} opacity={1.6} />
        <DepthOfField focusDistance={0.02} focalLength={0.035} bokehScale={3} height={480} />
        <ChromaticAberration blendFunction={BlendFunction.NORMAL} offset={[0.0011, 0.0008]} />
        <Vignette eskil={false} offset={0.12} darkness={0.45} />
      </EffectComposer>
    </Suspense>
  </Canvas>
</div>

); }

