"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";
import { Float } from "@react-three/drei";

function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.7, 64, 64]} />
      <shaderMaterial
        transparent
        side={THREE.BackSide}
        uniforms={{
          c: { value: 0.6 },
          p: { value: 4.0 },
          glowColor: { value: new THREE.Color(0x00e5ff) },
          viewVector: { value: new THREE.Vector3(0, 0, 1) }
        }}
        vertexShader={`
          varying vec3 vNormal;
          void main(){
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 glowColor;
          uniform float c;
          uniform float p;
          varying vec3 vNormal;
          void main(){
            float a = pow(c - dot(vNormal, vec3(0.0,0.0,1.0)), p);
            gl_FragColor = vec4(glowColor, a*0.35);
          }
        `}
      />
    </mesh>
  );
}

function WireGlobe() {
  const ref = useRef<THREE.LineSegments>(null!);
  const geo = useMemo(() => {
    const g = new THREE.SphereGeometry(1.6, 64, 64);
    const wire = new THREE.WireframeGeometry(g);
    return wire;
  }, []);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.1;
  });
  return (
    <lineSegments ref={ref} geometry={geo}>
      <lineBasicMaterial color={"#00E5FF"} opacity={0.65} transparent />
    </lineSegments>
  );
}

function Starfield() {
  const ref = useRef<THREE.Points>(null!);
  const { positions } = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 50 * Math.pow(Math.random(), 0.5) + 10;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return { positions };
  }, []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.005;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length/3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} sizeAttenuation transparent opacity={0.8} />
    </points>
  );
}

export default function Globe() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <color attach="background" args={["#050505"]} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
          <WireGlobe />
          <Atmosphere />
        </Float>
        <Starfield />
      </Canvas>
    </div>
  );
}
