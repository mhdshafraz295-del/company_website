import React, { useState, useEffect, useRef, Component } from 'react';
import Hero3DScene from './Hero3DScene';
import Hero3DFallback from './Hero3DFallback';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.warn('Three.js Hero Error Boundary caught error:', error?.message || error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function Hero3DContainer() {
  const containerRef = useRef(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  // Detect WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setWebGlSupported(false);
    } catch (e) {
      setWebGlSupported(false);
    }
  }, []);

  // Generous IntersectionObserver with 300px rootMargin so hero visibility never flips false while on screen
  useEffect(() => {
    if (!containerRef.current || !window.IntersectionObserver) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: '300px 0px 300px 0px',
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Tab visibility listener (only pause video when browser tab is genuinely hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  if (!webGlSupported) {
    return <Hero3DFallback />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full">
      <ErrorBoundary fallback={<Hero3DFallback />}>
        <Hero3DScene isVisible={isVisible} />
      </ErrorBoundary>
    </div>
  );
}
