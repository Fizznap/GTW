"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Flower() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.2;
      groupRef.current.rotation.y += 0.005;
      groupRef.current.rotation.z += 0.002;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} scale={1.5}>
        {/* Center of flower */}
        <mesh position={[0, 0, 0.1]}>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshStandardMaterial color="#fbbf24" roughness={0.3} />
        </mesh>
        
        {/* Petals */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * Math.PI * 2) / 6;
          return (
            <mesh 
              key={i} 
              rotation={[0, 0, angle]} 
              position={[Math.sin(angle) * 0.45, Math.cos(angle) * 0.45, 0]}
            >
              <sphereGeometry args={[0.35, 32, 32]} />
              <meshPhysicalMaterial 
                color="#f472b6"
                roughness={0.15}
                transmission={0.9}
                thickness={0.5}
                ior={1.4}
                envMapIntensity={1.5}
                clearcoat={1}
              />
            </mesh>
          );
        })}
      </group>
    </Float>
  );
}

export function Floating3D() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <directionalLight position={[-5, -5, -5]} intensity={0.5} color="#ffe4e6" />
        <Flower />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
