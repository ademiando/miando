"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import {
  OrbitControls,
  Points,
  PointMaterial,
  Stars,
} from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  GodRays,
  ChromaticAberration,
  Noise,
  Scanline,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { MotionBlur } from "@react-three/postprocessing";

// DNA Helix Ultra
function DNAHelix() {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    const arr: [number, number, number][] = [];
    const turns = 400; // lebih banyak detail
    for (let i = 0; i < turns; i++) {
      const angle = i * 0.18;
      const x = Math.cos(angle) * 1.5;
      const y = i * 0.045 - 9;
      const z = Math.sin(angle) * 1.5;
      arr.push([x, y, z]);
      arr.push([-x, y, -z]);
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.12;
  });
  return (
    <group ref={group}>
      {particles.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.035, 28, 28]} />
          <meshStandardMaterial
            emissive="#00ffff"
            emissiveIntensity={3.5}
            color="#00eaff"
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
      ))}
    </group>
  );
}

// Ultra Nebula
function Nebula() {
  const ref = useRef<THREE.Points>(null);
  const count = 12000; // lebih padat
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.004;
  });
  return (
    <Points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <PointMaterial
        transparent
        color="#ff00ff"
        size={0.05}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

// Smooth Parallax Camera
function ParallaxCamera() {
  const { camera } = useThree();
  const t = useRef(0);
  useFrame(() => {
    t.current += 0.0015;
    camera.position.x = Math.sin(t.current) * 0.8;
    camera.position.y = Math.cos(t.current * 0.5) * 0.4;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function GlobeCinematicUltra() {
  const sunRef = useRef<THREE.Mesh>(null);

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 14], fov: 50 }}>
        <color attach="background" args={["#000010"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[8, 6, 6]} intensity={2.2} />

        {/* Light Source */}
        <mesh ref={sunRef} position={[6, 5, -8]}>
          <sphereGeometry args={[1.5, 32, 32]} />
          <meshBasicMaterial color="#ffbb55" />
        </mesh>

        {/* Scene Objects */}
        <DNAHelix />
        <Nebula />
        <Stars radius={180} depth={90} count={9000} factor={4} fade />

        {/* Post Processing Ultra */}
        <EffectComposer>
          <Bloom intensity={3.5} luminanceThreshold={0.15} luminanceSmoothing={0.95} />
          <DepthOfField focusDistance={0.008} focalLength={0.012} bokehScale={4} />
          <Vignette eskil={false} offset={0.25} darkness={1.5} />
          {sunRef.current && <GodRays sun={sunRef} />}
          <ChromaticAberration
            offset={[0.002, 0.0015]}
            blendFunction={BlendFunction.NORMAL}
          />
          <Noise opacity={0.04} />
          <Scanline density={1.2} opacity={0.2} />
          <MotionBlur />
        </EffectComposer>

        <ParallaxCamera />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}