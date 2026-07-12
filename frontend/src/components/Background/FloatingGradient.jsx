import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function FloatingGradient() {
  const { scrollY } = useScroll();
  const gradY1 = useTransform(scrollY, [0, 2000], [0, -90]);
  const gradY2 = useTransform(scrollY, [0, 2000], [0, 70]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Ambient Dark Brown/Rust Base */}
      <div 
        className="absolute inset-0 opacity-[0.22]"
        style={{
          background: 'radial-gradient(circle at 80% 90%, #2f1207 0%, transparent 70%)',
        }}
      />
      
      {/* Floating Amber Glow */}
      <motion.div
        style={{ 
          y: gradY1,
          background: 'radial-gradient(ellipse at center, #ffaa44 0%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
        animate={{
          x: [0, -35, 25, 0],
          scale: [1, 1.07, 0.93, 1],
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-[25%] left-[5%] w-[65vw] h-[45vw] rounded-full opacity-[0.07] will-change-transform"
      />

      {/* Floating Red/Crimson Glow */}
      <motion.div
        style={{ 
          y: gradY2,
          background: 'radial-gradient(ellipse at center, #ff3344 0%, transparent 70%)',
          mixBlendMode: 'screen',
        }}
        animate={{
          x: [0, 35, -25, 0],
          scale: [1, 0.93, 1.07, 1],
        }}
        transition={{
          duration: 32,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-[25%] right-[5%] w-[60vw] h-[40vw] rounded-full opacity-[0.07] will-change-transform"
      />
    </div>
  );
}
