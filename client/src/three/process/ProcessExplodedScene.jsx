import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export const architectureLayers = [
  { id: 'ui', label: 'UI / UX Interface', color: '#0284c7', accent: '#e0f2fe' },
  { id: 'frontend', label: 'React Frontend', color: '#06b6d4', accent: '#cffafe' },
  { id: 'api', label: 'REST API Gateway', color: '#0d9488', accent: '#ccfbf1' },
  { id: 'backend', label: 'Node.js Backend', color: '#2563eb', accent: '#dbeafe' },
  { id: 'auth', label: 'Security & Auth', color: '#7c3aed', accent: '#f3e8ff' },
  { id: 'db', label: 'MySQL & Prisma', color: '#059669', accent: '#d1fae5' },
  { id: 'cloud', label: 'Cloud Infrastructure', color: '#0284c7', accent: '#e0f2fe' },
];

function GlassLayer({ index, total, label, color, scrollProgress }) {
  const groupRef = useRef(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const progress = scrollProgress.current || 0;

    // 5-Stage Scroll Timeline:
    // 0.0 - 0.15: ASSEMBLED (0.0 explosion)
    // 0.15 - 0.45: EXPLODE (0.0 -> 1.0 explosion)
    // 0.45 - 0.65: EXPLANATION HOLD (1.0 explosion STABLE)
    // 0.65 - 0.80: DATA FLOW (1.0 explosion STABLE with data pulse)
    // 0.80 - 1.00: REASSEMBLE (1.0 -> 0.0 explosion)
    let explosionFactor = 0;
    if (progress >= 0.15 && progress < 0.45) {
      explosionFactor = (progress - 0.15) / 0.3; // Explode smoothly
    } else if (progress >= 0.45 && progress <= 0.8) {
      explosionFactor = 1.0; // HOLD STABLE so labels are easy to read!
    } else if (progress > 0.8 && progress <= 1.0) {
      explosionFactor = 1.0 - (progress - 0.8) / 0.2; // Reassemble
    }

    const centerOffset = (total - 1) / 2 - index; // Top to bottom order
    const baseGap = 0.45;
    const explodedGap = 1.15;

    const targetY = centerOffset * (baseGap + explosionFactor * explodedGap);
    const targetRotY = explosionFactor * 0.06 * (index % 2 === 0 ? 1 : -1);

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotY, 0.1);
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Main Translucent Glass Box */}
      <RoundedBox args={[4.4, 0.28, 2.5]} radius={0.06} smoothness={4}>
        <meshStandardMaterial
          color={color}
          transparent={true}
          opacity={0.82}
          roughness={0.15}
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </RoundedBox>

      {/* Subtle Border Outline */}
      <lineSegments>
        <edgesGeometry attach="geometry" args={[new THREE.BoxGeometry(4.42, 0.3, 2.52)]} />
        <lineBasicMaterial attach="material" color="#ffffff" linewidth={1.5} transparent opacity={0.7} />
      </lineSegments>

      {/* Camera-Facing Upright Text Badge (Billboard Style) */}
      <Text
        position={[0, 0.28, 0.2]}
        rotation={[0, 0, 0]}
        fontSize={0.22}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.015}
        outlineColor="#0f172a"
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.ttf"
      >
        {label}
      </Text>
    </group>
  );
}

export default function ProcessExplodedScene({ scrollProgress }) {
  const mainGroupRef = useRef(null);

  useFrame((state) => {
    if (!mainGroupRef.current) return;
    // Gentle continuous hover rotation
    mainGroupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.05;
    mainGroupRef.current.rotation.x = 0.2 + Math.cos(state.clock.getElapsedTime() * 0.25) * 0.02;
  });

  return (
    <group ref={mainGroupRef} position={[0, 0, 0]}>
      <ambientLight intensity={1.4} />
      <directionalLight position={[5, 10, 5]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-5, -5, -5]} intensity={0.6} color="#06b6d4" />

      {architectureLayers.map((layer, idx) => (
        <GlassLayer
          key={layer.id}
          index={idx}
          total={architectureLayers.length}
          label={layer.label}
          color={layer.color}
          scrollProgress={scrollProgress}
        />
      ))}
    </group>
  );
}
