import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Reveal3D({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  yOffset = 24,
  rotateXOffset = 0,
  scaleOffset = 0.985,
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
        viewport={{ once, amount: 0.1 }}
        transition={{ duration: 0.4, delay }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  const initialProps = { opacity: 0, y: yOffset, scale: scaleOffset };
  const animateProps = { opacity: 1, y: 0, scale: 1 };
  if (rotateXOffset !== 0) {
    initialProps.rotateX = rotateXOffset;
    animateProps.rotateX = 0;
  }

  return (
    <motion.div
      initial={initialProps}
      whileInView={animateProps}
      viewport={{ once, amount: 0.1 }}
      transition={{
        duration,
        delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
