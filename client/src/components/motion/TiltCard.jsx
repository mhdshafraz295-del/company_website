import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

export default function TiltCard({
  children,
  className = '',
  maxTiltX = 2,
  maxTiltY = 3,
  liftOnHover = -4,
  disabled = false,
  ...props
}) {
  const cardRef = useRef(null);
  const [isTouchOrReduced, setIsTouchOrReduced] = useState(false);

  // Detect touch devices or prefers-reduced-motion
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsTouchOrReduced(isTouch || isReduced || disabled);
  }, [disabled]);

  // MotionValues for mouse position normalized [-0.5, 0.5]
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const springConfig = { damping: 25, stiffness: 200, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [maxTiltX, -maxTiltX]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-maxTiltY, maxTiltY]), springConfig);
  const translateY = useSpring(0, springConfig);

  const handleMouseMove = (e) => {
    if (isTouchOrReduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate normalized pointer position relative to center of card
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseEnter = () => {
    if (isTouchOrReduced) return;
    translateY.set(liftOnHover);
  };

  const handleMouseLeave = () => {
    if (isTouchOrReduced) return;
    x.set(0);
    y.set(0);
    translateY.set(0);
  };

  if (isTouchOrReduced) {
    return (
      <div className={`${className}`} {...props}>
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
