"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls, Points, PointMaterial, Effects } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

// ==================== ATOM CORE ====================
function AtomCore() {
  const mesh = useRef<THREE.Mesh>(null!);
  useFrame((_, delta) => {
    mesh.current.rotation.y += delta * 0.25;
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshStandardMaterial
        color="#00eaff"
        emissive="#00eaff"
        emissiveIntensity={1.5}
        metalness={0.6}
        roughness={0.2}
      />
    </mesh>
  );
}

// ==================== ELECTRONS ====================
function Electrons() {
  const group = useRef<THREE.Group>(null!);
  useFrame((_, delta) => {
    group.current.rotation.y += delta * 0.5;
    group.current.rotation.x += delta * 0.25;
  });

  const orbits = [2, 2.5, 3];
  return (
    <group ref={group}>
      {orbits.map((radius, i) => (
        <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <torusGeometry args={[radius, 0.02, 16, 128]} />
          <meshBasicMaterial color="#00eaff" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}

// ==================== NEBULA PARTICLES ====================
function Nebula() {
  const ref = useRef<THREE.Points>(null!);
  const count = 5000;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = THREE.MathUtils.randFloat(5, 15);
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.02;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#00eaff"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ==================== MAIN SCENE ====================
export default function Globe() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <color attach="background" args={["#020202"]} />
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1.5} color="#00eaff" />
        <pointLight position={[-5, -3, -5]} intensity={0.8} color="#ff00ff" />

        <Nebula />
        <AtomCore />
        <Electrons />

        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />

        <EffectComposer>
          <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}