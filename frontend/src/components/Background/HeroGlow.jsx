import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function HeroGlow() {
  const { scrollY } = useScroll();
  
  // Parallax translation for the central volumetric glow
  const glowY = useTransform(scrollY, [0, 2000], [0, 180]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
      {/* Huge Volumetric Glow (Layer 3) */}
      <motion.div 
        style={{ y: glowY }}
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
