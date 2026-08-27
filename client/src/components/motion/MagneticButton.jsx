import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function MagneticButton({ children, className = '', maxDistance = 6, ...props }) {
  const buttonRef = useRef(null);
  const [isTouchOrReduced, setIsTouchOrReduced] = useState(false);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsTouchOrReduced(isTouch || isReduced);
  }, []);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (isTouchOrReduced || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    x.set(Math.max(-maxDistance, Math.min(maxDistance, distanceX * 0.2)));
    y.set(Math.max(-maxDistance, Math.min(maxDistance, distanceY * 0.2)));
  };

  const handleMouseLeave = () => {
    if (isTouchOrReduced) return;
    x.set(0);
    y.set(0);
  };

  if (isTouchOrReduced) {
    return (
      <div className={`inline-block ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
