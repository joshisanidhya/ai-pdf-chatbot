import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroGlow() {
  const { scrollY } = useScroll();
  
  // Parallax translations with different rates for depth simulation
  const glowY1 = useTransform(scrollY, [0, 2000], [0, 150]);
  const glowY2 = useTransform(scrollY, [0, 2000], [0, 260]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
      {/* Huge Volumetric Glow Layer 1 (Layer 3) */}
      <motion.div 
        style={{ y: glowY1 }}
        animate={{
          scale: [1, 1.08, 0.96, 1.04, 1],
          opacity: [0.14, 0.17, 0.13, 0.16, 0.14]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[75vw] h-[75vw] max-w-[950px] max-h-[950px] rounded-full bg-gradient-to-br from-[#FF6B2C] via-[#E63946] to-transparent blur-[250px] opacity-[0.15] mix-blend-screen will-change-transform"
      />

      {/* Secondary Volumetric Glow Layer 2 (for parallax and organic lighting shifts) */}
      <motion.div 
        style={{ y: glowY2 }}
        animate={{
          x: [-40, 30, -20, 20, -40],
          y: [0, -45, 30, -15, 0],
          scale: [0.94, 1.06, 0.97, 1.03, 0.94],
          opacity: [0.08, 0.12, 0.07, 0.11, 0.08]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
        className="absolute left-[35%] top-[40%] -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] rounded-full bg-gradient-to-tr from-[#E63946] to-transparent blur-[220px] opacity-[0.10] mix-blend-screen will-change-transform"
      />

      {/* Dark Vignette Overlay (Layer 9) */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(circle at center, transparent 35%, rgba(5, 5, 5, 0.88) 100%)',
        }}
      />
    </div>
  );
}
