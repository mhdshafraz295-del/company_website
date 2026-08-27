import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Reveal3D({
  children,
  className = '',
  delay = 0,
  duration = 0.6,
  yOffset = 30,
  rotateXOffset = 3,
  scaleOffset = 0.98,
  once = true,
  ...props
}) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReducedMotion(isReduced);
  }, []);

  if (isReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once, margin: '-50px' }}
        transition={{ duration: 0.4, delay }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, rotateX: rotateXOffset, scale: scaleOffset }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      style={{ transformStyle: 'preserve-3d' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
