import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Reveal3D({
  children,
  className = '',
  delay = 0,
  duration = 0.3,
  yOffset = 12,
  once = true,
  amount = 0.05,
  ...props
}) {
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setIsReducedMotion(isReduced);
  }, []);

  if (isReducedMotion) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{
        duration,
        delay,
        ease: 'easeOut',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
