import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import ProcessExplodedScene, { architectureLayers } from './ProcessExplodedScene';

export default function Process3DContainer({ scrollProgress }) {
  const containerRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isInView, setIsInView] = useState(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Initialize Canvas once
          setIsInitialized(true);
          setIsInView(true);
        } else {
          // Keep Canvas mounted permanently; only reduce frame loop when far offscreen
          setIsInView(false);
        }
      },
      { threshold: 0, rootMargin: '300px 0px 300px 0px' }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-[480px] sm:h-[560px] relative select-none overflow-hidden rounded-3xl bg-gradient-to-b from-slate-50/50 via-white/80 to-blue-50/50 border border-slate-200/80 shadow-xl">
      {/* Crisp Semantic HTML Architecture Overlay Legend (Top-Left Badge List) */}
      <div className="absolute top-4 left-4 z-20 hidden md:flex flex-col space-y-1.5 max-w-[210px] pointer-events-none">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm w-fit">
          Architecture Layers
        </span>
        {architectureLayers.map((layer) => (
          <div
            key={layer.id}
            className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-md border border-slate-200/90 px-3 py-1.5 rounded-xl shadow-sm text-xs font-bold text-slate-900"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: layer.color }}
            />
            <span className="truncate">{layer.label}</span>
          </div>
        ))}
      </div>

      {/* R3F WebGL 3D Canvas */}
      {isInitialized ? (
        <Canvas
          camera={{ position: [0, 0, 8.5], fov: 45 }}
          dpr={[1, 1.5]}
          frameloop={isInView ? 'always' : 'demand'}
          className="w-full h-full relative z-10"
          style={{ background: 'transparent' }}
        >
          <ProcessExplodedScene scrollProgress={scrollProgress} />
        </Canvas>
      ) : (
        /* Pre-scroll Placeholder Skeleton */
        <div className="w-full h-full flex items-center justify-center bg-white/40 backdrop-blur-md rounded-3xl border border-slate-200/80">
          <p className="text-xs font-semibold text-slate-400">Loading 3D Architecture Visual...</p>
        </div>
      )}
    </div>
  );
}
