import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HeroAtmosphere({ pointerRef, reducedMotion }) {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (!groupRef.current || reducedMotion) return;

    // Slight parallax offset for depth layer
    const targetX = (pointerRef?.current?.posX || 0) * 1.5;
    const targetY = (pointerRef?.current?.posY || 0) * 1.5;

    const factor = Math.min(delta * 3, 0.08);
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, factor);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, factor);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0.5]}>
      {/* Subtle ambient lighting accent */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.4} color="#38bdf8" />
    </group>
  );
}
