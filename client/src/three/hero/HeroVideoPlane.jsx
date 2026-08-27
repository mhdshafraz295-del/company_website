import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function HeroVideoPlane({ pointerRef, reducedMotion, isVisible = true }) {
  const meshRef = useRef();
  const videoRef = useRef(null);
  const [videoTexture, setVideoTexture] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState({ width: 16, height: 9 });
  const { viewport } = useThree();

  // Create Video Element & VideoTexture safely
  useEffect(() => {
    let isMounted = true;
    let textureInstance = null;

    const video = document.createElement('video');
    videoRef.current = video;

    video.src = '/videos/nexgen-promo.mp4';
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = true;
    video.playsInline = true;
    video.preload = 'auto';

    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    const initTexture = () => {
      if (!isMounted) return;

      if (video.videoWidth > 0 && video.videoHeight > 0) {
        setVideoDimensions({ width: video.videoWidth, height: video.videoHeight });
      }

      if (!textureInstance) {
        textureInstance = new THREE.VideoTexture(video);
        textureInstance.minFilter = THREE.LinearFilter;
        textureInstance.magFilter = THREE.LinearFilter;
        textureInstance.generateMipmaps = false;

        // Apply sRGB Color Space according to Three.js version
        if ('colorSpace' in textureInstance) {
          textureInstance.colorSpace = THREE.SRGBColorSpace;
        } else {
          textureInstance.encoding = 3001; // THREE.sRGBEncoding
        }

        setVideoTexture(textureInstance);
      }
    };

    const handleEnded = () => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    };

    video.addEventListener('loadedmetadata', initTexture);
    video.addEventListener('canplay', initTexture);
    video.addEventListener('playing', initTexture);
    video.addEventListener('ended', handleEnded);

    // Call video.play() safely and handle promise rejection
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        if (err?.name === 'AbortError') return;
        console.log('Hero video.play() notice:', err.message);
      });
    }

    // Check if metadata is already available
    if (video.readyState >= 1) {
      initTexture();
    }

    return () => {
      isMounted = false;
      video.removeEventListener('loadedmetadata', initTexture);
      video.removeEventListener('canplay', initTexture);
      video.removeEventListener('playing', initTexture);
      video.removeEventListener('ended', handleEnded);
      video.pause();
      video.removeAttribute('src');
      video.load();
      if (textureInstance) {
        textureInstance.dispose();
      }
      videoRef.current = null;
    };
  }, []);

  // Handle visibility changes without unmounting video or texture
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isVisible) {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            if (err?.name === 'AbortError') return;
          });
        }
      }
    } else {
      video.pause();
    }
  }, [isVisible]);

  // Plane Sizing with 12% Overscan & Aspect Ratio Fitting (Cover Strategy)
  const { planeWidth, planeHeight } = useMemo(() => {
    const videoAspect =
      videoDimensions.width && videoDimensions.height
        ? videoDimensions.width / videoDimensions.height
        : 16 / 9;

    const viewportAspect = viewport.width / viewport.height;

    // Apply 12% overscan margin so pointer tilt never reveals dark edges
    const overscan = 1.12;

    let width, height;
    if (viewportAspect > videoAspect) {
      width = viewport.width * overscan;
      height = (viewport.width / videoAspect) * overscan;
    } else {
      height = viewport.height * overscan;
      width = viewport.height * videoAspect * overscan;
    }

    return { planeWidth: width, planeHeight: height };
  }, [viewport.width, viewport.height, videoDimensions]);

  // Smooth lerp animation loop for pointer tilt & mouse idle return
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const targetRotX = reducedMotion ? 0 : pointerRef?.current?.rotX || 0;
    const targetRotY = reducedMotion ? 0 : pointerRef?.current?.rotY || 0;
    const targetPosX = reducedMotion ? 0 : pointerRef?.current?.posX || 0;
    const targetPosY = reducedMotion ? 0 : pointerRef?.current?.posY || 0;

    const factor = Math.min(delta * 4, 0.1);
    meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, factor);
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, factor);
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, targetPosX, factor);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetPosY, factor);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[planeWidth, planeHeight, 1, 1]} />
      {videoTexture ? (
        <meshBasicMaterial map={videoTexture} toneMapped={false} />
      ) : (
        <meshBasicMaterial color="#070b14" />
      )}
    </mesh>
  );
}
