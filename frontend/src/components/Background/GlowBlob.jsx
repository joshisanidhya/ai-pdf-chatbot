import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

export default function GlowBlob({ 
  color = 'from-[#FF6B2C] to-[#E63946]', 
  size = 'w-[50vw] h-[50vw]', 
  position = '', 
  delay = 0, 
  duration = 22,
  blur = 'blur-[130px]'
}) {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Scroll parallax shifts the position of the glows to create physical depth
  const scrollOffset = useTransform(scrollY, [0, 2000], [0, -120]);

  const animateProps = shouldReduceMotion
    ? {}
    : {
        x: [0, 50, -40, 25, 0],
        y: [0, -40, 45, -20, 0],
        scale: [1, 1.06, 0.94, 1.02, 1],
      };

  return (
    <motion.div
      style={{ y: scrollOffset }}
      animate={animateProps}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay,
      }}
      className={`absolute rounded-full bg-gradient-to-br ${color} ${blur} opacity-[0.12] mix-blend-screen will-change-transform ${size} ${position}`}
    />
  );
}
