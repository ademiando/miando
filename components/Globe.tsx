"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls, Points, PointMaterial, Stars } from "@react-three/drei";
import { EffectComposer, Bloom, DepthOfField, Vignette } from "@react-three/postprocessing";

function DNAHelix() {
  const group = useRef<THREE.Group>(null);
  const particles = useMemo(() => {
    const arr: [number, number, number][] = [];
    const turns = 200;
    for (let i = 0; i < turns; i++) {
      const angle = i * 0.2;
      const x = Math.cos(angle) * 1.2;
      const y = i * 0.05 - 5;
      const z = Math.sin(angle) * 1.2;
      arr.push([x, y, z]);
      arr.push([-x, y, -z]);
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.2;
  });
  return (
    <group ref={group}>
      {particles.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial emissive="#00eaff" emissiveIntensity={2} color="#00ffff" />
        </mesh>
      ))}
    </group>
  );
}

function Nebula() {
  const ref = useRef<THREE.Points>(null);
  const count = 4000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.01;
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
      <PointMaterial transparent color="#00eaff" size={0.05} sizeAttenuation depthWrite={false} />
    </Points>
  );
}

export default function Globe() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 12], fov: 50 }}>
        <color attach="background" args={["#01010f"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <DNAHelix />
        <Nebula />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <EffectComposer>
          <Bloom intensity={2} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
          <DepthOfField focusDistance={0.01} focalLength={0.02} bokehScale={2} />
          <Vignette eskil={false} offset={0.3} darkness={1.1} />
        </EffectComposer>
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}