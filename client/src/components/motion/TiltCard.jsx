import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({
  children,
  className = '',
  maxTiltX = 2,
  maxTiltY = 3,
  liftOnHover = -3,
  enableTilt = false,
  disabled = false,
  ...props
}) {
  const cardRef = useRef(null);
  const [isTouchOrReduced, setIsTouchOrReduced] = useState(true);

  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsTouchOrReduced(isTouch || isReduced || disabled);
  }, [disabled]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTiltX, -maxTiltX]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTiltY, maxTiltY]), springConfig);
  const translateY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (isTouchOrReduced || !enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseEnter = () => {
    if (isTouchOrReduced || !enableTilt) return;
    translateY.set(liftOnHover);
  };

  const handleMouseLeave = () => {
    if (isTouchOrReduced || !enableTilt) return;
    x.set(0);
    y.set(0);
    translateY.set(0);
  };

  if (isTouchOrReduced || !enableTilt) {
    return (
      <div
        className={`transition-all duration-200 hover:-translate-y-[3px] ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        translateY,
        perspective: 1000,
      }}
      className={`transition-shadow duration-300 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
