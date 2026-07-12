import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import MouseParallax from './MouseParallax';

export default function AnimatedGrid() {
  const { scrollY } = useScroll();
  
  // Transform scroll position into slow vertical grid translation
  const gridY = useTransform(scrollY, [0, 2000], [0, -120]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <MouseParallax factor={8} className="w-full h-[120%] absolute -top-[10%]">
        <motion.div 
          style={{ 
            y: gridY,
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.18) 1.2px, transparent 1.2px)',
            backgroundSize: '48px 48px',
          }}
          className="w-full h-full opacity-[0.12] will-change-transform"
        />
      </MouseParallax>
    </div>
  );
}
