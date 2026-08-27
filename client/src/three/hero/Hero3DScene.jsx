import React, { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import HeroVideoPlane from './HeroVideoPlane';
import HeroAtmosphere from './HeroAtmosphere';

export default function Hero3DScene({ isVisible = true }) {
  const pointerRef = useRef({ rotX: 0, rotY: 0, posX: 0, posY: 0 });
  const idleTimerRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Check prefers-reduced-motion & touch device on mount
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    const touchQuery = window.matchMedia('(pointer: coarse)');
    setIsTouchDevice(touchQuery.matches);

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  // Desktop Pointer Parallax Tracking & Mouse Idle Reset Logic
  useEffect(() => {
    if (reducedMotion || isTouchDevice) return;

    const resetPointer = () => {
      pointerRef.current = { rotX: 0, rotY: 0, posX: 0, posY: 0 };
    };

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window;
      // Normalize pointer coordinates to -1 -> +1
      const x = (e.clientX / innerWidth) * 2 - 1;
      const y = -(e.clientY / innerHeight) * 2 + 1;

      // Restrained movement limits: subtle tilt & position shift
      pointerRef.current = {
        rotX: y * 0.08, // Subtle X rotation (~4.5 deg max)
        rotY: x * 0.1,  // Subtle Y rotation (~5.7 deg max)
        posX: x * 0.2,  // Slight X translation
        posY: y * 0.15, // Slight Y translation
      };

      // Clear existing idle timer and schedule reset after 1.5s inactivity
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(resetPointer, 1500);
    };

    const handleMouseLeave = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      resetPointer();
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, [reducedMotion, isTouchDevice]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <HeroVideoPlane
          pointerRef={pointerRef}
          reducedMotion={reducedMotion || isTouchDevice}
          isVisible={isVisible}
        />
        <HeroAtmosphere
          pointerRef={pointerRef}
          reducedMotion={reducedMotion || isTouchDevice}
          isVisible={isVisible}
        />
      </Canvas>
    </div>
  );
}
